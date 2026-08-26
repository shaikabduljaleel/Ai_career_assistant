import type {
  Request,
  Response,
} from "express";

import {
  askQuestion,
} from "../services/rag.service.js";

export const chat = async (
  req: Request,
  res: Response
) => {
  try {
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
        message.trim()
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