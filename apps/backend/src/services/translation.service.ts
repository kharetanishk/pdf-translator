const GOOGLE_TRANSLATE_URL = "https://translation.googleapis.com/language/translate/v2";

/** Google Translate API v2 limit: ~5000 chars per request. Use 4000 to stay safe. */
const MAX_CHUNK_CHARS = 4000;

export interface TranslateResult {
  translatedText: string;
}

/**
 * Split text into chunks at paragraph boundaries, respecting MAX_CHUNK_CHARS.
 * Preserves paragraph structure by not splitting mid-paragraph when possible.
 */
function chunkByParagraphs(text: string, maxChars: number): string[] {
  if (text.length <= maxChars) return [text];

  const paragraphs = text.split(/(\n\n+)/);
  const chunks: string[] = [];
  let current = "";

  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    if (p === undefined) continue;

    if (p.match(/^\n+$/)) {
      current += p;
      continue;
    }

    if (current.length + p.length <= maxChars) {
      current += p;
    } else {
      if (current) {
        chunks.push(current.trimEnd());
        current = "";
      }
      if (p.length <= maxChars) {
        current = p;
      } else {
        chunks.push(...chunkByLength(p, maxChars));
      }
    }
  }
  if (current) chunks.push(current.trimEnd());
  return chunks;
}

/** Fallback: split very long paragraphs by length at word boundaries. */
function chunkByLength(text: string, maxChars: number): string[] {
  const chunks: string[] = [];
  let remaining = text;

  while (remaining.length > maxChars) {
    const slice = remaining.slice(0, maxChars);
    const lastSpace = slice.lastIndexOf(" ");
    const cut = lastSpace > maxChars * 0.5 ? lastSpace : maxChars;
    chunks.push(remaining.slice(0, cut));
    remaining = remaining.slice(cut).trimStart();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
}

async function translateChunk(
  chunk: string,
  sourceLang: string,
  targetLang: string,
  apiKey: string
): Promise<string> {
  const body = new URLSearchParams({
    q: chunk,
    target: targetLang,
    format: "text",
    key: apiKey,
  });
  if (sourceLang) body.set("source", sourceLang);

  const res = await fetch(GOOGLE_TRANSLATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-HTTP-Method-Override": "GET",
    },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    const msg = err?.error?.message ?? res.statusText;
    throw new Error(`Google Translate API error: ${msg}`);
  }

  const data = (await res.json()) as {
    data?: { translations?: { translatedText?: string }[] };
  };
  const translated = data?.data?.translations?.[0]?.translatedText;
  if (translated == null) {
    throw new Error("Google Translate API returned invalid response");
  }
  return translated;
}

export async function translate(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<TranslateResult> {
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error("GOOGLE_TRANSLATE_API_KEY is not configured");
  }

  const trimmed = text?.trim() ?? "";
  if (!trimmed) {
    return { translatedText: "" };
  }

  const chunks = chunkByParagraphs(trimmed, MAX_CHUNK_CHARS);
  const results: string[] = [];

  for (const chunk of chunks) {
    const translated = await translateChunk(chunk, sourceLang, targetLang, apiKey);
    results.push(translated);
  }

  return {
    translatedText: results.join("\n\n"),
  };
}
