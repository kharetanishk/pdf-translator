# Global PDF Services – AI Powered PDF Translation Platform

Full-stack MVP: upload PDF, select languages, translate via Google API, download translated PDF.

## Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (optional; schema in `database/schema.sql`)
- **Translation:** Google Translate API
- **Deploy:** Vercel (frontend) + Render (backend)

## Setup

1. **Backend:** `cd backend && npm install`  
   Copy `.env.example` to `.env`, set `GOOGLE_TRANSLATE_API_KEY`, `PORT`.
2. **Frontend:** `cd frontend && npm install`  
   Set `NEXT_PUBLIC_API_URL` to backend URL (e.g. `http://localhost:4000`).
3. **DB (optional):** Run `database/schema.sql` on PostgreSQL.

## Run

- Backend: `cd backend && node server.js` (default port 4000)
- Frontend: `cd frontend && npm run dev` (default port 3000)

## API

- `GET /health` – health check
- `POST /api/translate` – multipart: `file` (PDF), `sourceLang`, `targetLang`; returns PDF.
