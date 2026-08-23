import { Router } from "express";

import {
  getMyProfile,
  updateMyProfile,
  createEducation,
  editEducation,
  removeEducation,
  createExperience,
  editExperience,
  removeExperience,
  createSkill,
  removeSkill,
  createCareerGoal,
} from "../controllers/profile.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.get(
  "/",
  authenticate,
  getMyProfile
);

router.put(
  "/",
  authenticate,
  updateMyProfile
);

router.post(
  "/education",
  authenticate,
  createEducation
);

router.put(
  "/education/:id",
  authenticate,
  editEducation
);

router.delete(
  "/education/:id",
  authenticate,
  removeEducation
);

router.post(
  "/experience",
  authenticate,
  createExperience
);

router.put(
  "/experience/:id",
  authenticate,
  editExperience
);

router.delete(
  "/experience/:id",
  authenticate,
  removeExperience
);

router.post(
  "/skills",
  authenticate,
  createSkill
);

router.delete(
  "/skills/:skillId",
  authenticate,
  removeSkill
);

router.post(
  "/goals",
  authenticate,
  createCareerGoal
);

export default router;