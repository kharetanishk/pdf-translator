import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";

const MARGIN = 72;
const FONT_SIZE = 11;
const LINE_GAP = 3;
const PARAGRAPH_GAP = 8;

/** Language code → font filename (in fonts/ directory) */
const FONT_MAP: Record<string, string> = {
  ar: "NotoSansArabic-Regular.ttf",
  bn: "NotoSansBengali-Regular.ttf",
  en: "NotoSans-Regular.ttf",
  fr: "NotoSans-Regular.ttf",
  de: "NotoSans-Regular.ttf",
  hi: "NotoSansDevanagari-Regular.ttf",
  mr: "NotoSansDevanagari-Regular.ttf",
  id: "NotoSans-Regular.ttf",
  ja: "NotoSansJP-Regular.otf",
  ko: "NotoSansKR-Regular.otf",
  zh: "NotoSansSC-Regular.otf",
  pt: "NotoSans-Regular.ttf",
  ru: "NotoSans-Regular.ttf",
  es: "NotoSans-Regular.ttf",
  sw: "NotoSans-Regular.ttf",
  ta: "NotoSansTamil-Regular.ttf",
  te: "NotoSansTelugu-Regular.ttf",
  tr: "NotoSans-Regular.ttf",
  ur: "NotoSansArabic-Regular.ttf",
  vi: "NotoSans-Regular.ttf",
};

/** Unicode ranges → lang code for font selection */
const SCRIPT_RANGES: { pattern: RegExp; lang: string }[] = [
  { pattern: /[\u0600-\u06FF\u0750-\u077F]/g, lang: "ar" }, // Arabic
  { pattern: /[\u0900-\u097F]/g, lang: "hi" }, // Devanagari
  { pattern: /[\u0980-\u09FF]/g, lang: "bn" }, // Bengali
  { pattern: /[\u0B80-\u0BFF]/g, lang: "ta" }, // Tamil
  { pattern: /[\u0C00-\u0C7F]/g, lang: "te" }, // Telugu
  { pattern: /[\u3040-\u309F\u30A0-\u30FF]/g, lang: "ja" }, // Hiragana, Katakana
  { pattern: /[\uAC00-\uD7AF]/g, lang: "ko" }, // Hangul
  { pattern: /[\u4E00-\u9FFF\u3400-\u4DBF]/g, lang: "zh" }, // CJK
  { pattern: /[\u0400-\u04FF]/g, lang: "ru" }, // Cyrillic
];

const FONTS_DIR = path.join(process.cwd(), "fonts");
const DEFAULT_FONT = "NotoSans-Regular.ttf";

/**
 * Returns the font file path for the given language code.
 * Falls back to default Latin font if the specific font is not found.
 */
export function getFontPathByLanguage(lang: string): string | null {
  const normalized = (lang || "").toLowerCase().trim();
  const filename = FONT_MAP[normalized] ?? DEFAULT_FONT;
  const fontPath = path.join(FONTS_DIR, filename);

  if (fs.existsSync(fontPath)) return fontPath;
  if (filename !== DEFAULT_FONT) {
    const defaultPath = path.join(FONTS_DIR, DEFAULT_FONT);
    if (fs.existsSync(defaultPath)) return defaultPath;
  }
  return null;
}

/**
 * Detects the dominant script in the text and returns a lang code for font selection.
 */
function detectLangFromText(text: string): string {
  if (!text || typeof text !== "string") return "en";
  let maxCount = 0;
  let detectedLang = "en";

  for (const { pattern, lang } of SCRIPT_RANGES) {
    const matches = text.match(pattern);
    const count = matches ? matches.length : 0;
    if (count > maxCount) {
      maxCount = count;
      detectedLang = lang;
    }
  }
  return detectedLang;
}

export async function buildPdf(
  translatedText: string,
  options?: { targetLang?: string }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: MARGIN, size: "A4" });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width;
    const textWidth = pageWidth - MARGIN * 2;

    const text = (translatedText ?? "").trim();
    const lang =
      (options?.targetLang ?? "").trim() || detectLangFromText(text);
    const fontPath = getFontPathByLanguage(lang);

    if (fontPath) {
      doc.font(fontPath);
    } else if (text && /[^\x00-\x7F]/.test(text)) {
      console.warn(
        `[pdfBuilder] No font found for "${lang}". Add fonts to apps/backend/fonts/ (see fonts/README.md). Unicode may not render correctly.`
      );
    }
    doc.fontSize(FONT_SIZE);

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
