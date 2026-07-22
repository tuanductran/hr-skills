# Designing an accommodation request process

## Context

You are the HR Director at a 1,200-person professional services firm that has grown through acquisitions. The company has no standardized accommodation request process — managers handle requests inconsistently, some employees don't know how to ask for accommodations, and HR has received two escalations in the past year where employees felt their requests were ignored or delayed. You need to build a process that is clear, legally defensible, and employee-friendly.

## Step 1 — Map the current state

**Sample prompt:**

> "We have no standard accommodation request process. Managers handle things informally and inconsistently. Where do I start building one?"

**Expected skill response:**

Before designing the new process, diagnose the gaps:

- How are accommodation requests currently reaching HR — email, verbal, manager escalation?
- Where are requests stalling — at intake, during the interactive dialogue, at approval, or at implementation?
- What documentation exists, and where is it stored?
- Are managers aware of their role, or are they making unilateral decisions without HR involvement?

Start with a brief audit: interview 3-4 managers and 2-3 HR business partners about how they handled recent accommodation situations. This surfaces the actual failure modes before you design the fix.

## Step 2 — Define the process stages

**Sample prompt:**

> "Help me design the end-to-end accommodation request process from employee request through implementation."

**Generated process stages:**

| Stage | Owner | Timeline | Key actions |
|---|---|---|---|
| 1. Intake | HR operations | Day 1 | Employee submits request via form or to HR; HR acknowledges within 2 business days |
| 2. Initial review | HR business partner | Days 2-5 | HR reviews request, confirms functional limitation information is sufficient |
| 3. Interactive dialogue | HR + employee (+ manager where appropriate) | Days 5-10 | HR meets with employee to understand needs; discusses options |
| 4. Feasibility review | HR + manager + legal (complex cases only) | Days 10-15 | HR assesses business impact, identifies effective accommodations |
| 5. Decision | HR | Day 15 | HR communicates decision in writing; records outcome |
| 6. Implementation | Manager + HR operations | Days 15-20 | Accommodation is set up; employee confirms it is working |
| 7. Follow-up | HR business partner | 90 days post-implementation | HR checks whether the accommodation remains effective |

## Step 3 — Design the intake form

**Sample prompt:**

> "Draft an accommodation request intake form that collects what we need without asking for a diagnosis."

**Generated form fields:**

```text
ACCOMMODATION REQUEST FORM

Employee name: ____________________
Job title: ____________________
Department: ____________________
Manager name: ____________________
Date of request: ____________________

Section 1 — Describe your situation
What limitation or challenge is affecting your ability to perform your job?
(You do not need to name a medical condition. Describe what is difficult.)

Section 2 — What you need
What type of support, change, or equipment do you think would help?
(You may not know the exact solution — that's fine. Describe the outcome you need.)

Section 3 — Duration
Is this a temporary or ongoing situation?
  [ ] Temporary — estimated duration: ____
  [ ] Ongoing
  [ ] Not sure

Section 4 — Urgency
Does this situation require urgent action?
  [ ] Yes — please describe why: ____
  [ ] No

Submission instructions:
Submit this form directly to HR at [email/portal link].
Your request will be acknowledged within 2 business days.
Your information will be kept confidential from your manager unless you consent to share it.
```

## Step 4 — Handle the interactive dialogue

**Sample prompt:**

> "What should the HR business partner cover in the interactive dialogue meeting with the employee?"

**Generated meeting guide:**

The interactive dialogue is a good-faith conversation — not an interrogation or an approval hearing. Cover:

- What the employee shared on the intake form, and confirm HR understood it correctly
- What functional tasks or aspects of the work are being affected
- What the employee believes would help (they often know their situation best)
- What has been tried before, if anything
- Whether the employee wants their manager involved at this stage or not
- Timeline — when is an accommodation needed, and how urgent is it?

Do not ask:

- What is your diagnosis?
- What medications are you taking?
- How long have you had this condition?
- Have you sought treatment?

Close by explaining next steps and the expected decision timeline.

## Step 5 — Write the decision communication

**Sample prompt:**

> "Draft an accommodation approval letter for an employee who requested a standing desk and permission to take movement breaks every 60 minutes."

**Generated letter:**

```text
Dear [Employee name],

Thank you for your accommodation request and for speaking with us about your situation.

We are pleased to confirm that the following accommodations have been approved, effective [date]:

1. Standing desk — A height-adjustable workstation will be arranged for your workspace by [date].
   Contact [facilities contact] to coordinate setup.

2. Movement breaks — You are approved to take a short movement break of up to 5 minutes every
   60 minutes during your workday. No prior approval from your manager is required for these breaks.

These accommodations will be reviewed at the 90-day mark to confirm they remain effective.
If your situation changes or the accommodation is not working, please contact HR directly.

This information will remain confidential within HR. If you would like your manager to be
informed about specific logistics (for example, the standing desk installation), please let us know.

Sincerely,
[HR Business Partner name]
Human Resources
```

## Step 6 — Build consistency checks

**Sample prompt:**

> "How do I make sure accommodation decisions are consistent across similar requests so we're not treating people differently for the same type of need?"

**Generated consistency framework:**

- Maintain a confidential HR case log with: request type, functional limitation category, accommodation offered, rationale, and outcome.
- Before deciding on a new request, check whether HR has handled similar situations and what the outcome was.
- Review the case log quarterly for patterns — if similar requests are getting different outcomes, identify why and correct the inconsistency.
- For complex or novel cases, get a second review from a senior HRBP or legal counsel before communicating the decision.
- Document the rationale for every denial — denials without documented reasoning are the highest legal risk.

## Summary

Use `hr-accessibility-accommodation` to design an accommodation request process that is clear for employees, consistent across managers, legally defensible for HR, and rooted in the interactive dialogue principle — not a compliance checkbox exercise.
