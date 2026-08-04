# Prompt → output examples

Every skill ships its own `examples/` directory with realistic HR scenarios,
sample prompts, and the output an agent should produce — see
[`docs/format.md`](../../docs/format.md) for the authoring format. This page
is a discoverability index into those, organized by workflow stage, so you
don't have to browse 146 skill folders to find a relevant one.

For examples that chain *multiple* skills together, see
[`../end-to-end/`](../end-to-end) instead — this page is single-skill,
single-prompt starting points.

## Talent acquisition

| Skill | Example |
| --- | --- |
| `hr-job-description` | [Rewriting a Head of Product job description](../../skills/hr-job-description/examples/rewriting-a-head-of-product-job-description.md) |
| `hr-recruiting` | [Plan a structured recruiting process](../../skills/hr-recruiting/examples/plan-structured-recruiting-process.md) · [Running an end-to-end hiring process](../../skills/hr-recruiting/examples/running-an-end-to-end-hiring-process.md) |
| `hr-interviewing` | [Building a structured, bias-aware interview panel for a PM role](../../skills/hr-interviewing/examples/building-a-structured-bias-aware-interview-panel-for-a-product-manager-role.md) |
| `hr-offer-management` | [Managing the offer closing workflow](../../skills/hr-offer-management/examples/managing-the-offer-closing-workflow.md) |

## Onboarding and operations

| Skill | Example |
| --- | --- |
| `hr-onboarding` | [Create a 30-60-90 day onboarding plan](../../skills/hr-onboarding/examples/create-30-60-90-day-onboarding-plan.md) · [Designing a new hire onboarding plan](../../skills/hr-onboarding/examples/designing-a-new-hire-onboarding-plan.md) |
| `hr-people-operations` | [Scaling onboarding and HRIS operations for a fast-growing company](../../skills/hr-people-operations/examples/scaling-onboarding-and-hris-operations-for-a-fast-growing-company.md) |

## Performance and growth

| Skill | Example |
| --- | --- |
| `hr-performance-review` | [Running a fair mid-year performance review cycle](../../skills/hr-performance-review/examples/running-a-fair-mid-year-performance-review-cycle.md) |
| `hr-succession-planning` | [Building a succession plan and leadership pipeline for a scaling tech company](../../skills/hr-succession-planning/examples/building-a-succession-plan-and-leadership-pipeline-for-a-scaling-technology-company.md) |
| `hr-career-development` | [Coaching a manager through a not-yet-promotion conversation](../../skills/hr-career-development/examples/coaching-a-manager-through-a-not-yet-promotion-conversation.md) |

## Finding more

Every skill's own `examples/` folder (`skills/<skill-name>/examples/`)
follows the same **Context → Sample workflow → Follow-up prompts →
Adaptation notes** structure. Check
[`docs/skill-matrix.md`](../../docs/skill-matrix.md) for the full inventory
of skills and their maturity tier, or start from
[`SKILL.md`](../../SKILL.md), the master router, if you're not sure which
skill fits your scenario.
