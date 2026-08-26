import { Router } from "express";
import {
  searchChunks,
} from "../controllers/search.controller.js";

const router = Router();

router.post("/", searchChunks);

export default router;