import { GoogleGenAI } from "@google/genai";
import type { StructuredResume } from "./ai";

export type MatchResult = {
  score: number;
  status: "Strong Match" | "Good Match" | "Potential";
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  gaps: string[];
  recommendation: string;
};

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  return new GoogleGenAI({ apiKey });
}

export async function matchResumeToJob(
  resume: StructuredResume,
  jobDescription: string
): Promise<MatchResult> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: `
You are an expert resume screening and job matching system.

Compare the candidate resume against the job description.

Evaluate:
1. Required skills
2. Relevant experience
3. Education
4. Overall suitability

Return ONLY valid JSON using exactly this structure:

{
  "score": 0,
  "status": "Strong Match",
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "gaps": [],
  "recommendation": ""
}

Rules:
- score must be an integer from 0 to 100.
- Strong Match = 85-100.
- Good Match = 70-84.
- Potential = below 70.
- Only include skills that are actually supported by the resume.
- Do not invent candidate experience.
- Missing skills must represent meaningful requirements from the job description.
- Consider equivalent technologies and transferable skills.
- Do not judge based on name, gender, age, photo, address, or other personal characteristics.
- Keep strengths and gaps concise.
- Recommendation should explain the score in 1-3 sentences.

JOB DESCRIPTION:

${jobDescription}

CANDIDATE RESUME:

${JSON.stringify(resume)}
`,
    config: {
      responseMimeType: "application/json",
    },
  });

  const content = response.text;

  if (!content) {
    throw new Error("Gemini returned an empty matching response.");
  }

  const result = JSON.parse(content) as MatchResult;

  if (
    typeof result.score !== "number" ||
    result.score < 0 ||
    result.score > 100
  ) {
    throw new Error("Gemini returned an invalid match score.");
  }

  return result;
}