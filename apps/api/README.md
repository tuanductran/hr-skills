# hr-skills-api

Hosted HTTP adapter for [HR Skills](../../README.md) (Phase 8.4).
This app exposes the deterministic service layer in
`hr-skills-build/server` — registry search, planning, runtime execution,
evaluation, health, and version information — over HTTP, following the
versioned contract documented in
[`docs/engineering/platform-integration.md`](../../docs/engineering/platform-integration.md).

## Status

The seven reserved `/api/v1/*` routes are implemented as thin adapters over the
existing services in `hr-skills-build/server`. Every response is a
`ServiceEnvelope<T>` with `meta.apiVersion = "v1"` and a `meta.requestId`.

Not implemented yet:

- A shared (multi-instance) rate-limit store; only the in-memory store is built in
- Observability wiring described in
  [`docs/engineering/operations.md`](../../docs/engineering/operations.md)
- Deployment configuration

## Routes

| Method | Path | Service | Request body |
| --- | --- | --- | --- |
| `GET` | `/api/v1/health` | `getHealthService` | none |
| `GET` | `/api/v1/ready` | `getReadinessService` | none |
| `GET` | `/api/v1/version` | `getVersionService` | none |
| `POST` | `/api/v1/search` | `searchRegistryService` | `SearchRequestSchema` |
| `POST` | `/api/v1/planner` | `generatePlanService` | `PlannerRequestSchema` |
| `POST` | `/api/v1/runtime` | `executeWorkflowService` | `{ "plan": ExecutionPlan }` |
| `POST` | `/api/v1/evaluation` | `runEvaluationService` | `{ "dataset": EvaluationDataset, "golden"?: GoldenFixture }` |

Request bodies are validated by the services themselves. `search` and `planner`
use the exported Valibot schemas; `runtime` and `evaluation` currently rely on
the structural guards inside their services.

## Request IDs

A well-formed inbound `X-Request-Id` (up to 128 characters of `A-Z a-z 0-9 . _ : -`)
is propagated. Otherwise the adapter generates `req_<uuid>`. The ID is returned in
`meta.requestId` and in the `X-Request-Id` response header, and is never used by
service logic.

## Error mapping

Service errors keep their `ServiceErrorCode`; the adapter only chooses the HTTP
status.

| Code | Status |
| --- | --- |
| `BAD_REQUEST` | 400 |
| `NOT_FOUND` | 404 |
| `VALIDATION_ERROR` | 422 |
| `PLANNING_FAILED` | 422 |
| `RUNTIME_FAILED` | 500 |
| `SERVICE_UNAVAILABLE` | 503 |
| `INTERNAL_ERROR` | 500 |

Adapter-level cases use the same envelope and existing codes only:

| Case | Status | Code |
| --- | --- | --- |
| Malformed JSON body | 400 | `BAD_REQUEST` |
| Known path, wrong method (`Allow` header set) | 405 | `BAD_REQUEST` |
| Unknown path | 404 | `NOT_FOUND` |
| Registry artifact cannot be loaded | 503 | `SERVICE_UNAVAILABLE` |
| API key missing, malformed, or invalid | 401 | `BAD_REQUEST` |
| Rate limit exceeded (`Retry-After` set) | 429 | `BAD_REQUEST` |
| Rate-limit store unavailable (fail closed) | 503 | `SERVICE_UNAVAILABLE` |
| Unexpected exception | 500 | `INTERNAL_ERROR` |

Unexpected exceptions and registry load failures return fixed messages so stack
traces and filesystem paths are never exposed.

## Authentication

`runtime` and `evaluation` are `authentication: "api-key"` in `SERVICE_CONTRACTS`.
`health`, `ready`, `version`, `search`, and `planner` need no key.

Send the key as `Authorization: Bearer <key>`. Keys are never read from the query
string, request body, or other headers. The scheme is case-insensitive; the header
must be exactly `Bearer`, one space, and the key.

| Situation | Status | Code |
| --- | --- | --- |
| No key store configured (`HR_SKILLS_API_KEYS` unset or empty) | 503 | `SERVICE_UNAVAILABLE` |
| Header missing, malformed, or key unknown | 401 | `BAD_REQUEST` |
| Key accepted | request proceeds | — |

Missing, malformed, and invalid keys return one identical response (same status,
code, message, and `WWW-Authenticate: Bearer` header), so callers cannot probe which
check failed. No new error codes were added. Authentication runs before the body is
read.

Configure keys with `HR_SKILLS_API_KEYS`, a comma-separated list from the deployment
secret manager (several keys allow rotation). Keys are compared in constant time
against every configured key. The adapter never logs, echoes, or includes a key in an
error message; `createApp()` accepts an optional `authenticateApiKey` callback for
tests and alternative strategies.

