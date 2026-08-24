const API_URL = import.meta.env.VITE_API_URL;

export interface CareerProfile {
  id: number;
  userId: number;

  headline: string | null;
  bio: string | null;
  location: string | null;
  phone: string | null;

  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;

  education: Education[];
  experience: Experience[];
  skills: ProfileSkill[];
  goals: CareerGoal[];
}

export interface Education {
  id: number;
  institution: string;
  degree: string | null;
  field: string | null;
  startYear: number | null;
  endYear: number | null;
  description: string | null;
}

export interface Experience {
  id: number;
  company: string;
  role: string;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  description: string | null;
}

export interface ProfileSkill {
  profileId: number;
  skillId: number;
  level:
    | "BEGINNER"
    | "INTERMEDIATE"
    | "ADVANCED"
    | "EXPERT";

  skill: {
    id: number;
    name: string;
  };
}

export interface CareerGoal {
  id: number;
  title: string;
  description: string | null;
  targetRole: string | null;
  targetDate: string | null;
}

export const getProfile = async (): Promise<CareerProfile | null> => {
  const response = await fetch(
    `${API_URL}/profile`,
    {
      credentials: "include",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to fetch profile");
  }

  const data = await response.json();

  return data.data;
};
export interface UpdateProfileData {
  headline?: string;
  bio?: string;
  location?: string;
  phone?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
}

export const updateProfile = async (
  profileData: UpdateProfileData
): Promise<CareerProfile> => {
  const response = await fetch(
    `${API_URL}/profile`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(profileData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ?? "Unable to update profile"
    );
  }

  return data.data;
};