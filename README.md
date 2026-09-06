# ProofPath 🎯

> Don't just claim the skill. Prove you can do the job.

## What is ProofPath?

ProofPath is an AI-powered career readiness platform that helps engineering students prove their capabilities through real work simulations — not just resumes and certificates.

## The Problem

Students have resumes, certificates, and GitHub repos — but employers hire people to **perform tasks**, not claim skills. There's no way to verify if a candidate can actually do the job.

## The Solution

ProofPath creates a loop:

**Job Description → Required Capabilities → Proof Mission → AI Evaluation → Evidence Ledger**

## Features

- **Job Intelligence** — AI analyzes real job descriptions and extracts required capabilities
- **Resume Analysis** — Upload your resume to extract current capabilities
- **Capability Dashboard** — See your verified capability profile with readiness score
- **Proof Missions** — Complete real work simulations (Docker, CI/CD, Linux)
- **AI Evaluation** — Get scored on correctness, implementation, best practices, documentation

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python |
| Database | Supabase (PostgreSQL) |
| AI | Groq (OpenAI GPT-OSS 20B) |

## Getting Started

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create `backend/.env`:
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
AI_API_KEY=your_groq_api_key
FRONTEND_URL=http://localhost:3000


## Demo

1. Go to **Job Intelligence** → paste a Cloud Engineer job description
2. See AI extract 7-10 required capabilities
3. Go to **My Dashboard** → see your capability profile
4. Go to **Proof Missions** → pick Docker mission
5. Submit your solution → get AI evaluation with scores

## Built for AI Builders Hackathon 2026