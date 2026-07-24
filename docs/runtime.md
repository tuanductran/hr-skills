# Workflow Runtime

> Phase 4.3 of the [roadmap](ROADMAP.md) — deterministic execution of plans produced by the [Skill Planner](planner.md).

## What it is

The Workflow Runtime **executes** an `ExecutionPlan` (see [`docs/planner.md`](planner.md)) that the Planner already produced. It is responsible for:

- Running workflow steps in the order the Planner already computed
- Propagating context (each step's output) to later steps
- Tracking execution state (pending, running, completed, failed, skipped)
- Retrying failed steps according to a configurable policy
- Handling failures cleanly, including skipping downstream dependents
- Emitting execution events
- Producing a deterministic execution trace for debugging

The Runtime is **NOT** responsible for:

- Intent analysis
- Capability matching
- Skill discovery
- Workflow planning

Those belong to the Skill Planner (Phase 4.2). The Runtime begins only after a validated `ExecutionPlan` exists.

The Runtime is also deliberately agnostic about **what a step does**. It does not invoke skills, call a model, or run tools itself — callers supply a `StepExecutorFn` that performs the real work. This keeps the Runtime a pure sequencing and state-management engine, independent of any particular execution backend, which is what makes it deterministic and easy to unit test with a stub executor.

## Architecture

```text
ExecutionPlan (from Planner)
        |
        v
  WorkflowExecutor.run(plan, executeStep)
        |
        |-- RuntimeStateTracker   (pending / running / completed / failed / skipped)
        |-- RuntimeContext        (context propagation between steps)
        |-- RetryPolicy           (deterministic retry behavior)
        |-- EventDispatcher       (execution events, logical clock)
        |-- TraceCollector        (execution trace: event + state snapshot)
        |
        v
   WorkflowResult (status, outputs, steps, events, trace, state)
```

| Component | File | Responsibility |
|---|---|---|
| `WorkflowExecutor` / `executeWorkflow` | `runtime.ts` | Orchestrates a single plan run: iterates steps, applies retries, decides skip/stop behavior, assembles the final result. |
| `RuntimeContext` | `runtime-context.ts` | Explicit, mutable store of step outputs keyed by skill ID — how later steps read earlier steps' results. |
| `RuntimeStateTracker` | `runtime-state.ts` | Tracks which bucket (pending/running/completed/failed/skipped) each skill ID is currently in. |
| `RetryPolicy` | `runtime-retry.ts` | Decides how many times to retry a failed step and what logical delay to record. Ships with `noRetryPolicy`, `fixedRetryPolicy`, and `exponentialRetryPolicy`. |
| `EventDispatcher` | `runtime-events.ts` | Assigns each event a monotonically increasing logical `order` and notifies an optional `onEvent` callback. |
| `TraceCollector` | `runtime-trace.ts` | Pairs each event with a state snapshot to build the execution trace. |
| `RuntimeError` | `runtime-errors.ts` | Structured, JSON-serializable failure information (code, skill ID, attempt, cause). |

All shared type definitions (`RuntimeContext`, `RuntimeStateSnapshot`, `RuntimeEvent`, `TraceEntry`, `WorkflowResult`, and so on) live in `src/types.ts`, alongside the Planner's types, to keep the shared interfaces used across the Planner, Runtime, and their tests in one place.

## Execution lifecycle

For a plan with steps `[s1, s2, s3, ...]` (already topologically ordered by the Planner):

1. `workflow-started` is emitted.
2. For each step, in plan order:
   - If any of its `dependencies` are in the `failed` or `skipped` bucket, the step is marked `skipped` (a `step-skipped` event is emitted) and the Runtime moves to the next step.
   - Otherwise the step is marked `running` (`step-started` is emitted) and executed via `executeStep(step, context)`.
     - On success: the output is written to the `RuntimeContext`, the step is marked `completed`, and `step-completed` is emitted.
     - On failure: the `RetryPolicy` is consulted. If a retry is allowed, `step-retry` is emitted and the step runs again. Once retries are exhausted (or `shouldRetry` declines), the step is marked `failed`, a `RuntimeError` is built, and `step-failed` is emitted.
   - If the step failed and `stopOnFailure` is `true` (the default), every remaining `pending` step is marked `skipped` and the loop ends.
3. `workflow-completed` is emitted if no step failed, otherwise `workflow-failed`.

The Runtime never reorders steps — ordering is entirely the Planner's responsibility (topological sort over dependencies). The Runtime only decides, for the order it's given, whether each step runs, retries, or is skipped.

## Execution model

`executeWorkflow` is the primary entry point:

```typescript
import { executeWorkflow } from './runtime.js';
import { generateExecutionPlan } from './planner.js';
import { buildRegistry } from './registry.js';

const registry = await buildRegistry();
const plan = generateExecutionPlan('create an onboarding plan', registry);

const result = await executeWorkflow(plan, async (step, context) => {
  // Perform the actual work for this step — load the skill, call a model,
  // run a tool, etc. `context.get(id)` reads any previous step's output.
  return await runSkill(step.skillId, context.toObject());
});

console.log(result.status);   // 'completed' | 'failed'
console.log(result.outputs);  // { [skillId]: output }
console.log(result.steps);    // per-step StepResult[]
console.log(result.events);   // RuntimeEvent[]
console.log(result.trace);    // TraceEntry[]
```

For more control (custom retry policy, live event handling, or reusing the same configuration across multiple plans), use the `WorkflowExecutor` class directly:

```typescript
import { WorkflowExecutor } from './runtime.js';
import { exponentialRetryPolicy } from './runtime-retry.js';

const executor = new WorkflowExecutor({
  retryPolicy: exponentialRetryPolicy({ maxRetries: 3, baseDelayMs: 100 }),
  onEvent: (event) => console.log(event.order, event.type, event.skillId),
  stopOnFailure: false,
});

const result = await executor.run(plan, executeStep);
```

## State management

`RuntimeStateTracker` maintains five disjoint buckets — `pending`, `running`, `completed`, `failed`, `skipped` — that always partition the full set of skill IDs in the plan. A skill ID moves through exactly one path:

```text
pending -> running -> completed
pending -> running -> failed
pending -> skipped   (dependency failed/skipped, or a prior step failed with stopOnFailure)
```

`WorkflowResult.state` is a plain-object snapshot (`RuntimeStateSnapshot`) of the final buckets. Intermediate snapshots are also captured in the trace (see below), so the full history of state transitions is recoverable even though the tracker itself is mutable and internal to a single run.

The bucket model is intentionally simple so it's easy to extend — for example, a future `blocked` bucket for steps waiting on an external resource would only require adding one more `Set` and one more transition method.

## Context propagation

`RuntimeContext` is created once per run (`createRuntimeContext(plan.intent)`) and passed to every step's executor call:

- `context.get(skillId)` — read a previous step's output, or `undefined` if it hasn't produced one.
- `context.set(skillId, value)` — record a step's output (the Runtime calls this automatically after a successful step; step executors don't need to call it themselves).
- `context.has(skillId)` — check whether a skill has produced output yet.
- `context.toObject()` — a plain-object snapshot of every recorded output, keyed by skill ID.
- `context.intent` — the plan's original intent string, for step executors that want it.

