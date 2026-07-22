# Building a competency framework from scratch

## Context

You are the Head of Talent at a 900-person technology company that has grown rapidly through hiring. The organization has no shared competency language — hiring managers use different criteria, performance reviews are inconsistent across teams, and HR has no structured way to identify development needs or succession candidates. The CHRO has asked you to build a competency framework that can anchor hiring, performance, and development across the company.

## Step 1 — Define the framework scope

**Sample prompt:**

> "We need a competency framework. Where do I start, and how do I avoid building something no one uses?"

**Expected skill response:**

Start by scoping three things before you write a single competency:

**1. What problems must the framework solve?**

- Inconsistent hiring criteria across teams?
- Performance reviews that only measure outputs, not how work gets done?
- No language for identifying high-potential employees for development?

Each problem has a different design implication. A framework built for hiring looks different from one built for succession.

**2. What is the framework architecture?**

Most organizations use three layers:
- Core competencies (5-7) — expected of everyone, tied to culture and values
- Leadership competencies (4-6) — expected of managers and leaders
- Functional competencies (6-10 per function) — role-specific domain expertise

**3. How will you validate that these competencies predict success?**

A framework not grounded in what actually differentiates high performers from average performers will be ignored. Plan to validate through top-performer interviews, job analysis, and manager input before finalizing.

## Step 2 — Design the core competency set

**Sample prompt:**

> "Help me define 6 core competencies for a technology company that values speed, customer obsession, and cross-functional collaboration."

**Generated core competency set:**

| Competency | Definition |
|---|---|
| Customer impact | Understands customer needs deeply and connects work to measurable customer outcomes |
| Collaborative execution | Works across teams and functions to deliver results; shares information proactively |
| Analytical thinking | Uses data and structured reasoning to diagnose problems and make sound decisions |
| Adaptability | Adjusts approach quickly in response to new information, changing priorities, or setbacks |
| Communication | Conveys ideas clearly and persuasively across different audiences and formats |
| Ownership | Takes end-to-end accountability for outcomes; follows through without needing to be managed |

## Step 3 — Define behavioral indicators

**Sample prompt:**

> "Write behavioral indicators for 'Ownership' at four proficiency levels: developing, proficient, advanced, and expert."

**Generated behavioral indicators — Ownership:**

**Developing:**

- Completes assigned tasks reliably when given clear direction
- Asks for help when blocked rather than waiting for a problem to escalate
- Beginning to take initiative on small improvements within their immediate scope

**Proficient:**

- Takes end-to-end accountability for their work area, including quality, timeline, and stakeholder communication
- Anticipates risks and addresses them proactively rather than reacting to problems
- Follows through on commitments without requiring reminders or close oversight

**Advanced:**

- Identifies and resolves cross-functional issues that fall between team boundaries
- Takes accountability for team outcomes, not just individual contributions
- Volunteers to own difficult, ambiguous, or high-stakes problems others avoid

**Expert:**

- Creates organizational systems and norms that build ownership culture at scale
- Holds themselves and others visibly accountable in ways that reinforce the standard for the whole organization
- Makes high-stakes bets and owns both the upside and the downside

## Step 4 — Build competency-based interview guides

**Sample prompt:**

> "Write 3 behavioral interview questions for the 'Ownership' competency at the Proficient level, with scoring anchors."

**Generated interview questions:**

**Question 1:**

> "Tell me about a time you realized a project you were responsible for was off track. What did you do, and what was the outcome?"

Scoring anchor — Strong (Proficient): Candidate identified the risk early, took personal accountability without blaming others, developed a recovery plan, communicated proactively to stakeholders, and delivered or came close to the original commitment.

Scoring anchor — Weak: Candidate escalated to their manager without their own diagnosis, blamed external factors, or only addressed the issue after being prompted.

**Question 2:**

> "Describe a situation where you committed to something and later realized it might not be achievable. How did you handle it?"

Scoring anchor — Strong: Candidate revised expectations early, proposed alternatives, and maintained credibility with stakeholders through transparency.

Scoring anchor — Weak: Candidate waited until the deadline had passed, surprised stakeholders, or minimized the significance of the miss.

**Question 3:**

> "Tell me about a problem in your team or organization that wasn't your direct responsibility but that you took action on anyway. Why, and what happened?"

Scoring anchor — Strong: Candidate identified a gap, decided not to wait for someone else to own it, took initiative proportionate to the situation, and drove a positive outcome.

Scoring anchor — Weak: Candidate passed the problem to someone else, waited for a manager to assign it, or had no examples of proactive ownership beyond their direct scope.

## Step 5 — Integrate into performance reviews

**Sample prompt:**

> "Create a competency rating section for our performance review form that evaluates the 6 core competencies without creating a checkbox exercise."

**Generated review section:**

```text
COMPETENCY ASSESSMENT

For each competency, select the rating that best reflects the employee's consistent behavior
over the review period. Support each rating with 1-2 specific examples.

Rating scale:
  Below expectations — Behavior does not consistently meet the Proficient standard
  Meets expectations  — Behavior consistently meets the Proficient standard for this role level
  Exceeds expectations — Behavior consistently exceeds Proficient; approaching Advanced

Competency                        | Rating | Supporting example (required)
----------------------------------|--------|-------------------------------
Customer impact                   |        |
Collaborative execution           |        |
Analytical thinking               |        |
Adaptability                      |        |
Communication                     |        |
Ownership                         |        |

Calibration note: "Exceeds" should reflect observed behavior, not potential or tenure.
Rate what you have seen, not what you expect from this person.
```

## Step 6 — Plan the rollout

**Sample prompt:**

> "What does a successful competency framework rollout look like for a 900-person company? What are the common failure modes?"

**Rollout phases:**

| Phase | Timeline | Focus |
|---|---|---|
| Design and validation | Months 1-3 | Co-design with business leaders, validate with top performers and managers |
| Pilot | Month 4 | Test in 2-3 teams; gather feedback on usability and language clarity |
| Manager enablement | Month 5 | Train managers on how to use the framework in hiring and conversations |
| Full launch | Month 6 | Embed into hiring tools, performance review forms, and development templates |
| Calibration | Months 6-9 | Run calibration sessions to align rating consistency across teams |

**Common failure modes:**

| Failure | Prevention |
|---|---|
| Framework is too long — 20+ competencies no one can remember | Cap at 5-7 core; layer functional on top for specific use cases |
| Competency language is generic corporate-speak | Use behavioral indicators grounded in real examples from your top performers |
| HR builds it alone without manager input | Involve 10-15 managers and senior individual contributors in design and validation |
| Framework launches but nothing changes in reviews or interviews | Embed it in the tools people already use — don't add a parallel process |
| No calibration — ratings drift to mean different things across teams | Build a calibration cadence into review cycles from the start |

## Summary

Use `hr-competency-management` to design a competency framework grounded in real performance data, define behavioral indicators at multiple proficiency levels, and embed the framework into hiring interviews, performance reviews, and development conversations — so it becomes the shared language of talent decisions rather than a document on a SharePoint page.
