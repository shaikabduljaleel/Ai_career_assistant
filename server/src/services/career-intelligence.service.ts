import prisma from "../config/prisma.js";

export const getCareerIntelligence = async (
  userId: number
) => {
  const profile = await prisma.careerProfile.findUnique({
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

  if (!profile) {
    throw new Error("Career profile not found");
  }

  const skills = profile.skills.map((profileSkill) => ({
    id: profileSkill.skill.id,
    name: profileSkill.skill.name,
    level: profileSkill.level,
  }));

  const skillSummary = {
    total: skills.length,
    beginner: skills.filter(
      (skill) => skill.level === "BEGINNER"
    ).length,
    intermediate: skills.filter(
      (skill) => skill.level === "INTERMEDIATE"
    ).length,
    advanced: skills.filter(
      (skill) => skill.level === "ADVANCED"
    ).length,
    expert: skills.filter(
      (skill) => skill.level === "EXPERT"
    ).length,
  };

  return {
    profile: {
      headline: profile.headline,
      bio: profile.bio,
      location: profile.location,
    },

    skills: {
      summary: skillSummary,
      items: skills,
    },

    experience: {
      total: profile.experience.length,
      items: profile.experience.map((experience) => ({
        id: experience.id,
        company: experience.company,
        role: experience.role,
        location: experience.location,
        startDate: experience.startDate,
        endDate: experience.endDate,
        description: experience.description,
      })),
    },

    education: {
      total: profile.education.length,
      items: profile.education.map((education) => ({
        id: education.id,
        institution: education.institution,
        degree: education.degree,
        field: education.field,
        startYear: education.startYear,
        endYear: education.endYear,
        description: education.description,
      })),
    },

    goals: profile.goals.map((goal) => ({
      id: goal.id,
      title: goal.title,
      description: goal.description,
      targetRole: goal.targetRole,
      targetDate: goal.targetDate,
    })),
  };
};