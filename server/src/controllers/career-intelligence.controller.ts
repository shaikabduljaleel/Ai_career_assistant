import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { getCareerIntelligence } from "../services/career-intelligence.service.js";

export const getCareerIntelligenceController = async (
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

    const intelligence = await getCareerIntelligence(
      req.userId
    );

    return res.status(200).json({
      success: true,
      data: intelligence,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Career profile not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error(
      "Career intelligence error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to generate career intelligence",
    });
  }
};