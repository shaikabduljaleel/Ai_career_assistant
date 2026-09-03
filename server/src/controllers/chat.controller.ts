import type {
  Response,
} from "express";

import type { AuthRequest } from "../middleware/auth.middleware.js";

import {
  askQuestion,
} from "../services/rag.service.js";

export const chat = async (
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

    const { message } = req.body;

    if (
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const result =
      await askQuestion(
        message.trim(),
        req.userId
      );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(
      "Chat error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate answer",
    });
  }
};