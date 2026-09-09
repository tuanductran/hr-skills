# Operational concerns

This document defines the operational behavior for Phase 8.3. The current
repository provides library-level operational primitives; deployment adapters
remain responsible for connecting them to a cache, log collector, metrics
backend, and hosting platform.

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

Run the service adapter beside the Bun/Node server package. Store API keys and
cache credentials in the deployment secret manager, terminate TLS at the
trusted edge, and use a shared cache when multiple instances serve traffic.
Use the readiness check for process supervision and graceful rollout.

### Managed

Use the platform's secret store, request tracing, rate-limit store, and
deployment health checks. Pin the package version and registry artifact
together, deploy immutable builds, and retain structured logs and metrics for
the configured retention period. Do not rely on local filesystem state for
cross-instance cache or recovery behavior.

## Operational test matrix

Adapters must test cache version changes, cold starts, stale artifacts,
dependency failure, log redaction, metric increments, readiness transitions,
and old-client compatibility with additive response fields.
