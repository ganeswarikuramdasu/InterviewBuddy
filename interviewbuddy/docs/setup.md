# InterviewBuddy — Setup Guide

## Prerequisites

- **Java 21+** (JDK)
- **Maven 3.9+** (or use your IDE's bundled Maven)
- **Node.js 18+** and npm
- **MySQL 8.0+** (running locally, or via the provided `docker-compose.yml`)

## 1. Database Setup

### Option A — Docker (recommended for quick start)
```bash
# Full production stack (MySQL + backend + frontend) — see docs/deployment.md
docker compose up -d --build

# Or just the database for local development
docker compose up -d mysql
```
The `mysql` service starts MySQL 8 on `localhost:3306`, creates the `interviewbuddy` database, and automatically runs `database/schema.sql` and `database/seed.sql` on first boot.

### Option B — Local MySQL install
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

> Demo **user accounts** (admin@interviewbuddy.com, user@interviewbuddy.com, etc.) are **not** inserted by `seed.sql`. They are created automatically the first time the backend starts (see `DataInitializer.java`), so their passwords are hashed correctly by the live BCrypt bean rather than a hand-computed hash in SQL.

## 2. Backend Setup

```bash
cd backend
cp ../.env.example .env   # or just export the variables in your shell
```

Set at minimum:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=interviewbuddy
DB_USERNAME=root
DB_PASSWORD=root
JWT_SECRET=<any long random string>
```

Run it:
```bash
mvn spring-boot:run
```
Or build a jar:
```bash
mvn clean package
java -jar target/interviewbuddy-backend-1.0.0.jar
```

The API starts on `http://localhost:8080`. On first run, `DataInitializer` creates the demo accounts and logs a confirmation line.

### Environment variables reference

| Variable | Required | Default | Purpose |
|---|---|---|---|
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD` | Yes | localhost/3306/interviewbuddy/root/root | MySQL connection |
| `JWT_SECRET` | Yes (prod) | dev placeholder | Signs JWT access tokens — use 32+ random chars in production |
| `JWT_EXPIRATION_MS` | No | 86400000 (24h) | Token lifetime |
| `CORS_ALLOWED_ORIGINS` | No | http://localhost:5173 | Comma-separated allowed frontend origins |
| `GEMINI_API_KEY` | No | (blank) | Enables real AI-powered interview evaluation. See below. |
| `GEMINI_MODEL` | No | gemini-1.5-flash | Gemini model name |
| `CODE_EXECUTION_SERVICE_URL` | No | (blank) | Judge0-compatible API base URL for real code execution. See "Known Limitations". |
| `SEED_DEMO_USERS` | No | true | Set false to skip demo account creation |
| `DEMO_PASSWORD` | No | Passw0rd! | Password used for auto-created demo accounts |

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
Opens on `http://localhost:5173` and proxies `/api/*` requests to `http://localhost:8080` (see `vite.config.ts`).

Build for production:
```bash
npm run build
```

## 4. Gemini API Setup (optional — AI Interview module)

1. Get an API key from Google AI Studio (https://aistudio.google.com/).
2. Set `GEMINI_API_KEY` in your backend environment.
3. Restart the backend. Logs will confirm `GeminiAIInterviewService` is active instead of the heuristic fallback.

Without a key, the AI Interview module still works end-to-end (question selection from the curated bank, session flow, history) but answer scoring uses a transparent, clearly-labelled heuristic instead of real AI evaluation — the UI and API responses say so explicitly.

## 5. Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@interviewbuddy.com` | `Passw0rd!` |
| User | `user@interviewbuddy.com` | `Passw0rd!` |
| User | `rahul.verma@interviewbuddy.com` | `Passw0rd!` |
| User | `sneha.patil@interviewbuddy.com` | `Passw0rd!` |

**Change these before any real deployment.** Set `SEED_DEMO_USERS=false` to disable auto-creation entirely.

## 6. Running Tests

```bash
cd backend
mvn test
```
Uses an in-memory H2 database (see `src/test/resources/application.yml`) so no MySQL instance is needed for tests.

## 7. Postman / API Testing

Import the endpoint list from `docs/api.md`. All endpoints are under `/api`. Auth endpoints (`/api/auth/register`, `/api/auth/login`) return a JWT in the response body — set it as a Bearer token on subsequent requests.
