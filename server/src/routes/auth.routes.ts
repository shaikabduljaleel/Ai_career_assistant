import { Router } from "express";
import { register,login,getMe,logout,verifyEmailController,resendVerification } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { get } from "http";


const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);
router.post("/logout", logout);
router.get("/verify-email",verifyEmailController)
router.post(
  "/resend-verification",
  resendVerification
);
export default router;