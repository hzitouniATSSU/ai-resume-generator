# AI Resume & Cover Letter Generator

A full-stack web app that tailors a candidate's resume and generates a personalized cover letter for a specific job posting — using an LLM grounded strictly in the candidate's real, uploaded resume content (no fabricated experience, skills, or credentials).

Live demo: ai-resume-generator-bay-sigma.vercel.app API docs: ai-resume-generator-production-8dde.up.railway.app/docs

Note: the backend runs on Railway's free tier, which spins down after inactivity. The first request after idle time may take 10–30 seconds while the server wakes up — subsequent requests are fast.

## Why this project

Most "AI resume tools" hallucinate — they invent job titles, metrics, and certifications that were never on the original resume. This project solves that with careful prompt design and structured output validation, so every generated document stays factually anchored to what the user actually submitted.

## Features

PDF resume upload — extracts raw text server-side using pypdf
AI-tailored resume — rewrites and reorders resume content to match a target job description, with explicit constraints preventing the model from inventing experience
AI-generated cover letter — produces a structured, personalized cover letter (greeting, opening, body, closing) using OpenAI's structured output mode, guaranteeing valid, parseable JSON every time
Editable results — both outputs are editable in-browser before copying or downloading
PDF export — both the tailored resume and cover letter can be downloaded as real, formatted PDFs (server-side generation via reportlab, with Markdown-to-PDF formatting for bold text)
Copy & download — one-click copy to clipboard or PDF export


## Tech Stack

Frontend: React (Vite), Tailwind CSS — deployed on Vercel Backend: FastAPI (Python), Pydantic — deployed on Railway AI: OpenAI API (gpt-4o-mini), structured outputs via client.beta.chat.completions.parse() PDF parsing: pypdf PDF generation: reportlab

## Architecture

```
frontend/          React app (Vite + Tailwind)
  ├── App.jsx               → owns shared state (resume text, job info)
  ├── UploadPanel.jsx       → PDF upload → calls /upload
  ├── JobInfoPanel.jsx      → job description, company, role inputs
  ├── ResumeGeneratorPanel.jsx  → calls /tailor, displays result, exports PDF
  └── CoverLetterPanel.jsx  → calls /cover-letter, displays result, exports PDF

backend/            FastAPI app
  └── main.py
      ├── POST /upload         → extracts text from uploaded PDF
      ├── POST /tailor         → returns AI-tailored resume (Markdown)
      ├── POST /cover-letter   → returns structured cover letter (JSON)
      └── POST /export-pdf     → converts Markdown content into a formatted PDF
```

State is lifted only as far as it needs to go: the uploaded resume text and job info live in App.jsx since multiple components need them, while each generator panel manages its own result, loading, and error state locally.

API base URL is configured via the VITE_API_URL environment variable, so the same frontend code runs against localhost:8000 in development and the deployed Railway URL in production.

## Prompt design

The `/tailor` endpoint's prompt explicitly instructs the model to:

Only reorder, re-emphasize, or rephrase content that already exists in the resume
Never invent job titles, companies, dates, metrics, or skills
Output only the resume content itself, with no conversational preamble
Format for ATS compatibility
This was iterated on directly — an earlier version of the prompt fabricated an entire fake work history from a one-line test input, and even after tightening the constraints, a later test surfaced a fabricated phone number and a split, invented job entry. Each failure was caught by comparing generated output against the real source resume line-by-line, and the prompt was tightened in response. The current version is verified against real resume data with no fabrication.

## Running locally

**Backend**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
# add your OpenAI key to a .env file: OPENAI_API_KEY=sk-...
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
# .env sets VITE_API_URL=http://localhost:8000 for local dev
npm run dev
```

The app runs at localhost:5173, backend at localhost:8000.

## What I learned

This was my first project using FastAPI — I came in comfortable with React but had never touched Python web frameworks. Along the way I worked through async/await patterns, Pydantic validation, CORS configuration, OpenAI's structured output API, server-side PDF generation, and the tradeoffs in designing prompts that resist hallucination rather than just requesting accuracy and hoping. Deploying the two services separately (Vercel + Railway) also meant learning how environment-specific configuration (API URLs, CORS allowlists) has to change between local development and production.

