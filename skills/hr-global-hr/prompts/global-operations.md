# Global operations prompt library

These prompts extend the summary prompts in `SKILL.md` with reusable workflows for global HR planning, localization, mobility, and governance.

## Country launch

```text
Create a country HR launch plan for [country] based on [business rationale], [target headcount], [roles], and [hiring timeline]. Separate must-have pre-hire actions from actions that can happen during the first 90 days. Include decisions, owners, dependencies, and risk flags that require local counsel or tax advice.
```

```text
Build a country readiness checklist for [country] covering employment model, payroll, benefits, leave, working time, data privacy, onboarding, employee relations, and vendor setup. Format it as a table with status, evidence needed, owner, and target date.
```

```text
Compare entity, employer of record, contractor, and global mobility options for hiring [role] in [country]. Evaluate speed, compliance risk, employee experience, cost, scalability, and exit complexity. Recommend a short-term and long-term path.
```

## Policy localization

```text
Review this global HR policy for use in [country]: [policy text]. Identify sections that can stay global, sections needing local annexes, and sections requiring legal review. Rewrite employee-facing guidance in plain language without making legal conclusions.
```

```text
Create a localization matrix for [policy area] across [countries]. Include global baseline, country-specific differences, employee communication notes, manager training needs, and unresolved questions for counsel.
```

## Global governance

```text
Design decision rights for a global HR operating model supporting [regions/countries]. Define what global HR, regional HR, local HR, people operations, payroll, legal, and business leaders each own. Include escalation triggers and service-level expectations.
```

```text
Create a quarterly global HR risk review agenda for [company context]. Include compliance, mobility, payroll, employee relations, benefits, data quality, vendor performance, and upcoming country changes.
```

## Mobility and remote work

```text
Assess a cross-border remote work request where [employee role] wants to work from [host country] for [duration] while employed in [home country]. Identify HR, immigration, payroll, tax, data security, benefits, and manager concerns. Provide a decision memo template, not legal advice.
```

```text
Design a repatriation plan for an employee returning from [assignment country] to [home country]. Include role placement, knowledge transfer, compensation review, family support, manager handoff, and retention check-ins.
```

## Output checks

For every output, verify that it:

- separates global standards from local requirements
- identifies assumptions and counsel-dependent questions
- avoids giving jurisdiction-specific legal advice as fact
- names decision owners and escalation triggers
- considers employee experience, not only compliance