Context is explicit and passed by reference through the call chain — there is no global or module-level state — which keeps propagation easy to reason about and makes the Runtime safe to run concurrently for independent plans.

## Retry handling

A `RetryPolicy` has:

```typescript
interface RetryPolicy {
  readonly maxRetries: number;
  delayForAttempt(attempt: number): number; // logical delay in ms, 1-indexed attempt
  shouldRetry?(error: unknown, attempt: number): boolean; // optional, defaults to always retry
}
```

Three built-in policies (`runtime-retry.ts`):

| Policy | Behavior |
|---|---|
| `noRetryPolicy()` | `maxRetries: 0` — fail on the first error. This is the default when no policy is supplied. |
| `fixedRetryPolicy({ maxRetries, delayMs? })` | Retries up to `maxRetries` times with a constant logical delay. |
| `exponentialRetryPolicy({ maxRetries, baseDelayMs?, maxDelayMs? })` | Retries with `delay = baseDelayMs * 2^(attempt - 1)`, capped at `maxDelayMs`. |

**The Runtime never actually sleeps.** `delayForAttempt` returns a number that's recorded on the `step-retry` event and trace entry — real waiting would make execution non-deterministic and slow down tests. Callers that need real backoff (for example, a step executor calling a rate-limited API) can read the recorded delay and implement their own wait inside the `StepExecutorFn`, or wrap the Runtime with their own scheduler.

`shouldRetry(error, attempt)` lets a policy decline to retry specific errors (for example, a validation error that will never succeed on retry) even if `maxRetries` hasn't been reached.

## Failure handling

When a step exhausts its retries, the Runtime builds a `RuntimeError` (`runtime-errors.ts`) with:

