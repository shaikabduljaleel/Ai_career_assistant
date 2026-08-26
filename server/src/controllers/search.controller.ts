import type { Request, Response } from "express";
import {
  searchSimilarChunks,
} from "../services/vector-search.service.js";

export const searchChunks = async (
  req: Request,
  res: Response
) => {
  try {
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