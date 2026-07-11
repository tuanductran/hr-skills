---
name: hr-system-integration
description: Help HR technology teams plan and manage integrations between HR systems (HRIS, ATS, payroll, LMS, benefits platforms) so data flows accurately across the HR tech stack. Use when asked to "integrate our HRIS with [system]", "plan a system integration for HR tools", "fix data sync issues between systems", "design an HR tech integration architecture", or "audit our HR system integrations".
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# HR system integration

Plan and manage integrations across the HR technology stack — HRIS, ATS, payroll, LMS, benefits, and point solutions — so employee and candidate data flows accurately, securely, and without manual rework.

## Supported tasks

- Mapping the current HR tech stack and its integration points
- Designing integration architecture between HRIS, ATS, payroll, and other systems
- Planning integration sequencing for a new HR system implementation
- Diagnosing and fixing data sync issues between connected systems
- Defining system of record for each data type across the HR tech stack
- Assessing integration options (native, middleware, API, manual) for a given system pair
- Designing data mapping and field-level transformation rules between systems
- Auditing existing integrations for reliability, latency, and data quality issues
- Planning integration testing before go-live for a new system or connector
- Documenting integration architecture for HR IT and vendor support teams
- Managing integration vendor relationships and support escalations
- Assessing integration risk and rollback plans for major system changes

## Key prompts

### Planning and architecture

1. "Map our current HR tech stack and identify all integration points between [systems]."
2. "Design an integration architecture connecting our HRIS, ATS, and payroll systems, including system of record for each data type."
3. "What integration approach — native connector, middleware, custom API, or manual process — fits best for connecting [system A] and [system B]?"

### Data mapping and quality

1. "Design field-level data mapping rules between [system A] and [system B] for [data type, e.g. employee status changes]."
2. "Diagnose why employee data is out of sync between [system A] and [system B] and identify likely root causes."
3. "Audit our existing integrations for data quality issues, latency, or reliability problems."

### Implementation and testing

1. "Plan integration testing steps to run before go-live for a new connector between [system A] and [system B]."
2. "Sequence integration work for a new HRIS implementation involving [number] connected downstream systems."
3. "Assess integration risk and design a rollback plan for [a major system change or migration]."

### Documentation and vendor management

1. "Document our integration architecture in a format usable by HR IT and vendor support teams."
2. "What questions should we ask a vendor about integration capabilities before selecting a new HR system?"

## Tips

- Define system of record for every data type before building integrations — ambiguity about which system "owns" a data point is the root cause of most sync issues.
- Test integrations with real edge cases (terminations, rehires, name changes, status transitions), not just clean happy-path data.
- Document integration architecture as you build it; undocumented point-to-point integrations become fragile and hard to maintain as the stack grows.
- Prefer standard APIs or established middleware over custom one-off connectors where possible, for long-term maintainability.
- Plan for failure — build monitoring and alerting for sync failures rather than discovering broken integrations when someone notices bad data downstream.
