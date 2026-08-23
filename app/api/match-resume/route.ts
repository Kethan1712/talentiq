import { NextResponse } from "next/server";
import { parseResume } from "@/lib/resumeParser";
import { extractResumeInformation } from "@/lib/ai";
import { matchResumeToJob } from "@/lib/matcher";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("resume");
    const jobDescription = formData.get("jobDescription");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Resume file is required." },
        { status: 400 }
      );
    }

    if (typeof jobDescription !== "string" || !jobDescription.trim()) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    const parsedResume = await parseResume(file);

    if (!parsedResume.text) {
      return NextResponse.json(
        { error: "Could not extract resume text." },
        { status: 422 }
      );
    }

    const structuredResume = await extractResumeInformation(
      parsedResume.text
    );

    const match = await matchResumeToJob(
      structuredResume,
      jobDescription
    );

    return NextResponse.json({
      success: true,
      resume: {
        fileName: parsedResume.fileName,
        pageCount: parsedResume.pageCount,
        ...structuredResume,
      },
      match,
    });
  } catch (error) {
    console.error("Resume matching error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to match resume.",
      },
      { status: 500 }
    );
  }
}