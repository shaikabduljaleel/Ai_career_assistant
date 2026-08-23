import type { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  verifyEmail,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword,
} from "../services/auth.service.js";

import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  createOtp,
  verifyOtp,
} from "../services/otp.service.js";
import prisma from "../config/prisma.js";
import { VerificationPurpose } from "../generated/prisma/enums.js";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    const user = await registerUser({
      name,
      email,
      password,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);

    if (
      error instanceof Error &&
      error.message === "User with this email already exists"
    ) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    if (error instanceof Error && error.message.includes("API key")) {
      return res.status(502).json({
        success: false,
        message: "Verification email service is not configured correctly",
      });
    }

    if (error instanceof Error && error.message.startsWith("Resend email failed:")) {
      return res.status(502).json({
        success: false,
        message: "Unable to send verification email. Check your Resend sender and recipient settings.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login=async(req:Request,res:Response)=>{
  try{
    const {email,password}=req.body;
  if(!email || !password){
    return res.status(400).json({
      success:false,
      message:"Email and password are required",
    });
  }
  const result=await loginUser(email,password);
  res.cookie("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(200).json({
    success:true,
    message:"Login successful",
    data:result.user,
  });
  }
  catch(error){
    if(error instanceof Error && error.message === "Email does not exist"){
      return res.status(404).json({
        success:false,
        message:error.message,
      });
    }
    if(error instanceof Error && error.message === "Incorrect password"){
      return res.status(401).json({
        success:false,
        message:error.message,
      });
    }
    if(error instanceof Error && error.message==='Invalid email or password'){
      return res.status(401).json({
        success:false,
        message:error.message,
      });
    }
    if (
  error instanceof Error &&
  error.message ===
    "Please verify your email before logging in"
) {
  return res.status(403).json({
    success: false,
    message: error.message,
  });
}

    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Internal server Error",
    });
  }
}

export const googleCallback = async (
  req: Request,
  res: Response
) => {
  try {
    const user = req.user as {
      id: number;
      email: string;
      name: string;
      isEmailVerified: boolean;
    };

    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:
        7 * 24 * 60 * 60 * 1000,
    });

    return res.redirect(
      "http://localhost:5173/dashboard"
    );
  } catch (error) {
    console.error(
      "Google callback error:",
      error
    );

    return res.redirect(
      "http://localhost:5173/login"
    );
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await getCurrentUser(req.userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "User not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout=async(req:Request,res:Response)=>{
  res.clearCookie('token',{
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
    sameSite:"lax",
    path:"/",
  })
  return res.status(200).json({
    success:true,
    message:"Logout successful",
  })
}

export const verifyEmailController = async (
  req: Request,
  res: Response
) => {
  try {
    const token = req.query.token;

    if (typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "Verification token is required",
      });
    }

    const user = await verifyEmail(token);

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: user,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        "Invalid or expired verification token"
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const resendVerification=async(req:Request,res:Response)=>{
  try{
    const {email}=req.body;
    if(!email){
      return res.status(400).json({
        success:false,
        message:"Email Required",
      });
    }
    await resendVerificationEmail(email);
    return res.status(200).json({
      success:true,
      message:"Verification email sent successfully",
    })
  }catch(error){
    if(error instanceof Error && error.message ==="User not found"){
      return res.status(404).json({
        success:false,
        message:"No account found with this email",
      })
    }
    if(error instanceof Error && error.message==="Email is already verified"){
      return res.status(400).json({
        success:false,
        message:error.message,
      })
    }
    console.error(error);
    return res.status(500).json({
      success:false,
      message:"Unable to send the verification email"
    })
  }
}

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    await requestPasswordReset(email);

    return res.status(200).json({
      success: true,
      message:
        "If an account exists, a password reset OTP has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to process request",
    });
  }
};

export const resetPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be 6 digits",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    await resetPassword(email, otp, newPassword);

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message === "Invalid OTP" ||
        error.message === "OTP is Invalid or has expired" ||
        error.message === "Maximum OTP attempts exceeded")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};

export const sendOtp=async(req:Request,res:Response)=>{
  try{
    const {email}=req.body;
    if (!email){
      return res.status(400).json({
        success:false,
        message:"Email is Required",
      });
    }
    const user=await prisma.user.findUnique({
      where:{
        email,
      }
    });
    if(!user){
      return res.status(404).json({
        success:false,
        message:"User not found",
      })
    }
    await createOtp(user.id,user.email,user.name);
    return res.status(200).json({
      success:true,
      message:"OTP sent successfully",
    });
  }catch(error){
    console.error("Send OTP error:",error);
    return res.status(500).json({
      success:false,
      message:"Unable to send the OTP",
    })
  }
}

export const verifyOtpController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must be 6 digits",
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await verifyOtp(user.id, otp, VerificationPurpose.EMAIL_VERIFICATION);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isEmailVerified: true,
      },
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid OTP"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "OTP is Invalid or has expired"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (
      error instanceof Error &&
      error.message ===
        "Maximum OTP attempts exceeded"
    ) {
      return res.status(429).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Verify OTP error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify OTP",
    });
  }
};