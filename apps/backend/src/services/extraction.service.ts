import { extractText, getDocumentProxy } from "unpdf";

export interface ExtractionResult {
  text: string;
  pages: string[];
  totalPages: number;
}

export async function extractFromPdf(buffer: Buffer): Promise<ExtractionResult> {
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    const pdfData = new Uint8Array(buffer);
    const data = await getDocumentProxy(pdfData);
    const extracted = await extractText(data);

    return {
      text: extracted.text.join("\n"),
      pages: extracted.text,
      totalPages: extracted.totalPages,
    };
  } finally {
    console.warn = originalWarn;
  }
}
