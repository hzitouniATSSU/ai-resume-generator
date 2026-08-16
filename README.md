# AI Resume & Cover Letter Generator

A full-stack web app that tailors a candidate's resume and generates a personalized cover letter for a specific job posting — using an LLM grounded strictly in the candidate's real, uploaded resume content (no fabricated experience, skills, or credentials).

## Why this project

Most "AI resume tools" hallucinate — they invent job titles, metrics, and certifications that were never on the original resume. This project solves that with careful prompt design and structured output validation, so every generated document stays factually anchored to what the user actually submitted.

## Features

- **PDF resume upload** — extracts raw text server-side using `pypdf`
- **AI-tailored resume** — rewrites and reorders resume content to match a target job description, with explicit constraints preventing the model from inventing experience
- **AI-generated cover letter** — produces a structured, personalized cover letter (greeting, opening, body, closing) using OpenAI's structured output mode, guaranteeing valid, parseable JSON every time
- **Editable results** — both outputs are editable in-browser before copying or downloading
- **Copy & download** — one-click copy to clipboard or `.txt` export

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS
**Backend:** FastAPI (Python), Pydantic
**AI:** OpenAI API (`gpt-4o-mini`), structured outputs via `client.beta.chat.completions.parse()`
**PDF parsing:** pypdf

## Architecture

```
frontend/          React app (Vite + Tailwind)
  ├── App.jsx               → owns shared state (resume text, job info)
  ├── UploadPanel.jsx       → PDF upload → calls /upload
  ├── JobInfoPanel.jsx      → job description, company, role inputs
  ├── ResumeGeneratorPanel.jsx  → calls /tailor, displays result
  └── CoverLetterPanel.jsx  → calls /cover-letter, displays result

backend/            FastAPI app
  └── main.py
      ├── POST /upload         → extracts text from uploaded PDF
      ├── POST /tailor         → returns AI-tailored resume (Markdown)
      └── POST /cover-letter   → returns structured cover letter (JSON)
```

State is lifted only as far as it needs to go: the uploaded resume text and job info live in `App.jsx` since multiple components need them, while each generator panel manages its own result and loading state locally.

## Prompt design

The `/tailor` endpoint's prompt explicitly instructs the model to:
- Only reorder, re-emphasize, or rephrase content that already exists in the resume
- Never invent job titles, companies, dates, metrics, or skills
- Format for ATS compatibility

This was iterated on directly — an earlier version of the prompt fabricated an entire fake work history from a one-line test input. The current version is verified against real resume data with no fabrication.

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
npm run dev
```

The app runs at `localhost:5173`, backend at `localhost:8000`.

## Roadmap

- [ ] PDF export (currently downloads as `.txt`)
- [ ] Deployment (Vercel + Railway/Render)

## What I learned

This was my first project using FastAPI — I came in comfortable with React but had never touched Python web frameworks. Along the way I worked through async/await patterns, Pydantic validation, CORS configuration, OpenAI's structured output API, and the tradeoffs in designing prompts that resist hallucination rather than just requesting accuracy and hoping.
