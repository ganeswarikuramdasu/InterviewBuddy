# InterviewBuddy — Deployment Guide

InterviewBuddy ships as a fully containerized, single-command deployment:
**Spring Boot backend + nginx (React SPA & reverse proxy)**. The database is a
**hosted Supabase** (PostgreSQL) project and is not part of the Docker stack.

## Architecture

```
                        ┌─────────────────────────────┐
   internet ──► :8081   │  nginx (frontend container) │
                        │   • serves built React SPA  │
                        │   • /api  ──► backend:8080  │
                        └──────────────┬──────────────┘
                                       │
                        ┌──────────────▼──────────────┐
                        │  Spring Boot (backend)      │
                        │  • JWT auth / REST API      │
                        │  /actuator/health (probe)   │
                        └──────────────┬──────────────┘
                                       │  TLS
                        ┌──────────────▼──────────────┐
                        │  Supabase (hosted PostgreSQL)│
                        └─────────────────────────────┘
```

The SPA and API share the nginx origin, so there are **no CORS issues** in the
default stack (the backend still supports `CORS_ALLOWED_ORIGINS` for direct calls).

## Prerequisites

- Docker + Docker Compose (v2)

## Deploy

```bash
cp .env.example .env       # <-- fill in Supabase DB_HOST/DB_PASSWORD + JWT_SECRET
docker compose up -d --build
```

Then open `http://localhost:8081`.

- **Migration without downtime**: `docker compose build && docker compose up -d`
- **Logs**: `docker compose logs -f backend frontend`
- **Stop**: `docker compose down`
- **Update**: `git pull && docker compose up -d --build`

## Configuration (`.env`)

Set these before your first deploy:

| Variable | Required | Purpose |
|---|---|---|
| `DB_HOST` | **Yes** | Supabase DB hostname only (e.g. `db.<PROJECT-REF>.supabase.co`), from Project Settings > Database. |
| `DB_PORT` | No | `5432` |
| `DB_NAME` | No | `postgres` |
| `DB_USERNAME` | No | `postgres` |
| `DB_PASSWORD` | **Yes** | Your Supabase database password. |
| `DB_SSLMODE` | No | `require` (Supabase requires TLS). |
| `JWT_SECRET` | **Yes** | 32+ random chars (e.g. `openssl rand -base64 48`). |
| `GEMINI_API_KEY` | No | Enables real AI interview evaluation (see README). |
| `CODE_EXECUTION_SERVICE_URL` | No | Judge0-compatible URL for real code execution. |
| `SEED_DEMO_USERS` | No | `false` (default here) disables demo accounts in prod. |
| `CORS_ALLOWED_ORIGINS` | No | Comma-separated extra origins (default `http://localhost:8081`). |
| `FRONTEND_PORT` | No | Host port for nginx (default `8081`). |
| `MAIL_ENABLED` | No | `true` to actually send verification emails via SMTP (default `false`). |
| `MAIL_HOST` | No | SMTP host (default `smtp.gmail.com`). |
| `MAIL_PORT` | No | SMTP port (default `587`). |
| `MAIL_USERNAME` | No | Gmail address to send from. |
| `MAIL_PASSWORD` | No | Gmail **App Password** (Google Account → Security → 2-Step Verification → App passwords). Never reuse your real account password. |
| `MAIL_FROM` | No | `From` address for emails (defaults to `MAIL_USERNAME`). |
| `APP_FRONTEND_URL` | No | Public SPA URL used to build verification links (default `http://localhost:8081`). |

## Database (Supabase)

- The schema is **not** auto-loaded by this stack. Apply the PostgreSQL scripts
  **in order** to your Supabase project via the Supabase Dashboard (SQL Editor)
  or `psql`: `database/schema.sql`, then `database/seed.sql`, then
  `database/neetcode_seed.sql` (see `docs/setup.md`).
- In production the backend runs with `DDL_AUTO=validate` (Spring Profile
  `prod`): Hibernate **validates** the entity/table mapping but never alters the
  schema. Schema changes are managed via SQL migrations applied through the
  Supabase dashboard or `psql`.
- To reset the database: point Supabase at a fresh project and re-run the three
  scripts (the sheet-membership inserts in `neetcode_seed.sql` are idempotent
  via `ON CONFLICT DO NOTHING`).

## Health & Monitoring

- Backend exposes Spring Actuator at `/actuator/health` (Docker healthcheck +
  uptime probes). The frontend container waits for the backend to be healthy via
  `depends_on.condition: service_healthy`. The backend's DB health (`Actuator`
  `db` probe) verifies the Supabase connection.

## Reverse proxy & HTTPS

The nginx container serves plain HTTP on its port (mapped to `FRONTEND_PORT`).
Terminate TLS at a reverse proxy / load balancer in front (Caddy, Traefik,
nginx, or a cloud LB) and forward to `FRONTEND_PORT`. Security headers
(`X-Content-Type-Options`, `X-Frame-Options`, etc.) are already set by nginx.

## Building & testing locally (without Docker)

See `docs/setup.md`. CI (`.github/workflows/ci.yml`) runs backend tests
(Java 21) and frontend lint+build, and publishes images to GitHub Container
Registry on `main`/tags.

## Security checklist

- [x] Backend runs as non-root user (`app`) inside the container.
- [x] Frontend runs as non-root (official `nginx` image).
- [x] Database is hosted in Supabase (managed, TLS-required) — no public DB port.
- [x] `SEED_DEMO_USERS=false` in production (via `.env`).
- [x] `DDL_AUTO=validate` in production profile.
- [ ] Set `DB_PASSWORD` (Supabase) and `JWT_SECRET` in your real `.env`.
- [ ] Do not run the heuristic (non-sandboxed) code path in public:
      set `CODE_EXECUTION_SERVICE_URL` to a real Judge0 instance.