## Rate limiting

Every operation is rate limited per caller. The limits come from `SERVICE_CONTRACTS`
(one fixed window of `windowSeconds` per operation), so the contract stays the single
source of truth:

| Operation | Limit |
| --- | --- |
| `health`, `ready`, `version` | 60 requests/minute each |
| `search` | 30 requests/minute |
| `planner` | 20 requests/minute |
| `runtime` | 10 requests/minute |
| `evaluation` | 5 requests/minute |

Counters are keyed by operation **and** caller, so there is no global counter: using up
one operation, or one caller's allowance, never affects another. Callers are identified
as follows:

- `runtime` and `evaluation` count per API key, using a hash of the accepted key. The raw
  key never reaches a counter key, a log, or a response. Two keys behind one address keep
  separate limits, and one key counts as one caller wherever it connects from.
- Other operations count per client address: the socket peer address, or the last entry
  of the header named by `HR_SKILLS_CLIENT_IP_HEADER` when it is set and well formed.
  Set that variable only behind a trusted reverse proxy that sets or appends the header;
  otherwise clients can spoof it. A request whose address cannot be determined shares one
  `unknown` counter.

Authentication runs first, so requests rejected with `401` are not counted. Rate
limiting runs before the body is read. A request over the limit gets `429` with code
`BAD_REQUEST` (no new error code), a `Retry-After` header in seconds, and
`error.details` of `{ limit, windowSeconds }`.

The window starts at a caller's first request and resets when it ends; requests rejected
inside the window do not extend it.

### Store and production behavior

Counters live behind the `RateLimitStore` interface in `src/http/rate-limit.ts`. The only
built-in store is in-memory, which is per process. Shared or external stores are a
deployment concern: implement `RateLimitStore` there and pass
`createApp({ rateLimiter: createRateLimiter({ store }) })`. A store that throws makes the
request fail closed with `503 SERVICE_UNAVAILABLE`; the limit is never skipped.

| Variable | Purpose |
| --- | --- |
| `HR_SKILLS_RATE_LIMIT_STORE` | Store used by `createApp()` when no `rateLimiter` is injected. Only `memory` is built in. |
| `HR_SKILLS_CLIENT_IP_HEADER` | Optional trusted proxy header that carries the client address. |

Rate limiting is never silently disabled. Outside production an unset store defaults to
`memory`. When `NODE_ENV=production`, `HR_SKILLS_RATE_LIMIT_STORE` must be set: if it is
missing, empty, or names an unsupported store, `createApp()` throws
`RateLimitConfigError` and the server refuses to start with a clear message. Choosing
`memory` in production is an explicit opt-in and logs a warning, because each instance
then keeps its own counters and the effective limit is multiplied by the number of
instances. Use it for single-instance deployments only.

The in-memory store holds at most 100,000 live counters and fails closed (`503`) beyond
that, so a flood of distinct callers cannot exhaust memory.

## Structure

| Path | Responsibility |
| --- | --- |
| `src/app.ts` | Constructs and returns the Elysia application. No side effects, no port binding — safe to import from tests. |
| `src/index.ts` | Starts the server by calling `createApp()` and binding a port. |
| `src/routes/v1.ts` | Route handlers: authentication, rate limiting, body parsing, service call, envelope. |
| `src/http/request-id.ts` | Request ID resolution. |
| `src/http/response.ts` | Envelope serialisation and error-code to status mapping. |
| `src/http/rate-limit.ts` | Fixed-window limiter, `RateLimitStore` interface, in-memory store, client address resolver. |
| `src/http/rate-limit-config.ts` | Environment-driven limiter and resolver configuration; production guard. |
| `src/http/auth.ts` | Bearer API-key authenticator: header parsing, constant-time comparison, key list parsing. |
| `src/registry.ts` | Loads the committed `registry/skills.json`. |
| `src/app.test.ts` | Adapter-level tests for all seven routes. |
| `src/http/rate-limit.test.ts` | Rate limiting: limits per operation, window reset, caller isolation, store failures, configuration. |

## Setup

From the repo root, install dependencies and build the workspace's
TypeScript packages once so `hr-skills-build` resolves:

```sh
bun install
bun run build
```

Then, from this directory:

```sh
bun run dev     # starts the API with --watch on http://localhost:3001
bun run start   # starts the API without --watch
```

Override the port with the `PORT` environment variable.

## Testing

```sh
bun run test       # adapter-level tests (exercise createApp() via .handle())
bun run typecheck
```

Tests inject a mock registry and authenticator into `createApp()`, so they need
neither a running server nor the committed registry.
