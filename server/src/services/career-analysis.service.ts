import { getCareerIntelligence } from "./career-intelligence.service.js";
import { generateAnswer } from "./llm.service.js";

export const generateCareerAnalysis = async (
  userId: number
): Promise<string> => {
  const careerData = await getCareerIntelligence(userId);

  const prompt = `
Analyze this candidate's career profile.

CANDIDATE DATA:
${JSON.stringify(careerData, null, 2)}

Give a concise and practical career analysis.

Use exactly these sections:

1. Career Summary
2. Strengths
3. Skill Gaps
4. Recommended Skills
5. Career Readiness
6. Next Steps

Rules:
- Only make claims supported by the candidate data.
- Do not assume the candidate lacks a skill just because it is not listed.
- If information is missing, explicitly say that it is not provided.
- Do not invent experience or skills.
- Do not give an arbitrary percentage unless the data supports it.
- Keep each section short.
- Give 3-5 actionable next steps.
`;

  return await generateAnswer([
    {
      role: "system",
      content:
        "You are a practical AI career advisor. Be accurate, concise, and actionable.",
    },
    {
      role: "user",
      content: prompt,
    },
  ]);
};