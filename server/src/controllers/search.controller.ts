import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import {
  searchSimilarChunks,
} from "../services/vector-search.service.js";

export const searchChunks = async (
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

    const { query } = req.body;

    if (
      typeof query !== "string" ||
      query.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const results = await searchSimilarChunks(
      query.trim(),
      req.userId,
      5
    );

    return res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error("Search error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to perform semantic search",
    });
  }
};