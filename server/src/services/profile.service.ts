import prisma from "../config/prisma.js";
import { SkillLevel } from "../generated/prisma/enums.js";

export const getProfile = async (userId: number) => {
  return prisma.careerProfile.findUnique({
    where: {
      userId,
    },
    include: {
      education: true,
      experience: true,
      skills: {
        include: {
          skill: true,
        },
      },
      goals: true,
    },
  });
};

export const createProfile = async (
  userId: number,
  data: {
    headline?: string;
    bio?: string;
    location?: string;
    phone?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
  }
) => {
  return prisma.careerProfile.create({
    data: {
      userId,
      ...data,
    },
  });
};

export const updateProfile = async (
  userId: number,
  data: {
    headline?: string;
    bio?: string;
    location?: string;
    phone?: string;
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
  }
) => {
  return prisma.careerProfile.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      ...data,
    },
    update: {
      ...data,
    },
  });
};

export const addEducation = async (
  userId: number,
  data: {
    institution: string;
    degree?: string;
    field?: string;
    startYear?: number;
    endYear?: number;
    description?: string;
  }
) => {
  const profile = await prisma.careerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Career profile not found");
  }

  return prisma.education.create({
    data: {
      profileId: profile.id,
      ...data,
    },
  });
};

export const updateEducation = async (
  userId: number,
  educationId: number,
  data: {
    institution?: string;
    degree?: string;
    field?: string;
    startYear?: number;
    endYear?: number;
    description?: string;
  }
) => {
  const education =
    await prisma.education.findFirst({
      where: {
        id: educationId,
        profile: {
          userId,
        },
      },
    });

  if (!education) {
    throw new Error("Education not found");
  }

  return prisma.education.update({
    where: {
      id: educationId,
    },
    data,
  });
};

export const deleteEducation = async (
  userId: number,
  educationId: number
) => {
  const education =
    await prisma.education.findFirst({
      where: {
        id: educationId,
        profile: {
          userId,
        },
      },
    });

  if (!education) {
    throw new Error("Education not found");
  }

  await prisma.education.delete({
    where: {
      id: educationId,
    },
  });
};

export const addExperience = async (
  userId: number,
  data: {
    company: string;
    role: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }
) => {
  const profile = await prisma.careerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Career profile not found");
  }

  return prisma.experience.create({
    data: {
      profileId: profile.id,
      company: data.company,
      role: data.role,
      location: data.location,
      startDate: data.startDate
        ? new Date(data.startDate)
        : undefined,
      endDate: data.endDate
        ? new Date(data.endDate)
        : undefined,
      description: data.description,
    },
  });
};

export const updateExperience = async (
  userId: number,
  experienceId: number,
  data: {
    company?: string;
    role?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }
) => {
  const experience =
    await prisma.experience.findFirst({
      where: {
        id: experienceId,
        profile: {
          userId,
        },
      },
    });

  if (!experience) {
    throw new Error("Experience not found");
  }

  return prisma.experience.update({
    where: {
      id: experienceId,
    },
    data: {
      ...data,
      startDate: data.startDate
        ? new Date(data.startDate)
        : undefined,
      endDate: data.endDate
        ? new Date(data.endDate)
        : undefined,
    },
  });
};

export const deleteExperience = async (
  userId: number,
  experienceId: number
) => {
  const experience =
    await prisma.experience.findFirst({
      where: {
        id: experienceId,
        profile: {
          userId,
        },
      },
    });

  if (!experience) {
    throw new Error("Experience not found");
  }

  await prisma.experience.delete({
    where: {
      id: experienceId,
    },
  });
};

export const addSkill = async (
  userId: number,
  name: string,
  level: SkillLevel
) => {
  const profile = await prisma.careerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Career profile not found");
  }

  const skill = await prisma.skill.upsert({
    where: {
      name,
    },
    create: {
      name,
    },
    update: {},
  });

  return prisma.profileSkill.upsert({
    where: {
      profileId_skillId: {
        profileId: profile.id,
        skillId: skill.id,
      },
    },
    create: {
      profileId: profile.id,
      skillId: skill.id,
      level,
    },
    update: {
      level,
    },
    include: {
      skill: true,
    },
  });
};

export const deleteSkill = async (
  userId: number,
  skillId: number
) => {
  const profile = await prisma.careerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Career profile not found");
  }

  const profileSkill = await prisma.profileSkill.findUnique({
    where: {
      profileId_skillId: {
        profileId: profile.id,
        skillId,
      },
    },
  });

  if (!profileSkill) {
    throw new Error("Skill not found");
  }

  await prisma.profileSkill.delete({
    where: {
      profileId_skillId: {
        profileId: profile.id,
        skillId,
      },
    },
  });
};

export const addCareerGoal = async (
  userId: number,
  data: {
    title: string;
    description?: string;
    targetRole?: string;
    targetDate?: string;
  }
) => {
  const profile = await prisma.careerProfile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("Career profile not found");
  }

  return prisma.careerGoal.create({
    data: {
      profileId: profile.id,
      title: data.title,
      description: data.description,
      targetRole: data.targetRole,
      targetDate: data.targetDate
        ? new Date(data.targetDate)
        : undefined,
    },
  });
};