import { getData } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

PDFParse.setWorker(getData());

export type ParsedResume = {
  fileName: string;
  text: string;
  pageCount: number;
};

export async function parseResume(
  file: File
): Promise<ParsedResume> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const parser = new PDFParse({
    data: buffer,
  });

  const result = await parser.getText();

  await parser.destroy();

  return {
    fileName: file.name,
    text: result.text.trim(),
    pageCount: result.total,
  };
}