- `code` — currently `STEP_EXECUTION_FAILED` (reserved: `STEP_DEPENDENCY_FAILED`, `STEP_DEPENDENCY_SKIPPED` for future use by callers that want to raise those explicitly)
- `skillId` — which step failed
- `attempt` — which attempt it failed on
- `cause` — a normalized, human-readable description of whatever the step executor threw (works for `Error` instances, strings, and arbitrary thrown values)

`RuntimeError.toInfo()` converts this into a plain `RuntimeErrorInfo` object, which is what actually appears on `StepResult.error` and `TraceEntry.error` — this keeps `WorkflowResult` fully JSON-serializable (an `Error` instance would not survive `JSON.stringify`/`JSON.parse`).

By default (`stopOnFailure: true`), a step failure halts the workflow: every remaining pending step is marked `skipped`. With `stopOnFailure: false`, only steps that depend (directly or transitively, since a skipped step also blocks its own dependents) on the failed step are skipped — independent steps still run to completion.

## Execution events

Every event (`RuntimeEvent`) has a monotonically increasing `order` (a logical clock assigned by `EventDispatcher`), not a wall-clock timestamp — this is what makes two runs of the same plan against the same executor produce identical event streams.

| Event type | When |
|---|---|
| `workflow-started` | Once, before the first step. |
| `step-started` | Before a step's first attempt. |
| `step-retry` | After a failed attempt that will be retried. |
| `step-completed` | After a step succeeds. |
| `step-failed` | After a step exhausts its retries. |
| `step-skipped` | When a step is skipped (dependency failed/skipped, or the workflow stopped early). |
| `workflow-completed` | Once, if no step failed. |
| `workflow-failed` | Once, if any step failed. |

Pass `onEvent` in `RuntimeOptions` to observe events as they happen (for progress UIs, logging, and so on); `WorkflowResult.events` also contains the full ordered list after the run finishes.

## Execution tracing

`WorkflowResult.trace` is an array of `TraceEntry`, one per event, each carrying:

- `order`, `type`, `skillId?`, `attempt?` — mirrors the corresponding event
- `state` — a full `RuntimeStateSnapshot` immediately after that event was applied
- `result?` — the step's output, present on `step-completed` entries
- `error?` — the structured `RuntimeErrorInfo`, present on `step-failed` entries

Because entries are keyed off the same logical clock as events, and because `Set` iteration in `RuntimeStateTracker` preserves insertion order, a trace is fully deterministic and reproducible: replaying it reconstructs exactly what happened, in what order, without needing wall-clock timestamps.

## Extension points

- **New retry strategies** — implement the `RetryPolicy` interface (`runtime-retry.ts`) and pass it via `RuntimeOptions.retryPolicy`. No changes to `runtime.ts` are needed.
- **New state buckets** — add a bucket to `RuntimeStateTracker` (`runtime-state.ts`) and a transition method; `RuntimeStateSnapshot` in `types.ts` would need the matching field.
- **New event/trace consumers** — subscribe via `RuntimeOptions.onEvent`, or post-process `WorkflowResult.trace`/`.events` after a run. Both are plain data, so they work equally well for logging, persistence, or replay tooling.
- **Real step execution** — implement a `StepExecutorFn` that loads a skill's `SKILL.md`, builds a prompt from `context`, calls a model, and returns its output. `src/execute-plan.ts` ships a stub executor as a CLI demonstration; production integrations should replace it.

## CLI

```bash
bun run execute "<user intent>"
```

Generates a plan for the given intent via the Planner, runs it through the Runtime using a stub step executor (for demonstration — it does not call a model), prints step results and events, and writes the full `WorkflowResult` to `execution-result.json`.

## Testing

`test/runtime.test.ts` covers:

- Successful execution and exact step ordering
- Deterministic output across repeated runs of the same plan
- Context propagation between steps, including `context.toObject()` and `context.intent`
- Retry behavior: eventual success, exhausted retries, no-retry default, `shouldRetry`, and deterministic backoff values
- Failure handling: default stop-on-failure, dependency-based skipping with `stopOnFailure: false`, and structured/serializable errors
- State transitions and the final state snapshot
- Event ordering, the `onEvent` callback, and `workflow-failed` vs `workflow-completed`
- Trace generation, including recorded results/errors and state-at-event correctness
- The `WorkflowExecutor` class with async step executors, and an empty-plan edge case

Run with:

```bash
bun run test
```
