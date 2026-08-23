"use client";

import { ChangeEvent, DragEvent, useState } from "react";
import { useRouter } from "next/navigation";

type ResumeFile = {
  id: string;
  file: File;
};

export default function ScreeningPage() {
  const router = useRouter();

  const [jobDescription, setJobDescription] = useState("");
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
const [error, setError] = useState("");

  const addFiles = (files: FileList | File[]) => {
    const validFiles = Array.from(files).filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "text/plain" ||
        file.name.toLowerCase().endsWith(".pdf") ||
        file.name.toLowerCase().endsWith(".txt")
    );

    const newFiles = validFiles.map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
    }));

    setResumes((current) => [...current, ...newFiles]);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      addFiles(event.target.files);
    }
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files) {
      addFiles(event.dataTransfer.files);
    }
  };

  const removeResume = (id: string) => {
    setResumes((current) => current.filter((resume) => resume.id !== id));
  };

  const canAnalyze = jobDescription.trim().length > 20 && resumes.length > 0;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };
  const analyzeResumes = async () => {
  if (!canAnalyze || isAnalyzing) return;

  setIsAnalyzing(true);
  setError("");

  try {
    const formData = new FormData();

    formData.append(
      "jobDescription",
      jobDescription
    );

    resumes.forEach((resume) => {
      formData.append("resumes", resume.file);
    });

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Analysis failed."
      );
    }

    sessionStorage.setItem(
      "talentiq-results",
      JSON.stringify(data)
    );

    router.push("/results");
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Something went wrong."
    );
  } finally {
    setIsAnalyzing(false);
  }
};

  return (
    <main className="min-h-screen bg-[#080b16] text-white">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6 md:px-10">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2"
        >
          <div className="text-lg font-semibold tracking-tight">
            Talent<span className="text-[#7c83ff]">IQ</span>
          </div>
        </button>

        <div className="flex items-center gap-4">
          <span className="hidden text-[10px] text-gray-500 sm:block">
            No signup required
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-[#111525] text-xs text-gray-400">
            AI
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        {/* Heading */}
        <div className="mb-10">
          <button
            onClick={() => router.push("/")}
            className="mb-5 text-xs text-gray-500 transition hover:text-white"
          >
            ← Back to TalentIQ
          </button>

          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#8e94ff]">
            Resume Fit Analysis
          </p>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Find the resume that fits.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Add a job description and upload multiple resumes. TalentIQ will
            compare them and identify the strongest match.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Job Description */}
          <section className="rounded-xl border border-white/10 bg-[#101421] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                  Step 01
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                  Job Description
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Tell TalentIQ what the role requires.
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6f76ff]/10 text-xs text-[#8e94ff]">
                01
              </div>
            </div>

            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder={`Paste the job description here...

Example:
We are looking for a Machine Learning Engineer with experience in Python, FastAPI, SQL, machine learning, and cloud technologies...`}
              className="mt-6 min-h-[300px] w-full resize-none rounded-lg border border-white/10 bg-[#0b0f1b] p-4 text-sm leading-6 text-gray-200 outline-none placeholder:text-gray-600 focus:border-[#6f76ff]/50"
            />

            <div className="mt-3 flex items-center justify-between text-[10px]">
              <span className="text-gray-600">
                {jobDescription.length} characters
              </span>

              {jobDescription.trim().length > 20 && (
                <span className="text-green-400">
                  ✓ Job description ready
                </span>
              )}
            </div>
          </section>

          {/* Resume Upload */}
          <section className="rounded-xl border border-white/10 bg-[#101421] p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gray-500">
                  Step 02
                </p>

                <h2 className="mt-2 text-lg font-semibold">
                  Resumes
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Upload the resumes you want to compare.
                </p>
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6f76ff]/10 text-xs text-[#8e94ff]">
                02
              </div>
            </div>

            {/* Upload Area */}
            <label
              htmlFor="resume-upload"
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`mt-6 flex min-h-[170px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition ${
                isDragging
                  ? "border-[#7c83ff] bg-[#6f76ff]/10"
                  : "border-white/15 bg-[#0b0f1b] hover:border-[#6f76ff]/50 hover:bg-[#0d1120]"
              }`}
            >
              <input
                id="resume-upload"
                type="file"
                accept=".pdf,.txt,application/pdf,text/plain"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#151a2a] text-lg">
                ↑
              </div>

              <h3 className="mt-4 text-sm font-medium">
                Drop resumes here
              </h3>

              <p className="mt-1 text-xs text-gray-600">
                or click to browse your files
              </p>

              <p className="mt-4 text-[9px] uppercase tracking-wider text-gray-700">
                PDF or TXT · Multiple files supported
              </p>
            </label>

            {/* Uploaded Resumes */}
            {resumes.length > 0 && (
              <div className="mt-5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] uppercase tracking-wider text-gray-500">
                    Uploaded Resumes
                  </p>

                  <p className="text-[10px] text-[#8e94ff]">
                    {resumes.length} file{resumes.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0b0f1b] p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#171c31] text-xs text-[#8e94ff]">
                      PDF
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium text-gray-300">
                        {resume.file.name}
                      </p>

                      <p className="mt-1 text-[9px] text-gray-600">
                        {formatFileSize(resume.file.size)}
                      </p>
                    </div>

                    <span className="text-[10px] text-green-400">
                      ✓
                    </span>

                    <button
                      onClick={() => removeResume(resume.id)}
                      className="text-gray-600 transition hover:text-red-400"
                      aria-label={`Remove ${resume.file.name}`}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Analysis Summary */}
        <section className="mt-6 rounded-xl border border-white/10 bg-[#101421] p-5">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-medium text-gray-300">
                Ready to compare?
              </p>

              <p className="mt-1 text-[10px] text-gray-600">
                {resumes.length > 0
                  ? `${resumes.length} resume${
                      resumes.length !== 1 ? "s" : ""
                    } selected`
                  : "No resumes uploaded yet"}
                {" · "}
                {jobDescription.trim().length > 20
                  ? "Job description added"
                  : "Job description required"}
              </p>
            </div>

            <button
  disabled={!canAnalyze || isAnalyzing}
  onClick={analyzeResumes}
  className={`rounded-lg px-6 py-3 text-xs font-medium transition ${
    canAnalyze && !isAnalyzing
      ? "bg-[#6f76ff] text-white hover:bg-[#7d84ff]"
      : "cursor-not-allowed bg-[#191d2b] text-gray-600"
  }`}
>
  {isAnalyzing
    ? "Analyzing Resumes..."
    : "Analyze Resume Fit →"}
</button>
          </div>
        </section>

       {/* Error */}
{error && (
  <div className="mt-5 rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-3 text-center text-xs text-red-400">
    {error}
  </div>
)}

{/* Privacy Note */}
<p className="mt-5 text-center text-[9px] text-gray-700">
  Your files are used only for this analysis.
</p>
      </section>
    </main>
  );
}