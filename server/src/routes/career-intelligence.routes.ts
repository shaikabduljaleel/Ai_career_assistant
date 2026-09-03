import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  getCareerIntelligenceController,
} from "../controllers/career-intelligence.controller.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getCareerIntelligenceController
);

export default router;