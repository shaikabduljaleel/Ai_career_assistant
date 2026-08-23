import type { Response } from "express";
import {
  getProfile,
  updateProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  addSkill,
  deleteSkill,
  addCareerGoal,
} from "../services/profile.service.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";
import { SkillLevel } from "../generated/prisma/enums.js";

export const getMyProfile = async (
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

    const profile = await getProfile(req.userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Career profile not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to get career profile",
    });
  }
};

export const updateMyProfile = async (
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

    const {
      headline,
      bio,
      location,
      phone,
      githubUrl,
      linkedinUrl,
      portfolioUrl,
    } = req.body;

    const profile = await updateProfile(
      req.userId,
      {
        headline,
        bio,
        location,
        phone,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Career profile updated successfully",
      data: profile,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update career profile",
    });
  }
};

export const createEducation=async(req:AuthRequest,res:Response)=>{
  try{
    if (!req.userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    const education=await addEducation(req.userId,req.body)
    return res.status(200).json({
      success:true,
      message:"Education added successfully",
      data:education,
    })
  }catch(error){
    console.error("Create Education error",error);
    return res.status(500).json({
      success:false,
      message:"Unable to add education",
    })
  }
}

export const editEducation = async (
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

    const educationId = Number(req.params.id);

    if (Number.isNaN(educationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid education ID",
      });
    }

    const education = await updateEducation(
      req.userId,
      educationId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Education updated successfully",
      data: education,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Education not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Update education error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update education",
    });
  }
};

export const removeEducation = async (
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

    const educationId = Number(req.params.id);

    if (Number.isNaN(educationId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid education ID",
      });
    }

    await deleteEducation(
      req.userId,
      educationId
    );

    return res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Education not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Delete education error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete education",
    });
  }
};

export const createExperience = async (
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

    const experience = await addExperience(
      req.userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Experience added successfully",
      data: experience,
    });
  } catch (error) {
    console.error(
      "Create experience error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to add experience",
    });
  }
};

export const editExperience = async (
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

    const experienceId = Number(req.params.id);

    if (Number.isNaN(experienceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience ID",
      });
    }

    const experience = await updateExperience(
      req.userId,
      experienceId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Experience updated successfully",
      data: experience,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Experience not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update experience",
    });
  }
};

export const removeExperience = async (
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

    const experienceId = Number(req.params.id);

    if (Number.isNaN(experienceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid experience ID",
      });
    }

    await deleteExperience(
      req.userId,
      experienceId
    );

    return res.status(200).json({
      success: true,
      message: "Experience deleted successfully",
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Experience not found"
    ) {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to delete experience",
    });
  }
};

export const createSkill = async (
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

    const { name, level } = req.body;
    const validLevels = Object.values(SkillLevel);

    if (!name || !validLevels.includes(level)) {
      return res.status(400).json({
        success: false,
        message: "Skill name and a valid level are required",
      });
    }

    const skill = await addSkill(req.userId, name, level);

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      data: skill,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Career profile not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create skill error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to add skill",
    });
  }
};

export const removeSkill = async (
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

    const skillId = Number(req.params.skillId);

    if (Number.isNaN(skillId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skill ID",
      });
    }

    await deleteSkill(req.userId, skillId);

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Skill not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Delete skill error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete skill",
    });
  }
};

export const createCareerGoal = async (
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

    const { title, description, targetRole, targetDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Goal title is required",
      });
    }

    const goal = await addCareerGoal(req.userId, {
      title,
      description,
      targetRole,
      targetDate,
    });

    return res.status(201).json({
      success: true,
      message: "Career goal added successfully",
      data: goal,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Career profile not found") {
      return res.status(404).json({
        success: false,
        message: error.message,
      });
    }

    console.error("Create career goal error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to add career goal",
    });
  }
};