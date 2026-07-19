# Designing integrations for a new HRIS implementation

## Context

You are the HR Technology Manager at a 900-person manufacturing company. The company is replacing its legacy HRIS with Workday. The current stack includes: an ATS (Greenhouse), a payroll system (ADP Workforce Now), a benefits administration platform (bswift), an LMS (Cornerstone), and an IAM system (Okta).

You have six months to go live. Integration design is your first critical dependency — payroll and benefits feeds cannot go down during cutover.

## Step 1 — Map the current integration landscape

**Sample prompt:**

> "We are migrating to Workday from a legacy HRIS. Our connected systems are Greenhouse (ATS), ADP Workforce Now (payroll), bswift (benefits), Cornerstone (LMS), and Okta (IAM). Map our current integration points, data flow directions, and identify the system of record for each data type."

**Generated integration map:**

| Integration | Direction | Trigger | Data transferred | Current pattern |
|---|---|---|---|---|
| Legacy HRIS → ADP | Outbound | Nightly batch | Employee profile, pay rate, cost center, status | SFTP flat file |
| Legacy HRIS → bswift | Outbound | Event + weekly batch | Eligibility, enrollment triggers, dependent data | SFTP flat file |
| Greenhouse → Legacy HRIS | Inbound | Hire decision in Greenhouse | New hire record, offer data | Manual import |
| Legacy HRIS → Cornerstone | Outbound | Nightly batch | Employee profile, department, manager, status | SFTP flat file |
| Legacy HRIS → Okta | Outbound | Event-driven | New hire provisioning, termination deprovisioning | API |

**System of record definition:**

| Data type | System of record |
|---|---|
| Employee profile (name, ID, status, position) | Workday (after go-live) |
| Candidate data through to hire | Greenhouse |
| Hire record handoff | Greenhouse → Workday trigger |
| Compensation and pay rate | Workday |
| Benefits enrollment | bswift (elections); Workday (eligibility source) |
| Learning completions | Cornerstone |
| Access provisioning | Okta (driven by Workday status) |

## Step 2 — Choose integration patterns for each connection

**Sample prompt:**

> "Recommend the integration pattern for each Workday connection — native, middleware (Workato), or file-based. Prioritize reliability for payroll and benefits, minimize custom development, and flag the highest-risk connections."

**Generated recommendations:**

| Integration | Recommended pattern | Rationale | Risk level |
|---|---|---|---|
| Workday → ADP | Workday native connector (ADP) | Supported out-of-box; handles real-time status events and nightly pay data | Medium — test payroll cut-off timing carefully |
| Workday → bswift | SFTP file via Workato | bswift requires 834 EDI file format; Workato handles transformation from Workday output | High — benefits eligibility errors affect employee coverage |
| Greenhouse → Workday | Workday native connector (Greenhouse) | Standard hire handoff connector; well-documented | Low |
| Workday → Cornerstone | Workato middleware | Cornerstone API connector in Workato; real-time status sync replaces batch file | Low |
| Workday → Okta | Workday native connector (Okta) | Event-driven provisioning; Workday-Okta connector is mature and widely used | Low |

### Highest-risk integration: Workday → bswift (benefits)

The 834 EDI file format required by bswift involves complex transformation logic and strict field validation. Benefits carrier data errors can result in employees losing coverage or being enrolled incorrectly. This integration requires the most rigorous testing and the most conservative go-live sequencing.

## Step 3 — Design the data mapping for the highest-risk integration

**Sample prompt:**

> "Design the field-level data mapping specification for the Workday → bswift benefits eligibility integration. Include field names, transformation logic, and the edge cases we must handle."

**Generated data mapping excerpt:**

