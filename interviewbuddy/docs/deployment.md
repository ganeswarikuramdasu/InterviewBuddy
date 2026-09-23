# InterviewBuddy — Deployment Guide

InterviewBuddy ships as a fully containerized, single-command deployment:
**MySQL + Spring Boot backend + nginx (React SPA & reverse proxy)**.

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
                                       │
                        ┌──────────────▼──────────────┐
                        │  MySQL 8 (schema.sql+seed)  │
                        └─────────────────────────────┘
```

The SPA and API share the nginx origin, so there are **no CORS issues** in the
default stack (the backend still supports `CORS_ALLOWED_ORIGINS` for direct calls).

## Prerequisites

- Docker + Docker Compose (v2)

## Deploy

```bash
cp .env.example .env       # <-- edit secrets (DB_PASSWORD, JWT_SECRET, etc.)
docker compose up -d --build
```

Then open `http://localhost:8081`.

- **Migration without downtime**: `docker compose build && docker compose up -d`
- **Logs**: `docker compose logs -f backend frontend`
- **Stop**: `docker compose down` (add `-v` to also delete the database volume)
- **Update**: `git pull && docker compose up -d --build`

## Configuration (`.env`)

Set these before your first deploy:

| Variable | Required | Purpose |
|---|---|---|
| `DB_PASSWORD` | **Yes** | MySQL root password. **Change from `root`.** |
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

## Database

- `database/schema.sql` and `database/seed.sql` are mounted into the MySQL
  container and run **only on first volume creation**.
- In production the backend runs with `DDL_AUTO=validate` (Spring Profile
  `prod`): Hibernate **validates** the entity/table mapping but never alters the
  schema. To manage schema changes, apply SQL migrations against the volume
  (back up `interviewbuddy-mysql-data` first).
- To reset the database: `docker compose down -v` then `docker compose up -d`.

## Health & Monitoring

- Backend exposes Spring Actuator at `/actuator/health` (Docker healthcheck +
  uptime probes). Container startup is gated on `mysql` and `backend` being
  healthy via `depends_on.condition: service_healthy`.

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
- [x] MySQL port bound to `127.0.0.1` only (not exposed publicly).
- [x] `SEED_DEMO_USERS=false` in production (via `.env`).
- [x] `DDL_AUTO=validate` in production profile.
- [ ] Change `DB_PASSWORD` and `JWT_SECRET` in your real `.env`.
- [ ] Do not run the heuristic (non-sandboxed) code path in public:
      set `CODE_EXECUTION_SERVICE_URL` to a real Judge0 instance.
