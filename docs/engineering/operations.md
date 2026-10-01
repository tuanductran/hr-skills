# Operational concerns

This document defines the operational behavior for Phase 8.3. The repository
provides library-level operational primitives in `hr-skills-build/server`;
deployment adapters remain responsible for connecting them to a cache, log
collector, metrics backend, and hosting platform. [`apps/api`](../../apps/api/README.md)
is the first adapter and wires the logger, metrics, and readiness primitives as
described in [HTTP adapter wiring](#http-adapter-wiring); the cache primitives
are not used by it.

## Artifact caching

Registry and evaluation artifacts use separate versioned caches from
`hr-skills-build/server`:

- Registry entries are keyed by the committed registry version, normally
  `registry.generatedAt` plus the registry schema version.
- Evaluation reports are keyed by the dataset name, dataset version, golden
  fixture version, and registry version.
- A version mismatch is a cache miss. The old value is never returned for a
  newer source version.
- Deployments must invalidate both caches when the registry schema or
  evaluation fixture format changes.

The cache primitives do not add time-based expiry. Deployments may add a TTL
for resource protection, but version checks remain mandatory so identical
inputs continue to produce deterministic results.

## Logging and metrics

`createStructuredLogger()` emits JSON-compatible events with a stable event
name, level, timestamp, operation, request ID, duration, and optional details.
Production adapters should send these events to their structured log backend
and must redact API keys, skill content, prompts, and personal data.

`createServiceMetrics()` provides counters for request totals, validation
failures, service failures, cache hits, cache misses, and readiness failures.
Adapters should publish snapshots to their metrics system and include the
operation and API version in metric dimensions.

## Readiness and failure recovery

`getReadinessService()` checks deployment dependencies such as registry loading,
cache availability, and required configuration. A failed dependency returns
`SERVICE_UNAVAILABLE` with the failing checks and API version in the response
metadata. Health is a liveness signal; readiness is the signal used by a load
balancer before sending traffic.

HTTP adapters should expose this check through the reserved `GET /api/v1/ready`
contract and keep it unauthenticated but rate limited.

Adapters should remove an instance from rotation when readiness fails, retry
transient dependency recovery with bounded backoff, and preserve the last
known-good immutable registry artifact when a refresh fails. They must not
silently serve a newer partial registry.

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

Run the service adapter beside the Bun/Node server package (`apps/api` runs on
Bun from a repository checkout; see its README for requirements). Store API keys and
cache credentials in the deployment secret manager, terminate TLS at the
trusted edge, and use a shared cache when multiple instances serve traffic.
Use the readiness check for process supervision and graceful rollout.

### Managed

`apps/api` ships no managed-platform configuration and has not been verified on
any hosting provider. Use the platform's secret store, request tracing,
rate-limit store, and deployment health checks. Pin the package version and registry artifact
together, deploy immutable builds, and retain structured logs and metrics for
the configured retention period. Do not rely on local filesystem state for
cross-instance cache or recovery behavior.

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

Adapters must test cache version changes, cold starts, stale artifacts,
dependency failure, log redaction, metric increments, readiness transitions,
and old-client compatibility with additive response fields.
