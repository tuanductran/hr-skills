# Scaling Onboarding and HRIS Operations for a Fast-Growing Company

## Context

You are the People Operations Manager at a 180-person logistics tech company that has grown from 70 to 180 employees in 14 months. The company is hiring 12-15 people per month, and onboarding is still run manually through a shared spreadsheet, email chains with IT, and a generic offer letter template. The CFO flagged that two new hires this month did not have laptops ready on day one, and Legal raised concerns after discovering inconsistent employee records between your HRIS and payroll system during a recent audit prep exercise. You have a basic HRIS in place but no automation, no documented runbooks, and no data governance process.

## Step 1 — Choosing Where to Start

**Sample prompt:**

> "Onboarding is breaking down as we scale and we just found data mismatches between our HRIS and payroll during an audit prep. Where do I start?"

**Expected skill response:**

Given your situation — visible onboarding failures, a data integrity finding from Legal, and a hiring volume that has outpaced your manual process — start with two priority areas:

**Onboarding reliability (CFO's concern):**

- Map the current onboarding process from offer acceptance to day one, identifying every handoff between HR, IT, and the hiring manager
- Identify where the laptop-readiness failure occurred — likely a missing trigger point, not a one-off mistake
- Build a simple checklist with clear ownership before attempting full automation

Two failed day-ones in one month at your hiring volume is a process gap, not a coincidence. You need to fix the handoff before scaling the volume further.

**Data integrity (Legal's concern):**

- Identify which system is the source of truth for each core data field (name, employment status, compensation, manager)
- Run a baseline audit comparing HRIS and payroll records for the current population
- Document a remediation plan with a realistic timeline before the next audit checkpoint

> **Avoid:** Do not attempt to fully automate onboarding and fix all data governance issues simultaneously in month one. Stabilize the onboarding handoff process first, run the data audit in parallel, then layer in automation once the manual process is reliable.

## Step 2 — Mapping the Current Onboarding Process

**Sample prompt:**

> "Help me map our current onboarding process so I can see exactly where it's breaking down."

**Skill walkthrough:**

**Current state process map (as reported):**

```text
1. Recruiter sends offer letter (manual, generic template)
2. Candidate accepts via email reply
3. Recruiter manually emails HR with start date
4. HR manually creates HRIS record (often delayed 2-3 days)
5. HR manually emails IT to request equipment (no defined lead time)
6. IT orders equipment when capacity allows (no SLA)
7. Hiring manager is not notified of any of the above steps
8. New hire shows up on day one — equipment status unknown until that morning
```

**Failure point identification:**

```text
Step 5 → Step 6 is the most likely cause of the laptop incident:
- No defined lead time given to IT before the request is sent
- No automated trigger when HR creates the HRIS record
- No visibility for the hiring manager to flag if something is missing

This is a single, fixable handoff gap — not a sign that the entire
process needs to be rebuilt from scratch immediately.
```

**Benchmark context:**

A target onboarding completion rate above 90% for the first 90 days is a reasonable industry benchmark, but day-one equipment readiness failures typically indicate a process design gap rather than an execution capacity problem. At your current hiring volume of 12-15 new hires per month, a manual handoff with no defined SLA between HR and IT will continue to fail intermittently until a trigger-based process replaces it.

> **Experience impact estimate:** A new hire without a working laptop on day one creates an immediate negative first impression that is disproportionately memorable relative to its actual severity. Left unaddressed at your current hiring pace, this could affect 2-3 new hires per month, compounding into a broader pattern that surfaces in engagement and first-year retention data.

## Step 3 — Diagnosing the Data Integrity Issue

**Sample prompt:**

> "Legal found mismatches between our HRIS and payroll records during audit prep. I need to understand the scope before this becomes a bigger compliance issue."

**Skill response — diagnostic framework:**

Before assuming the scope, gather signals across four dimensions:

**1. System of record ambiguity:**

- For each core data field — name, employment status, compensation, manager, department — which system is currently treated as authoritative?
- Are there fields being manually entered separately into both systems rather than synced?

**2. Update timing and process gaps:**

- When an employee's compensation or status changes, what is the actual process for updating both systems?
- Is there a defined owner and deadline for propagating changes, or does it happen ad hoc?

**3. Historical accumulation:**

- Are the mismatches concentrated in recent hires, or do they span the full employee population?
- Were there any past system migrations or manual bulk updates that may have introduced errors?

**4. Audit and compliance exposure:**

- What specific records did Legal flag, and what triggered the discovery?
- Are any mismatches in fields with direct compliance implications (compensation, employment classification, work authorization)?

> **What to bring to Legal:** Do not present this as fully resolved or fully unknown. Bring a scoped audit plan with a defined timeline, a proposed system-of-truth assignment per data field, and an initial estimate of how many records are affected based on a sample check.

## Step 4 — Building the New Onboarding Workflow

**Sample prompt:**

> "Help me design a new onboarding workflow that fixes the IT handoff gap and gives the hiring manager visibility."

**Skill response — workflow structure:**

Design the new workflow around three components: trigger points, defined SLAs, and visibility for all stakeholders.

**Section 1 — Trigger-based handoffs:**

| Step | Trigger | Owner | SLA |
|------|---------|-------|-----|
| HRIS record created | Offer accepted in ATS | People Ops | Same business day |
| IT equipment request sent | HRIS record created (automated) | System-generated | Immediate |
| Equipment ordered/prepared | IT request received | IT | 5 business days before start date |
| Hiring manager checklist sent | 7 days before start date | System-generated | Automated |
| Day-one readiness confirmation | 1 business day before start | IT + People Ops | Confirmed before end of day |

**Section 2 — Stakeholder visibility:**

- Hiring managers receive an automated status update at the 7-day and 1-day marks, showing equipment and access readiness
- People Ops has a single dashboard view showing every upcoming start date and its readiness status
- IT has a defined queue with start-date-driven priority, not a first-come email inbox

**Implementation notes:**

- Start with a simple automated trigger (HRIS record creation → IT ticket creation) before attempting a fully integrated system
- Build the hiring manager visibility view even if it is a simple shared dashboard initially — visibility matters more than polish at this stage
- Set the IT equipment lead time based on your actual offer-to-start-date window; if offers often close less than 5 business days before start, flag this as a recruiting timeline issue too

> **Common finding at fast-growing companies:** Onboarding breakdowns are rarely caused by any one team failing — they are caused by the absence of a defined trigger and owner at each handoff point. Fixing the handoff structure resolves most day-one failures without requiring a full platform overhaul.

## Step 5 — Presenting the Plan to the CFO and Legal

**Sample prompt:**

> "I need to update the CFO on the onboarding fix and Legal on the data audit plan in the same leadership meeting. Help me frame both without sounding like everything was broken."

**Skill response — leadership communication framework:**

Leadership responds to defined ownership, a credible timeline, and evidence the root cause is understood — not a list of everything that went wrong.

**Part 1 — Confirm the observation with data:**

"You're right that two new hires this month did not have equipment ready on day one. We traced this to a single handoff gap between HR and IT that had no defined trigger or lead time — not a broader breakdown across onboarding."

**Part 2 — Present the fix and its scope:**

"We're implementing an automated trigger so an IT request is generated the same day a new hire's HRIS record is created, with a defined 5-business-day lead time before start date, and a readiness confirmation step the day before. This directly closes the gap that caused the recent incidents."

**Part 3 — Address the data audit in parallel:**

"On the HRIS-payroll mismatch Legal flagged, we're running a full comparison audit this week, starting with compensation and employment status fields given their compliance sensitivity. We'll have a scoped finding and remediation timeline within two weeks, and we're assigning a clear system of record per data field going forward to prevent recurrence."

> **Key principle:** Leadership and Legal respond well to a plan that shows the root cause was understood quickly and is being closed systematically — frame both issues as contained and actively managed, not as ongoing unknowns.

## Step 6 — Using AI to Audit and Document the Process

**Sample prompt:**

> "I have our HRIS and payroll exports. How do I use Claude or ChatGPT to help identify data mismatches without manually comparing thousands of rows?"

**Skill response — AI-assisted analysis workflow:**

**Step 1 — Prepare your data safely:**

Export both systems' employee records to CSV, including employee ID, name, employment status, compensation, department, and manager. Remove any fields beyond what is needed for the comparison, and confirm your data handling approach is appropriate for the sensitivity of compensation data before using any AI tool.

**Step 2 — Use this prompt structure:**

```text
I am a People Operations Manager comparing HRIS and payroll records
for a 180-person company.
Here is my HRIS export and payroll export (matched by employee ID):
[paste both datasets here]

Please:
1. Identify all records where employment status, compensation, or
   department differs between the two systems
2. Flag any employee IDs present in one system but missing from the other
3. Group the mismatches by likely cause (recent hire lag, recent change
   not propagated, historical/legacy discrepancy)
4. Summarize the scope and severity in plain language suitable for
   a Legal and leadership briefing
```

**Step 3 — Follow up with documentation:**

```text
Based on this audit, draft a data governance policy defining which
system is the source of truth for each field (name, status, compensation,
department, manager), and the process for propagating changes between
systems going forward.
Format as: Data Field / System of Record / Update Process / Owner.
```

**What AI does well here:**
- Quickly comparing large datasets and flagging discrepancies
- Grouping findings into patterns to support root-cause diagnosis
- Drafting governance policy language and process documentation
- Translating technical findings into a leadership-ready summary

**What AI cannot replace:**
- Legal judgment on compliance exposure and disclosure obligations
- Final decisions on which system is authoritative for sensitive fields
- Manual verification of flagged records before any data correction is made

## Step 7 — Designing the Standing Data Governance Process

**Sample prompt:**

> "We've fixed the current mismatches. I don't want to be back here at the next audit. How do I build ongoing data governance into our process?"

**Skill response — governance build:**

Embed data governance checks at three points in the standard employee lifecycle rather than treating it as a one-time cleanup project.

**At the point of data entry:**

- Define a single system of record for each core data field and restrict direct editing of that field in any other system
- Require changes to flow through the system of record first, with downstream systems updated via integration rather than manual re-entry

**At the point of lifecycle events:**

- Build a checklist trigger for every lifecycle event (promotion, transfer, compensation change, termination) that confirms all connected systems are updated before the event is marked complete
- Assign a named owner for each event type, not a general "HR team" responsibility

**At the recurring audit cadence:**

- Run a lightweight automated comparison between HRIS and payroll on a monthly basis, rather than waiting for the next external audit to surface issues
- Escalate any recurring mismatch pattern to a process fix, not just a one-time data correction

**Standing governance cadence:**

| Process Step | Owner | Frequency |
|--------------|-------|-----------|
| System of record enforcement at data entry | HRIS Administrator | Every change |
| Lifecycle event multi-system checklist | People Operations | Every event |
| HRIS-payroll comparison audit | People Operations Analyst | Monthly |
| Full data governance review | People Operations Manager | Quarterly |

> **Common finding at fast-growing companies:** Data integrity issues accumulate quietly through everyday lifecycle events — a compensation change updated in one system but not another — not through any single large failure. Lightweight, frequent checks catch this far earlier than periodic full audits.

## Step 8 — Writing the Quarterly People Operations Report for Leadership

**Sample prompt:**

> "I need to report on our onboarding fix and data governance progress to leadership next quarter. Give me a template."

**Generated report template:**

```text
Q[X] PEOPLE OPERATIONS REPORT — [COMPANY NAME]
Prepared by: [People Operations Manager Name]
Date: [Date]
Audience: CEO, CFO, Legal, Leadership Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTIVE SUMMARY (3 sentences)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[One sentence on onboarding reliability status this quarter.]
[One sentence on data governance and audit-readiness status.]
[One sentence on the primary operational focus for next quarter.]

Example:
"Day-one equipment readiness reached 100% this quarter following the
implementation of an automated HR-to-IT trigger, up from two incidents
last quarter. Our HRIS-payroll data audit identified and remediated 23
mismatched records, with a standing monthly comparison process now in
place. Our Q[X+1] priority is extending automated triggers to internal
transfers and promotions."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: ONBOARDING RELIABILITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
New hires onboarded this quarter: ___
Day-one equipment readiness rate: ___% | Target: 100%
90-day onboarding completion rate: ___% | Target: >90%
Open process gaps identified: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: DATA GOVERNANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Records audited: ___
Mismatches identified and remediated: ___
HRIS data accuracy rate: ___% | Target: >98%
Standing audit cadence status: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: SERVICE DELIVERY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HR tickets received: ___
First-response SLA performance: ___% | Target: <24 hours
Resolution SLA performance: ___% | Target: <3 business days
Self-service resolution rate: ___% | Target: >40%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: AUTOMATION PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Processes automated this quarter: ___
Estimated hours saved per month: ___
Next automation priority: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: RISKS AND ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Risk 1: [Description] | Likelihood: H/M/L | Business impact: ___
Action: ___ | Owner: ___ | Deadline: ___

Risk 2: [Description] | Likelihood: H/M/L | Business impact: ___
Action: ___ | Owner: ___ | Deadline: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: NEXT QUARTER TARGETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target 1: Maintain day-one equipment readiness at 100%
Target 2: Extend automated lifecycle triggers to ___ additional event types
Target 3: Achieve self-service resolution rate of ___%
```

## Full People Operations Workflow Summary

```text
Identify trigger (process failure, audit finding, scaling pressure)
                    ↓
Map the current process to locate the exact failure point
                    ↓
Diagnose root cause across systems, ownership, and timing gaps
                    ↓
Design a trigger-based workflow with defined SLAs and visibility
                    ↓
Present the fix and remediation plan to affected stakeholders
                    ↓
Use AI to audit data and draft governance documentation
                    ↓
Embed standing governance checks into the everyday lifecycle process
                    ↓
Report on operational health to leadership every quarter
```

### Common People Operations Mistakes

| Mistake | How to avoid it |
|---------|----------------|
| Running critical handoffs through manual email chains with no SLA | Replace ad hoc email handoffs with trigger-based workflows and defined SLAs |
| Treating a data audit as a one-time cleanup project | Build a recurring, lightweight comparison audit into the standing process |
| Automating every request regardless of sensitivity | Reserve automation for routine, high-volume requests; route sensitive cases to human judgment |
| Leaving system-of-record ownership undefined per data field | Assign one authoritative system per data field and restrict direct edits elsewhere |
| Presenting operational issues to leadership without a fix attached | Always pair any flagged gap with a root cause, fix, and timeline before the conversation |
| Building processes that depend on one person's knowledge | Document runbooks so any team member can execute the process consistently |
| Measuring only ticket volume instead of resolution quality and experience | Track SLA performance, self-service adoption, and downstream experience signals together |
