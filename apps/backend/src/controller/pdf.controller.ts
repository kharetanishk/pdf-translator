import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { extractFromPdf } from "../services/extraction.service";
import { translate } from "../services/translation.service";
import { buildPdf } from "../services/pdfBuilder.service";

export const uploadPdfController = async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No Pdf buffer found. Ensure Multer is using memoryStorage.",
      });
    }

    const sourceLang = String(req.body?.sourceLang ?? "").trim();
    const targetLang = String(req.body?.targetLang ?? "").trim();
    if (!sourceLang || !targetLang) {
      return res.status(400).json({
        success: false,
        message: "sourceLang and targetLang are required",
      });
    }

    const extractionResult = await extractFromPdf(req.file.buffer);

    const outputDir = path.join(process.cwd(), "parsetext");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const fileName = `output-${Date.now()}.txt`;
    fs.writeFileSync(path.join(outputDir, fileName), extractionResult.text);
    console.log(`Text saved to: ${path.join(outputDir, fileName)}`);

    const { translatedText } = await translate(
      extractionResult.text,
      sourceLang,
      targetLang
    );

    const pdfBuffer = await buildPdf(translatedText);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="translated.pdf"'
    );
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("Error processing pdf:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return res.status(500).json({ success: false, message });
  }
};
