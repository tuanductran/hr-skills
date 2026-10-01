# Operational concerns

This document describes the library primitives, the state currently held by
the hosted HTTP adapter, and infrastructure that a deployment must provide.
These are separate layers:

- `hr-skills-build/server` exports process-local versioned cache, structured
  logger, metrics, and readiness primitives. They do not provide distributed
  storage or a deployment backend.
- [`apps/api`](../../apps/api/README.md) is a host-platform-neutral Bun/Elysia
  application outside the reusable packages. It wires logging, metrics, and
  readiness, but does not use the library cache primitives.
- A production deployment must supply infrastructure such as an atomic shared
  rate-limit store. No provider or shared datastore is selected or configured
  by this repository.

## Artifact caching

`hr-skills-build/server` exports separate in-process versioned cache primitives
for registry and evaluation artifacts:

- `get(key, version)` returns a value only when its stored version matches.
- `set` replaces the value for a key; `invalidate` removes one key and `clear`
  removes all entries.
- The caller supplies the key and version. The primitive does not derive
  source versions, expire entries, persist values, or invalidate them
  automatically.

The API adapter does not use these primitives. It loads the committed
`registry/skills.json` artifact once per process and does not cache evaluation
reports. This process-local registry state suits immutable deployments: a
changed artifact takes effect after restart. No cache hit/miss metrics or
distributed cache are configured. Add cache integration only when a concrete
refreshable artifact or reusable evaluation result needs versioned caching.

## Logging and metrics

`createStructuredLogger()` emits JSON-compatible events with a stable event
name, level, timestamp, operation, request ID, duration, and optional details.
Production adapters should send these events to their structured log backend
and must redact API keys, skill content, prompts, and personal data.

`createServiceMetrics()` provides process-local counters. The API adapter
records request totals, validation failures, service failures, and readiness
failures, with operation and API version in counter names. It does not record
cache hits or misses because it does not use a cache. Deployments can collect
periodic counter snapshots from the adapter's structured logs; no metrics
endpoint or external metrics backend is included.

## Readiness and failure recovery

`getReadinessService()` evaluates the dependencies supplied by the adapter. The
API adapter checks registry loading and required API-key configuration. It
does not check a cache or rate-limit store by default. A failed dependency returns
`SERVICE_UNAVAILABLE` with the failing checks and API version in the response
metadata. Health is a liveness signal; readiness is the signal used by a load
balancer before sending traffic.

HTTP adapters should expose this check through the reserved `GET /api/v1/ready`
contract and keep it unauthenticated but rate limited.

Deployments should remove an instance from rotation when readiness fails and
retry transient dependency recovery with bounded backoff. The API adapter does
not refresh registry artifacts or keep a last-known-good copy.

## Version compatibility

Public routes use the `/api/v1/` prefix. Within `v1`:

- Existing response fields and error codes are never removed or renamed.
- New response fields must be optional.
- New request fields must be optional and ignored by older consumers.
- Breaking changes require a new route version, migration notes, tests, and a
  changeset for the affected package.
- The service API version in every response must match the route version.

## Deployment guidance

### Self-hosted

Run `apps/api` with Bun from a repository checkout; see its README for
requirements. Store API keys and any selected infrastructure credentials in a
deployment secret manager, terminate TLS at the trusted edge, and use readiness
for process supervision and rollout. The built-in rate-limit store is
in-memory, so multi-instance production deployments need an injected shared
store. No shared cache is required or configured by the adapter.

### Managed

`apps/api` ships no managed-platform configuration and has not been verified on
any hosting provider. No production rate-limit backend has been selected.
Choose and inject a deployment-backed atomic store before using multiple
instances in production; the in-memory store is not a production substitute.
Use the platform's secret store and health checks, deploy immutable builds, and
ship structured logs and metrics snapshots to the platform's observability
systems. The adapter does not rely on cross-instance cache state.

## HTTP adapter wiring

`apps/api` connects HTTP requests to the primitives above without adding a second
observability layer. Its [README](../../apps/api/README.md) is the reference for
routes, fields, counters, and configuration; this section records what is and is
not wired.

- **Logger.** `createStructuredLogger()` receives one `http.request.completed`
  event per request, with the operation, request ID, duration, HTTP status,
  outcome, and stable error code. The request ID is the one returned in
  `meta.requestId` and the `X-Request-Id` header, so a response can be traced to
  its log line. Events contain no API keys or key-derived values, headers,
  bodies, query strings, client addresses, exception messages, or stack traces;
  unexpected exceptions are recorded by class name only. A failing sink cannot
  fail a request.
- **Metrics.** `createServiceMetrics()` counters are named
  `service.<apiVersion>.<operation>.<counter>`, which carries the operation and
  API version dimensions because the primitive has no labels. Emitted counters
  are `requests`, `unauthorized`, `rate_limited`, `validation_failures`,
  `service_failures`, and `readiness_failures`. There is no metrics endpoint;
  counters can be written to the log periodically for a log pipeline to
  collect.
- **Readiness.** `getReadinessService()` checks that the registry artifact loads
  and that API keys are configured, because `runtime` and `evaluation` fail
  closed without them. The rate-limit store is not probed by default;
  deployments with a shared store add their own check.
- **Caches.** Not wired. The adapter keeps the committed registry artifact in
  memory for the life of the process and does not cache evaluation reports, so
  it emits no cache hit or miss counters and has no cache version to
  invalidate. A new registry takes effect when the process restarts.

The adapter's tests cover dependency failure, log redaction, metric increments,
readiness transitions, and request ID linkage. Cache version changes, cold
starts, and stale artifacts from the matrix below do not apply until the adapter
adopts the cache primitives.

## Operational test matrix

The library cache primitive tests cover version mismatches, cold starts, and
explicit invalidation. API adapter tests cover dependency failures, log
redaction, metric increments, readiness transitions, and request ID linkage.
Cache integration and cache-specific adapter tests apply only if an adapter
actually adopts the cache primitives. Continue to test old-client
compatibility when adding response fields.
