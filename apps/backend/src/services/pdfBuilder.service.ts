import PDFDocument from "pdfkit";

const MARGIN = 72;
const FONT_SIZE = 11;
const LINE_GAP = 3;
const PARAGRAPH_GAP = 8;

export async function buildPdf(translatedText: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: MARGIN, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width;
    const textWidth = pageWidth - MARGIN * 2;

    doc.fontSize(FONT_SIZE);

    const text = (translatedText ?? "").trim();
    if (!text) {
      doc.text("No content.", { width: textWidth });
    } else {
      doc.text(text, {
        width: textWidth,
        align: "left",
        lineBreak: true,
        lineGap: LINE_GAP,
        paragraphGap: PARAGRAPH_GAP,
      });
    }

    doc.end();
  });
}
