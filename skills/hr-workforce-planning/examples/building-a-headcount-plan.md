# Building a headcount plan

## Context

You are an HR manager supporting annual planning for a 500-person company. Finance needs a headcount plan by department, executives want growth roles prioritized, and managers submitted requests that exceed budget by 25%. You need a structured plan that links roles to business outcomes.

## Step 1 — Clarify planning assumptions

**Sample prompt:**

> "Help me build an annual headcount plan when manager requests exceed budget by 25%."

**Expected skill response:**

- Start with business goals, revenue assumptions, productivity needs, and budget constraints.
- Separate replacement hiring, approved growth hiring, critical capability gaps, and speculative requests.
- Use prioritization criteria so leaders can make trade-offs transparently.
- Align timing with recruiting capacity, onboarding capacity, and payroll forecast.

## Step 2 — Create the request template

**Sample prompt:**

> "Create a headcount request template managers must complete before leadership review."

**Generated template:**

```text
Headcount request template

Role title:
Department:
Hiring manager:
Replacement or growth role:
Target start quarter:
Estimated compensation range:

Business outcome supported:
Critical work this role will own:
Impact if not approved:
Alternatives considered:
Required skills and level:
Dependencies with other teams:
Ramp time:
Budget owner:
```

## Step 3 — Prioritize requests

**Sample prompt:**

> "Create a prioritization scorecard for headcount requests."

**Generated scorecard:**

| Criterion | 1 point | 3 points | 5 points |
|---|---|---|---|
| Business impact | Helpful but not tied to a committed goal | Supports department goal | Required for company priority |
| Urgency | Can wait more than two quarters | Needed within two quarters | Needed this quarter |
| Risk if delayed | Minor inconvenience | Slower delivery or manager overload | Revenue, compliance, customer, or retention risk |
| Alternatives | Contractor, automation, or reprioritization likely works | Partial alternative exists | No credible alternative |
| Budget fit | Not funded | Partially funded | Fully funded or offset identified |

## Step 4 — Build the leadership summary

**Sample prompt:**

> "Write a leadership summary for a plan that approves 30 of 42 requested roles and defers lower-priority roles to midyear review."

**Generated summary:**

```text
Annual headcount plan summary

Managers requested 42 roles for the planning year. Based on budget, business priority, and recruiting capacity, the recommended plan approves 30 roles and defers 12 roles to midyear review.

Approved roles are concentrated in customer retention, product delivery, and compliance-critical operations. Deferred roles are important but have lower urgency, partial alternatives, or unclear timing.

Planning trade-offs:
1. Prioritize roles tied to committed revenue retention and product milestones.
2. Protect compliance and operational resilience roles.
3. Defer roles without clear start-quarter need or funded budget.
4. Reassess deferred roles at midyear based on business performance and attrition.
```

## Step 5 — Track execution

**Sample prompt:**

> "Create a monthly headcount plan review checklist."

**Generated checklist:**

- [ ] Approved roles match budget and workforce plan version.
- [ ] Open requisitions are assigned to recruiters.
- [ ] Start dates are reflected in payroll forecast.
- [ ] Backfills are separated from growth hiring.
- [ ] Deferred roles have documented review criteria.
- [ ] Attrition and internal mobility changes are reflected in the plan.
- [ ] Leaders review hiring capacity and onboarding constraints.

## Summary

Use `hr-workforce-planning` to convert competing role requests into a budget-aligned headcount plan with clear assumptions, prioritization, leadership trade-offs, and monthly tracking.
