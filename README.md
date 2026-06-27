# Advanced Adaptive Reading Research Platform (AARRP) — v2.0.0-rc1

A state-of-the-art educational psychology and clinical readability research platform combining real-time cognitive scaffolding (Groq Llama-3 AI engine) with rigorous empirical telemetry tracking (RQ1/RQ2 data collection pipelines).

## Status: Release Candidate 1 (RC1) ✅
The platform has completed thorough integration verification and production hardening across 16 implementation batches. All compilation builds pass cleanly with zero TypeScript or syntax errors.

- **Frontend Progress & Architecture**: See [`FRONTEND_PROGRESS.md`](file:///c:/Users/a_pra/projects/AARRP/FRONTEND_PROGRESS.md)
- **Integration Audit**: See [`INTEGRATION_AUDIT.md`](file:///c:/Users/a_pra/projects/AARRP/INTEGRATION_AUDIT.md)
- **RC1 Production Audit**: See [`RC1_AUDIT.md`](file:///c:/Users/a_pra/projects/AARRP/RC1_AUDIT.md)

---

## System Architecture

### 1. Frontend Engine (`/frontend`)
Built with **Next.js 14 (App Router)**, **TypeScript**, **Vanilla CSS**, and **TanStack React Query**.
- **Admin & Researcher Portal**: Features an experiment wizard, slide break editor, quiz builder, AI prompt library, release readiness dashboard, real-time health observability, and RBAC user management.
- **Participant Runtime**: Offers smooth distraction-free slide progression, real-time cognitive hints via Server-Sent Events (SSE), autosave recovery pulses, and deterministic assessment runtimes.

### 2. Backend Engine (`/backend`)
Built with **Python FastAPI**, **Pydantic v2**, **Alembic**, and **Supabase PostgreSQL**.
- Exposes REST endpoints for experiment CRUD, dynamic reading cohorts, telemetry ingestion buffers, and ZIP dataset synthesis archives for downstream Python data analysis (`pandas`/`scipy`).

---

## Quick Start & Deployment Setup

### Prerequisites
- Node.js 18+ (`npm` v9+)
- Python 3.10+
- Supabase PostgreSQL / Local PostgreSQL Instance
- Groq AI API Key (`GROQ_API_KEY`)

### Backend Setup (FastAPI)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env # Configure Supabase URL, JWT secrets, and Groq API Key
uvicorn app.main:app --port 8000 --reload
```
API Documentation & Swagger UI available at `http://localhost:8000/docs`.

### Frontend Setup (Next.js 14)
```powershell
cd frontend
npm install
cp .env.example .env.local # Set NEXT_PUBLIC_API_URL=http://localhost:8000
npm run build # Verifies static & dynamic bundle generation
npm run dev
```
Researcher control panel available at `http://localhost:3000/admin`.
Participant runtime accessible at `http://localhost:3000/participant/[code]`.