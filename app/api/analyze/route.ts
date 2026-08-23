import { NextResponse } from "next/server";
import { parseResume } from "@/lib/resumeParser";
import { extractResumeInformation } from "@/lib/ai";
import { matchResumeToJob } from "@/lib/matcher";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const jobDescription = formData.get("jobDescription");

    if (
      typeof jobDescription !== "string" ||
      !jobDescription.trim()
    ) {
      return NextResponse.json(
        { error: "Job description is required." },
        { status: 400 }
      );
    }

    const files = formData
      .getAll("resumes")
      .filter(
        (item): item is File => item instanceof File
      );

    if (files.length === 0) {
      return NextResponse.json(
        { error: "At least one resume is required." },
        { status: 400 }
      );
    }

    if (files.length > 10) {
      return NextResponse.json(
        { error: "Maximum 10 resumes allowed." },
        { status: 400 }
      );
    }

    // Step 1: Parse + extract all resumes in parallel
    const extracted = await Promise.all(
      files.map(async (file) => {
        try {
          const parsedResume = await parseResume(file);

          if (!parsedResume.text) {
            throw new Error("Could not extract text.");
          }

          const structuredResume =
            await extractResumeInformation(
              parsedResume.text
            );

          return {
            success: true as const,
            fileName: parsedResume.fileName,
            pageCount: parsedResume.pageCount,
            resume: structuredResume,
          };
        } catch (error) {
          return {
            success: false as const,
            fileName: file.name,
            error:
              error instanceof Error
                ? error.message
                : "Failed to extract resume.",
          };
        }
      })
    );

    // Step 2: Match all successfully extracted resumes in parallel
    const matched = await Promise.all(
      extracted.map(async (item) => {
        if (!item.success) {
          return item;
        }

        try {
          const match = await matchResumeToJob(
            item.resume,
            jobDescription
          );

          return {
            success: true as const,
            fileName: item.fileName,
            pageCount: item.pageCount,
            ...item.resume,
            match,
          };
        } catch (error) {
          return {
            success: false as const,
            fileName: item.fileName,
            error:
              error instanceof Error
                ? error.message
                : "Failed to match resume.",
          };
        }
      })
    );

    const successfulResults = matched
      .filter(
        (
          item
        ): item is Extract<
          (typeof matched)[number],
          { success: true }
        > => item.success
      )
      .sort(
        (a, b) => b.match.score - a.match.score
      )
      .map((item, index) => ({
        rank: index + 1,
        ...item,
      }));

    const failed = matched.filter(
      (item) => !item.success
    );

    return NextResponse.json({
      success: true,
      totalResumes: files.length,
      analyzedResumes: successfulResults.length,
      results: successfulResults,
      failed,
    });
  } catch (error) {
    console.error("Analysis error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Analysis failed.",
      },
      { status: 500 }
    );
  }
}