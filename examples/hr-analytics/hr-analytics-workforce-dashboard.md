---
title: HR analytics workforce dashboard
reference: hr-analytics
---

# Example: HR analytics workforce dashboard

## Context

You are an HR manager at a 700-person software company. The executive team wants a monthly workforce dashboard that explains headcount, attrition, hiring, internal mobility, and engagement risk by department. Your HRIS exports are inconsistent, and leaders need clear insights before the quarterly talent review.

## Step 1 — Define the business questions

**Sample prompt:**

> "Help me turn raw HRIS exports into a workforce dashboard for executives. We need to understand headcount, attrition, hiring progress, and engagement risk by department."

**Expected skill response:**

- Anchor the dashboard on decisions leaders must make, not on every available HR metric.
- Separate descriptive metrics from risk indicators so executives know what happened and where action is needed.
- Use consistent definitions for active headcount, regrettable attrition, voluntary attrition, involuntary attrition, open roles, and internal mobility.
- Add clear data quality notes for missing manager, department, location, or termination reason fields.

## Step 2 — Build the dashboard metric map

**Sample prompt:**

> "Create a metric map for the dashboard with definitions, data fields, owner, update cadence, and action trigger."

**Generated metric map:**

| Metric | Definition | Required fields | Owner | Action trigger |
|---|---|---|---|---|
| Active headcount | Employees active on the last day of the reporting month | employee ID, status, department, location | HR operations | More than 5% variance from approved plan |
| Voluntary attrition | Voluntary exits divided by average headcount for the period | termination date, termination type, department | HR analytics | Two-month increase or top-quartile department rate |
| Regrettable attrition | Voluntary exits from high performers, critical roles, or flight-risk talent | performance rating, critical role flag, termination reason | HR business partner | Any critical-role loss |
| Hiring progress | Filled roles compared with approved openings | requisition ID, open date, close date, status | Talent acquisition | Role open more than 60 days |
| Internal mobility | Employees moving roles, departments, or levels internally | job change date, old role, new role | HR operations | Low movement in priority functions |
| Engagement risk | Combined signal from survey scores, manager changes, absence, and attrition trend | survey score, manager ID, absence days | People analytics | Red status for two months |

## Step 3 — Create a data quality checklist

**Sample prompt:**

> "Before I show this to executives, create a data quality checklist for the workforce dashboard."

**Generated checklist:**

- [ ] Every active employee has one employee ID.
- [ ] Department names match the approved organization structure.
- [ ] Termination reasons are grouped into standard categories.
- [ ] Contractors, interns, and employees are tagged separately.
- [ ] Open requisitions have an approved budget owner.
- [ ] Transfers are not counted as exits and new hires.
- [ ] Missing values are shown in a visible data quality note.

## Step 4 — Generate the executive summary

**Sample prompt:**

> "Write an executive summary for a dashboard where Engineering attrition rose to 14%, Sales hiring is 30 days behind plan, and Customer Support engagement dropped after a manager change."

**Generated summary:**

```txt
Monthly workforce dashboard summary

Overall headcount remains within 2% of the approved plan, but three workforce risks need leadership attention this month.

1. Engineering voluntary attrition increased to 14%, with two regrettable exits from critical platform roles. HR should partner with Engineering leadership on stay interviews and workload review within the next two weeks.
2. Sales hiring is behind plan by an average of 30 days across account executive roles. Talent acquisition needs a sourcing reset and faster interview scheduling with hiring managers.
3. Customer Support engagement declined after a manager transition. The HR business partner should review team feedback, manager support needs, and short-term staffing pressure.

Recommended next action: Review these three risks in the talent operating meeting and assign owners with due dates before the next dashboard cycle.
```

## Step 5 — Add a dashboard scorecard

**Sample prompt:**

> "Create a simple scorecard that helps executives read the workforce dashboard without overreacting to one-month changes."

**Generated scorecard:**

| Area | Green | Yellow | Red |
|---|---|---|---|
| Headcount plan | Within 3% of plan | 3% to 7% variance | More than 7% variance |
| Voluntary attrition | Stable or declining | Increase for one month | Increase for two months or above benchmark |
| Critical role risk | No critical exits | One critical-role exit | Multiple critical-role exits or no successor |
| Hiring progress | Roles filled on plan | Average delay under 30 days | Average delay over 30 days |
| Engagement | Stable survey trend | One team below threshold | Repeated low scores plus attrition risk |

## Summary

Use `hr-analytics` to convert messy HR data into an executive-ready dashboard with defined metrics, data quality checks, action triggers, and a short narrative that supports workforce decisions.
