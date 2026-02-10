import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { extractText, getDocumentProxy } from "unpdf";

export const uploadPdfController = async (req: Request, res: Response) => {
  const originalWarn = console.warn;
  console.warn = () => {};
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: "No Pdf buffer found. Ensure Multer is using memoryStorage.",
      });
    }
    const outputDir = path.join(process.cwd(), "parsetext");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 1. Convert Node.js Buffer to Uint8Array
    const pdfData = new Uint8Array(req.file.buffer);

    const data = await getDocumentProxy(pdfData);
    const extractedText = await extractText(data);
    console.log(extractedText);
    const text = extractedText.text.join("\n");

    const fileName = `output-${Date.now()}.txt`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, text);
    console.log(`Text saved to: ${filePath}`);

    return res.status(200).json({
      success: true,
      message: "Pdf parsed successfully",
      fileName: fileName,
      totalPages: extractedText.totalPages,
      text: extractedText.text.join("\n"),
    });
  } catch (error) {
    console.error("Error parsing pdf:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  } finally {
    console.warn = originalWarn;
  }
};
