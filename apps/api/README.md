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

- Rate limiting
- The approved API-key authentication strategy (a fail-closed placeholder is in
  place; see [Authentication placeholder](#authentication-placeholder))
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
| API key rejected | 401 | `BAD_REQUEST` |
| Unexpected exception | 500 | `INTERNAL_ERROR` |

Unexpected exceptions and registry load failures return fixed messages so stack
traces and filesystem paths are never exposed.

## Authentication placeholder

`runtime` and `evaluation` are `authentication: "api-key"` in `SERVICE_CONTRACTS`.
The approved strategy is not implemented, so `createApp()` accepts an optional
`authenticateApiKey` callback and **fails closed** without it: those two routes
return `503 SERVICE_UNAVAILABLE` ("API key authentication is not configured").
When a callback is supplied, returning `false` yields `401`. Nothing in this app
reads, stores, or validates keys.

## Structure

| Path | Responsibility |
| --- | --- |
| `src/app.ts` | Constructs and returns the Elysia application. No side effects, no port binding — safe to import from tests. |
| `src/index.ts` | Starts the server by calling `createApp()` and binding a port. |
| `src/routes/v1.ts` | Route handlers: authentication seam, body parsing, service call, envelope. |
| `src/http/request-id.ts` | Request ID resolution. |
| `src/http/response.ts` | Envelope serialisation and error-code to status mapping. |
| `src/http/auth.ts` | API-key authenticator type (placeholder). |
| `src/registry.ts` | Loads the committed `registry/skills.json`. |
| `src/app.test.ts` | Adapter-level tests for all seven routes. |

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
