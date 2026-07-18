# Skills gap analysis for a technology function

## Context

You are the HR Business Partner for the Engineering function at a 500-person software company. The CTO has announced a three-year platform modernization strategy that requires the engineering team to shift from legacy monolithic architecture to cloud-native, microservices-based systems.

The CHRO has asked you to conduct a skills gap analysis for the Engineering function to support hiring, L&D investment, and workforce planning decisions for the next 18 months.

## Step 1 — Define the required skills profile

**Sample prompt:**

> "We are modernizing our engineering platform from monolithic to cloud-native microservices over three years. Build a required skills profile for our Engineering function covering the top 15 technical and behavioral skills we will need most, with a four-level proficiency scale for each."

**Expected skill response:**

- Define the 15 skills in three categories: cloud and infrastructure, software engineering practices, and behavioral/collaboration skills.
- Provide a four-level proficiency scale (Foundational → Expert) with observable behaviors.
- Flag which skills are broadly required across the engineering team versus which are specialist skills needed in a smaller subset.

**Excerpt from generated skills profile:**

| Skill | Category | Required level — Individual Contributor | Required level — Tech Lead |
|---|---|---|---|
| Cloud infrastructure (AWS / GCP / Azure) | Cloud | Developing (2) | Proficient (3) |
| Containerization (Docker / Kubernetes) | Cloud | Developing (2) | Proficient (3) |
| Microservices design patterns | Engineering | Developing (2) | Expert (4) |
| CI/CD pipeline management | Engineering | Foundational (1) | Proficient (3) |
| System observability and monitoring | Engineering | Foundational (1) | Developing (2) |
| Agile and iterative delivery | Behavioral | Developing (2) | Proficient (3) |
| Cross-functional collaboration | Behavioral | Developing (2) | Expert (4) |

## Step 2 — Design the skills self-assessment

**Sample prompt:**

> "Design a skills self-assessment survey for 120 engineers covering the 15 skills we identified. Include calibration guidance so engineers rate themselves consistently, and a manager validation step."

**Expected skill response:**

- A survey structure with clear rating instructions.
- Calibration examples showing what each proficiency level looks like for representative skills.
- A manager validation workflow covering how managers review, discuss, and confirm ratings.

**Generated calibration guidance example:**

```text
Skills self-assessment — rating guide

Before rating each skill, read the level descriptions carefully.

Example: Cloud infrastructure (AWS / GCP / Azure)

Level 1 — Foundational
You understand core cloud concepts (regions, VPCs, compute, storage).
You have completed a cloud fundamentals course or equivalent learning.
You need guidance to implement cloud solutions in production.

Level 2 — Developing
You independently deploy and configure standard cloud resources.
You can implement a basic three-tier architecture on a major cloud platform.
You troubleshoot common cloud configuration issues without help.

Level 3 — Proficient
You design scalable, cost-efficient cloud architectures for your team's services.
You review and approve cloud infrastructure decisions made by others.
You mentor junior engineers on cloud best practices.

Level 4 — Expert
You define the cloud architecture strategy for the organization.
You are recognized internally and externally as a cloud authority.
You evaluate and select cloud services for new platform capabilities.

Rate yourself honestly. Your manager will review your ratings in a follow-up conversation.
```

## Step 3 — Analyze the gap data

**Sample prompt:**

> "We collected skills self-assessment data from 120 engineers. Here is a summary of average current proficiency versus required proficiency by skill: [paste data]. Produce a skills gap analysis with priority ranking, business risk assessment, and recommended actions."

**Expected skill response:**

- A ranked gap analysis table showing which skills have the largest gaps relative to business need.
- A risk assessment identifying which gaps pose the highest risk to the modernization program.
- Recommended actions categorized as: hire, develop internally, or use contingent talent.

**Generated gap analysis excerpt:**

