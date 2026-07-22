# Building an HR tech stack for a scaling company

## Context

You are the Head of People Operations at a 350-person technology company that has grown from 50 to 350 employees in 18 months. HR currently runs on a combination of Workday (HRIS), three separate spreadsheets for headcount planning, a manual performance review process in Google Forms, and an ATS the recruiting team has outgrown. The CFO has approved a digital HR budget for the next fiscal year and wants a prioritized investment plan. You need to design a coherent HR tech stack strategy before evaluating any vendors.

## Step 1 — Audit the current state

**Sample prompt:**

> "We've scaled fast and our HR systems are a mess. Before I start evaluating new tools, how do I audit what we have and what we need?"

**Expected skill response:**

Map your current state across four dimensions before touching any vendor shortlist:

**1. System inventory:**

List every tool HR currently uses — even spreadsheets and Google Docs count as systems if people depend on them. Note: what it does, who uses it, and what breaks when it doesn't work.

**2. Process gaps:**

For each core HR process, answer: Is this process working well? Is it painful because of the tool, or because the process itself is broken? A bad process automated is still a bad process.

**3. Data quality:**

Where does your employee data live, and is it accurate? A new HRIS built on dirty data will fail. Data cleanup is almost always the hidden work in any digital HR project.

**4. Employee and manager pain points:**

Ask HR business partners: what questions do managers ask HR that they should be able to answer themselves? Ask employees: what HR interactions feel slow, confusing, or require more steps than they should?

## Step 2 — Design the target stack architecture

**Sample prompt:**

> "Help me design the right HR tech stack for a 350-person tech company that needs to scale to 800 in the next 2 years."

**Generated stack architecture:**

| Layer | Function | What it covers |
|---|---|---|
| Core HRIS | System of record | Employee data, org structure, payroll, benefits, compliance, reporting |
| Talent acquisition | ATS + CRM | Job requisitions, candidate tracking, offer management, recruiter workflow |
| Performance and development | Performance platform | Reviews, goal-setting, continuous feedback, development planning |
| Learning | LMS | Course delivery, compliance training, development content |
| Engagement | Listening tool | Pulse surveys, engagement measurement, action planning |
| Analytics | People analytics layer | Cross-system reporting, dashboards, predictive insights |
| Workflows | Automation and self-service | Manager and employee self-service, workflow automation, notifications |

**Integration principle:**

Every tool in the stack should connect to the HRIS as the source of truth for employee data. If a tool cannot sync employee records bidirectionally, it will create data maintenance burden that grows as the company scales.

## Step 3 — Prioritize investments

**Sample prompt:**

> "The CFO has given me a budget but not enough to buy everything at once. Help me prioritize what to invest in first."

**Generated prioritization framework:**

Evaluate each investment on two dimensions: business impact and implementation complexity.

| Investment | Business impact | Implementation complexity | Priority |
|---|---|---|---|
| ATS replacement | High — recruiting is the top people bottleneck | Medium — requires process redesign and recruiter training | 1 |
| HRIS data cleanup and consolidation | High — everything else depends on clean data | High — requires HR ops time before new system | 2 |
| Employee self-service portal | Medium — reduces HR admin burden | Low — most modern HRIS includes this | 3 |
| Performance platform | Medium — current process is painful but workarounds exist | Medium | 4 |
| People analytics layer | High long-term, low immediate urgency | High — requires clean data first | 5 |
| LMS | Low — learning needs are currently managed informally | Low | 6 |

**Decision rule:**

Invest in data quality and the system of record before adding any specialized tools. A new performance platform built on inaccurate employee data will produce unreliable results from day one.

## Step 4 — Evaluate and select an ATS

**Sample prompt:**

> "Help me build a vendor evaluation process for a new ATS. We're evaluating 4 vendors and need a structured approach."

**Generated evaluation process:**

**Phase 1 — Requirements definition (week 1):**

Define must-haves versus nice-to-haves before any demos:

Must-haves:
- Bidirectional HRIS integration (data flows automatically in both directions)
- Structured interview scoring and feedback capture
- Offer management with e-signature
- Reporting on time-to-fill, source quality, and pipeline conversion

Nice-to-haves:
- Candidate CRM for pipeline building
- AI-assisted screening (with bias audit capability)
- Career site builder
- Internal mobility integration

**Phase 2 — Scripted demos (weeks 2-3):**

Give all four vendors the same scenario to demo — don't let them show only their strengths:

> "Walk us through what happens when a hiring manager opens a new requisition, a candidate applies, moves through four interview stages, and receives an offer. Show us the recruiter view, the hiring manager view, and the candidate experience."

**Phase 3 — Reference checks (week 3):**

Ask each vendor for 2 references at companies of similar size and growth stage. Questions to ask:
- What broke in year 1 that you didn't anticipate?
- How responsive is the support team when something goes wrong?
- If you were choosing again today, would you choose this vendor?

**Phase 4 — Decision scoring:**

| Criterion | Weight | Vendor A | Vendor B | Vendor C | Vendor D |
|---|---|---|---|---|---|
| HRIS integration quality | 25% | | | | |
| Recruiter workflow usability | 20% | | | | |
| Hiring manager experience | 15% | | | | |
| Reporting and analytics | 15% | | | | |
| Candidate experience | 10% | | | | |
| Implementation support | 10% | | | | |
| Total cost of ownership | 5% | | | | |

## Step 5 — Manage the implementation

**Sample prompt:**

> "We've selected the new ATS. What are the most common implementation failures and how do we avoid them?"

**Common failure modes and prevention:**

| Failure | Prevention |
|---|---|
| Data migration errors — candidate records lost or duplicated | Audit and clean data in the old system before migration; validate after |
| Recruiter adoption failure — teams revert to the old process | Involve 2-3 recruiters in configuration decisions; run parallel for 2 weeks |
| Integration breaks at go-live | Test the HRIS integration end-to-end with real data in a sandbox environment |
| Hiring manager confusion — managers ignore the new platform | Run a 30-minute manager training the week before go-live; make it mandatory |
| Reporting gaps discovered post-launch | Map required reports before configuration; test every report in UAT |

**Go-live checklist:**

- [ ] All open requisitions migrated and verified
- [ ] Hiring manager accounts created and tested
- [ ] HRIS integration tested with a live transaction
- [ ] Recruiter training completed
- [ ] Old system access disabled for new requisitions (run-off plan for in-flight roles only)
- [ ] Support escalation path confirmed with vendor

## Summary

Use `hr-digital-hr` to design a coherent HR technology strategy before evaluating vendors, prioritize investments based on data dependencies and business impact, run structured vendor evaluations with scripted demos and reference checks, and manage implementations with adoption and integration risk controls built in from the start.
