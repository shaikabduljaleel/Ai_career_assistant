import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import fs from "fs/promises";
import {
  createDocument,
  getUserDocuments,
  deleteDocument,
} from "../services/document.service.js";

export const uploadDocumentController = async (
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const document =
      await createDocument(
        req.userId,
        {
          originalName:
            req.file.originalname,

          storedName:
            req.file.filename,

          mimeType:
            req.file.mimetype,

          size:
            req.file.size,

          path:
            req.file.path,
        }
      );

    return res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    console.error(
      "Upload document error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to upload document",
    });
  }
};

export const getDocumentsController = async (
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

    const documents =
      await getUserDocuments(req.userId);

    return res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error(
      "Get documents error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to get documents",
    });
  }
};



export const deleteDocumentController = async (
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

    const documentId = Number(req.params.id);

    if (Number.isNaN(documentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid document ID",
      });
    }

    const document =
      await deleteDocument(
        req.userId,
        documentId
      );

    try {
      await fs.unlink(document.path);
    } catch (error) {
      console.error(
        "Unable to delete physical file:",
        error
      );
    }

    return res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Document not found"
    ) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    console.error(
      "Delete document error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to delete document",
    });
  }
};