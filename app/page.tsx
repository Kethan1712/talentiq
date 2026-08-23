"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#080b16] text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between border-b border-white/10 px-6 py-4 md:px-10">
        <div>
          <div className="text-lg font-semibold tracking-tight">
            Talent<span className="text-[#7c83ff]">IQ</span>
          </div>
          <p className="text-[8px] tracking-[0.25em] text-gray-500">
            AI RESUME MATCHING
          </p>
        </div>

        <div className="hidden items-center gap-8 text-xs text-gray-400 md:flex">
          <button
  onClick={() => {
    document
      .getElementById("how-it-works")
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }}
>
  How It Works
</button>

          <button className="transition hover:text-white">
            For Job Seekers
          </button>

          <button className="transition hover:text-white">
            For Recruiters
          </button>
        </div>

        <button
          onClick={() => router.push("/screening")}
          className="rounded-md bg-[#6f76ff] px-4 py-2 text-xs font-medium transition hover:bg-[#7d84ff]"
        >
          Try TalentIQ →
        </button>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-20 text-center md:pt-24">
        <div className="mb-6 inline-flex rounded-full border border-[#6f76ff]/30 bg-[#6f76ff]/10 px-4 py-1 text-[10px] font-medium tracking-wider text-[#8e94ff]">
          ✦ AI-POWERED RESUME MATCHING
        </div>

        <h1 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Know which resume
          <span className="text-[#7c83ff]"> fits the job.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">
          Upload a job description and multiple resumes. TalentIQ uses AI to
          compare them, rank their fit, and explain exactly why.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            onClick={() => router.push("/screening")}
            className="rounded-md bg-[#6f76ff] px-7 py-3 text-sm font-medium transition hover:bg-[#7d84ff]"
          >
            Analyze Resumes →
          </button>

          <button className="rounded-md border border-white/10 bg-[#111525] px-7 py-3 text-sm text-gray-300 transition hover:bg-[#171b2d]">
            See How It Works
          </button>
        </div>

        <p className="mt-4 text-[10px] text-gray-600">
          No signup · No complicated setup · Upload and analyze
        </p>
      </section>

      {/* Product Preview */}
      <section className="mx-auto mt-16 max-w-5xl px-6 pb-16">
        <div className="rounded-xl border border-white/10 bg-[#101421] p-5 shadow-[0_0_70px_rgba(111,118,255,0.08)] md:p-6">
          {/* Preview Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-wider text-gray-500">
                Resume Fit Analysis
              </p>
              <h2 className="mt-1 text-sm font-semibold">
                Machine Learning Engineer
              </h2>
            </div>

            <div className="rounded-md border border-white/10 bg-[#171b2b] px-3 py-2 text-[10px] text-gray-400">
              3 resumes analyzed
            </div>
          </div>

          {/* Candidates */}
          <div className="mt-5 space-y-3">
            <ResumePreview
              rank="01"
              name="Sarah Johnson"
              role="Senior Machine Learning Engineer"
              score="92%"
              skills={["Python", "FastAPI", "Machine Learning", "SQL"]}
              status="Strong Match"
            />

            <ResumePreview
              rank="02"
              name="Rahul Sharma"
              role="Software Engineer"
              score="84%"
              skills={["Python", "TensorFlow", "SQL", "Docker"]}
              status="Good Match"
            />

            <ResumePreview
              rank="03"
              name="Elena Li"
              role="Full Stack Developer"
              score="72%"
              skills={["JavaScript", "React", "Node.js", "AWS"]}
              status="Potential"
            />
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="mb-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8e94ff]">
            Built for both sides
          </p>

          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            One tool. Different goals.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-500">
            Whether you're applying for a role or evaluating candidates,
            TalentIQ helps you understand resume-to-job fit.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Job Seekers */}
          <div className="rounded-xl border border-white/10 bg-[#101421] p-7 transition hover:border-[#6f76ff]/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6f76ff]/10 text-lg">
              🎓
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              For Job Seekers
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Have multiple versions of your resume? Upload them with a job
              description and discover which one fits the role best.
            </p>

            <div className="mt-5 space-y-2 text-xs text-gray-400">
              <p>✓ Compare multiple resume versions</p>
              <p>✓ Identify missing skills</p>
              <p>✓ Understand your match score</p>
              <p>✓ Get suggestions to improve your resume</p>
            </div>

            <button
              onClick={() => router.push("/screening")}
              className="mt-6 text-xs font-medium text-[#8e94ff] transition hover:text-white"
            >
              Compare My Resumes →
            </button>
          </div>
          <section
  id="how-it-works"
  className="mx-auto max-w-6xl px-6 py-24 md:px-10"
