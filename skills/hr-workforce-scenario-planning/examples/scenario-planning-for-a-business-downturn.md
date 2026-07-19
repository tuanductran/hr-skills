# Workforce scenario planning for a potential business downturn

## Context

You are the Chief People Officer at a 400-person technology company. Revenue growth has slowed from 40% to 12% year-over-year, and the CFO has flagged a possible revenue miss in Q3. The executive team wants a workforce scenario plan that prepares the company to respond quickly if conditions deteriorate further — without committing to action that may not be needed.

You have six weeks to deliver a scenario plan before the board strategy review.

## Step 1 — Define the scenario set

**Sample prompt:**

> "Our revenue growth has slowed significantly. Build three workforce scenarios for the next 18 months — base, moderate downside, and severe downside — with the key assumptions and headcount implications for each."

**Expected skill response:**

- Define distinct assumption sets for each scenario, not just growth rate adjustments.
- Show headcount implications by function with a current headcount baseline.
- Flag which scenario assumptions are most uncertain and most likely to drive the outcome.

**Generated scenario summary:**

| | Base scenario | Moderate downside | Severe downside |
|---|---|---|---|
| **Revenue growth assumption** | 15% (recovers in Q4) | 5% (flat year) | −10% (revenue contraction) |
| **Hiring posture** | Selective hiring in priority roles | Freeze all non-critical roles | Freeze all; evaluate restructuring |
| **Net headcount change (Year 1)** | +18 | −5 (attrition only) | −40 (restructuring required) |
| **Key trigger** | Q3 revenue in line with plan | Q3 miss > 10% of plan | Q3 miss > 20%; Q4 pipeline < 1.5x |
| **Workforce cost change** | +4% | −1% | −12% |

## Step 2 — Identify trigger points

**Sample prompt:**

> "Define specific, observable trigger points for moving from the base scenario to each downside scenario. We want to know in real time which scenario we are in, not discover it six weeks later."

**Generated trigger point definitions:**

```text
Base → Moderate downside
- Q3 revenue misses plan by 10% or more.
- Sales pipeline coverage ratio drops below 2x for two consecutive months.
- Net Revenue Retention falls below 95%.

Action on trigger: Activate Moderate Downside pre-planned actions within 5 business days.

Moderate downside → Severe downside
- Q3 revenue misses plan by 20% or more.
- Q4 pipeline coverage falls below 1.5x.
- Two or more enterprise customers give notice of churn or non-renewal.

Action on trigger: Escalate to Board. Activate Severe Downside planning within 10 business days.
```

## Step 3 — Pre-plan workforce actions for each scenario

**Sample prompt:**

> "For each scenario, pre-plan the workforce actions we would take within 30 days of the trigger firing. We want to move quickly without deliberating from scratch under pressure."

**Generated pre-planned actions:**

**Base scenario (ongoing):**
- Continue hiring for the [number] approved critical roles.
- No changes to L&D or benefits programs.
- Monthly pipeline and revenue monitoring against trigger thresholds.

**Moderate downside (trigger: Q3 miss > 10%):**
- Freeze all open requisitions not yet in final interview stage. Communicate to candidates within 5 business days.
- Pause all contingent and consulting spend not tied to revenue-generating work.
- Defer non-critical L&D and travel spend for 90 days.
- Begin redeployment review: identify employees in lower-priority roles who could shift to higher-priority work.
- No involuntary action in first 60 days; monitor Q4 pipeline before next decision point.

**Severe downside (trigger: Q3 miss > 20%):**
- All requisitions frozen immediately.
- Restructuring analysis begins within 10 days: identify role eliminations by function based on strategic priority.
- Redeployment first: offer affected employees moves to critical roles before any involuntary separation.
- Leadership communication plan prepared and ready for activation within 2 weeks of Board approval.
- Outplacement and severance packages pre-designed so execution is not delayed by design decisions.

## Step 4 — Model the cost impact

**Sample prompt:**

> "Model the workforce cost impact of each scenario over 18 months, showing: total payroll cost, hiring cost avoided or incurred, and severance cost if restructuring is required in the severe downside."

**Generated cost summary:**

| | Base | Moderate downside | Severe downside |
|---|---|---|---|
| Hiring plan cost (18 months) | +2.8M USD | 0 | 0 |
| Payroll change vs. current run rate | +4% | −1% | −12% |
| Contingent spend change | No change | −400K USD | −700K USD |
| Restructuring cost (severance) | — | — | ~1.5M USD (est.) |
| Net cost vs. base plan | — | −3.2M USD | −6.5M USD |

## Step 5 — Prepare the board brief

**Sample prompt:**

> "Write a one-page board brief presenting the three workforce scenarios, the trigger points, and the pre-planned actions. Frame it as a risk management update, not a cost-cutting announcement."

**Generated board brief:**

```text
Workforce Scenario Plan — Board Strategy Review

Purpose
This plan prepares the company to respond decisively to a range of revenue
outcomes without making irreversible workforce decisions prematurely.

Scenario summary
Three scenarios have been modeled for the next 18 months. The base scenario
assumes revenue recovery in Q4 and a net headcount increase of 18. The moderate
downside assumes a flat year with a hiring freeze and no involuntary action.
The severe downside assumes revenue contraction and a targeted restructuring
of approximately 40 roles.

Trigger-based decision model
Scenarios are linked to specific, observable business triggers so the company
moves from monitoring to action within 5 to 10 business days of a trigger
firing — not weeks later after extended deliberation.

Pre-planned actions
Detailed workforce actions have been designed for each scenario, including
communications, redeployment plans, and — for the severe downside —
restructuring analysis and outplacement readiness.

Board decisions requested
1. Approve the trigger-based decision model and the authority levels for
   activating each scenario.
2. Confirm that moderate downside actions can be activated by the CEO
   without a separate board vote.
3. Confirm that severe downside restructuring requires board notification
   before execution.
```

## Summary

Use `hr-workforce-scenario-planning` to prepare the organization to respond quickly and confidently to a range of business outcomes — building pre-planned actions and decision triggers before a crisis forces rushed decisions.

> Related skills: [`hr-strategic-workforce-planning`](../../hr-strategic-workforce-planning/SKILL.md) for the baseline workforce plan this scenario analysis stress-tests, [`hr-workforce-capability`](../../hr-workforce-capability/SKILL.md) for protecting critical capabilities during a downside scenario.
