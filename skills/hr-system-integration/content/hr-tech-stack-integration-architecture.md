# HR Tech Stack Integration Architecture

## Overview

An HR tech stack is a collection of software systems that support the employee lifecycle — from recruiting and onboarding through payroll, learning, and offboarding. When these systems share data accurately and automatically, HR operations run reliably. When they do not, data becomes inconsistent, manual rework accumulates, and downstream processes break.

HR system integration is the discipline of designing, building, and maintaining the connections between these systems so data flows correctly across the stack.

## Common HR System Categories

| System category | Primary function | Key data produced |
|---|---|---|
| HRIS / HCM | Core employee record and organizational structure | Employee profile, position, org hierarchy, employment status |
| ATS | Candidate and requisition management | Candidate records, offer data, hired candidate handoff |
| Payroll | Compensation processing and payroll execution | Pay records, tax withholdings, deductions |
| Benefits administration | Benefits enrollment and carrier data exchange | Enrollment elections, dependent data, carrier feeds |
| LMS | Learning content delivery and completion tracking | Course completions, certifications, learning history |
| Performance management | Goal-setting, reviews, ratings | Performance ratings, review completion, goal status |
| Workforce management / scheduling | Time tracking, attendance, shift scheduling | Hours worked, attendance records, schedule data |
| Identity and access management | Employee provisioning and system access | Account creation, role-based access, termination deprovisioning |

## System of Record

The most important integration design decision is defining the **system of record** for each data type — the single authoritative source that other systems must follow.

Without a defined system of record, two systems can both attempt to write the same field, producing conflicting values that are difficult to resolve.

Common system of record assignments:

| Data type | Typical system of record |
|---|---|
| Employee profile (name, ID, employment status) | HRIS |
| Candidate data | ATS (until hire; then HRIS takes over) |
| Pay rates and compensation | HRIS or compensation module |
| Benefits enrollment | Benefits platform |
| Learning completions | LMS |
| Performance ratings | Performance management system |
| Time and attendance | WFM / scheduling system |
| System access | IAM / directory (driven by HRIS status) |

Define the system of record in writing before building any integration. Document what happens when a downstream system receives conflicting data.

## Integration Patterns

### Native Integration

A pre-built connector maintained by one or both vendors, typically set up through a configuration interface rather than custom code.

Best for: Common system pairings where vendors have invested in a supported connector (e.g., HRIS → payroll from the same vendor family).

Pros: Low development cost; vendor-supported; faster to implement.
Cons: Limited flexibility; dependent on vendor roadmap; may not cover all data fields.

### Middleware / Integration Platform

A third-party integration platform (iPaaS — Integration Platform as a Service) that orchestrates data flows between systems through pre-built connectors and configurable logic.

Common platforms in HR: Workato, MuleSoft, Boomi, Zapier (for lighter use cases).

Best for: Multi-system integration environments where a hub-and-spoke model is more maintainable than point-to-point connections.

Pros: Centralized monitoring; reusable connectors; transformation logic in one place.
Cons: Additional vendor cost and contract; requires configuration expertise.

### API Integration

A custom-built integration using the APIs published by each system, developed and maintained by an internal or external development team.

Best for: Non-standard integration requirements not covered by native connectors or middleware.

Pros: Maximum flexibility; can handle complex transformation logic.
Cons: High development cost; requires ongoing maintenance; no vendor support for custom code.

### File-Based Integration

Data exchange via flat files (CSV, SFTP) on a scheduled cadence — the oldest and still common integration pattern, particularly with legacy systems or external carriers.

Best for: Batch data exchange where real-time sync is not required (e.g., weekly benefits carrier feeds).

Pros: Simple to implement; compatible with legacy systems.
Cons: Batch latency; error detection is delayed; file format changes require manual updates.

## Integration Data Flow Design

### Trigger types

| Trigger | Description | Example |
|---|---|---|
| Event-driven | Integration fires when a specific record change occurs | New hire record created in HRIS → triggers ATS candidate archive + IAM provisioning |
| Scheduled batch | Integration runs on a fixed schedule | Nightly payroll sync; weekly benefits carrier file |
| On-demand | Integration triggered by a user action or manual process | Manager requests org chart export |

### Data transformation

Data fields rarely map 1:1 between systems. Common transformation requirements:

- **Field name mapping** — "Employee Status" in HRIS maps to "emp_status" in payroll.
- **Value translation** — "Active" in HRIS maps to "1" in payroll.
- **Format conversion** — date format DD/MM/YYYY → YYYY-MM-DD.
- **Calculated fields** — Full-time equivalent value derived from hours per week.
- **Conditional logic** — Only sync employees in "Active" or "Leave" status; exclude "Terminated".

Document all transformation rules in a data mapping specification before building the integration.

## Monitoring and Error Handling

Integrations break. The question is how quickly errors are detected and resolved.

Monitoring design should include:

- **Sync confirmation logging** — record when each integration ran and how many records were processed.
- **Error alerting** — notify the HR operations team or HR IT when a sync fails or produces errors, not when someone notices bad data downstream.
- **Reconciliation checks** — periodic comparison of record counts or key field values across systems to catch silent sync drift.
- **Runbooks** — documented step-by-step guides for diagnosing and resolving the most common integration failures.

## Integration Testing

Before going live with a new integration or a change to an existing one, run structured testing:

| Test type | What it covers |
|---|---|
| Happy path | Standard records sync correctly end-to-end |
| Edge cases | Rehires, name changes, transfers, LOA status changes, part-time employees |
| Error conditions | Missing required fields; invalid values; duplicate records |
| Volume test | Large batch runs complete within acceptable time |
| Rollback test | Integration can be disabled and previous state restored without data loss |

## Integration Audit

An integration audit reviews existing integrations for:

- **Reliability** — How often do syncs fail or produce errors? Is there alerting in place?
- **Data quality** — Are field values consistent across connected systems?
- **Coverage** — Are there manual workarounds that indicate a missing integration?
- **Documentation** — Is the integration architecture documented and current?
- **Ownership** — Is there a clear owner for each integration responsible for monitoring and fixing failures?

Related skill: `hr-vendor-management`.
