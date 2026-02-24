# CHAPTER X – SOURCE CODE

This chapter presents the core source code of **Global PDF Services – AI Powered PDF Translation Platform**. Only key files and essential snippets are included to support documentation and viva explanation. The full codebase resides in the project repository.

---

## 1. Backend – Server Setup (server.js)

The server initialises Express and applies security and rate-limiting middleware before registering routes and a global error handler.

```js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import translateRouter from './routes/translate.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Security: set safe HTTP headers
app.use(helmet());

// Allow frontend origin
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

// Rate limit to protect API and translation quota (50 req / 15 min)
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { success: false, message: 'Too many requests' }
}));

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', translateRouter);

// Global error handler – must be last
app.use(errorHandler);

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
```

**Explanation.** `helmet` sets secure HTTP headers; `cors` allows the frontend origin to call the API; `express-rate-limit` limits the number of requests per IP to protect the Google Translate API quota and reduce abuse. The `/health` route is used for monitoring; all translation requests go through `/api` and are handled by the translate router. The central error handler returns JSON errors and avoids leaking stack traces.

---

## 2. Translation Controller

The controller receives the uploaded file and language parameters, orchestrates extraction and translation, builds the PDF, and sends it as a downloadable response.

```js
import { extractTextFromPDF, buildTranslatedPDF } from '../services/pdfService.js';
import { translateText } from '../services/translationService.js';

export async function translatePdf(req, res, next) {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ success: false, message: 'No PDF file uploaded.' });
    }

    const sourceLang = (req.body?.sourceLang || '').trim() || 'en';
    const targetLang = (req.body?.targetLang || '').trim();
    if (!targetLang) {
      return res.status(400).json({ success: false, message: 'sourceLang and targetLang required.' });
    }

    const rawText = extractTextFromPDF(req.file.buffer);
    const translatedText = await translateText(rawText, sourceLang, targetLang);
    const pdfBuffer = await buildTranslatedPDF(translatedText);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="translated.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
}
```

**Explanation.** The route uses `multer` (configured in the router) so the file is available as `req.file.buffer`. The controller validates the presence of the file and target language, then calls the PDF service to extract text and to build the translated PDF, and the translation service to get the translated text. The response is sent as a binary PDF with headers that trigger a download in the browser. Any thrown error is passed to the global error handler via `next(err)`.

---

## 3. Translation Service

The service chunks long text to respect API limits and calls the Google Translate API for each chunk.

```js
import axios from 'axios';

const API_URL = 'https://translation.googleapis.com/language/translate/v2';
const MAX_CHUNK = 4000;

function chunkText(text) {
  if (!text || text.length <= MAX_CHUNK) return [text];
  const chunks = [];
  for (let i = 0; i < text.length; i += MAX_CHUNK) {
    chunks.push(text.slice(i, i + MAX_CHUNK));
  }
  return chunks;
}

export async function translateText(text, sourceLang, targetLang) {
  const key = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!key) throw new Error('GOOGLE_TRANSLATE_API_KEY not set');

  const chunks = chunkText(text);
  const results = [];

  for (const chunk of chunks) {
    const params = new URLSearchParams({
      q: chunk,
      target: targetLang,
      format: 'text',
      key
    });
    if (sourceLang) params.set('source', sourceLang);

    const { data } = await axios.post(API_URL, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const translated = data?.data?.translations?.[0]?.translatedText;
    if (translated) results.push(translated);
  }

  return results.join('\n\n');
}
```

**Explanation.** Google Translate API has a character limit per request; `chunkText` splits the extracted text into segments of at most 4000 characters. Each segment is sent in a separate POST request; responses are concatenated with double newlines to preserve paragraph breaks. The API key is read from the environment and never exposed to the client. Errors from `axios` (e.g. network or quota) propagate to the controller and are returned as JSON by the error handler.

---

## 4. PDF Service

The PDF service provides text extraction (mock for MVP) and PDF generation from translated text.

```js
import PDFDocument from 'pdfkit';

// Mock extraction: replace with pdf-parse or unpdf in production
export function extractTextFromPDF(buffer) {
  if (!buffer?.length) return '';
  return 'Sample document text for translation. Replace with actual PDF parsing.';
}

// Build a simple PDF from translated text
export async function buildTranslatedPDF(text) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    doc.fontSize(11).text(text || 'No content.', { width: 500 });
    doc.end();
  });
}
```

