# InterviewBuddy

**AI-Powered Interview & Placement Preparation Platform**

InterviewBuddy is a full-stack platform combining Campus Recruitment Training (CRT — Aptitude, Reasoning, Verbal), coding practice, programming contests, AI-powered mock interviews, and structured learning resources, with separate user and admin experiences.

---

## Features

- **Authentication** — JWT-based, with separate USER and ADMIN roles enforced at the backend (not just hidden UI).
- **CRT Preparation** — Aptitude, Reasoning, and Verbal categories, each with Learn (concepts/formulas/examples), Practice (instant feedback), and Tests (timed, scored, topic-wise review).
- **Coding Practice** — Problem list with search/filter, in-browser editor, submission history, solved-problem tracking.
- **Contests** — Timed programming contests with registration, live leaderboard, and past-contest results.
- **AI Mock Interviews** — Technical / HR / Mixed interviews with per-answer AI evaluation (relevance, technical correctness, communication, clarity) and a session summary. Falls back gracefully to a clearly-labelled heuristic evaluator if no Gemini API key is configured — it never pretends to be real AI.
- **Learning Resources** — Articles, notes, courses, and external links across Java, Spring Boot, DSA, SQL, DBMS, OS, Networks, OOP, System Design, and Interview Prep, with completion tracking.
- **Dashboards** — Personalized user progress dashboard; platform-wide admin statistics dashboard.
- **Admin Content Management** — Full CRUD for CRT content, coding problems, contests, interview question bank, and learning resources.

## Technology Stack

**Backend:** Java 21, Spring Boot 3, Spring Web, Spring Security, JWT (jjwt), Spring Data JPA / Hibernate, PostgreSQL (Supabase-hosted), Bean Validation, Lombok, Maven

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios

**AI:** Google Gemini API (optional, via a clean `AIInterviewService` abstraction — see below)

**Testing:** JUnit 5, Mockito, Spring Boot Test, H2 (in-memory, test-only)

## Architecture

Clean layered Spring Boot architecture: `controller → service → repository → entity`, with DTOs at the API boundary, centralized exception handling, and pluggable strategy interfaces for the two features that need a real external service (code execution, AI evaluation). Full details in [`docs/architecture.md`](docs/architecture.md).

## Quick Start

### Production (Docker — recommended)

The database is a hosted **Supabase** (PostgreSQL) project — it is not part of
the Docker stack. `docker compose` runs backend + frontend (nginx), with health
checks and a production profile (`DDL_AUTO=validate`, demo seeds off):

```bash
cp .env.example .env        # fill in Supabase DB_HOST/DB_PASSWORD + JWT_SECRET
docker compose up -d --build
# → http://localhost:8081
```

> **Email verification (optional):** Set `MAIL_ENABLED=true` and `BREVO_API_KEY`
> to a key from your [Brevo](https://www.brevo.com) account (a verified sender
> must be set via `MAIL_FROM`) to send real verification emails on signup.
> Without these the app runs fully with email verification disabled.

Full details, config reference, and security checklist: [`docs/deployment.md`](docs/deployment.md).

### Amazon Web Services (free tier)

Run the same stack on a single free-tier EC2 instance (AWS Console walkthrough
or Terraform): [`deploy/aws/README.md`](deploy/aws/README.md).

### Local development

```bash
# 1. Load schema + seed data into your Supabase project
#    (Supabase Dashboard > SQL Editor, or psql — see docs/setup.md):
#    run database/schema.sql, then database/seed.sql, then database/neetcode_seed.sql
#    and set DB_HOST/DB_PORT/DB_NAME/DB_USERNAME/DB_PASSWORD/DB_SSLMODE in .env

# 2. Start the backend
cd backend
mvn spring-boot:run
# → http://localhost:8080

# 3. Start the frontend (in a new terminal)
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

Full setup instructions, environment variables, and Gemini API setup: [`docs/setup.md`](docs/setup.md).

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@interviewbuddy.com` | `Passw0rd!` |
| User | `user@interviewbuddy.com` | `Passw0rd!` |

