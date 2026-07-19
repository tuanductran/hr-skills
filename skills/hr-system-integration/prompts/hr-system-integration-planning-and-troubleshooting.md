# HR system integration planning and troubleshooting

Prompts for designing integration architecture, mapping data flows, diagnosing sync issues, planning testing, and documenting the HR tech stack.

## Architecture and planning

- "Map our current HR tech stack and identify all integration points between [list systems]. Show data flow direction, trigger type, and which system is the source of record for each data type."
- "Design an integration architecture connecting our [HRIS], [ATS], and [payroll system]. Define system of record for each key data type and recommend the integration pattern for each connection."
- "What integration approach — native connector, middleware, custom API, or file-based — is most appropriate for connecting [system A] and [system B] given [our scale, IT capacity, and budget]?"
- "We are implementing a new [HRIS / ATS / LMS]. Sequence the integration work for connecting [number] downstream systems and identify the highest-risk integration dependencies."
- "Design an HR integration hub-and-spoke architecture using [middleware platform] as the central orchestration layer connecting [list systems]."
- "What questions should we ask vendors about integration capabilities before selecting a new [HRIS / ATS / benefits platform]?"
- "Audit our current integration architecture for [reliability / data quality / documentation / ownership] issues and prioritize the top [number] remediation actions."

## System of record and data governance

- "Define the system of record for each data type across our HR tech stack: [list systems and data types]. Flag any ambiguities where two systems currently claim ownership of the same field."
- "Design a data governance policy for our HR tech stack covering: system of record per data type, who can write to each system, and how conflicts are resolved."
- "We have conflicting employee status values between [HRIS] and [payroll]. Design a reconciliation process to identify discrepancies, determine the correct value, and prevent recurrence."
- "Which data fields should never be edited directly in [downstream system] and must always flow from [system of record]? Design the enforcement rule."

## Data mapping and transformation

- "Design a field-level data mapping specification for the integration between [system A] and [system B] for [employee lifecycle event — e.g. new hire, termination, transfer]. Include field names, data types, value translations, and transformation logic."
- "Write the transformation rules for syncing employment status from [HRIS] to [payroll] including all status values and their mappings."
- "Identify the data quality issues most likely to cause sync failures in the integration between [system A] and [system B] based on this field mapping: [paste mapping]."
- "Design a data validation layer for our [system] integration that catches invalid or missing values before they cause downstream failures."

## Troubleshooting and diagnostics

- "Diagnose why employee records are out of sync between [system A] and [system B]. Walk through the most likely root causes from data mapping errors to trigger failures to permission issues."
- "An employee's termination in [HRIS] has not propagated to [payroll / IAM / benefits platform]. What is the diagnostic sequence to find the failure point?"
- "Design a runbook for the most common integration failure between [system A] and [system B] so any HR operations team member can diagnose and resolve it without escalating to IT."
- "What are the most common root causes of data drift between [HRIS] and [downstream systems] over time, and how do we prevent them?"
- "Our [benefits carrier feed / payroll file] is rejecting records from [system]. What validation checks should we run to identify and fix the records before the next send?"

## Testing and go-live

- "Design an integration test plan for the new connection between [system A] and [system B] covering: happy path, edge cases (rehires, name changes, LOA, transfers), error conditions, and rollback."
- "What edge case employee records should we include in integration testing for a new [HRIS / payroll / benefits] system to ensure real-world data scenarios are covered?"
- "Design a parallel-run validation plan for running our old and new integrations simultaneously before full cutover to [new system]."
- "What integration monitoring and alerting should we configure at go-live so sync failures are caught within [timeframe] rather than discovered through data complaints?"

## Monitoring and documentation

- "Design an integration health dashboard for our HR tech stack showing: last sync time, record count, error rate, and ownership for each integration."
- "Write an integration architecture document for our current HR tech stack in a format usable by HR IT, new team members, and vendor support teams."
- "Design a reconciliation check process that compares key field values across [HRIS] and [payroll / benefits / LMS] on a [weekly] basis to catch silent sync drift."
- "Build a monthly integration health review checklist for the HR operations team covering: error log review, reconciliation checks, documentation updates, and vendor follow-up items."
