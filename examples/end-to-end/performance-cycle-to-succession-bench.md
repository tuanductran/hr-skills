# Performance cycle to succession bench

## Context

Annual performance reviews just closed. An HR Business Partner needs to
turn review outcomes into an updated succession bench for critical roles,
then translate that into individual development plans for the people
identified as ready-now or ready-in-two-years successors.

**Skills used, in order:** `hr-performance-review` → `hr-succession-planning`
→ `hr-career-development`

## Step 1 — Synthesize review outcomes (`hr-performance-review`)

**Sample prompt:**

> "I have completed performance reviews for a 12-person engineering
> leadership team. Help me identify who is showing sustained high
> performance and readiness for broader scope, based on review evidence."

**Expected skill support:**

- Push for evidence-based criteria (specific outcomes, not rating inflation) when identifying high performers
- Distinguish "excelling in current role" from "ready for expanded scope" — these are not the same signal
- Flag where review data alone is insufficient and other inputs (peer feedback, potential assessment) are needed
- Avoid recency bias — ask about sustained performance across the cycle, not just the last quarter

**Generated synthesis excerpt:**

```text
Sustained high performance with scope-readiness signals: 3 of 12
- Consistently exceeded outcomes across 2+ review cycles
- Evidence of leading beyond their formal role (cross-team initiatives,
  mentoring, representing the team in leadership forums)

Strong performer, scope-readiness unclear: 4 of 12
- Reliable delivery, but review evidence doesn't yet show leadership
  beyond their current scope — needs a stretch assignment to assess.
```

## Step 2 — Update the succession bench (`hr-succession-planning`)

**Sample prompt:**

> "Using this performance synthesis, help me update the succession bench
> for the Engineering Director role and identify coverage gaps."

**Expected skill support:**

- Map the performance synthesis onto a 9-box or readiness framework (ready-now, ready-in-2-years, development-needed)
- Identify single points of failure — critical roles with no viable internal successor
- Prepare talking points for a calibration session with senior leadership
- Distinguish succession planning from a performance ranking exercise — readiness is about the target role, not just current-role excellence

**Generated bench excerpt:**

| Candidate | Readiness | Gap to close |
| --- | --- | --- |
| Person A | Ready now | None significant — validate with a leadership panel |
| Person B | Ready in ~2 years | Needs P&L or budget-owning experience |
| Engineering Director role overall | 1 ready-now, 1 ready-later | Single point of failure until Person B is developed |

## Step 3 — Build individual development plans (`hr-career-development`)

**Sample prompt:**

> "Build an individual development plan for Person B to close the gap
> identified in the succession review, with a two-year horizon."

**Expected skill support:**

- Translate the specific gap ("P&L or budget-owning experience") into concrete development actions, not generic training
- Sequence stretch assignments, mentoring, and formal learning against the two-year horizon
- Draft a career conversation guide the manager can use to align expectations with the employee
- Flag that the employee should be part of shaping their own plan, not just receiving it

**Generated development plan excerpt:**

```text
Year 1: Own budget planning for one sub-team as a stretch assignment,
         paired with a mentor who has run a full P&L.
Year 1 (Q3-Q4): Represent engineering in one cross-functional budget
         review with finance leadership.
Year 2: Take ownership of a full P&L for a product area, with the
         current director as executive sponsor.
```

## Summary

The readiness signal from Step 1's review synthesis fed directly into the
bench in Step 2, and the specific gap identified in the bench became the
development plan in Step 3. The throughline is the *gap*, not the person's
general performance rating — each step narrows from "who is strong" to
"what specifically stands between them and the target role."

## Adaptation notes

Replace roles, timelines, and readiness criteria with your organization's
real framework. Succession and development decisions often intersect with
compensation, promotion, and sometimes immigration or visa sponsorship
considerations — use this output as preparation for review with the
relevant internal stakeholders before communicating any plan to employees.
