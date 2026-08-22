import type { Request, Response } from "express";
import { registerUser,loginUser,getCurrentUser,verifyEmail ,resendVerificationEmail} from "../services/auth.service.js";

import type { AuthRequest } from "../middleware/auth.middleware.js";


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

