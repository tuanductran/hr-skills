# Recruitment Operations

## Overview

Recruitment operations is the infrastructure layer of talent acquisition — the processes, systems, data, and governance that determine whether TA can deliver consistently at scale. Strong recruiting ops is invisible when it works well and painfully visible when it does not.

Most TA functions invest heavily in recruiter skill and employer brand while underinvesting in operations. The result is a team where individual recruiter performance varies widely, process is inconsistent, data is unreliable, and capacity is opaque.

## Process Design Principles

### Map the process before automating it

Process problems automated at speed are faster process problems. Before configuring the ATS, building intake templates, or setting SLAs, map the actual current-state process: what happens, in what sequence, who is responsible, and where delays occur.

Common current-state findings that should inform process redesign:

- Requisition approval takes longer than the search itself in some functions
- Interview scheduling is owned by no one and defaults to back-and-forth email
- Hiring manager feedback collection is informal and inconsistent
- Offer approval loops include more stakeholders than necessary

### Design for the common case, not the exception

Process designed around edge cases creates overhead for every standard hire. Design the standard process for the 80% case, with defined exception handling for the rest. Document when an exception applies and who approves it.

### Assign ownership for each stage

Every stage in the recruiting process should have a named owner responsible for moving it forward within the SLA. Ambiguous ownership is the most common cause of stage delays.

## SLA Design and Enforcement

SLAs are the operational contract between TA and the business. They define expected timelines, set mutual accountability, and generate the data needed to identify where the process breaks down.

### SLA framework by stage

| Stage | Owner | Standard SLA |
|---|---|---|
| Requisition approval to recruiter assignment | TA Lead | 1 business day |
| Recruiter assignment to intake meeting | Recruiter + Hiring Manager | 2 business days |
| Intake to first candidate presented | Recruiter | 5-10 business days (varies by role complexity) |
| Candidate application to screen scheduled | Recruiter | 2 business days |
| Screen to debrief/decision | Recruiter | 1 business day |
| Interview to hiring decision | Hiring Manager | 2 business days |
| Decision to verbal offer | Recruiter | 1 business day |
| Verbal offer to written offer | TA Ops/Recruiter | 1 business day |

These are starting points; calibrate to your organization's actual hiring volume and process complexity.

### What makes SLAs stick

SLAs without visibility and accountability are aspirational. What makes them operational:

- **ATS reporting surfacing SLA breaches in real time** — recruiter and TA leader both see when stages are aging
- **Weekly pipeline review** covering open roles past SLA threshold with named action owners
- **Hiring manager SLAs communicated at intake** — the recruiter is not the only party with response obligations
- **Escalation path defined** — what happens when an SLA breach is caused by unavailability of the hiring panel?

## Intake Meeting Structure

The intake meeting is the highest-leverage activity in a search. A well-run intake reduces misalignment, calibration errors, and wasted sourcing effort. A poorly run intake produces a job description and a lot of misaligned candidates.

### Minimum intake agenda

**Role context (10 minutes):** Why is this role open? What will the hire be doing in months 1, 3, and 12? What does success look like at 12 months?

**Profile calibration (15 minutes):** Walk through must-have versus nice-to-have requirements. For each must-have, ask: "If a candidate is strong on everything else but missing this, would you still consider them?" This surfaces which requirements are truly hard requirements.

**Compensation calibration (5 minutes):** Confirm the approved range. Is the range competitive for the target profile? If not, what is the plan?

**Process design (10 minutes):** How many interview stages? Who is on the panel? What is each interviewer evaluating? What are the decision criteria?

**Sourcing strategy (10 minutes):** Where will candidates come from? What companies are you targeting? Are there known candidates in the network?

**Logistics (5 minutes):** Availability for interviews over the next 4 weeks. Communication preferences and response time expectations.

## ATS Configuration and Governance

### Configuration principles

**Stages should match your actual process:** Default ATS stages rarely match how organizations actually hire. Configure custom stages that reflect your real process. Five to eight stages is typical; more than ten creates overhead.

**Dispositions must be used consistently:** Pipeline reporting is only accurate if dispositions (the reason a candidate was rejected or withdrew) are applied every time. Define a standard disposition list and train the team to use it.

**Scorecards attached to every evaluation stage:** Structured interview feedback in scorecards enables calibration and builds the data for quality-of-hire analysis. Free-text feedback fields produce unstructured data that cannot be analyzed.

**Reporting configured before go-live:** Build your standard reports into the ATS before the team starts using it, not after. Retroactively configuring reporting on inconsistently populated data produces unreliable output.

### ATS governance

Assign an ATS owner who is responsible for configuration, data quality, and user training. Without a named owner, configuration drift accumulates and data quality degrades.

Conduct a quarterly data quality audit: sample open and closed requisitions for stage completion, disposition consistency, and scorecard usage rates.

## Capacity Planning

TA teams frequently operate without a clear view of recruiter capacity, which makes it impossible to commit to delivery timelines or identify when additional resources are needed.

### Capacity model inputs

- Number of active requisitions per recruiter (current load)
- Historical requisitions-per-hire (how many active reqs is one filled role equivalent to?)
- Stage work estimates by role type (senior leadership searches require more time than high-volume roles)
- Non-recruiting time commitments (projects, interviewer training, reporting)

### Practical capacity signals

A simple leading indicator: if average recruiter load exceeds 15-20 active requisitions (for generalist roles) or 8-12 (for specialized/leadership roles), quality and speed will degrade. When load exceeds this threshold, the options are to hire, reprioritize requisitions, or adjust SLA commitments to the business.

Visible capacity creates honest conversations. Hidden capacity problems produce missed SLAs and frustrated hiring managers.
