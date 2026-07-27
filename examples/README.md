# Examples

Practical, production-oriented examples of AI agents using HR Skills — from a
single prompt against one skill up to a multi-skill workflow driven by the
[Skill Planner](../docs/planner.md) and [Workflow Runtime](../docs/runtime.md).

Use this directory to see what a real HR automation session looks like before
you install skills or wire up the planner and runtime yourself.

## How the examples are organized

| Directory | What it shows | Start here if... |
| --- | --- | --- |
| [`prompt-to-output/`](prompt-to-output/README.md) | Single-skill, single-prompt examples with expected output | You want to see one skill in action |
| [`end-to-end/`](end-to-end) | Realistic HR scenarios that chain several skills together, turn by turn | You want to see how skills compose into a full workflow |
| [`planner-runtime/`](planner-runtime) | How the same scenario is expressed as an `ExecutionPlan` and executed deterministically | You're building an agent and need programmatic orchestration, not just chat prompts |

## Two ways to use HR Skills

HR Skills supports two integration styles, and the examples are split to match:

1. **Conversational** — a person (or an agent acting on their behalf) loads
   one or more `SKILL.md` files into context and works through a scenario
   turn by turn. See `prompt-to-output/` and `end-to-end/`.
2. **Programmatic** — an agent calls `generateExecutionPlan()` to turn a
   natural-language intent into an ordered, explainable list of skills, then
   calls `executeWorkflow()` to run that plan with context propagation,
   retries, and a full execution trace. See `planner-runtime/`.

Both styles use the exact same skills — the planner and runtime don't
replace `SKILL.md` content, they orchestrate it.

## End-to-end scenarios

| Scenario | Skills involved | Docs |
| --- | --- | --- |
| Hiring a senior engineer, req to signed offer | `hr-job-description` → `hr-recruiting` → `hr-interviewing` → `hr-offer-management` | [`end-to-end/hiring-a-senior-engineer.md`](end-to-end/hiring-a-senior-engineer.md) |
| New hire to 90-day review | `hr-onboarding` → `hr-people-operations` → `hr-performance-review` | [`end-to-end/new-hire-to-90-day-review.md`](end-to-end/new-hire-to-90-day-review.md) |
| Performance cycle to succession bench | `hr-performance-review` → `hr-succession-planning` → `hr-career-development` | [`end-to-end/performance-cycle-to-succession-bench.md`](end-to-end/performance-cycle-to-succession-bench.md) |

## Planner + runtime integration

| Example | What it demonstrates |
| --- | --- |
| [`planner-runtime/from-intent-to-execution.md`](planner-runtime/from-intent-to-execution.md) | Turning one of the scenarios above into an `ExecutionPlan` with `bun src/generate-plan.ts`, then running it with `bun src/execute-plan.ts`, reading the resulting trace |

## Conventions used across these examples

- **Prompt → expected support, not prompt → verbatim output.** Skill output
  depends on the model and the organization's real context, so examples show
  the *shape* of a good response (what the skill should cover) rather than a
  fixed transcript to copy.
- **Placeholders stay explicit.** `[Role Title]`, `[Department]`, and similar
  placeholders are intentional — replace them with your organization's real
  values before using an example as-is.
- **Nothing here is legal, payroll, tax, benefits, immigration, or employee
  relations advice.** Every example is preparation for qualified internal or
  external review, consistent with the guidance in each skill's `SKILL.md`.

## Related docs

- [`SKILL.md`](../SKILL.md) — master router across all skills
- [`docs/skill-matrix.md`](../docs/skill-matrix.md) — full skill inventory and maturity
- [`docs/planner.md`](../docs/planner.md) — Skill Planner architecture
- [`docs/runtime.md`](../docs/runtime.md) — Workflow Runtime architecture
- [`docs/format.md`](../docs/format.md) — `SKILL.md` authoring format
