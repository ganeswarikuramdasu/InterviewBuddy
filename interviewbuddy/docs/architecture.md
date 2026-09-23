# InterviewBuddy — Architecture

## Overview

InterviewBuddy is a monorepo with a Spring Boot REST API backend and a React SPA frontend, backed by MySQL.

```
Browser (React SPA)
      │  HTTPS / JSON
      ▼
Spring Boot REST API  ──────►  MySQL
      │
      ├── Spring Security + JWT (stateless auth, role-based authorization)
      ├── CodeExecutionService abstraction ──► Judge0-compatible remote judge (optional)
      │                                    └─► DevModeCodeExecutionService (fallback)
      └── AIInterviewService abstraction   ──► Google Gemini API (optional)
                                           └─► HeuristicAIInterviewService (fallback)
```

## Backend layering

```
controller/       REST endpoints only — no business logic. Validates input, delegates to services.
controller/admin/  Admin-only endpoints (secured by ROLE_ADMIN at the SecurityFilterChain level)
service/           Interfaces describing business operations
service/impl/      Business logic, transactions, orchestration
repository/        Spring Data JPA interfaces — one per entity, plus a handful of custom @Query methods
entity/            JPA entities mapped to MySQL tables
dto/request/       Input DTOs with Bean Validation annotations
dto/response/      Output DTOs — entities are never returned directly from public endpoints (one
                    intentional exception: the admin interview-question-bank endpoints return the
                    entity directly since it's a simple, low-risk internal CRUD surface — see
                    README "Known Limitations")
security/          JWT generation/validation, UserDetailsService, JWT filter
config/            Spring Security config, CORS, bean wiring for AI/code-execution strategy selection
exception/         Custom exceptions + a single @RestControllerAdvice mapping them to consistent JSON errors
```

Request flow for a typical authenticated write, e.g. `POST /api/coding/problems/{id}/submit`:

1. `JwtAuthenticationFilter` reads the `Authorization: Bearer <token>` header, validates the JWT, and populates the Spring Security context with a `UserPrincipal`.
2. `CodingController` receives the request, pulls the current user id from `@AuthenticationPrincipal`, validates the request body (`@Valid SubmissionRequest`), and calls `CodingService.submit(...)`.
3. `CodingServiceImpl` loads the problem and its test cases, delegates execution to whichever `CodeExecutionService` bean is active, persists a `Submission`, updates `UserSolvedProblem` if accepted, and returns a `SubmissionResponse` DTO.
4. Any exception thrown anywhere in this chain (not found, validation, bad request, etc.) is caught by `GlobalExceptionHandler` and turned into a consistent `ApiError` JSON body with the right HTTP status.

## Why two "pluggable strategy" abstractions?

Both the **coding judge** and the **AI interview evaluator** need a real external service to be fully functional (a sandboxed code execution service; the Gemini API). Neither is safe or possible to fully replicate inside this project:

- Running arbitrary user-submitted code safely requires proper sandboxing (containers/VMs with strict resource limits) — building that from scratch is out of scope and would be a serious security liability if done carelessly.
- Real AI evaluation requires an actual LLM call.

Rather than either (a) pretending these work with hard-coded fake results, or (b) leaving them as unimplemented stubs, both are built as clean interfaces (`CodeExecutionService`, `AIInterviewService`) with:
- A **real implementation** that calls out to an external, properly-scoped service when configured (`RemoteJudgeCodeExecutionService` → Judge0-compatible API; `GeminiAIInterviewService` → Google Gemini).
- A **transparent fallback implementation** that keeps the rest of the platform (submission history, contest scoring, interview session flow, dashboards) fully exercisable in local/demo environments, while clearly labelling itself as non-authoritative in both logs and API responses (`DevModeCodeExecutionService`, `HeuristicAIInterviewService`).

`AppExecutionConfig` and `AppAiConfig` select the right bean at startup based on whether `CODE_EXECUTION_SERVICE_URL` / `GEMINI_API_KEY` are configured, using explicit `Condition` classes (not `@ConditionalOnProperty`) because `application.yml` always defines those keys with a blank default, which `@ConditionalOnProperty` would otherwise treat as "present".

## Frontend structure

```
src/
  api/          One module per backend resource (auth, crt, coding, contests, interviews, learning, dashboard, admin).
                Wraps a shared axios instance (api/client.ts) that attaches the JWT and normalizes error messages.
  context/      AuthContext (session state, login/register/logout) and ToastContext (global notifications)
  layouts/      PublicLayout (marketing site), AppLayout (authenticated user shell with sidebar),
                AdminLayout (admin shell with dark sidebar)
  components/   Shared, reusable UI primitives (Spinner, LoadingState, EmptyState, ErrorState, Badge,
                Modal, ConfirmDialog, Pagination, ProtectedRoute)
  pages/        One file per route, matching App.tsx's route tree 1:1
  pages/admin/  Admin-only pages (only reachable via ProtectedRoute adminOnly)
  types/        Shared TypeScript interfaces mirroring backend DTOs
```

`ProtectedRoute` enforces auth on the frontend (redirects to login, and separates the user vs. admin app shells), but this is a UX convenience only — the backend independently enforces `ROLE_ADMIN` on every `/api/admin/**` endpoint regardless of what the frontend does, so a USER token can never successfully call an admin endpoint even by hitting the URL directly (see `AuthAndSecurityIntegrationTest`).

## Database

See `database/schema.sql` for the full DDL (25 tables) and `database/seed.sql` for sample CRT/coding/contest/interview/learning content. Foreign keys, unique constraints, and indexes are used throughout; most join/association tables (e.g. `crt_test_questions`, `contest_problems`) use plain `BIGINT` foreign key columns rather than full JPA `@ManyToOne` object graphs, which keeps the entity layer simple and avoids N+1/lazy-loading pitfalls — related data is joined explicitly in service code where needed.
