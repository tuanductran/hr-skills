# Platform integration

This document defines the Phase 8.2 contract between the HR Skills service
layer, the web product, and future external clients.

## Current boundary

The repository exposes deterministic library services from
`hr-skills-build/server`. `apps/api` implements the seven reserved routes as a
Bun + Elysia adapter over those services, with `Authorization: Bearer` API-key
authentication for runtime and evaluation, per-caller rate limiting, structured
request logging, request counters, and a readiness check (see
[`apps/api/README.md`](../../apps/api/README.md) and
[`operations.md`](operations.md)). The
contract metadata remains the source of truth for adapters, and is not a claim
that these URLs are deployed.

Browser code should continue to use `hr-skills-build/client`. Server loaders
and route handlers, including `apps/api`, should use `hr-skills-build/server`.
Neither surface may import from the other.

## Versioned operations

The browser-safe `SERVICE_CONTRACTS` export from
`hr-skills-build/client` defines the reserved version-one operations:

| Operation | Method | Path | Authentication | Limit |
|---|---|---|---|---|
| Health | `GET` | `/api/v1/health` | None | 60 requests/minute |
| Readiness | `GET` | `/api/v1/ready` | None | 60 requests/minute |
| Version | `GET` | `/api/v1/version` | None | 60 requests/minute |
| Search | `POST` | `/api/v1/search` | None | 30 requests/minute |
| Planner | `POST` | `/api/v1/planner` | None | 20 requests/minute |
| Runtime | `POST` | `/api/v1/runtime` | API key | 10 requests/minute |
| Evaluation | `POST` | `/api/v1/evaluation` | API key | 5 requests/minute |

The limits are an initial policy for an adapter. A deployment may lower them
for abuse prevention, but must not silently raise them without documenting the
change.

## Response envelope

Every adapter must preserve the discriminated response shape:

```json
{
  "success": true,
  "data": {},
  "meta": {
    "apiVersion": "v1",
    "requestId": "req_123"
  }
}
```

Failures use the same envelope discriminator and a normalized error:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid planner request",
    "details": {}
  },
  "meta": {
    "apiVersion": "v1",
    "requestId": "req_123"
  }
}
```

Clients must branch on `success`, not on the presence of `data` or
`error`. Supported error codes are defined by `ServiceErrorCode` and must
remain stable within a major API version.

## Authentication and rate limiting

Health, version, search, and planner are read-only or bounded computation
operations and are initially unauthenticated. They remain rate limited and
must not expose filesystem paths, secrets, or unbounded registry data.

Runtime and evaluation require an API key at the adapter boundary. API keys
must be supplied through an authorization mechanism managed by the hosting
platform, never through query parameters or committed configuration. The
adapter must identify the caller before applying the per-operation limit and
return a normalized `SERVICE_UNAVAILABLE` response when its rate-limit store
is unavailable rather than silently disabling the control.

The adapter uses an in-memory counter with a fixed one-minute window by default,
which is suitable for local development and single-instance deployments. The
current adapter has no built-in shared store; multi-instance deployments must
inject a shared, deployment-backed counter. If that store is unavailable, the
adapter returns `SERVICE_UNAVAILABLE` rather than silently disabling rate limits.

## Validation and determinism

Adapters pass request bodies to the server services, which own validation.
Search and planner use the exported service schemas, while runtime and
evaluation use their service-level structural guards. Invalid input returns
`VALIDATION_ERROR`; missing required resources return `BAD_REQUEST` or
`NOT_FOUND`; execution failures must retain their operation-specific error code.

The adapter must pass the validated input to the existing deterministic
registry, planner, runtime, and evaluation functions. It must not add ranking,
planning, retries, timestamps, or random identifiers to service results.
Request IDs may be added to response metadata for tracing only; the adapter also
writes them to its request logs.

## Compatibility policy

- `v1` response fields are additive-compatible: new optional fields may be
  added, but existing fields and error codes cannot be removed or renamed.
- Request fields may be added only as optional fields.
- A breaking request or response change requires a new API version and a
  changeset for the affected package.
- Adapter tests must cover web-shaped calls and external-client-shaped calls
  as the hosted adapter evolves.

See [`package-architecture.md`](package-architecture.md) for package import
rules and the service exports in
`packages/hr-skills-build/src/client/service/contracts.ts` for the
machine-readable contract.
