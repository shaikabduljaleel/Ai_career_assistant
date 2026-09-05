const API_URL = import.meta.env.VITE_API_URL;

export interface CareerIntelligence {
  profile: {
    headline: string | null;
    bio: string | null;
    location: string | null;
  };

  skills: {
    summary: {
      total: number;
      beginner: number;
      intermediate: number;
      advanced: number;
      expert: number;
    };

    items: {
      id: number;
      name: string;
      level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    }[];
  };

  experience: {
    total: number;
    items: {
      id: number;
      company: string;
      role: string;
      location: string | null;
      startDate: string;
      endDate: string | null;
      description: string | null;
    }[];
  };

  education: {
    total: number;
    items: {
      id: number;
      institution: string;
      degree: string;
      field: string;
      startYear: number;
      endYear: number | null;
      description: string | null;
    }[];
  };

  goals: {
    id: number;
    title: string;
    description: string | null;
    targetRole: string | null;
    targetDate: string | null;
  }[];
}

export const getCareerIntelligence =
  async (): Promise<CareerIntelligence> => {
    const response = await fetch(
      `${API_URL}/career-intelligence`,
      {
        method: "GET",
        credentials: "include",
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || "Failed to load career intelligence"
      );
    }

    return result.data;
  };

  export const getCareerAnalysis = async (): Promise<string> => {
  const response = await fetch(
    `${API_URL}/career-analysis`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to generate career analysis"
    );
  }

  return result.data.analysis;
};