# InterviewBuddy — API Reference

Base URL: `http://localhost:8080/api`

All authenticated endpoints require `Authorization: Bearer <token>` (obtained from `/auth/login` or `/auth/register`). Admin endpoints (`/admin/**`) additionally require the token to belong to a user with `role = ADMIN` — enforced server-side regardless of frontend routing.

Responses follow standard HTTP status codes. Errors return:
```json
{
  "timestamp": "2026-08-27T10:15:00",
  "status": 404,
  "error": "Not Found",
  "message": "Problem not found with id: 42",
  "path": "/api/coding/problems/42",
  "details": null
}
```

## Auth (`/api/auth`) — public

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/auth/register` | `{fullName, email, password, phone?, college?, branch?, graduationYear?}` | Create a USER account, returns `{token, user}` |
| POST | `/auth/login` | `{email, password}` | Returns `{token, user}` for any role |

## User (`/api/user`) — authenticated

| Method | Path | Description |
|---|---|---|
| GET | `/user/profile` | Current user's profile |
| PUT | `/user/profile` | Update name/phone/college/branch/graduationYear |
| PUT | `/user/password` | `{currentPassword, newPassword}` |

## CRT (`/api/crt`) — read endpoints public, submit/attempt endpoints authenticated

| Method | Path | Description |
|---|---|---|
| GET | `/crt/categories` | List Aptitude/Reasoning/Verbal categories |
| GET | `/crt/categories/{id}/topics` | Topics in a category |
| GET | `/crt/topics/{id}` | Topic detail (Learn content) |
| GET | `/crt/topics/{id}/practice` | Practice questions (answers withheld) |
| POST | `/crt/practice/submit` | `{questionId, selectedOption}` → correctness + explanation |
| GET | `/crt/tests?categoryId=` | List published tests |
| GET | `/crt/tests/{id}` | Test detail |
| POST | `/crt/tests/{id}/start` | Start an attempt → questions (answers withheld) |
| POST | `/crt/attempts/{attemptId}/submit` | `{answers:[{questionId, selectedOption}], timeTakenSeconds}` → full result |
| GET | `/crt/attempts` | Current user's past attempts |

## Coding (`/api/coding`) — listing/detail public, submit/history authenticated

| Method | Path | Description |
|---|---|---|
| GET | `/coding/problems?search=&difficulty=&topic=&page=&size=` | Paginated problem list |
| GET | `/coding/problems/{slug}` | Problem detail with examples |
| POST | `/coding/problems/{id}/submit` | `{language, sourceCode}` → submission result |
| GET | `/coding/submissions?page=&size=` | Current user's submission history |

## Contests (`/api/contests`) — listing public, register/submit authenticated

| Method | Path | Description |
|---|---|---|
| GET | `/contests?page=&size=` | Paginated contest list with computed status |
| GET | `/contests/{id}` | Contest detail with problems |
| POST | `/contests/{id}/register` | Register current user (rejects duplicates) |
| POST | `/contests/{id}/submit` | `{problemId, language, sourceCode}` → scored submission |
| GET | `/contests/{id}/leaderboard` | Ranked leaderboard |

## AI Interviews (`/api/interviews`) — authenticated

| Method | Path | Description |
|---|---|---|
| POST | `/interviews/start` | `{role, interviewType, difficulty, numberOfQuestions}` → session + questions |
| POST | `/interviews/{sessionId}/answer` | `{answerId, answerText}` → running result |
| POST | `/interviews/{sessionId}/finish` | Finalizes scoring → full result |
| GET | `/interviews/{sessionId}` | Session detail |
| GET | `/interviews/history` | Current user's past sessions |

## Learning (`/api/learning`) — read public, complete authenticated

| Method | Path | Description |
|---|---|---|
| GET | `/learning/categories` | Category list |
| GET | `/learning/categories/{id}/resources` | Resources in a category |
| GET | `/learning/resources/{id}` | Resource detail |
| POST | `/learning/resources/{id}/complete` | Mark completed for current user |

## Dashboard (`/api/dashboard`) — authenticated

| Method | Path | Description |
|---|---|---|
| GET | `/dashboard` | Personalized progress dashboard for the current user |

## Admin — all require `ROLE_ADMIN`

| Method | Path | Description |
|---|---|---|
| GET | `/admin/dashboard` | Platform-wide statistics |
| GET | `/admin/users?search=&role=&page=&size=` | Search/paginate users |
| PUT | `/admin/users/{id}/enabled?enabled=true|false` | Enable/disable an account |
| DELETE | `/admin/users/{id}` | Delete a user |
| POST/PUT/DELETE | `/admin/crt/topics[/{id}]` | Manage CRT topics |
| POST/PUT/DELETE | `/admin/crt/questions[/{id}]` | Manage CRT questions |
| GET | `/admin/crt/topics/{id}/questions` | List questions for a topic (with correct answers) |
| POST/PUT/DELETE | `/admin/crt/tests[/{id}]` | Manage CRT tests |
| POST/PUT/DELETE | `/admin/coding/problems[/{id}]` | Manage coding problems (incl. examples + test cases) |
| POST/PUT/DELETE | `/admin/contests[/{id}]` | Manage contests + attached problems |
| GET/POST/PUT/DELETE | `/admin/interviews/questions[/{id}]` | Manage the interview question bank |
| POST | `/admin/learning/categories` | Create a learning category |
| POST/PUT/DELETE | `/admin/learning/resources[/{id}]` | Manage learning resources |

## Postman

Set a collection variable `baseUrl = http://localhost:8080/api` and a variable `token` populated from the login response; add `Authorization: Bearer {{token}}` as a collection-level header for authenticated requests.
