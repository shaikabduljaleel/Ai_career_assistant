import type{Request,Response,NextFunction} from "express";
import jwt from "jsonwebtoken";

interface JwtPayload{
  userId:number;
}

export interface AuthRequest extends Request{
  userId?:number;
}

export const authenticate=(
  req:AuthRequest,
  res:Response,
  next:NextFunction,
)=>{
  try{
    const token=req.cookies?.token;
    if(!token){
      return res.status(401).json({
        success:false,
        message:"Authentication required",
      });
    }
    const decoded=jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.userId=decoded.userId;
    next();
  }catch(error){
    return res.status(401).json({
      success:false,
      message:"Invalid or expired token",
    });
  }
}