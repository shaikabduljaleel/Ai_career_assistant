import { Router } from "express";

import {
  uploadDocumentController,
  getDocumentsController,
  deleteDocumentController,
} from "../controllers/document.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

import {
  uploadDocument,
} from "../middleware/upload.middleware.js";

const router = Router();

router.post(
  "/",
  authenticate,
  uploadDocument.single("file"),
  uploadDocumentController
);

router.get(
  "/",
  authenticate,
  getDocumentsController
);

router.delete(
  "/:id",
  authenticate,
  deleteDocumentController
);

export default router;