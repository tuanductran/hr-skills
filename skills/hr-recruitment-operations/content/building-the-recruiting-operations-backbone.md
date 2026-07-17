# Building the Recruiting Operations Backbone

## Overview

Recruitment operations is the infrastructure layer beneath TA strategy — requisition workflows, ATS configuration, SLAs, and reporting — and it's frequently under-invested relative to sourcing and employer branding, despite being where a large share of process friction actually lives. A recruiter working around a broken requisition approval process or an inconsistently configured ATS loses time to friction that has nothing to do with finding or engaging candidates.

## Designing the Requisition Workflow

The requisition process is often the first point of friction in a hiring cycle, well before any candidate is involved:

- **Map the current approval chain explicitly** — count the actual number of approvers and average turnaround per step, since most organizations underestimate this until it's documented
- **Differentiate approval paths by requisition type** — a backfill for an already-budgeted role shouldn't require the same approval depth as a new headcount request; applying uniform heavy process to both slows down the majority of routine cases
- **Require a complete requisition brief before opening a search** — role scope, compensation band, and must-have criteria agreed with the hiring manager up front prevents the far more costly problem of requirement drift mid-search

## Configuring the ATS

ATS configuration is where recruiting operations most directly shapes both recruiter efficiency and candidate experience:

- Design pipeline stages to reflect actual decision points, not an arbitrary number of steps — too many stages creates administrative overhead without adding decision value; too few obscures where candidates are actually getting stuck
- Standardize stage definitions across teams so reporting is comparable — if one team's "phone screen" stage means something different from another's, aggregate funnel metrics become meaningless
- Automate the notifications and status updates that reduce candidate-facing delay (application receipt, stage transition, rejection), since manual handling of these at volume is a common source of the response-time gaps that damage candidate experience

## Setting and Enforcing SLAs

SLAs create accountability for the parts of the process most prone to silent delay:

| SLA type | Typical target range | Why it matters |
|---|---|---|
| Requisition approval | 2–5 business days | First point of delay before any recruiting activity begins |
| Initial candidate response | 2–3 business days | Longest silent gaps drive the most candidate drop-off |
| Interview feedback submission | 24–48 hours post-interview | Delayed feedback slows every downstream decision |
| Offer approval | 1–3 business days | Directly affects competitive offer timing |

Set targets based on this organization's actual baseline data, not industry benchmarks alone — a target set without reference to current performance either sets an unrealistic bar or fails to drive improvement from an already-slow baseline. Track adherence by team and stage, and treat a consistently missed SLA as a process signal, not an individual performance issue.

## Reporting and Governance

- Build a recurring reporting cadence (weekly operational, monthly strategic) rather than ad hoc reporting only when leadership asks — this makes bottlenecks visible before they become escalations
- Report funnel metrics by stage and by role type, not just aggregate time-to-fill, which masks where the actual friction lives
- Establish a clear escalation path for stalled requisitions — a requisition open significantly longer than the typical cycle for its role type should trigger a defined review, not just continued waiting

## Process Auditing

Periodically audit the end-to-end process for bottlenecks rather than only reacting to individual complaints:

- Walk a sample of recently closed requisitions stage by stage, comparing actual elapsed time against SLA targets at each step
- Interview recruiters and hiring managers directly about where they experience the most friction — this frequently surfaces workarounds and informal process deviations that dashboards alone don't show
- Revisit ATS configuration and requisition workflow at least annually, since both tend to accumulate unused stages, redundant approvals, and outdated fields over time without a deliberate cleanup

## Common Pitfalls

- **Building elaborate reporting without first fixing the underlying process** the reporting is meant to monitor — dashboards don't fix bottlenecks by themselves.
- **Applying identical SLAs and approval depth to fundamentally different requisition types**, which slows the common case to accommodate the exception.
- **Letting ATS configuration drift unmanaged** as new stages and fields get added ad hoc without anyone responsible for periodic cleanup.
