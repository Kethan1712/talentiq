"use client";

import { useParams, useRouter } from "next/navigation";

export default function ResumeAnalysisPage() {
  const router = useRouter();
  const params = useParams();

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
              Sarah Johnson
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Senior Machine Learning Engineer · Resume #{params.id}
            </p>
          </div>

          <div className="rounded-xl border border-green-400/20 bg-green-400/5 px-6 py-4 text-center">
            <p className="text-3xl font-bold text-green-400">92%</p>
            <p className="mt-1 text-[9px] uppercase tracking-wider text-gray-600">
              Strong Match
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <AnalysisCard title="Skills Match">
            <SkillRow name="Python" score={100} />
            <SkillRow name="FastAPI" score={100} />
            <SkillRow name="Machine Learning" score={90} />
            <SkillRow name="SQL" score={80} />
            <SkillRow name="AWS" score={40} />
          </AnalysisCard>

          <AnalysisCard title="AI Recommendation">
            <p className="text-sm leading-7 text-gray-400">
              This resume is a strong match for the role. The candidate has
              relevant machine learning and backend experience and demonstrates
              most of the technical skills required by the job description.
            </p>

            <div className="mt-5 rounded-lg border border-green-400/10 bg-green-400/5 p-4">
              <p className="text-[9px] uppercase tracking-wider text-green-400">
                Recommendation
              </p>

              <p className="mt-2 text-xs text-gray-300">
                Strong candidate based on technical alignment and relevant
                experience.
              </p>
            </div>
          </AnalysisCard>

          <AnalysisCard title="Key Strengths">
            <Bullet text="Strong Python experience" />
            <Bullet text="Relevant machine learning background" />
            <Bullet text="Good FastAPI and backend experience" />
            <Bullet text="Strong SQL knowledge" />
          </AnalysisCard>

          <AnalysisCard title="Potential Gaps">
            <Bullet text="Limited AWS experience" warning />
            <Bullet text="No explicit Kubernetes experience" warning />
          </AnalysisCard>

          <AnalysisCard title="Experience">
            <div className="text-2xl font-bold text-gray-200">4 years</div>

            <p className="mt-2 text-xs text-gray-500">
              Relevant software engineering and machine learning experience.
            </p>
          </AnalysisCard>

          <AnalysisCard title="Education">
            <div className="text-sm font-semibold text-gray-300">
              B.Tech — Computer Science
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Relevant technical education identified from the resume.
            </p>
          </AnalysisCard>
        </div>

        <AnalysisCard title="How to Improve This Resume" className="mt-5">
          <Bullet text="Highlight cloud deployment experience" />
          <Bullet text="Add relevant AWS projects or certifications" />
          <Bullet text="Make API development experience more prominent" />
          <Bullet text="Quantify impact in previous projects and roles" />
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
      <h2 className="mb-5 text-sm font-semibold">{title}</h2>

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
      <span className={warning ? "mr-2 text-yellow-400" : "mr-2 text-green-400"}>
        {warning ? "!" : "✓"}
      </span>
      {text}
    </p>
  );
}