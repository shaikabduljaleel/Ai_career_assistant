import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { generateCareerAnalysis } from "../services/career-analysis.service.js";

export const getCareerAnalysisController = async (
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

    const analysis = await generateCareerAnalysis(req.userId);

    return res.status(200).json({
      success: true,
      data: {
        analysis,
      },
    });
  } catch (error) {
    console.error("Career analysis error:", error);

    if (
      error instanceof Error &&
      error.message === "Career profile not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to generate career analysis",
    });
  }
};