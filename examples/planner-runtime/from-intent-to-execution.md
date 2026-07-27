# From intent to execution: planning and running a hiring workflow

## Context

[`../end-to-end/hiring-a-senior-engineer.md`](../end-to-end/hiring-a-senior-engineer.md)
walks the "hire a senior backend engineer" scenario turn by turn, as a
person would run it in chat. This example shows the same scenario
expressed programmatically: one natural-language intent goes into the
[Skill Planner](../../docs/planner.md), which produces an explainable
`ExecutionPlan`, and that plan is executed by the
[Workflow Runtime](../../docs/runtime.md).

This is the integration path for an agent that needs to decide *which*
skills to load and *in what order*, rather than a person manually choosing
`hr-job-description`, then `hr-recruiting`, then `hr-interviewing`.

## Step 1 — Generate a plan from intent

```bash
bun src/generate-plan.ts "hire a senior backend engineer: write the job description, run interviews, and prepare an offer"
```

The Planner (`packages/hr-skills-build/src/planner.ts`) splits this intent
into capabilities, matches each one against `registry/skills.json` using
Jaccard similarity, selects skills, and orders them with a topological
sort. The shape of the result — illustrating the documented
`ExecutionPlan` interface from [`docs/planner.md`](../../docs/planner.md)
— looks like this:

```json
{
  "intent": "hire a senior backend engineer: write the job description, run interviews, and prepare an offer",
  "requestedCapabilities": [
    "write the job description",
    "run interviews",
    "prepare an offer"
  ],
  "steps": [
    {
      "skillId": "hr-job-description",
      "order": 1,
      "reason": "direct-capability-match",
      "rationale": "Matched \"write the job description\" against hr-job-description's declared capability \"Writing complete job descriptions\"",
      "dependencies": []
    },
    {
      "skillId": "hr-recruiting",
      "order": 2,
      "reason": "domain-expert",
      "rationale": "Recruiting workflow expertise for sourcing and screening ahead of interviews",
      "dependencies": []
    },
    {
      "skillId": "hr-interviewing",
      "order": 3,
      "reason": "direct-capability-match",
      "rationale": "Matched \"run interviews\" against hr-interviewing's declared capability \"Generating structured interview questions for any role and seniority\"",
      "dependencies": []
    },
    {
      "skillId": "hr-offer-management",
      "order": 4,
      "reason": "direct-capability-match",
      "rationale": "Matched \"prepare an offer\" against hr-offer-management's declared capability \"Building offer packages that align with salary bands and internal equity\"",
      "dependencies": []
    }
  ],
  "complexity": "moderate"
}
```

Every step's `reason` and `rationale` explain *why* that skill was
selected — this is what makes the plan auditable before anything executes.
The CLI also writes the full plan to `execution-plan.json` and reports any
`validateExecutionPlan()` issues (duplicate steps, dangling references,
dependency violations) before you act on it.

## Step 2 — Execute the plan

```bash
bun src/execute-plan.ts "hire a senior backend engineer: write the job description, run interviews, and prepare an offer"
```

`execute-plan.ts` regenerates the same plan and runs it through
`executeWorkflow()` with a stub step executor — useful for smoke-testing
sequencing, retries, and tracing before wiring in a real executor. A
production integration replaces the stub with a `StepExecutorFn` that
actually loads each skill's `SKILL.md`, builds a prompt from
`context.toObject()` (the outputs of earlier steps), and calls a model:

```typescript
import { executeWorkflow } from './runtime.js';
import { generateExecutionPlan } from './planner.js';
import { buildRegistry } from './registry.js';

const registry = await buildRegistry();
const plan = generateExecutionPlan(
  'hire a senior backend engineer: write the job description, run interviews, and prepare an offer',
  registry,
);

const result = await executeWorkflow(plan, async (step, context) => {
  // context.get('hr-job-description') is available by the time this
  // step runs for hr-recruiting, hr-interviewing, or hr-offer-management —
  // this is how the must-have criteria from Step 1 of the chat-based
  // example reaches the interview scorecard in Step 3 automatically.
  const skillContent = await loadSkill(step.skillId);
  return await callModel(skillContent, context.toObject());
});

console.log(result.status);   // 'completed' | 'failed'
console.log(result.outputs);  // { 'hr-job-description': ..., 'hr-recruiting': ..., ... }
```

## Step 3 — Read the trace

`result.trace` and `result.events` give a deterministic, replayable record
of the run — illustrating the shape documented in
[`docs/runtime.md`](../../docs/runtime.md):

```json
[
  { "order": 0, "type": "workflow-started" },
  { "order": 1, "type": "step-started", "skillId": "hr-job-description" },
  { "order": 2, "type": "step-completed", "skillId": "hr-job-description" },
  { "order": 3, "type": "step-started", "skillId": "hr-recruiting" },
  { "order": 4, "type": "step-completed", "skillId": "hr-recruiting" },
  { "order": 5, "type": "step-started", "skillId": "hr-interviewing" },
  { "order": 6, "type": "step-completed", "skillId": "hr-interviewing" },
  { "order": 7, "type": "step-started", "skillId": "hr-offer-management" },
  { "order": 8, "type": "step-completed", "skillId": "hr-offer-management" },
  { "order": 9, "type": "workflow-completed" }
]
```

If a step fails (for example, the model call for `hr-interviewing`
errors out), the default `stopOnFailure: true` behavior marks
`hr-offer-management` as `skipped` rather than running it against
incomplete context — the same dependency-aware caution a person would
apply manually by not sending an offer before interviews are done.

## Why this matters

The chat-based example and this one are not two different workflows —
they're two front ends for the same skills. The Planner's job is exactly
what a person does implicitly when choosing which `SKILL.md` to load next;
the Runtime's job is exactly what a person does implicitly when copying
one step's output into the next prompt. Building an agent on top of
`generateExecutionPlan()` and `executeWorkflow()` makes both of those
decisions explicit, explainable, and testable instead of ad hoc.

## Adaptation notes

The JSON above illustrates the documented interfaces and is not a
recorded run — actual `order` values, matched skills, and rationale text
depend on the current `registry/skills.json` and the exact intent string.
Run the commands above against your checkout to see the real output, and
see [`docs/planner.md`](../../docs/planner.md) and
[`docs/runtime.md`](../../docs/runtime.md) for the full type definitions.
