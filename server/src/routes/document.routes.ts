import { Router } from "express";

import {
  uploadDocumentController,
  getDocumentsController,
  deleteDocumentController,
  reprocessDocumentController,
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

router.post(
  "/:id/reprocess",
  authenticate,
  reprocessDocumentController
);
export default router;