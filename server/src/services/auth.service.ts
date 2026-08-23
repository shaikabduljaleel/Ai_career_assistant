import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sendVerificationEmail } from './email.service.js';
import { VerificationPurpose } from '../generated/prisma/enums.js';
import {
  createOtp,
  verifyOtp,
} from './otp.service.js';


interface RegisterUserData{
  name:string;
  email:string;
  password:string;
}

export const registerUser=async({name,email,password}:RegisterUserData)=>{
  const existingUser=await prisma.user.findUnique({where:{email,},});
  if(existingUser){
    throw new Error('User with this email already exists');
  }
  const hashedPassword=await bcrypt.hash(password,10);
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const verificationExpires = new Date(
    Date.now() + 15 * 60 * 1000
  );

  const user=await prisma.user.create({
    data:{
      name,
      email,
      password:hashedPassword,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
    },
  });

  try {
    await sendVerificationEmail(user.email, user.name, verificationToken);
  } catch (error) {
    await prisma.user.delete({ where: { id: user.id } });
    throw error;
  }

  return {
    id:user.id,
    name:user.name,
    email:user.email,
    isEmailVerified:user.isEmailVerified,
    verificationToken,
  };
};

export const loginUser=async(email:string,password:string)=>{
  const user=await prisma.user.findUnique({where:{email,},});
  if(!user){
    throw new Error('Email does not exist');
  }
  if(!user.password){
    throw new Error('Invalid email or password');
  }
  const passwordMatch=await bcrypt.compare(password,user.password);
  if(!passwordMatch){
    throw new Error('Incorrect password');
  }
  if (!user.isEmailVerified) {
  throw new Error("Please verify your email before logging in");
}
  const token = jwt.sign(
    {
      userId: user.id,

    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    },
  };
}

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return;
  }

  await createOtp(
    user.id,
    user.email,
    user.name,
    VerificationPurpose.PASSWORD_RESET
  );
};

export const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid reset request");
  }

  await verifyOtp(
    user.id,
    otp,
    VerificationPurpose.PASSWORD_RESET
  );

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });
};

export const getCurrentUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      googleId: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

export const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: token,
      emailVerificationExpires: {
        gt: new Date(),
      },
    } as any,
  });

  if (!user) {
    throw new Error(
      "Invalid or expired verification token"
    );
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null,
    },
  });

  return {
    id: user.id,
    email: user.email,
    isEmailVerified: true,
  };
};

export const resendVerificationEmail=async(email:string)=>{
  const user=await prisma.user.findUnique({
    where:{
      email,
    },
  });
  if(!user){
    throw new Error("User not found");
  }
  if(user.isEmailVerified){
    throw new Error("Email is already verified");
  }
  const verificationToken=crypto
  .randomBytes(32)
  .toString("hex")
  const verificationExpires=new Date(
    Date.now()+15*60*1000
  )
  await prisma.user.update({
    where:{
      id:user.id
    },
    data:{
      emailVerificationToken:verificationToken,
      emailVerificationExpires:verificationExpires,
    },
  });
  await sendVerificationEmail(
    user.email,
    user.name,
    verificationToken
  )
}