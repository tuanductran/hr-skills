# Advising a business leader on a team performance problem

## Context

You are an HR Business Partner supporting a 120-person Engineering division. The VP of Engineering has requested an urgent meeting and tells you: "My three senior engineering managers are all struggling. The teams are missing sprints, senior engineers are leaving, and two of the managers have gotten poor 360 feedback. I need you to fix this." You need to structure this as an HR consulting engagement — diagnose before prescribing — rather than jumping to a training program or a performance plan.

## Step 1 — Structure the problem before advising

**Sample prompt:**

> "A VP is telling me her managers are failing. She wants a fix immediately. How do I slow this down and make sure I diagnose before I prescribe?"

**Expected skill response:**

Before recommending anything, establish what you actually know:

**Questions to ask the VP in the first meeting:**

- What does "struggling" look like specifically — missed deadlines, team conflict, attrition, 360 feedback themes?
- How long has this been happening, and what changed before it started?
- Are all three managers struggling in the same way, or are the problems different across each one?
- What has the VP already tried?
- Is this a performance issue that has been discussed with the managers, or have they not received direct feedback?

**Framing for the VP:**

> "I want to help you solve this effectively, not just quickly. Before I recommend an approach, I'd like to spend 2-3 weeks doing a rapid diagnostic so we address root causes rather than symptoms. Can you give me access to the managers' 360 reports, sprint data, and attrition records for their teams?"

## Step 2 — Run a rapid diagnostic

**Sample prompt:**

> "Help me design a 3-week diagnostic sprint to understand why three Engineering managers are underperforming."

**Generated diagnostic plan:**

| Week | Activity | Data collected |
|---|---|---|
| Week 1 | Review 360 feedback reports for all three managers; review attrition data by team; review sprint completion rates for the past 3 months | Themes in feedback; attrition patterns; performance trends |
| Week 2 | 1:1 interviews with each manager (30 min each); 1:1 interviews with 2-3 senior engineers per team | Manager self-assessment; team perspective; structural vs behavioral issues |
| Week 3 | Stakeholder interview with VP of Engineering; cross-check findings across sources | VP perspective; alignment on priorities |

**Key diagnostic questions for manager interviews:**

- What are the biggest challenges in your role right now?
- What support or resources do you feel you're missing?
- How clear are you on what success looks like for your team this quarter?
- What feedback have you received from your skip-level or 360, and how did you respond to it?
- What's driving the attrition on your team, from your perspective?

## Step 3 — Identify the root causes

**Sample prompt:**

> "After running the diagnostic, I found that all three managers received poor 360 feedback on 'communication' and 'giving feedback.' But one manager also has a structural problem — her team doubled in size in 6 months. How do I separate the people development issue from the structural issue?"

**Expected skill response:**

Distinguish between three categories:

**1. Skill gap (addressable through development):**

- All three managers receive low scores on giving feedback and clear communication in their 360s
- This is a consistent pattern that points to a shared capability need

**2. Structural problem (addressable through org design or resourcing):**

- Manager A's team doubled in 6 months without a senior tech lead or additional headcount
- Her performance decline correlates with the resizing, not a pattern of poor management
- This is a role design problem, not a people problem

**3. Performance problem (addressable through direct management):**

- If a manager has received direct feedback, coaching, and development support, and performance has not improved, this may be a fit or capability ceiling issue

**Recommendation framing for the VP:**

> "Two of the three managers have a real development need — they would benefit from structured coaching on feedback and communication. One of the three is actually dealing with an under-resourced team structure. I'd recommend we address those differently. Lumping all three together would miss the actual problem for one of them."

## Step 4 — Build the recommendation

**Sample prompt:**

> "Help me structure my recommendation to the VP in a consulting-style brief she can act on."

**Generated recommendation brief:**

```text
ENGINEERING MANAGER EFFECTIVENESS — HR ADVISORY BRIEF

Prepared by: [HR Business Partner]
For: VP of Engineering
Date: [Date]

─────────────────────────────────────────
SITUATION
─────────────────────────────────────────
Three Engineering managers are showing signs of underperformance across
sprint delivery, team attrition, and 360 feedback scores. This is occurring
simultaneously, suggesting both shared and individual root causes.

─────────────────────────────────────────
DIAGNOSTIC FINDINGS
─────────────────────────────────────────
Shared root cause (all 3 managers):
  Low scores on giving direct feedback and team communication
  No structured manager development has occurred in the past 18 months

Individual root cause (Manager A only):
  Team doubled from 8 to 16 engineers in 6 months
  No additional tech lead or staffing support was added
  Performance decline correlates directly with the team scaling event

─────────────────────────────────────────
RECOMMENDATIONS
─────────────────────────────────────────
For all 3 managers:
  1. Structured coaching with external executive coach — 6-session engagement
  2. Peer learning cohort with 3-4 Engineering managers from other divisions
  3. Clear 90-day performance expectations set by VP with HR support

For Manager A specifically:
  1. Add a Staff Engineer as technical lead to reduce management span complexity
  2. Defer performance expectations during a 60-day stabilization period
  3. Reassess at 60 days before drawing performance-based conclusions

─────────────────────────────────────────
DECISION NEEDED
─────────────────────────────────────────
[ ] Approve coaching investment for 3 managers (estimated cost: $X)
[ ] Approve Staff Engineer headcount for Manager A's team
[ ] Approve 90-day structured improvement timeline with defined checkpoints

─────────────────────────────────────────
RISK IF NO ACTION IS TAKEN
─────────────────────────────────────────
At current attrition rates, Manager A's team is on track to lose 2-3 more
senior engineers in Q4, representing approximately $X in replacement cost
and 6-9 months of productivity impact per departure.
```

## Step 5 — Maintain the consulting posture

**Sample prompt:**

> "The VP pushed back and said she just wants me to put all three on PIPs. How do I hold the advisory stance without caving?"

**Skill response — holding the consulting posture:**

> "I understand the urgency, and I want to act on this too. A PIP is the right tool when there's a documented pattern of performance issues, direct feedback has been given, and development support has been offered without improvement. Right now, we haven't established that for all three managers — and using PIPs without that groundwork creates legal exposure and would almost certainly cause them to resign before we know if they could have improved.
> What I'm recommending is faster than it sounds — 90 days with structured coaching and clear expectations, not an open-ended development journey. If there's no improvement at the 90-day mark, we move to a formal performance process with full documentation. Can you give me 90 days to do this right?"

## Summary

Use `hr-consulting` to structure people problems as diagnostic engagements before recommending solutions, translate findings into business-language recommendations leaders can act on, and maintain a credible advisory posture even when stakeholders are pushing for quick fixes.
