# Managing an unplanned layoff

## Context

You are the VP of HR at a 600-person SaaS company. At 5 PM on a Thursday, the CEO calls to inform you that the board has approved an immediate 20% workforce reduction — 120 employees — due to a funding shortfall. The layoff must be completed by end of business Friday. You have 18 hours to plan and execute the largest reduction in the company's history.

## Step 1 — Immediate priorities in hour one

**Sample prompt:**

> "We just got told we need to lay off 20% of the company by tomorrow evening. What do I do in the next hour?"

**Expected skill response:**

In the first hour, do not start drafting communications or selecting employees. Do these first:

**1. Get legal on the phone immediately.**

Confirm whether WARN Act notice obligations apply (US: 100+ employees, 50+ affected, or 33% of workforce). If they apply and you cannot give 60 days notice, understand the cash-in-lieu-of-notice implications and consult on whether exceptions apply.

**2. Establish a decision-making structure.**

Identify who makes what decisions:
- CEO/board: final approval on business rationale and affected populations
- CFO: severance budget, final numbers
- Legal counsel: process compliance, separation agreements
- CHRO/VP HR: process design, manager preparation, communication
- HRBP team: execution support

**3. Lock down information.**

Confirm who knows and who must know. Leaks before notification create chaos and legal risk. HR system access for affected employees should be planned for suspension at notification time.

**4. Understand the selection rationale.**

Has leadership already identified the affected population, or does HR need to work with business leaders to determine it? The answer changes what happens in the next 3 hours significantly.

## Step 2 — Notification logistics

**Sample prompt:**

> "Help me design the notification logistics for 120 employees across 4 time zones."

**Generated notification plan:**

| Element | Decision |
|---|---|
| Notification format | 1:1 meeting with manager + HR present (video call for remote employees) |
| Timing | All notifications within a 2-hour window to prevent information spreading before everyone is told |
| Meeting length | 15 minutes maximum — deliver the message, provide the packet, allow for questions, end the call |
| HRBP ratio | 1 HRBP per 15-20 notifications; each HRBP manages 3-4 managers through their notifications |
| System access | IT suspends system access at the start of the notification window for affected employees |
| Manager briefing | Managers are briefed the morning of notification day, 2-3 hours before employee meetings |

**Notification meeting flow:**

```text
1. Manager opens meeting (30 seconds)
   "Thank you for joining this meeting. I have HR here with me."

2. Deliver the decision (1-2 minutes)
   "I need to share some difficult news. The company has made the decision to eliminate your role
   as part of a reduction in force. Today is your last day of employment."

3. HRBP covers key logistics (3-5 minutes)
   - Severance terms and timeline
   - Benefits continuation (COBRA/equivalent)
   - How to return equipment
   - Reference and verification of employment

4. Allow questions (5-7 minutes)
   Answer what you can; say "I'll follow up in writing" for anything complex.

5. Close the meeting
   "We'll follow up with everything in writing to your personal email within 24 hours."
```

## Step 3 — Severance and separation documents

**Sample prompt:**

> "What should be in the separation package and what legal review is required before we distribute it?"

**Key severance package components:**

| Component | Standard practice |
|---|---|
| Severance amount | Typically 1-2 weeks per year of service (confirm company policy and budget) |
| Benefits continuation | COBRA enrollment information; active benefits through end of month or end of notification period |
| Equity treatment | Per plan documents — confirm vesting cliff and acceleration provisions with legal |
| Release of claims | Required for ADEA compliance if releasing employees over 40; requires 21-day consideration period and 7-day revocation |
| Reference policy | Confirm what HR will say; avoid disparaging characterizations |
| Return of property | Clear instructions on equipment return, timeline, and what happens if not returned |

**Legal review checklist before distribution:**

- [ ] WARN Act compliance confirmed or exception documented
- [ ] ADEA requirements met for employees over 40 (class list if group termination)
- [ ] No discriminatory impact analysis completed on affected population
- [ ] Separation agreement reviewed by employment counsel
- [ ] State-specific requirements confirmed for all employee locations

## Step 4 — Manager preparation

**Sample prompt:**

> "Help me write a briefing document for managers who will be delivering the notifications tomorrow morning."

**Generated manager briefing:**

```text
MANAGER BRIEFING — CONFIDENTIAL

Overview:
Tomorrow morning, you will be delivering a reduction in force notification to [X] member(s) of
your team. HR will be present in each meeting to support you. This briefing prepares you
for what to say, what not to say, and what happens after the meeting.

What to say:
  — The decision is final and was made by company leadership
  — The role is eliminated, not the person
  — You are available to provide a reference for their next role

What not to say:
  — Do not speculate on whether more layoffs are coming
  — Do not express personal disagreement with the decision to the employee being notified
  — Do not promise outcomes HR or legal have not confirmed (severance amounts, rehire, etc.)
  — Do not apologize repeatedly — one clear acknowledgment is appropriate; excessive apology
     prolongs distress and creates awkwardness

Expect these reactions:
  — Silence or shock: give them a moment; don't fill the silence immediately
  — Anger: stay calm; acknowledge the feeling; do not escalate or defend the business
  — Tears: allow it; offer a pause; have water and tissues available
  — Immediate questions about pay or benefits: HR will cover this in the meeting

After the meeting:
  — Your remaining team members will know something happened. Schedule a team meeting for that
     afternoon to acknowledge the change without discussing individuals.
  — HR will provide you with talking points for your surviving team by noon on notification day.
```

## Step 5 — Communicate with surviving employees

**Sample prompt:**

> "Write an all-hands message for the employees who were not laid off. They'll be anxious and looking for leadership."

**Generated all-hands message:**

```text
Subject: An update to our team

Team,

By now, many of you know that we made difficult changes to our workforce today. We let go of
120 colleagues — 20% of our team. This was one of the hardest decisions our leadership team
has ever made, and I want to be honest with you about why we made it and what comes next.

Why we made this decision:
Our funding environment changed significantly faster than we anticipated. To reach profitability
at our current revenue level, we needed to reduce our cost structure. We explored every
alternative, and a reduction in force was the only path that gives the company a viable future.

What happens next:
We are not planning further reductions. The team we have now is the team we are building with.
Starting next week, each leadership team will share what our revised plan looks like and what
our priorities are for the next two quarters.

For those who were affected:
We are supporting everyone who was let go with [severance details, reference support, career
services]. They were good colleagues, and their contributions to what we've built matter.

I know today was hard. I want to talk with you directly — we'll hold an open Q&A session
on [day/time]. There are no off-limits questions.

[CEO name]
```

## Summary

Use `hr-crisis-management` to respond to unplanned workforce reductions with a structured legal-first approach, coordinated notification logistics, legally compliant separation packages, prepared managers, and honest communication to surviving employees — all executed within a compressed timeline.
