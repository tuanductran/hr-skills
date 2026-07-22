# Automating the Leave Request Approval Workflow

## Context

An HR shared-services team manually processes over 400 leave requests a month across email and spreadsheets, causing approval delays and payroll errors. Leadership wants to automate the routine cases while keeping human judgment for exceptions.

## Step 1: Map the process and find automation potential

Sample prompt: "Map the offboarding process end to end and flag which steps can be automated versus which need a human decision" (adapted to leave requests).

Expected response: A process map showing that standard, policy-compliant requests (sufficient balance, advance notice met) can be auto-approved and synced to payroll, while requests involving negative balances, overlapping team absences, or protected leave types are flagged for a human reviewer.

## Step 2: Design the automated workflow

Sample prompt: "Design an automated escalation rule that routes a leave request to HR only when it falls outside standard policy parameters."

Expected response: A rule set auto-approving requests meeting all standard criteria and routing exceptions to an HR queue with the specific reason flagged (for example, "balance insufficient" or "protected leave type"), so reviewers aren't re-checking every request from scratch.

## Step 3: Validate data quality and plan for failure

Sample prompt: "Write a data-quality checklist to run before automating a workflow that depends on HRIS employee records" and "Draft a rollback plan for an automated onboarding workflow that starts sending incorrect task assignments" (adapted to leave automation).

Expected response: A checklist confirming leave balances, employment type, and manager-of-record fields are accurate in the HRIS before go-live, plus a rollback plan that reverts to manual review for any employee whose auto-approved leave doesn't match their subsequent payroll record.

## Workflow summary

The team automates the routine, low-risk majority of leave requests while explicitly routing exceptions to a human, and protects against silent errors with a data-quality check and a rollback path.
