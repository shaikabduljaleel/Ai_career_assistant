import bcrypt from 'bcrypt';
import prisma from '../config/prisma.js';

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
  const user=await prisma.user.create({
    data:{
      name,
      email,
      password:hashedPassword,
    },
  });
  return {
    id:user.id,
    name:user.name,
    email:user.email,
    isEmailVerified:user.isEmailVerified,
  };
};