import { Router } from "express";
import {
  searchChunks,
} from "../controllers/search.controller.js";

import {
  authenticate,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, searchChunks);

export default router;