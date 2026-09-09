# Platform integration

This document defines the Phase 8.2 contract between the HR Skills service
layer, the web product, and future external clients.

## Current boundary

The repository currently exposes deterministic library services from
`hr-skills-build/server`. It does not expose hosted HTTP route handlers yet.
The contract metadata is therefore a stable implementation guide for future
adapters, not a claim that these URLs are already deployed.

Browser code should continue to use `hr-skills-build/client`. Server loaders
and future route handlers should use `hr-skills-build/server`. Neither surface
may import from the other.

## Versioned operations

The browser-safe `SERVICE_CONTRACTS` export from
`hr-skills-build/client` defines the reserved version-one operations:

| Operation | Method | Path | Authentication | Limit |
|---|---|---|---|---|
| Health | `GET` | `/api/v1/health` | None | 60 requests/minute |
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

The initial implementation should use a shared, deployment-backed counter
with a fixed one-minute window. A later deployment may use a token bucket or
sliding window if it preserves the documented limits and response behavior.

## Validation and determinism

Adapters must validate request bodies with the exported service schemas before
calling the server services. Invalid input returns `VALIDATION_ERROR`; missing
required resources return `BAD_REQUEST` or `NOT_FOUND`; execution failures
must retain their operation-specific error code.

The adapter must pass the validated input to the existing deterministic
registry, planner, runtime, and evaluation functions. It must not add ranking,
planning, retries, timestamps, or random identifiers to service results.
Request IDs may be added to response metadata for tracing only.

## Compatibility policy

- `v1` response fields are additive-compatible: new optional fields may be
  added, but existing fields and error codes cannot be removed or renamed.
- Request fields may be added only as optional fields.
- A breaking request or response change requires a new API version and a
  changeset for the affected package.
- Contract tests must cover web-shaped calls and external-client-shaped calls
  before a hosted adapter is introduced.

See [`package-architecture.md`](package-architecture.md) for package import
rules and the service exports in
`packages/hr-skills-build/src/client/service/contracts.ts` for the
machine-readable contract.