Demo accounts are created automatically on first backend startup (see `DataInitializer.java`) — **change or disable them (`SEED_DEMO_USERS=false`) before any real deployment.**

## Database Setup

The database is a **Supabase** (hosted PostgreSQL) project. `database/schema.sql`
(25 tables, foreign keys, indexes, constraints), `database/seed.sql` (CRT
topics/questions, coding problems + test cases, an interview question bank,
learning resources) and `database/neetcode_seed.sql` (full Neetcode 150 + Blind
75 catalog) are PostgreSQL scripts — load them in that order, e.g. from the
Supabase SQL Editor or `psql` (see [`docs/setup.md`](docs/setup.md)).

## API Overview

Full endpoint list in [`docs/api.md`](docs/api.md). Summary: `/api/auth/**`, `/api/user/**`, `/api/crt/**`, `/api/coding/**`, `/api/contests/**`, `/api/interviews/**`, `/api/learning/**`, `/api/dashboard`, and `/api/admin/**` (all admin routes require `ROLE_ADMIN`).

## How to Build

```bash
# Backend
cd backend && mvn clean package
# produces target/interviewbuddy-backend-1.0.0.jar

# Frontend
cd frontend && npm install && npm run build
# produces frontend/dist/
```

Or build the production Docker images:

```bash
docker compose build
```

## How to Test

```bash
cd backend && mvn test
```
Runs against an in-memory H2 database — no database instance required. Covers auth (register/login/duplicate handling), JWT-based role enforcement (a USER token gets 403 on admin endpoints), CRT practice scoring logic, and the dev-mode code execution heuristic. **Use JDK 21** (matching the production runtime) — newer JDKs can break Mockito's inline mocking.

## Known Limitations

These are intentional, disclosed trade-offs rather than oversights:

1. **Code execution is not a real sandbox by default.** Running arbitrary, untrusted, user-submitted code safely requires proper sandboxing (containers/VMs with strict CPU/memory/network isolation) — building that from scratch was out of scope. By default, submissions are evaluated by `DevModeCodeExecutionService`, a transparent, clearly-labelled heuristic (not real compilation/execution) so the rest of the platform (submission history, solved tracking, contest scoring) is fully usable in local/demo environments. Set `CODE_EXECUTION_SERVICE_URL` to a Judge0-compatible API for real, sandboxed execution via `RemoteJudgeCodeExecutionService` — this integration is implemented but has not been exercised against a live Judge0 instance in this development environment (no outbound network access here).
2. **AI interview evaluation requires `GEMINI_API_KEY`.** Without it, `HeuristicAIInterviewService` provides a functional but explicitly non-AI fallback (question selection from the curated bank still works normally; answer scoring uses simple heuristics and says so in the feedback text).
3. **The admin interview-question-bank endpoints (`/api/admin/interviews/questions/**`) return the JPA entity directly** rather than a dedicated response DTO — a deliberate shortcut for this one simple, low-risk internal CRUD surface (no lazy-loaded relations to leak), rather than adding a DTO with zero behavioral difference.
4. **Always build with JDK 21.** The code targets Java 21; building/testing with a newer JDK can fail in Mockito tests (inline mocking of final classes) even though the code itself compiles. The Docker image and CI both use JDK 21.

## Future Improvements

- Real-time contest leaderboard updates (WebSocket) instead of poll-on-view
- Rich text / Markdown rendering for learning resource content
- Syntax highlighting and multi-file support in the coding editor
- Email verification and password reset flow
- Audit logging for admin actions

## Project Structure

```
interviewbuddy/
├── backend/            Spring Boot API (Java 21, Maven) + Dockerfile
├── frontend/           React + TypeScript + Vite + Tailwind SPA + Dockerfile + nginx.conf
├── database/           schema.sql, seed.sql, neetcode_seed.sql (PostgreSQL/Supabase)
├── docs/                architecture.md, api.md, setup.md, deployment.md
├── .github/workflows/   CI: build + test + publish Docker images
├── .env.example
├── docker-compose.yml   Backend + frontend (nginx) against Supabase PostgreSQL
└── README.md
```