| Workday field | bswift field | Transformation | Edge cases to handle |
|---|---|---|---|
| Employee_ID | MemberID | Direct map | Must be unique; reject duplicates |
| Employment_Status | EligibilityStatus | Active → 1, Leave of Absence → 2, Terminated → 3 | LOA employees retain benefits eligibility for [policy period] |
| Benefits_Start_Date | CoverageEffectiveDate | Format: YYYY-MM-DD → MM/DD/YYYY | New hire 30-day waiting period must be applied before first send |
| FTE_Percentage | PartTimeIndicator | FTE < 0.75 → PT; FTE ≥ 0.75 → FT | Part-time eligibility rules differ by benefit plan |
| Dependent_DOB | Dependent_BirthDate | Format: YYYY-MM-DD → MM/DD/YYYY | Dependents over age 26 must be excluded from medical |
| Termination_Date | CoverageEndDate | Direct map if status = Terminated | COBRA trigger: send termination record within 14 days of term date |

## Step 4 — Sequence and plan the testing program

**Sample prompt:**

> "Design the integration test plan for the Workday go-live. Prioritize payroll and benefits. Include: test phases, edge cases to cover, success criteria, and cutover conditions."

**Generated test plan summary:**

```text
Phase 1 — Unit testing (Weeks 1–3)
Each integration tested in isolation with synthetic test data.
Success criteria: All mapped fields sync with correct values and formatting.
Payroll focus: Validate pay rate, cost center, and status field mapping.
Benefits focus: Validate eligibility, waiting period logic, and dependent rules.

Phase 2 — Edge case testing (Weeks 4–5)
Test with real-world edge case employee records:
- Rehires (duplicate ID handling)
- Employees on LOA (status transition rules)
- Part-time / variable FTE employees (benefits eligibility logic)
- Employees with dependents over age 26 (exclusion rule)
- Mid-month terminations (COBRA trigger timing)
- Employees with name changes (ID continuity)

Phase 3 — Parallel run (Weeks 6–8)
Run Workday integrations in parallel with legacy integrations for 2 payroll cycles.
Compare output records from Workday feeds vs. legacy feeds.
Success criteria: Record count match ≥ 99.9%; zero pay or benefits discrepancies.

Cutover conditions (all must be met before go-live):
✓ Parallel run passed for 2 consecutive payroll cycles.
✓ Benefits eligibility file accepted by bswift with zero rejected records.
✓ Okta provisioning tested for 50 new hire scenarios — all accounts created within SLA.
✓ Rollback plan tested and confirmed executable within 4 hours.
```

## Step 5 — Set up integration monitoring

**Sample prompt:**

> "Design the integration monitoring setup for post-go-live. We need to catch sync failures within one hour for payroll and benefits, and within one business day for other integrations."

**Generated monitoring design:**

```text
Tier 1 — Critical (payroll, benefits): Alert within 60 minutes of failure
- Workday → ADP: Monitor nightly batch completion; alert if not confirmed by 3:00 AM.
- Workday → bswift: Alert on any rejected 834 records; alert if weekly file not delivered.
- Notification: HR Technology Manager + Payroll Manager via email and Slack.

Tier 2 — Important (Okta provisioning): Alert within 4 hours
- Workday → Okta: Alert if new hire provisioning not confirmed within 2 hours of hire date.
- Alert if termination deprovisioning not confirmed within 1 hour of termination in Workday.
- Notification: HR Technology Manager + IT Security.

Tier 3 — Standard (Greenhouse, Cornerstone): Alert within 1 business day
- Greenhouse → Workday: Alert if hired candidate record not received in Workday within 24 hours.
- Workday → Cornerstone: Alert if nightly batch fails; reconcile weekly.
- Notification: HR Technology Manager.

Monthly reconciliation checks:
- Employee count: Workday vs. ADP vs. bswift vs. Cornerstone — flag variances > 0.
- Active employee status: compare across all systems; resolve any discrepancies within 5 business days.
```

## Summary

Use `hr-system-integration` to design, test, and monitor a reliable integration architecture for a major HR system implementation — defining system of record, choosing the right integration pattern per connection, and building a structured testing and monitoring program that protects payroll and benefits continuity through the cutover.

> Related skills: [`hr-vendor-management`](../../hr-vendor-management/SKILL.md) for managing vendor integration support commitments and SLAs during the implementation.
