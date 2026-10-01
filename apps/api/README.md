# hr-skills-api

Hosted HTTP adapter for [HR Skills](../../README.md) (Phase 8.4).
This app exposes the deterministic service layer in
`hr-skills-build/server` — registry search, planning, runtime execution,
evaluation, health, and version information — over HTTP, following the
versioned contract documented in
[`docs/engineering/platform-integration.md`](../../docs/engineering/platform-integration.md).

## Status

The seven reserved `/api/v1/*` routes are implemented as thin adapters over the
existing services in `hr-skills-build/server`, with Bearer API-key authentication for
`runtime` and `evaluation`, per-caller rate limiting, structured request logging,
request counters, and a readiness check. Every response is a `ServiceEnvelope<T>` with
`meta.apiVersion = "v1"` and a `meta.requestId`.

The adapter runs as a Bun process from a checkout of this monorepo; see
[Deployment requirements](#deployment-requirements). This repository does **not**
provide:

- A shared (multi-instance) rate-limit store. Only the in-memory store is built in.
- Deployment configuration. There is no Dockerfile, process manifest, infrastructure
  template, provider-specific configuration, or CI deployment job. CI builds the Bun
  adapter bundle, but the adapter has not been verified on any hosting provider.
- A metrics endpoint or exporter. Counters live in the process and can be written to
  the log; see [Metrics](#metrics).
- Graceful shutdown. The adapter installs no signal handlers and does not drain
  in-flight requests.

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
`meta.requestId` and in the `X-Request-Id` response header, is written to the request's
log event (see [Observability](#observability)), and is never used by service logic.
A request keeps one ID for its whole life, so the header, the body, and the log always
agree.

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

## Observability

The adapter uses the logger and counters that already exist in
`hr-skills-build/server` (`createStructuredLogger`, `createServiceMetrics`), as
described in [`docs/engineering/operations.md`](../../docs/engineering/operations.md).
It adds no second observability layer: `src/http/observability.ts` only decides what is
recorded and keeps that safe.

### Logs

`src/index.ts` writes every event as one JSON line: `info` to stdout, `warn` and `error`
to stderr. `createApp()` writes nothing unless it is given an `observability` option, so
importing or testing it has no console output.

Each request produces exactly one `http.request.completed` event, however it ends
(success, `401`, `429`, `404`, unexpected exception):

```json
{"level":"info","event":"http.request.completed","timestamp":"2026-10-01T08:34:51.845Z","operation":"search","requestId":"trace-e2e-1","durationMs":139.8,"details":{"status":200,"outcome":"ok"}}
```

| Field | Meaning |
| --- | --- |
| `level` | `info` below 400, `warn` for 4xx, `error` for 5xx. |
| `operation` | One of the seven operations, or `unrouted` for `404`/`405` and errors raised outside a handler. |
| `requestId` | The same ID as `meta.requestId` and the `X-Request-Id` header. |
| `durationMs` | Time spent in the handler. Absent for `unrouted`. |
| `details.status` | HTTP status returned. |
| `details.outcome` | `ok`, `unauthorized`, `rate_limited`, `validation_failure`, `service_failure`, `readiness_failure`, or `not_matched`. |
| `details.errorCode` | Stable `ServiceErrorCode`, present when the response came from a service, the error handler, or an unexpected exception. Adapter refusals (`401`, `429`, malformed body, registry or rate-limit outage) are identified by `outcome` and `reason` instead. |
| `details.reason` | `registry_unavailable` or `rate_limit_store_unavailable` when an outage produced a `503`. |
| `details.errorName` | Class name of an unexpected exception. |
| `details.failedChecks` | Names of the readiness checks that were not ready. |

Startup produces `server.started`, and these warnings or errors when relevant:
`server.config.api_keys_missing`, `server.config.rate_limit_store_memory`,
`server.config.metrics_interval_invalid`, and `server.config.invalid` (which is followed
by exit code 1).

To follow one request, search the logs for the `X-Request-Id` the caller received. A
well-formed inbound ID is propagated, so a caller's own trace ID can be searched
directly. A malformed inbound ID is replaced and never logged.

**Never logged:** API keys or anything derived from them (this includes the key
fingerprint used for rate-limit counters), the `Authorization` header or any other
header, request or response bodies, query strings, the path of an unmatched route,
client addresses, exception messages, and stack traces. Unexpected exceptions are
recorded by class name only, because messages can echo input. A log sink or metrics
backend that throws cannot fail a request.

If you pass your own `readinessDependencies`, have each check return a boolean rather
than throw: the readiness service copies a thrown message into the response body. The
adapter's own logs never include it.

### Metrics

Counters are cumulative since the process started and are named
`service.<apiVersion>.<operation>.<counter>`, for example
`service.v1.search.requests`. A counter appears once it has been incremented.

| Counter | Counts |
| --- | --- |
| `requests` | Every completed request. |
| `unauthorized` | `401` responses. |
| `rate_limited` | `429` responses. |
| `validation_failures` | Malformed JSON bodies, `VALIDATION_ERROR` results, and any other `400`. |
| `service_failures` | Every other response of 400 or above, including `PLANNING_FAILED`, `RUNTIME_FAILED`, adapter-created `503`s, and unexpected exceptions. |
| `readiness_failures` | `readiness` only: a dependency was not ready. |

The `unrouted` operation counts `requests` for `404` and `405` and `service_failures`
for a `500`.

There is no metrics endpoint. Two ways to read the counters:

- Set `HR_SKILLS_METRICS_LOG_INTERVAL_SECONDS` to write a `service.metrics.snapshot` log
  event with the current counters on that interval, and derive metrics in your log
  pipeline. Counters are per process; sum them across instances yourself.
- Embed the app: pass `createApp({ observability })` and read
  `observability.metrics.snapshot()`.

### Caching

The adapter does not use `createRegistryCache` or `createEvaluationCache`. It reads the
committed `registry/skills.json` once per process and keeps it in memory
(`src/registry.ts`). A failed load is not remembered, so a later request can recover.
This suits immutable builds, with consequences to plan for:

- A registry file replaced while the process runs is not picked up until the process
  restarts.
- No cache hit or miss counters exist, because there is no versioned cache to measure.
- Evaluation results are not cached; `evaluation` is limited to 5 requests per minute
  per key.

## Readiness

`GET /api/v1/health` is a liveness signal and checks no dependencies. `GET /api/v1/ready`
returns the `getReadinessService` result for these checks:

| Check | Ready when |
| --- | --- |
| `registry` | The registry artifact loads. A failed load is retried on each probe, so the check recovers as soon as the file is readable. |
| `api-keys` | `HR_SKILLS_API_KEYS` yielded at least one key. Without one, `runtime` and `evaluation` answer `503`, so the instance cannot serve its full contract. |

When a check is not ready the response is `503 SERVICE_UNAVAILABLE` with
`error.details.checks` listing each check and its status (the message is the generic
`Dependency is not ready`; no paths or exception text). The log event for that request
carries `details.failedChecks`, and the `readiness_failures` counter is incremented.

The rate-limit store is not a readiness check. The built-in in-memory store has nothing
to probe, and a store that throws already fails requests closed with `503` (logged with
`reason: "rate_limit_store_unavailable"`). A deployment that injects a shared store
should add its own check through `readinessDependencies`. That option replaces the
defaults above, so include the `registry` and `api-keys` equivalents too.

Readiness is open (no key) and rate limited like the other unauthenticated operations,
which affects how often probes may run; see [Deployment requirements](#deployment-requirements).

## Configuration

All configuration is read from the environment by `src/index.ts`.

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | Port to listen on. Defaults to `3001`. |
| `NODE_ENV` | No | `production` makes `HR_SKILLS_RATE_LIMIT_STORE` mandatory. |
| `HR_SKILLS_API_KEYS` | For `runtime` and `evaluation` | Comma-separated API keys from the deployment secret manager. Unset or empty: those routes answer `503`, readiness reports `api-keys` as not ready, and the server still starts. |
| `HR_SKILLS_RATE_LIMIT_STORE` | In production | Only `memory` is built in. A missing or unsupported value stops startup (exit code 1) with a `server.config.invalid` event. |
| `HR_SKILLS_CLIENT_IP_HEADER` | No | Header set by a trusted reverse proxy, used to identify callers of unauthenticated operations. See [Rate limiting](#rate-limiting). |
| `HR_SKILLS_METRICS_LOG_INTERVAL_SECONDS` | No | Whole seconds from 1 to 86400 between `service.metrics.snapshot` events. Unset turns them off; an invalid value is reported once and turns them off. |

Never put keys in the repository, in command-line arguments, or in a query string.

## Deployment requirements

What exists today is a Bun process started with `bun run start`. To run it you need:

1. **Bun**, at the version pinned by `packageManager` in the root `package.json`. The
   adapter uses Bun APIs and does not run on Node.
2. **A full checkout of this repository**, with dependencies installed and the library
   packages built, because the adapter imports their `dist/` output:

   ```sh
   bun install
   bunx turbo run build --filter=hr-skills-build --filter=hr-skills-ref
   ```

3. **The right working directory.** `hr-skills-ref` finds the repository root from the
   current directory: the directory itself if it contains `skills/`, otherwise two
   levels up. Start the process from the repository root or from `apps/api`. From
   anywhere else the registry cannot be found and readiness reports `registry` as not
   ready.
4. **A current `registry/skills.json`.** It is a committed, generated artifact (run
   `bun run registry` at the root to regenerate it). Restart the process after it
   changes.
5. **TLS terminated in front of the process.** The adapter serves plain HTTP and has no
   TLS support. Put a TLS-terminating reverse proxy or ingress in front of it.
6. **Secrets from your secret manager**, injected as environment variables.
7. **Log collection** for both stdout and stderr.
8. **A single instance, unless you provide a shared rate-limit store.** With
   `HR_SKILLS_RATE_LIMIT_STORE=memory` each instance keeps its own counters, so the
   effective limit is multiplied by the number of instances. This repository ships no
   shared store: running several instances means writing a `RateLimitStore`
   and a small entrypoint that calls `createApp({ rateLimiter })`.

Health probes count against the same limits as any caller (60 requests per minute per
caller for `health` and `ready`), and a `429` reads as a failed probe. Probe each
instance no more than once every few seconds. Behind a shared proxy or load balancer all
probes arrive from one address unless `HR_SKILLS_CLIENT_IP_HEADER` identifies the real
caller, so leave generous headroom.

Because there is no graceful shutdown, take an instance out of rotation (readiness or
the load balancer) before stopping it.

Example production start, with values coming from your secret manager and proxy:

```sh
NODE_ENV=production \
HR_SKILLS_RATE_LIMIT_STORE=memory \
HR_SKILLS_CLIENT_IP_HEADER=x-forwarded-for \
HR_SKILLS_METRICS_LOG_INTERVAL_SECONDS=60 \
bun run start   # HR_SKILLS_API_KEYS is already present in the environment
```

`HR_SKILLS_CLIENT_IP_HEADER=x-forwarded-for` is only correct when every request passes
through a proxy that sets or appends that header. `memory` is for a single instance.

## Structure

| Path | Responsibility |
| --- | --- |
| `src/app.ts` | Constructs and returns the Elysia application. No side effects, no port binding, no log output by default — safe to import from tests. |
| `src/index.ts` | Starts the server: reads the environment, installs the JSON log sink, calls `createApp()`, binds the port. |
| `src/routes/v1.ts` | Route handlers: authentication, rate limiting, body parsing, service call, envelope. |
| `src/http/request-id.ts` | Request ID resolution. |
| `src/http/response.ts` | Envelope serialisation and error-code to status mapping. |
| `src/http/rate-limit.ts` | Fixed-window limiter, `RateLimitStore` interface, in-memory store, client address resolver. |
| `src/http/rate-limit-config.ts` | Environment-driven limiter and resolver configuration; production guard. |
| `src/http/observability.ts` | Wires the shared structured logger and counters: JSON sink, one completion event and counters per request, safe error descriptions. |
| `src/http/auth.ts` | Bearer API-key authenticator: header parsing, constant-time comparison, key list parsing. |
| `src/registry.ts` | Loads the committed `registry/skills.json`. |
| `src/app.test.ts` | Adapter-level tests for all seven routes. |
| `src/http/observability.test.ts` | Request ID linkage, counters, redaction, failing sinks, readiness transitions, JSON sink. |
| `src/http/rate-limit.test.ts` | Rate limiting: limits per operation, window reset, caller isolation, store failures, configuration. |

## Local development

From the repo root, install dependencies and build the library packages once so
`hr-skills-build` resolves:

```sh
bun install
bunx turbo run build --filter=hr-skills-build --filter=hr-skills-ref
```

(`bun run build` at the root also works but additionally builds `apps/web`, which needs
network access to fetch fonts.)

Then, from this directory:

```sh
HR_SKILLS_API_KEYS=dev-key bun run dev     # starts with --watch on http://localhost:3001
HR_SKILLS_API_KEYS=dev-key bun run start   # starts without --watch
```

Override the port with `PORT`. Outside production an unset `HR_SKILLS_RATE_LIMIT_STORE`
defaults to the in-memory store. Without `HR_SKILLS_API_KEYS` the server still starts
and `search` and `planner` work, but `runtime` and `evaluation` answer `503` and
`GET /api/v1/ready` reports `api-keys` as not ready.

```sh
curl -i http://localhost:3001/api/v1/health
curl -s http://localhost:3001/api/v1/ready
curl -s -X POST http://localhost:3001/api/v1/search \
  -H 'content-type: application/json' -d '{"query":"onboarding"}'
```

Each call prints a JSON log line in the terminal running the server.

## Testing

```sh
bun run test       # adapter-level tests (exercise createApp() via .handle())
bun run typecheck
```

Tests inject a mock registry, authenticator, rate limiter, and observability instance
into `createApp()`, so they need neither a running server nor the committed registry,
and they read log events and counters directly instead of capturing output.
