# Hiring a Senior Backend Engineer, req to signed offer

## Context

You are a technical recruiter opening a Senior Backend Engineer requisition
for a Series B SaaS company. The hiring manager has a rough idea of the role
but no written job description, no interview plan, and no compensation
range confirmed yet. You need to run the full lifecycle — write the role,
source and screen, interview, and land an accepted offer — using a
different skill for each stage.

**Skills used, in order:** `hr-job-description` → `hr-recruiting` →
`hr-interviewing` → `hr-offer-management`

This is the same shape of workflow the [Skill Planner](../../docs/planner.md)
produces automatically from a single intent like *"hire a senior backend
engineer"* — see
[`../planner-runtime/from-intent-to-execution.md`](../planner-runtime/from-intent-to-execution.md)
for the programmatic version of this exact scenario.

## Step 1 — Write the job description (`hr-job-description`)

**Sample prompt:**

> "Write a complete job description for a Senior Backend Engineer at a
> Series B SaaS company. The team owns a Node.js/Postgres platform and is
> moving toward event-driven services."

**Expected skill support:**

- Draft role summary, responsibilities, and outcomes framed around impact, not task lists
- Separate must-have from nice-to-have requirements
- Flag inclusive-language issues (gendered phrasing, inflated requirement lists)
- Suggest a leveling check against internal job architecture, if one exists

**Generated excerpt:**

```text
Role summary
Own backend services for our core billing and usage platform, working
across Node.js and Postgres, with a mandate to help the team migrate
toward event-driven architecture over the next 12 months.

Must-have
- 5+ years building and operating production backend services
- Strong experience with relational databases and service boundaries
- Track record of mentoring engineers or leading technical initiatives

Nice-to-have
- Experience with event-driven or message-queue architectures
- Exposure to billing, metering, or usage-based pricing systems
```

## Step 2 — Build the hiring plan and source candidates (`hr-recruiting`)

**Sample prompt:**

> "Using this job description, build a hiring plan and a sourcing message
> for passive senior backend candidates."

**Expected skill support:**

- Turn the job description into an intake summary and scorecard-ready criteria
- Define interview stages (recruiter screen, technical screen, onsite loop, debrief)
- Draft a sourcing outreach message tailored to passive candidates
- Set screening questions that map directly to the must-have criteria from Step 1

**Generated hiring plan excerpt:**

| Stage | Purpose | Owner |
| --- | --- | --- |
| Recruiter screen | Confirm motivation, comp expectations, logistics | Recruiter |
| Technical screen | Validate must-have technical criteria | Engineering lead |
| Onsite loop | Deep-dive system design, coding, collaboration | Panel |
| Debrief | Evidence-based hire/no-hire decision | Hiring manager |

## Step 3 — Build interview questions and scorecards (`hr-interviewing`)

**Sample prompt:**

> "Create structured interview questions and a scorecard for the technical
> screen and system design round, based on the must-have criteria."

**Expected skill support:**

- Generate competency-based and behavioral (STAR) questions tied to each must-have
- Produce a system design prompt scoped to the team's actual domain (billing/usage)
- Build a scorecard with strong-evidence and concern-signal anchors per competency
- Keep questions role- and level-appropriate for a senior IC, not a manager

**Generated scorecard excerpt:**

| Competency | Strong evidence | Concern signal |
| --- | --- | --- |
| Service ownership | Describes owning a service end to end, including on-call and incident response | Only describes writing code, not operating it |
| System design | Reasons about trade-offs (consistency, latency, cost) explicitly | Jumps to a single solution without exploring alternatives |
| Mentorship | Gives concrete examples of unblocking or growing other engineers | Vague claims of "helping the team" |

## Step 4 — Build and negotiate the offer (`hr-offer-management`)

**Sample prompt:**

> "The panel wants to hire this candidate. Build an offer package aligned
> to our salary bands and prepare the hiring manager for a negotiation
> conversation about a competing offer."

**Expected skill support:**

- Assemble an offer package (base, equity, sign-on, start date) checked against the internal band
- Flag internal equity risks against current team members at the same level
- Draft talking points for the hiring manager if the candidate has a competing offer
- Provide an approval checklist before the offer goes out

**Generated negotiation talking points excerpt:**

```text
1. Reaffirm why this role and team fit the candidate's stated goals.
2. Ask directly what would make this the clear choice — comp, scope, or timeline.
3. If comp is the gap, confirm how much room exists in the band before
   escalating for an exception.
4. Set a specific decision date instead of leaving it open-ended.
```

## Summary

Each stage used a different skill, but the outputs chained together:
the must-have criteria from `hr-job-description` became the scorecard
anchors in `hr-interviewing`, and the hiring plan from `hr-recruiting`
determined when `hr-offer-management` was invoked. This is the pattern to
reuse for any multi-stage hiring workflow — carry forward the specific
criteria and decisions from each step instead of re-deriving them.

## Adaptation notes

Replace the role, tech stack, and band references with your organization's
real values. Compensation bands, equity structures, and approval workflows
vary by company and jurisdiction — use the offer output as preparation for
review by compensation or legal, not as a final offer letter.
