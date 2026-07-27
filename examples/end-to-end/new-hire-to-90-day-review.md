# New hire to 90-day review

## Context

A Product Manager accepted an offer and starts in two weeks. You need to
take them from signed offer through a structured first 90 days, then run a
fair, evidence-based 90-day review — using a different skill for onboarding
logistics, day-to-day HR operations, and the review itself.

**Skills used, in order:** `hr-onboarding` → `hr-people-operations` →
`hr-performance-review`

## Step 1 — Build the 30-60-90 day plan (`hr-onboarding`)

**Sample prompt:**

> "Build a 30-60-90 day onboarding plan for a Product Manager joining a
> cross-functional team, including manager check-in prompts."

**Expected skill support:**

- Map first-week logistics, access needs, and stakeholder introductions
- Set outcome-based milestones for day 30, 60, and 90 (not just task lists)
- Draft manager check-in questions for each milestone
- Flag what needs confirming with IT, facilities, or the hiring manager before day one

**Generated milestone excerpt:**

```text
Day 30: Understands the product, current roadmap, and key stakeholders.
         Has shipped one small, low-risk change to build momentum.
Day 60: Owns a defined piece of the roadmap. Runs stakeholder syncs
         independently. Has given and received feedback in at least
         one cross-functional review.
Day 90: Operating at full capacity for the role. Manager can point to
         a specific decision or initiative the PM led independently.
```

## Step 2 — Handle onboarding operations and records (`hr-people-operations`)

**Sample prompt:**

> "This new hire's onboarding plan is set. What people-ops steps do I need
> to run in parallel — records, systems access, policy acknowledgments,
> and payroll setup — and in what order?"

**Expected skill support:**

- Sequence records creation, systems provisioning, and compliance acknowledgments against the onboarding plan's day-one requirements
- Identify which steps are blocking (must happen before day one) versus can trail into week one
- Flag data accuracy and record-integrity checks (correct legal name, start date, cost center) before payroll processing
- Note points where IT, payroll, or facilities own the action, not HR directly

**Generated sequencing excerpt:**

| Step | Owner | Timing |
| --- | --- | --- |
| Confirm legal name, start date, cost center in HRIS | HR ops | Before offer countersigned |
| Provision systems access and equipment | IT | 3 business days before start |
| Payroll and benefits enrollment | Payroll/Benefits | Day one, deadline day five |
| Policy acknowledgments (handbook, security, code of conduct) | HR ops | Day one |

## Step 3 — Run the 90-day review (`hr-performance-review`)

**Sample prompt:**

> "It's day 90. Using the milestones from the onboarding plan, help the
> manager write a balanced 90-day review and prep for the conversation."

**Expected skill support:**

- Turn the day-90 milestone from Step 1 into concrete review criteria instead of generic performance language
- Draft a balanced review that separates observed evidence from manager opinion
- Prepare talking points for both a strong-progress and a needs-support scenario
- Suggest what to document if the review surfaces a fit or performance concern

**Generated review excerpt:**

```text
Progress against day-90 milestone: Independently led the redesign of the
onboarding checkout flow, coordinating design, engineering, and support
without escalation. Roadmap ownership is on track.

Strengths observed: Clear written communication in stakeholder updates;
proactively flagged a scope risk in week 7 before it became a blocker.

Growth areas: Still relies on the manager to broker cross-team
prioritization conflicts — expected to handle more of this independently
by day 120.
```

## Summary

The onboarding milestones set in Step 1 became the review criteria in
Step 3, and Step 2 made sure nothing administrative blocked the new hire
from actually reaching those milestones. Carrying the day-90 milestone
language forward — rather than writing a generic review from scratch — is
what keeps the review evidence-based instead of impressionistic.

## Adaptation notes

Replace the role, timeline, and milestone language with your organization's
real onboarding structure. Where a review surfaces a performance or fit
concern, treat the skill's output as preparation for review with HR
business partners or legal before any formal action is taken.