**Explanation.** `extractTextFromPDF` is a placeholder that returns a fixed string; in production it would use a library such as `pdf-parse` or `unpdf` to extract text from the buffer. `buildTranslatedPDF` uses PDFKit to create a new PDF: it writes the translated text with a fixed width for line wrapping, streams the output into a buffer, and returns the buffer. The controller sends this buffer as the HTTP response body.

---

## 5. Frontend – Main Page (page.tsx)

The main page composes the upload area, language selectors, progress indicator, and translate action, and calls the backend via the API utility.

```tsx
'use client';

import { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { LanguageSelector } from '../components/LanguageSelector';
import { ProgressBar } from '../components/ProgressBar';
import { ResultDownload } from '../components/ResultDownload';
import { translatePdf } from '../lib/api';

type Step = 'idle' | 'uploading' | 'translating' | 'building' | 'done';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [step, setStep] = useState<Step>('idle');
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canTranslate = file && sourceLang && targetLang && step === 'idle';

  async function handleTranslate() {
    if (!file) return;
    setError(null);
    setResult(null);
    setStep('uploading');
    const t1 = setTimeout(() => setStep('translating'), 400);
    const t2 = setTimeout(() => setStep('building'), 1200);

    try {
      const blob = await translatePdf(file, sourceLang, targetLang);
      clearTimeout(t1);
      clearTimeout(t2);
      setStep('done');
      setResult(blob);
    } catch (e) {
      clearTimeout(t1);
      clearTimeout(t2);
      setStep('idle');
      setError(e instanceof Error ? e.message : 'Translation failed.');
    }
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Global PDF Services</h1>
      <FileUpload onFile={setFile} />
      <div className="mt-6">
        <LanguageSelector source={sourceLang} target={targetLang}
          onSource={setSourceLang} onTarget={setTargetLang} />
      </div>
      <ProgressBar current={step} />
      {error && <div className="mt-4 p-3 rounded-lg bg-red-50 text-red-700">{error}</div>}
      <ResultDownload blob={result} onReset={() => { setFile(null); setResult(null); setStep('idle'); setError(null); }} />
      <button onClick={handleTranslate} disabled={!canTranslate}
        className="w-full py-3 px-4 rounded-xl font-medium bg-blue-600 text-white disabled:opacity-50">
        {step !== 'idle' && step !== 'done' ? 'Translating…' : 'Translate PDF'}
      </button>
    </main>
  );
}
```

**Explanation.** State holds the selected file, source and target language, current pipeline step, result blob, and error message. The translate button is enabled only when a file and both languages are set. On click, the step is updated optimistically (uploading, translating, building) while `translatePdf` runs; on success the step is set to `done` and the blob is stored for download. On failure the error is shown and the step is reset. The ProgressBar and ResultDownload components are omitted here for brevity; they render the step labels and a download button when a result is available.

---

## 6. API Utility (lib/api.ts)

The API module exposes a single function that sends the PDF and language options to the backend and returns the response as a Blob.

```ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function translatePdf(
  file: File,
  sourceLang: string,
  targetLang: string
): Promise<Blob> {
  const form = new FormData();
  form.append('file', file);
  form.append('sourceLang', sourceLang);
  form.append('targetLang', targetLang);

  const res = await fetch(`${API_BASE}/api/translate`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message || res.statusText);
  }
  return res.blob();
}
```

**Explanation.** The frontend must not set `Content-Type` so that the browser sets the multipart boundary. The backend URL is taken from `NEXT_PUBLIC_API_URL` for environment-specific deployment. If the response is not OK, the code attempts to read a JSON body and use its `message` field; otherwise it throws with the status text. On success the response body is returned as a Blob for the PDF download.

---

## 7. Database Schema (schema.sql)

The optional PostgreSQL schema supports user accounts and translation history. It is not required for the minimal MVP.

```sql
-- Users table for optional authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE,
  password_hash TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Translation requests (linked to user when auth is enabled)
CREATE TABLE IF NOT EXISTS translations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  original_filename TEXT,
  source_lang VARCHAR(10),
  target_lang VARCHAR(10),
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Explanation.** The `users` table stores email and a hashed password for future authentication. The `translations` table records each request with the original filename, source and target language codes, and an optional foreign key to `users`. Running this schema is optional; the application can operate without a database by processing each request in memory and returning the translated PDF directly.

---

*End of Chapter X – Source Code.*
