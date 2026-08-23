# TalentIQ

### AI-Powered Resume-to-Job Matching

TalentIQ is a free, no-login resume matching platform that helps both **job seekers and recruiters** understand how well a resume fits a particular job description.

Users can paste a job description and upload multiple PDF resumes. TalentIQ extracts structured information from each resume, compares it with the job requirements using Gemini, and ranks the resumes based on their overall fit.

For job seekers, this can be used to compare multiple versions of their resume and determine which version is best suited for a particular role.

---

## Problem Statement

When applying for a job, candidates often have multiple versions of their resume and may not know which one is best aligned with a particular job description.

Recruiters also need to evaluate multiple resumes against the same job description.

Traditional keyword-based screening can miss equivalent skills and does not clearly explain why a resume is or is not a good match.

TalentIQ addresses this by providing:

- Resume-to-job matching
- Multiple resume comparison
- Match scoring
- Matched and missing skills
- Strengths and gaps
- AI-generated recommendations
- Ranking of multiple resumes

---

## Key Features

- Paste a job description
- Upload multiple PDF resumes
- Extract resume text automatically
- Convert resumes into structured information
- Identify skills, experience, and education
- Compare resumes with a job description
- Generate an overall match score
- Identify matched skills
- Identify missing skills and requirements
- Explain resume strengths
- Highlight potential gaps
- Rank multiple resumes
- No login or account required
- Free to use

## User Use Cases

### Job Seekers

A student or job seeker can:

