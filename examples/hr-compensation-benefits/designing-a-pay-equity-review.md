---
title: Designing a pay equity review
reference: hr-compensation-benefits
---

# Example: Designing a pay equity review

## Context

You are an HR manager preparing the first structured pay equity review for a 450-person company. Leaders want to identify unexplained pay gaps by role, level, department, gender, race, location, and tenure before the annual compensation cycle.

## Step 1 — Scope the review

**Sample prompt:**

> "Help me design a practical pay equity review for a mid-sized company before annual compensation planning."

**Expected skill response:**

- Define the purpose as identifying unexplained pay differences, not proving intent.
- Compare employees in similar work groups using role, level, job family, location, and employment type.
- Include base pay, bonus target, equity value, and total compensation when data quality allows.
- Involve legal counsel before analysis starts if the review may create privileged findings.

## Step 2 — Build the data request

**Sample prompt:**

> "Create a data request list for compensation, HRIS, and finance teams."

**Generated data request:**

- Employee ID
- Job title and standardized job family
- Level or grade
- Department and manager
- Work location and pay market
- Full-time or part-time status
- Base salary or hourly rate
- Bonus target and most recent payout
- Equity grant value, if applicable
- Hire date and time in role
- Performance rating history
- Promotion date
- Gender, race, ethnicity, and other legally approved demographic fields
- Leave status and employment status

## Step 3 — Create the review workflow

**Sample prompt:**

> "Give me a step-by-step workflow for running the pay equity review with finance, legal, and HR business partners."

**Generated workflow:**

1. Confirm legal review structure, data access, and confidentiality rules.
2. Clean job architecture data so employees are compared within valid groups.
3. Run initial pay comparisons by job family, level, location, and demographic group.
4. Flag differences that remain after accounting for tenure, performance, location, and role scope.
5. Review flagged cases with HR business partners for legitimate business context.
6. Prepare recommended adjustments with cost, timing, and employee impact.
7. Present aggregate findings to executives without exposing individual demographic details.
8. Document decisions, owners, and follow-up audits.

## Step 4 — Draft leader talking points

**Sample prompt:**

> "Write talking points for executives explaining why we are doing this review and how we will handle results responsibly."

**Generated talking points:**

```txt
We are conducting a structured pay equity review to make sure employees doing comparable work are paid fairly and consistently.

The review will compare employees within similar job families, levels, and locations. It will consider relevant business factors such as tenure, performance, role scope, and market differences.

If we find unexplained gaps, we will review them carefully and make appropriate adjustments through the compensation cycle. We will treat employee-level findings as confidential and report executive results in aggregate.

This review supports our compensation philosophy: fair, market-informed, consistent, and transparent where possible.
```

## Step 5 — Use an adjustment decision checklist

**Sample prompt:**

> "Create a checklist for deciding whether a flagged pay gap needs adjustment."

**Generated checklist:**

- [ ] Employees are in comparable job family, level, and location groups.
- [ ] Pay difference cannot be explained by documented scope differences.
- [ ] Performance history supports the current pay position.
- [ ] Tenure and time in role were reviewed.
- [ ] Recent promotions or counteroffers were considered but not used as the only explanation.
- [ ] Proposed adjustment fits salary range and internal equity.
- [ ] Legal and finance stakeholders approved the recommendation.

## Summary

Use `hr-compensation-benefits` to structure a pay equity review that is data-driven, legally careful, financially realistic, and connected to compensation decisions.
