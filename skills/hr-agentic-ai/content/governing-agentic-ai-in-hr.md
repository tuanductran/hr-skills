# Governing Agentic AI in HR

## Overview

Agentic AI represents a fundamental shift in how AI operates in HR. Unlike conventional AI tools that generate outputs for a human to act on, agentic systems take actions autonomously — sending emails, updating records, scheduling interviews, making API calls, and chaining tasks across systems without a human approving each step.

For HR leaders, this shift demands a new governance posture. The risks are not hypothetical: an autonomous recruiting agent that emails thousands of candidates with incorrect information, or an onboarding agent that enrolls employees in the wrong benefits tier, can cause real organizational and legal harm.

## How Agentic AI Differs from Traditional AI in HR

| Traditional AI | Agentic AI |
|---|---|
| Generates a draft for a human to send | Sends the message on its own |
| Produces a list of candidates | Contacts and schedules them |
| Scores a resume | Advances or rejects the candidate in the ATS |
| Flags a policy violation | Takes corrective action |

The key difference is **action versus recommendation**. Agentic systems collapse the human review step, which is the primary governance challenge.

## High-Value HR Use Cases for Agentic AI

These use cases offer genuine efficiency gains with manageable governance risk when designed well.

### Low-risk (start here)

- Interview scheduling and rescheduling
- Pre-boarding task sequences (form completion, document collection)
- HR policy FAQ resolution
- Meeting notes and action item capture
- Benefits enrollment reminders and status tracking

### Medium-risk (requires oversight design)

- Resume screening and initial outreach to candidates
- Onboarding plan generation and progress tracking
- Leave and accommodation request routing
- Employee survey follow-up workflows

### High-risk (human review required at each decision point)

- Employment decisions (offers, rejections, promotions)
- Performance-based actions (PIPs, terminations)
- Disciplinary process steps
- Compensation changes

## Human Oversight Framework Design

Effective oversight is not a checkbox. It is a workflow design decision made before deployment.

### The three oversight models

**Full review** — a human approves every agent action before execution. Use for high-risk decisions and during pilots. Slower but safest.

**Exception review** — the agent acts autonomously within defined parameters. Actions outside those parameters are held for human review. Use for mature, low-risk workflows with well-understood edge cases.

**Audit review** — the agent acts fully autonomously. Humans review a sample of actions after the fact. Only appropriate for very low-stakes, easily reversible actions.

Never use audit review for actions that affect employment status, compensation, or sensitive employee data.

### Questions to answer before deployment

- What is the worst realistic outcome if this agent acts incorrectly?
- Is that outcome reversible?
- Who is notified when the agent takes an action?
- What triggers a human to intervene?
- Who is accountable when the agent makes an error?

## Designing the Kill Switch

Every agentic HR deployment must have a tested, documented rollback procedure before go-live.

Rollback design should cover:

- How to pause the agent without losing state
- How to notify affected employees or candidates if the agent took an incorrect action
- Who has authority to invoke the rollback
- How affected records are corrected

Test the rollback before launching the pilot, not after something goes wrong.

## Employee Transparency Requirements

Employees and candidates have a reasonable expectation to know when they are interacting with an AI agent. Transparency is both an ethical standard and, in many jurisdictions, a legal one.

Minimum transparency standards:

- Clearly identify AI agent interactions at the point of contact
- Explain what the agent can and cannot do
- Provide a direct path to a human HR contact
- Document whether and how AI actions affect employment decisions

## Vendor Evaluation Checklist

When evaluating vendors selling agentic HR AI, ask:

- What actions can the agent take without human confirmation, and how are those configured?
- What audit logs are available, and how long are they retained?
- How are agent failures handled — does it fail silently or alert?
- What data does the agent access, and what are the data residency and deletion policies?
- Can you demonstrate the agent operating at the boundaries of its configured parameters?
- What is the rollback process if we need to halt the agent?

Vendors who cannot clearly answer these questions should not be trusted with autonomous HR workflows.
