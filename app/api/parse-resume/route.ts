import { NextResponse } from "next/server";
import { parseResume } from "@/lib/resumeParser";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("resume");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Resume file is required." },
        { status: 400 }
      );
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return NextResponse.json(
        { error: "Only PDF resumes are currently supported." },
        { status: 400 }
      );
    }

    const resume = await parseResume(file);

    if (!resume.text) {
      return NextResponse.json(
        { error: "Could not extract text from this resume." },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      resume,
    });
  } catch (error) {
    console.error("Resume parsing error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}