>
  <div className="text-center">
    <p className="text-[10px] uppercase tracking-[0.2em] text-[#8e94ff]">
      How It Works
    </p>

    <h2 className="mt-3 text-3xl font-bold tracking-tight">
      From job description to the right resume.
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500">
      Paste a job description, upload multiple resumes, and
      let TalentIQ compare, explain, and rank them for you.
    </p>
  </div>

  <div className="mt-12 grid gap-4 md:grid-cols-3">
    <div className="rounded-xl border border-white/10 bg-[#101421] p-6">
      <p className="text-sm font-semibold">01 · Add the JD</p>
      <p className="mt-3 text-xs leading-6 text-gray-500">
        Paste the job description you're targeting.
      </p>
    </div>

    <div className="rounded-xl border border-white/10 bg-[#101421] p-6">
      <p className="text-sm font-semibold">02 · Upload resumes</p>
      <p className="mt-3 text-xs leading-6 text-gray-500">
        Upload multiple resume versions or candidate resumes.
      </p>
    </div>

    <div className="rounded-xl border border-white/10 bg-[#101421] p-6">
      <p className="text-sm font-semibold">03 · Compare & rank</p>
      <p className="mt-3 text-xs leading-6 text-gray-500">
        TalentIQ analyzes the fit, highlights strengths and
        gaps, and ranks the resumes.
      </p>
    </div>
  </div>
</section>

          {/* Recruiters */}
          <div className="rounded-xl border border-white/10 bg-[#101421] p-7 transition hover:border-[#6f76ff]/30">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#6f76ff]/10 text-lg">
              👥
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              For Recruiters
            </h3>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Upload a job description and multiple resumes to quickly
              identify the candidates who fit the role best.
            </p>

            <div className="mt-5 space-y-2 text-xs text-gray-400">
              <p>✓ Screen multiple resumes</p>
              <p>✓ Rank candidates automatically</p>
              <p>✓ Identify skill gaps</p>
              <p>✓ Understand why candidates match</p>
            </div>

            <button
              onClick={() => router.push("/screening")}
              className="mt-6 text-xs font-medium text-[#8e94ff] transition hover:text-white"
            >
              Screen Candidates →
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

function ResumePreview({
  rank,
  name,
  role,
  score,
  skills,
  status,
}: {
  rank: string;
  name: string;
  role: string;
  score: string;
  skills: string[];
  status: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#0c101c] p-4 transition hover:border-[#6f76ff]/30">
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-gray-600">{rank}</span>

        <div className="min-w-0 flex-1 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xs font-semibold">{name}</h3>

            <span className="rounded bg-[#171c31] px-2 py-0.5 text-[8px] text-[#9da2ff]">
              {status}
            </span>
          </div>

          <p className="mt-1 text-[9px] text-gray-500">{role}</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded bg-[#171b2b] px-2 py-1 text-[8px] text-gray-400"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#1c2130]">
            <div
              className="h-full rounded-full bg-[#737aff]"
              style={{ width: score }}
            />
          </div>
        </div>


        <div className="text-right">
          <p className="text-xl font-bold text-[#9da2ff]">{score}</p>
          <p className="text-[8px] uppercase tracking-wider text-gray-600">
            Match
          </p>
        </div>
      </div>
    </div>
  );
}