# Global PDF Translation System

A full-stack AI-powered PDF Translation application that allows users to upload a PDF, translate it into multiple languages, and download a newly generated translated PDF.

The system uses a processing pipeline architecture:

Upload PDF → Extract Text → Translate → Generate PDF → Download


---

## ✨ Features

### Core Features

- Upload PDF files
- Automatic text extraction
- AI-based translation using Google Translate API
- Multi-language support
- PDF regeneration with proper formatting
- Automatic file download

### User Experience

- Drag & drop upload
- Language selection
- Pipeline-style progress loader
- Error handling and validation

### Engineering Highlights

- Service-based backend architecture
- Modular processing pipeline
- Unicode-safe multilingual rendering
- Dynamic font mapping
- Automatic line wrapping and page breaks

---

## 🌍 Supported Languages

- Arabic
- Bengali
- English
- French
- German
- Hindi
- Indonesian
- Japanese
- Korean
- Mandarin Chinese
- Marathi
- Portuguese
- Russian
- Spanish
- Swahili
- Tamil
- Telugu
- Turkish

---

## 🧱 Tech Stack

### Frontend
- Next.js 16
- React 19
- Tailwind CSS
- TypeScript

### Backend
- Express 5
- TypeScript
- Multer (file upload)
- Google Translate API
- PDFKit (PDF generation)
- unpdf (PDF text extraction)

### Monorepo
- Turborepo
- pnpm

---

## 📁 Project Structure

apps/
backend/
src/
controllers/
services/
routes/
middleware/
fonts/
frontend/
app/
components/

content/
docs/
packages/


---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone <your-repository-url>
cd <project-folder>
2. Install Dependencies
Install all monorepo dependencies:

pnpm install
3. Environment Variables (IMPORTANT)
Create a .env file inside:

apps/backend/.env
Add the following:

PORT=4000
GOOGLE_TRANSLATE_API_KEY=YOUR_GOOGLE_TRANSLATE_API_KEY
🔑 Getting Google Translate API Key
Go to Google Cloud Console:
https://console.cloud.google.com/

Create a new project (or select existing).

Enable Cloud Translation API.

Go to:

APIs & Services → Credentials
Create an API Key.

Copy the key and paste it into:

apps/backend/.env
🔤 Font Setup (Required for Multi-language PDFs)
To properly render languages like Hindi, Arabic, Japanese, etc., add Noto fonts inside:

apps/backend/fonts/
Required files:

NotoSans-Regular.ttf
NotoSansDevanagari-Regular.ttf
NotoSansBengali-Regular.ttf
NotoSansArabic-Regular.ttf
NotoSansJP-Regular.otf
NotoSansKR-Regular.otf
NotoSansSC-Regular.otf
NotoSansTamil-Regular.ttf
NotoSansTelugu-Regular.ttf
You can download these from:

https://fonts.google.com/noto

Important:

Use static font files

Avoid variable fonts

Filenames must match exactly

▶️ Running the Project
Run Backend
cd apps/backend
pnpm dev
Backend runs on:

http://localhost:4000
Run Frontend
Open new terminal:

cd apps/frontend
pnpm dev
Frontend runs on:

http://localhost:3000
🧪 Application Flow
Upload a PDF.

Select source and target language.

Click Translate PDF.

Progress pipeline runs:

Extracting Text

Translating Text

Generating PDF

Translated PDF downloads automatically.

🧠 Architecture Overview
Frontend (Next.js)
        ↓
Express API
        ↓
Extraction Service
        ↓
Translation Service
        ↓
PDF Builder Service
Service Responsibilities
Extraction Service

Extract text from uploaded PDF.

Translation Service

Translate text using Google Translate API.

Uses chunking for large documents.

PDF Builder Service

Generate clean translated PDF.

Applies automatic wrapping and page breaks.

⚠️ Common Setup Issues
1. Text appears as symbols
Ensure required Noto fonts exist inside:

apps/backend/fonts/
2. Translation fails
Check:

GOOGLE_TRANSLATE_API_KEY
is set correctly.

3. Download not working
Ensure backend is running on correct port.

📌 Future Improvements
Layout-preserving translation (advanced)

OCR support for scanned PDFs

Batch document translation

Real-time backend progress tracking

User history and storage

👨‍💻 Author
Final Year Project — Global PDF Translation System
--Tanishk khare
