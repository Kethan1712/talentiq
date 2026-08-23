"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

export default function ResultsPage() {
  const router = useRouter();

  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const stored = sessionStorage.getItem("talentiq-results");

    if (!stored) {
      router.push("/screening");
      return;
    }

    try {
      const data = JSON.parse(stored);
      setResults(data.results || []);
    } catch {
      router.push("/screening");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const filteredResults =
    filter === "All"
      ? results
      : results.filter(
          (resume) => resume.match.status === filter
        );

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b16] text-white">
        <div className="text-center">
          <div className="text-lg font-semibold">
            Talent<span className="text-[#7c83ff]">IQ</span>
          </div>

          <p className="mt-3 text-xs text-gray-500">
            Loading analysis results...
          </p>
        </div>
      </main>
    );
  }

  if (results.length === 0) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080b16] text-white">
        <div className="text-center">
          <p className="text-sm text-gray-400">
            No analysis results found.
          </p>

          <button
            onClick={() => router.push("/screening")}
            className="mt-4 rounded-md bg-[#6f76ff] px-4 py-2 text-xs"
          >
            Start Analysis
          </button>
        </div>
      </main>
    );
  }

  const averageScore = Math.round(
    results.reduce(
      (sum, resume) => sum + resume.match.score,
      0
    ) / results.length
  );

  const strongMatches = results.filter(
    (resume) => resume.match.score >= 85
  ).length;

  const topScore = results[0]?.match.score ?? 0;

  return (
    <main className="min-h-screen bg-[#080b16] text-white">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b border-white/10 px-6 md:px-10">
        <button
          onClick={() => router.push("/")}
          className="text-lg font-semibold tracking-tight"
        >
          Talent<span className="text-[#7c83ff]">IQ</span>
        </button>

        <button
          onClick={() => router.push("/screening")}
          className="rounded-md border border-white/10 bg-[#111525] px-4 py-2 text-xs text-gray-300 transition hover:bg-[#171c2d]"
        >
          + New Analysis
        </button>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10 md:px-10 md:py-14">
        {/* Heading */}
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <button
              onClick={() => router.push("/screening")}
              className="mb-5 text-xs text-gray-500 transition hover:text-white"
            >
              ← Back to Analysis
            </button>

            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8e94ff]">
              Analysis Complete
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Resume Fit Results
            </h1>

            <p className="mt-3 text-sm text-gray-500">
              {results.length} resume
              {results.length !== 1 ? "s" : ""} analyzed
              against the same job description.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <SummaryCard
            label="Resumes"
            value={results.length
              .toString()
              .padStart(2, "0")}
          />

          <SummaryCard
            label="Strong Matches"
            value={strongMatches
              .toString()
              .padStart(2, "0")}
          />

          <SummaryCard
            label="Average Match"
            value={`${averageScore}%`}
          />

          <SummaryCard
            label="Top Match"
            value={`${topScore}%`}
            highlight
          />
        </div>

        {/* Filters */}
        <div className="mt-10 flex flex-col justify-between gap-4 border-b border-white/10 pb-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-sm font-semibold">
              Ranked Resumes
            </h2>

            <p className="mt-1 text-[10px] text-gray-600">
              Highest matching resumes appear first.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {["All", "Strong Match", "Potential"].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`rounded-md px-3 py-2 text-[10px] transition ${
                  filter === option
                    ? "bg-[#6f76ff]/10 text-[#9da2ff]"
                    : "border border-white/10 text-gray-500 hover:text-white"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Real Resume Cards */}
        <div className="mt-5 space-y-4">
          {filteredResults.map((resume) => {
            const role =
              resume.experience?.[0]?.role ||
              "Candidate";

            const gap =
              resume.match.gaps?.[0] ||
              resume.match.missingSkills?.[0] ||
              "No major gaps identified.";

            return (
              <article
                key={`${resume.rank}-${resume.fileName}`}
                className="rounded-xl border border-white/10 bg-[#101421] p-5 transition hover:border-[#6f76ff]/30 md:p-6"
              >
                <div className="flex flex-col gap-6 md:flex-row">
                  {/* Rank */}
                  <div className="hidden w-8 shrink-0 pt-1 text-center text-xs font-medium text-gray-700 md:block">
                    #{resume.rank}
                  </div>

                  {/* Main */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold">
                            {resume.name ||
                              resume.fileName}
                          </h3>

                          <span
                            className={`rounded px-2 py-1 text-[9px] ${statusStyle(
                              resume.match.status
                            )}`}
                          >
                            {resume.match.status}
                          </span>
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                          {role}
                        </p>

                        <p className="mt-1 text-[9px] text-gray-700">
                          {resume.fileName}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p
                          className={`text-3xl font-bold ${scoreColor(
                            resume.match.score
                          )}`}
                        >
                          {resume.match.score}%
                        </p>

                        <p className="text-[8px] uppercase tracking-wider text-gray-600">
                          Match
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#1b2030]">
                      <div
                        className="h-full rounded-full bg-[#737aff]"
                        style={{
                          width: `${resume.match.score}%`,
                        }}
                      />
                    </div>

                    {/* Matched Skills */}
                    <div className="mt-5 flex flex-wrap gap-2">
                      {resume.match.matchedSkills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="rounded-md border border-white/5 bg-[#171c2d] px-2.5 py-1.5 text-[9px] text-gray-400"
                          >
                            {skill}
                          </span>
                        )
                      )}
                    </div>

                    {/* Insights */}
                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <div className="rounded-lg border border-white/5 bg-[#0b0f1b] p-4">
                        <p className="text-[9px] uppercase tracking-wider text-gray-600">
                          Why it matches
                        </p>

                        <div className="mt-3 space-y-2">
                          {resume.match.strengths.map(
                            (strength) => (
                              <p
                                key={strength}
                                className="text-[10px] text-gray-400"
                              >
                                <span className="mr-2 text-green-400">
                                  ✓
                                </span>
                                {strength}
                              </p>
                            )
                          )}
                        </div>
                      </div>

                      <div className="rounded-lg border border-white/5 bg-[#0b0f1b] p-4">
                        <p className="text-[9px] uppercase tracking-wider text-gray-600">
                          Potential gap
                        </p>

                        <div className="mt-3 space-y-2">
                          {resume.match.gaps
                            .slice(0, 2)
                            .map((item) => (
                              <p
                                key={item}
                                className="text-[10px] leading-5 text-gray-400"
                              >
                                <span className="mr-2 text-yellow-400">
                                  !
                                </span>
                                {item}
                              </p>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Missing Skills */}
                    {resume.match.missingSkills
                      .length > 0 && (
                      <div className="mt-3 rounded-lg border border-white/5 bg-[#0b0f1b] p-4">
                        <p className="text-[9px] uppercase tracking-wider text-gray-600">
                          Missing skills
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {resume.match.missingSkills.map(
                            (skill) => (
                              <span
                                key={skill}
                                className="rounded-md border border-yellow-400/10 bg-yellow-400/5 px-2.5 py-1.5 text-[9px] text-yellow-400"
                              >
                                {skill}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* Recommendation */}
                    <div className="mt-3 rounded-lg border border-white/5 bg-[#0b0f1b] p-4">
                      <p className="text-[9px] uppercase tracking-wider text-gray-600">
                        Recommendation
                      </p>

                      <p className="mt-3 text-[10px] leading-5 text-gray-400">
                        {resume.match.recommendation}
                      </p>
                    </div>

                    {/* View Full Analysis */}
                    <div className="mt-5 flex justify-end">
                      <button
                        onClick={() => {
                          sessionStorage.setItem(
                            "talentiq-selected-result",
                            JSON.stringify(resume)
                          );

                          router.push(`/results/${resume.rank}`);
                        }}
                        className="text-xs font-medium text-[#9da2ff] transition hover:text-white"
                      >
                        View Full Analysis →
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function scoreColor(score: number) {
  if (score >= 90) return "text-green-400";
  if (score >= 75) return "text-[#9da2ff]";
  return "text-yellow-400";
}

function statusStyle(status: string) {
  if (status === "Strong Match") {
    return "bg-green-400/10 text-green-400";
  }

  if (status === "Good Match") {
    return "bg-[#6f76ff]/10 text-[#9da2ff]";
  }

  return "bg-yellow-400/10 text-yellow-400";
}

function SummaryCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#101421] p-4 md:p-5">
      <p className="text-[9px] uppercase tracking-wider text-gray-600">
        {label}
      </p>

      <p
        className={`mt-3 text-2xl font-bold ${
          highlight
            ? "text-[#9da2ff]"
            : "text-gray-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}