import pdfParse from "pdf-parse";

export async function extractPdfText(buffer: Buffer) {
  const data = await (pdfParse as any)(buffer);
  return data.text;
}
