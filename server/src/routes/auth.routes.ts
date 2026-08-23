import { Router } from "express";
import { register,login,getMe,logout,verifyEmailController,resendVerification,forgotPassword,resetPasswordController,sendOtp,verifyOtpController,googleCallback } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import passport from "../config/passport.js";

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
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect:
      "http://localhost:5173/login",
  }),
  googleCallback
);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordController);
router.post("/send-otp",sendOtp);
router.post("/verify-otp",verifyOtpController)
export default router;