```text
Job Description
       +
Resume Version 1
Resume Version 2
Resume Version 3
       ↓
     TalentIQ
       ↓
Ranked Results










System Architecture
                         TALENTIQ
                            |
                            v
                 +----------------------+
                 |      Next.js UI       |
                 |   React + TypeScript  |
                 +----------+-----------+
                            |
                    JD + PDF Resumes
                            |
                            v
                 +----------------------+
                 |    /api/analyze       |
                 +----------+-----------+
                            |
              +-------------+-------------+
              |                           |
              v                           v
       PDF Text Extraction        Resume Structuring
          pdf-parse                    Gemini
              |                           |
              +-------------+-------------+
                            |
                            v
                  Resume ↔ JD Matching
                         Gemini
                            |
                            v
                    Match Results
                            |
                            v
                    Ranking / Sorting
                            |
                            v
                       Results UI
     TalentIQ
       ↓
Ranked Results




Processing Flow
1. Job Description

The user pastes a job description into the screening interface.

2. Resume Upload

The user uploads one or more PDF resumes.

The application supports up to 10 resumes per analysis.

3. PDF Text Extraction

The resume PDF is processed on the server and its text is extracted.

4. Resume Structuring

The extracted resume text is sent to Gemini.

Gemini converts the unstructured resume into structured information containing:

Name
Email
Phone
Skills
Experience
Education
5. Resume-to-JD Matching

The structured resume and job description are provided to Gemini for comparison.

The matching process evaluates:

Required skills
Relevant experience
Education
Responsibilities
Overall suitability
6. Result Generation

The model returns:

Match score
Match status
Matched skills
Missing skills
Strengths
Gaps
Recommendation
7. Ranking

When multiple resumes are uploaded, the application sorts the successful results by match score in descending order.

LLM Usage

TalentIQ uses Google's Gemini API through the @google/genai SDK.

The LLM is used for two main tasks:

1. Resume Information Extraction

The first prompt instructs Gemini to extract structured information from resume text.

The model is instructed to return JSON containing:

{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "experience": [],
  "education": []
}

Important instructions include:

Do not invent information.
Extract only information present in the resume.
Use empty strings when information is unavailable.
Preserve the meaning of the original resume.
Return structured JSON.
2. Resume-to-Job Matching

The second prompt instructs Gemini to compare the structured resume against the supplied job description.

The output follows this structure:

{
  "score": 0,
  "status": "Strong Match",
  "matchedSkills": [],
  "missingSkills": [],
  "strengths": [],
  "gaps": [],
  "recommendation": ""
}

The model is instructed to:

Produce a score between 0 and 100.
Identify skills supported by the resume.
Identify meaningful missing requirements.
Consider equivalent and transferable skills.
Avoid inventing candidate experience.
Explain the reason behind the result.
Avoid using personal characteristics such as age, gender, address, or photo when evaluating fit.
Match Status

The current matching logic uses:

Score	Status
85–100	Strong Match
70–84	Good Match
Below 70	Potential
Technology Stack
Frontend
Next.js
React
TypeScript
Tailwind CSS
Backend
Next.js App Router API routes
TypeScript
AI
Google Gemini API
@google/genai
Document Processing
pdf-parse
Deployment
Vercel
Source Control
Git
GitHub
Project Structure
talentiq/
│
├── app/
│   ├── api/
│   │   ├── analyze/
│   │   │   └── route.ts
│   │   ├── extract-resume/
│   │   │   └── route.ts
│   │   ├── match-resume/
│   │   │   └── route.ts
│   │   └── parse-resume/
│   │       └── route.ts
│   │
│   ├── results/
│   │   ├── [id]/
│   │   └── page.tsx
│   │
│   ├── screening/
│   │   └── page.tsx
│   │
│   ├── page.tsx
│   └── ...
│
├── lib/
│   ├── ai.ts
│   ├── matcher.ts
│   └── resumeParser.ts
│
├── public/
│
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
└── README.md
API Endpoints
POST /api/parse-resume

Handles PDF resume parsing and text extraction.

POST /api/extract-resume

Converts extracted resume text into structured resume information using Gemini.

POST /api/match-resume

Compares one structured resume against a job description.

POST /api/analyze

Main multi-resume analysis endpoint.

It accepts:

Job description
Multiple resume files

and returns ranked resume matching results.

Performance

Multiple resumes are processed in parallel during the analysis pipeline.

The application performs independent resume extraction and matching operations concurrently rather than processing every resume completely sequentially.

This reduces the waiting time when multiple resumes are submitted.

Environment Variables

Create a .env.local file:

GEMINI_API_KEY=your_gemini_api_key

The API key must never be committed to GitHub.

For deployment, the same variable is configured through the hosting platform's environment variable settings.

Local Development
1. Clone the repository
git clone https://github.com/Kethan1712/talentiq.git
cd talentiq
2. Install dependencies
npm install
3. Configure environment variables

Create:

.env.local

and add:

GEMINI_API_KEY=your_gemini_api_key
4. Start the development server
npm run dev

Open:

http://localhost:3000
Production Build

To verify the application before deployment:

npm run build

The production build should complete without TypeScript or compilation errors.

Deployment

The application is deployed using Vercel.

The GEMINI_API_KEY is configured as a deployment environment variable and is not stored in the repository.

Privacy and Security

TalentIQ does not require user authentication.

Uploaded resumes are processed for the purpose of the requested analysis.

The Gemini API key is stored as a server-side environment variable and is not exposed in the client-side application.

Sensitive environment files such as .env.local are excluded from Git.

Limitations

The current version has several limitations:

Resume input is currently focused on PDF files.
Match scores are AI-generated and should be treated as an assistive signal rather than an absolute hiring decision.
Results depend on the quality and completeness of the supplied resume and job description.
Gemini API rate limits may affect large batches of resumes.
The application does not currently persist user analysis history.
No user authentication or account system is included by design.
Future Improvements

Possible future improvements include:

More robust deterministic scoring
Better separation of skill gaps and experience gaps
Additional document formats such as DOCX
Resume improvement suggestions
Job description skill extraction
More detailed candidate comparison
Analysis history
Exportable reports
Improved model evaluation and benchmarking
Demo

The application demonstrates the following workflow:

Paste Job Description
        ↓
Upload Multiple Resumes
        ↓
Extract Resume Information
        ↓
AI Resume-to-JD Matching
        ↓
Compare Results
        ↓
Rank Resumes
        ↓
View Strengths, Gaps & Recommendations
