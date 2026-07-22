# Fixing a Low-Adoption HR Chatbot Before a Full Rollout

## Context

An HR chatbot piloted with one department shows employees still email HR directly for questions the bot is supposed to handle. Login data looks fine, but resolution rate is low, and leadership wants to know whether to expand the pilot company-wide.

## Step 1: Diagnose the real problem

Sample prompt: "Identify which of our top 20 HR inquiries are actually suited for self-service versus needing a human, based on complexity and sensitivity."

Expected response: A finding that several of the bot's assigned topics — leave policy exceptions, compensation questions — are too case-specific for self-service and were driving both the low resolution rate and the direct emails, since employees learned quickly the bot couldn't actually resolve those.

## Step 2: Fix the content and the escalation path

Sample prompt: "Write a clear, employee-friendly FAQ answer for 'How do I request unpaid leave?' that an employee can act on without calling HR" and "Design chatbot escalation paths so employees reach a human HR contact when the bot can't help, instead of getting stuck in a loop."

Expected response: A rewritten FAQ answer giving the actual steps and eligibility criteria in plain language, plus an escalation path that routes to a named HR contact after one failed clarification attempt rather than looping the employee through repeated bot prompts.

## Step 3: Rebuild trust before expanding

Sample prompt: "Draft a change management plan to drive adoption of our new HR chatbot among employees who currently just email HR directly."

Expected response: A plan that re-launches the bot to the pilot department only after the content fixes are in place, with a short message acknowledging the earlier gaps and highlighting the specific topics now fixed, before expanding to additional departments.

## Workflow summary

Rather than blaming low adoption on unfamiliarity, the team diagnoses that the bot was scoped to handle questions it couldn't actually resolve, fixes the content and escalation path, and rebuilds trust with the pilot group before expanding further.
