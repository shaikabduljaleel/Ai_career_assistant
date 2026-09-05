import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { getCareerAnalysisController } from "../controllers/career-analysis.controller.js";

const router = Router();

router.get("/", authenticate, getCareerAnalysisController);

export default router;