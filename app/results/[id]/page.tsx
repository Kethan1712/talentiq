"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Result = {
  rank: number;
  fileName: string;
  pageCount: number;
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
  match: {
    score: number;
    status: string;
    matchedSkills: string[];
    missingSkills: string[];
    strengths: string[];
    gaps: string[];
    recommendation: string;
  };
};

export default function ResumeAnalysisPage() {
  const router = useRouter();
  const params = useParams();

  const [resume, setResume] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(
      "talentiq-selected-result"
    );

    if (!stored) {
      router.push("/results");
      return;
    }

    try {
      const data = JSON.parse(stored);
      setResume(data);
    } catch {
      router.push("/results");
    } finally {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b16] text-white">
        <div className="text-center">
          <div className="text-lg font-semibold">
            Talent<span className="text-[#7c83ff]">IQ</span>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Loading resume analysis...
          </p>
        </div>
      </main>
    );
  }

  if (!resume) {
    return null;
  }

  const role =
    resume.experience?.[0]?.role || "Candidate";

  const experienceText =
    resume.experience?.length > 0
      ? resume.experience
          .map(
            (item) =>
              `${item.role} at ${item.company} (${item.duration})`
          )
          .join(" • ")
      : "No professional experience identified.";

  return (
    <main className="min-h-screen bg-[#080b16] text-white">
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6 md:px-10">
        <button
          onClick={() => router.push("/")}
          className="text-lg font-semibold tracking-tight"
        >
          Talent<span className="text-[#7c83ff]">IQ</span>
        </button>

        <button
          onClick={() => router.push("/results")}
          className="text-xs text-gray-500 transition hover:text-white"
        >
          ← Back to Results
        </button>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[#8e94ff]">
          Resume Analysis
        </p>

        <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold">
              {resume.name || resume.fileName}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {role} · Resume #{params.id}
            </p>

            <p className="mt-1 text-[10px] text-gray-700">
              {resume.fileName}
            </p>
          </div>

          <div className="rounded-xl border border-green-400/20 bg-green-400/5 px-6 py-4 text-center">
            <p
              className={`text-3xl font-bold ${
                resume.match.score >= 85
                  ? "text-green-400"
                  : resume.match.score >= 70
                  ? "text-[#9da2ff]"
                  : "text-yellow-400"
              }`}
            >
              {resume.match.score}%
            </p>

            <p className="mt-1 text-[9px] uppercase tracking-wider text-gray-600">
              {resume.match.status}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <AnalysisCard title="Skills Match">
            {resume.match.matchedSkills.length > 0 ? (
              resume.match.matchedSkills.map((skill) => (
                <SkillRow
                  key={skill}
                  name={skill}
                  score={100}
                />
              ))
            ) : (
              <p className="text-xs text-gray-500">
                No matched skills identified.
              </p>
            )}
          </AnalysisCard>

          <AnalysisCard title="AI Recommendation">
            <p className="text-sm leading-7 text-gray-400">
              {resume.match.recommendation}
            </p>

            <div className="mt-5 rounded-lg border border-[#6f76ff]/10 bg-[#6f76ff]/5 p-4">
              <p className="text-[9px] uppercase tracking-wider text-[#9da2ff]">
                Recommendation
              </p>

              <p className="mt-2 text-xs text-gray-300">
                {resume.match.status} based on the AI evaluation
                of the resume against the job description.
              </p>
            </div>
          </AnalysisCard>

          <AnalysisCard title="Key Strengths">
            {resume.match.strengths.length > 0 ? (
              resume.match.strengths.map((strength) => (
                <Bullet
                  key={strength}
                  text={strength}
                />
              ))
            ) : (
              <p className="text-xs text-gray-500">
                No specific strengths identified.
              </p>
            )}
          </AnalysisCard>

          <AnalysisCard title="Potential Gaps">
            {resume.match.gaps.length > 0 ? (
              resume.match.gaps.map((gap) => (
                <Bullet
                  key={gap}
                  text={gap}
                  warning
                />
              ))
            ) : (
              <p className="text-xs text-gray-500">
                No major gaps identified.
              </p>
            )}
          </AnalysisCard>

          <AnalysisCard title="Experience">
            {resume.experience.length > 0 ? (
              <>
                <div className="text-sm font-semibold text-gray-200">
                  {resume.experience.length}{" "}
                  {resume.experience.length === 1
                    ? "position"
                    : "positions"}
                </div>

                <p className="mt-2 text-xs leading-6 text-gray-500">
                  {experienceText}
                </p>
              </>
            ) : (
              <p className="text-xs text-gray-500">
                No professional experience identified.
              </p>
            )}
          </AnalysisCard>

          <AnalysisCard title="Education">
            {resume.education.length > 0 ? (
              resume.education.map((education) => (
                <div key={`${education.degree}-${education.institution}`}>
                  <div className="text-sm font-semibold text-gray-300">
                    {education.degree}
                  </div>

                  <p className="mt-2 text-xs text-gray-500">
                    {education.institution}
                    {education.year
                      ? ` · ${education.year}`
                      : ""}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">
                No education information identified.
              </p>
            )}
          </AnalysisCard>
        </div>

        {resume.match.missingSkills.length > 0 && (
          <AnalysisCard title="Missing Skills" className="mt-5">
            <div className="flex flex-wrap gap-2">
              {resume.match.missingSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-yellow-400/10 bg-yellow-400/5 px-3 py-2 text-xs text-yellow-400"
                >
                  {skill}
                </span>
              ))}
            </div>
          </AnalysisCard>
        )}

        <AnalysisCard
          title="How to Improve This Resume"
          className="mt-5"
        >
          {resume.match.missingSkills.length > 0 ? (
            resume.match.missingSkills
              .slice(0, 4)
              .map((skill) => (
                <Bullet
                  key={skill}
                  text={`Consider strengthening evidence of ${skill}.`}
                />
              ))
          ) : (
            <Bullet text="Continue highlighting measurable achievements and relevant technical skills." />
          )}
        </AnalysisCard>
      </section>
    </main>
  );
}

function AnalysisCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-[#101421] p-6 ${className}`}
    >
      <h2 className="mb-5 text-sm font-semibold">
        {title}
      </h2>

      <div className="space-y-4">{children}</div>
    </section>
  );
}

function SkillRow({
  name,
  score,
}: {
  name: string;
  score: number;
}) {
  return (
    <div>
      <div className="flex justify-between text-[10px]">
        <span className="text-gray-400">{name}</span>
        <span className="text-gray-600">{score}%</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#1b2030]">
        <div
          className="h-full rounded-full bg-[#737aff]"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function Bullet({
  text,
  warning = false,
}: {
  text: string;
  warning?: boolean;
}) {
  return (
    <p className="text-xs text-gray-400">
      <span
        className={
          warning
            ? "mr-2 text-yellow-400"
            : "mr-2 text-green-400"
        }
      >
        {warning ? "!" : "✓"}
      </span>

      {text}
    </p>
  );
}