| Skill | Current avg. | Required level | Gap | Business risk | Recommended action |
|---|---|---|---|---|---|
| Containerization | 1.2 | 2.0 | 0.8 | High | Upskilling program + 3 specialist hires |
| Microservices design | 1.1 | 2.0 | 0.9 | Critical | Senior engineer hire + internal coaching program |
| CI/CD pipeline | 1.4 | 2.0 | 0.6 | High | L&D investment (hands-on labs) |
| System observability | 1.6 | 2.0 | 0.4 | Medium | Peer learning + tooling enablement |
| Cross-functional collaboration | 2.3 | 3.0 | 0.7 | Medium | Team practices + manager coaching |

**Key finding:**

Microservices design and containerization are the most critical gaps with the highest business risk. The current team cannot lead the platform modernization without targeted intervention in these two areas within the next six months.

## Step 4 — Build the action plan

**Sample prompt:**

> "Based on the gap analysis, build an 18-month action plan covering: which skills we will develop internally, which we will hire for, and which we will address through contingent or partner resources. Include milestones and success metrics."

**Generated action plan summary:**

```text
Engineering Skills Action Plan — 18 Months

Build (develop internally):
- Containerization upskilling program: 12-week hands-on lab series, targeting all 120 engineers.
  Milestone: 80% of engineers reach Level 2 by Month 6.
- CI/CD pipeline: Embedded learning through DevOps Guild + peer coaching.
  Milestone: All teams operating a CI/CD pipeline by Month 9.

Buy (hire externally):
- 3 Senior Cloud Engineers (AWS/GCP): Hire in Months 1–3 to anchor cloud architecture.
- 2 Staff Engineers (Microservices): Hire in Months 2–4 to lead microservices design.

Borrow (contingent / partner):
- Engage implementation partner for platform modernization Sprint 1 (Months 1–6) to
  provide hands-on coaching alongside internal engineers.

Success metrics:
- Average proficiency gain of 0.8 across priority skills by Month 12.
- Zero critical-skill gaps rated above 0.5 by Month 18.
- Reduction in cloud-related production incidents by 30% by Month 12.
```

## Step 5 — Communicate findings to leadership

**Sample prompt:**

> "Write a one-page executive summary of the skills gap analysis for the CTO and CHRO, covering: key findings, business risk, recommended investments, and the 18-month outcome we are targeting."

**Generated executive summary:**

```text
Engineering Skills Gap Analysis — Executive Summary

Situation
We assessed skills readiness across 120 engineers against the capability profile required
for the three-year platform modernization program. Two critical gaps require immediate action.

Key findings
1. Containerization and microservices design are the most critical gaps, with average
   proficiency more than 0.8 below the required level for the modernization program.
2. Cloud infrastructure skills are developing but will not reach required levels without
   a structured upskilling program and targeted senior hires.
3. Behavioral skills — particularly cross-functional collaboration — need targeted
   improvement as teams shift to cross-functional product delivery.

Business risk
Without intervention, the platform modernization program will face delivery delays in
Sprints 2 and 3 as internal engineering teams will not have sufficient skills to lead
cloud-native design and microservices implementation independently.

Recommended investment
- 5 targeted senior and staff engineer hires: Months 1–4.
- 12-week containerization upskilling program for all engineers: Months 2–5.
- Implementation partner engagement for platform Sprint 1: Months 1–6.

18-month outcome
By Month 18, all critical skill gaps will be below 0.5 average gap, 80% of engineers
will be independently contributing to cloud-native delivery, and the team will have
reduced dependency on external delivery support.
```

## Summary

Use `hr-skills-management` to run a structured skills gap analysis that connects directly to business strategy, produces prioritized action plans, and gives leadership a clear picture of capability risk and investment options.

> Related skills: [`hr-strategic-workforce-planning`](../../hr-strategic-workforce-planning/SKILL.md) for connecting skills data to headcount planning, [`hr-learning-development`](../../hr-learning-development/SKILL.md) for designing upskilling interventions, [`hr-competency-management`](../../hr-competency-management/SKILL.md) for connecting skills to role proficiency frameworks.
