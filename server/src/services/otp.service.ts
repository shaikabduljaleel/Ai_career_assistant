import crypto from "crypto";
import prisma from "../config/prisma.js"
import {Resend} from "resend"

const resend=new Resend(process.env.RESEND_API_KEY)
const OTP_EXPIRY_MINUTES=10
const MAX_ATTEMPTS=5

const generateOtp=():string=>{
  return crypto
  .randomInt(100000, 1000000)
  .toString()
};

const hashOtp=(otp:string):string=>{
  return crypto
  .createHash("sha256")
  .update(otp)
  .digest("hex")
}

export const createOtp=async(
  userId:number,
  email:string,
  name:string
)=>{
  const otp=generateOtp();
  const codeHash=hashOtp(otp)
  const expiresAt=new Date(Date.now()+OTP_EXPIRY_MINUTES*60*1000)
  await prisma.verificationCode.updateMany({
    where:{
      userId,
      usedAt:null,
    },
    data:{
      usedAt:new Date()
    }
  });
  await prisma.verificationCode.create({
    data:{
      userId,
      codeHash,
      expiresAt,
    }
  })
  await resend.emails.send({
     from: "AI Career Assistant <onboarding@resend.dev>",
    to: email,
    subject: "Your verification code",
    html: `
      <h2>Hello ${name}</h2>

      <p>Your verification code is:</p>

      <h1 style="letter-spacing: 8px;">
        ${otp}
      </h1>

      <p>
        This code expires in ${OTP_EXPIRY_MINUTES} minutes.
      </p>

      <p>
        If you did not request this code, you can ignore this email.
      </p>
    `,
  })
}
export const verifyOtp=async(
  userId:number,
  otp:string,
)=>{
  const verificationCode=
  await prisma.verificationCode.findFirst({
    where:{
      userId,
      usedAt:null,
      expiresAt:{
        gt:new Date(),
      },
    },
    orderBy:{
      createdAt:"desc",
    },
  });
  if(!verificationCode){
    throw new Error("OTP is Invalid or has expired");
  }
  const submittedHash=hashOtp(otp);
  if(submittedHash!==verificationCode.codeHash){
    await prisma.verificationCode.update({
      where:{
        id:verificationCode.id,
      },
      data:{
        attempts:{
          increment:1
        },
      },
    });
    throw new Error("Invalid OTP");
  }
  await prisma.verificationCode.update({
    where:{
      id:verificationCode.id,
    },
    data:{
      usedAt:new Date(),
    },
  });
  return true;
}