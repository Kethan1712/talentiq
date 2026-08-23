import { GoogleGenAI } from "@google/genai";

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is missing. Check your .env.local file."
    );
  }

  return new GoogleGenAI({
    apiKey,
  });
}

export type StructuredResume = {
  name: string;
  email: string;
  phone: string;
  skills: string[];
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
};

export async function extractResumeInformation(
  resumeText: string
): Promise<StructuredResume> {
  const ai = getGeminiClient();

  const response = await ai.models.generateContent({
    model: "gemini-3.6-flash",
    contents: `
You are a resume information extraction system.

Extract information from the provided resume text.

Return ONLY valid JSON with this exact structure:

{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "experience": [
    {
      "role": "",
      "company": "",
      "duration": "",
      "description": ""
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": ""
    }
  ]
}

Rules:
- Do not invent information.
- If information is unavailable, use an empty string.
- Keep skills as individual items.
- Preserve the meaning of the resume.
- Extract only information actually present in the resume.

Resume text:

${resumeText}
`,
    config: {
  responseMimeType: "application/json",
},
  });

  const content = response.text;

  if (!content) {
    throw new Error("Gemini returned an empty response.");
  }

  return JSON.parse(content) as StructuredResume;
}