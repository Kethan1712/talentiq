import { NextResponse } from "next/server";
import { parseResume } from "@/lib/resumeParser";
import { extractResumeInformation } from "@/lib/ai";

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

    const parsedResume = await parseResume(file);

    if (!parsedResume.text) {
      return NextResponse.json(
        { error: "Could not extract text from the resume." },
        { status: 422 }
      );
    }

    const structuredResume =
      await extractResumeInformation(parsedResume.text);

    return NextResponse.json({
      success: true,
      resume: {
        fileName: parsedResume.fileName,
        pageCount: parsedResume.pageCount,
        ...structuredResume,
      },
    });
  } catch (error) {
   console.error("Resume extraction error:", error);

return NextResponse.json(
  {
    error:
      error instanceof Error
        ? `${error.name}: ${error.message}`
        : String(error),
  },
  { status: 500 }
);
  }
}