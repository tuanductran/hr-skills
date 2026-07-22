# Assessing HR risk during rapid growth

## Context

A fintech company is growing from 150 to 400 employees over 18 months following a Series C raise. The CHRO has been asked by the board to present the top people risks associated with this growth trajectory and the mitigation plan before the next funding round. HR has no formal risk register and no prior documented risk management process.

## Step 1: Identify the top HR risks

Sample prompt: "Identify the top 10 HR risks for a 150-person fintech company undergoing rapid growth to 400 employees over 18 months."

Expected response:

| Risk | Category | Likelihood | Impact |
|---|---|---|---|
| Manager capability gap — promoting ICs too quickly | Operational | High | High |
| Compliance gaps as headcount crosses regulatory thresholds | Compliance | High | High |
| Culture dilution from fast hiring | People/Cultural | High | Medium |
| Key-person dependency in technical leadership | Operational | Medium | High |
| Compensation compression as market rates shift | People | Medium | High |
| Inconsistent onboarding quality at scale | Operational | High | Medium |
| HRIS and HR process infrastructure lag | Operational | Medium | Medium |
| Flight risk in critical engineering roles | People | Medium | High |
| Employee relations capacity — no formal ER function | Compliance | Low-Medium | High |
| Data privacy exposure as people data volumes grow | Compliance | Medium | High |

## Step 2: Build the risk register

Sample prompt: "Create an HR risk register for the top 5 people risks identified during rapid growth, with mitigation actions and owners."

Expected response: A structured register with each risk covering:

- Risk description: concise, specific to this company's context
- Current controls: what is already in place (even informally)
- Mitigation actions: 2-3 specific, named actions with a timeline
- Owner: named function or role
- Review trigger: what event would prompt an early review of this risk

## Step 3: Address the key-person risk

Sample prompt: "Write a workforce key-person dependency risk map identifying roles where departure would cause significant disruption, and recommend mitigation actions."

Expected response: Identifies 3-5 roles (typically Head of Engineering, Chief Architect, and any sole owner of critical business process or client relationship). Mitigation actions include: document critical knowledge and processes; begin succession conversation and cross-training; consider retention agreements with vesting milestones; identify internal candidates who could step up with 6-12 months of development.

## Step 4: Present to the board

Sample prompt: "Design a quarterly HR risk review process for senior leadership — format, agenda, and how to connect risk findings to business decisions."

Expected response:

- Format: 30-minute board agenda item or CHRO written briefing
- Agenda: top 5 open risks with status update, any new risks identified since last review, one deep-dive on the highest-priority risk
- Connection to business decisions: each risk should link to a business decision that could be affected — for example, "manager capability risk affects our ability to sustain product velocity during the growth phase"
- Escalation: any risk moving from Medium to High likelihood or impact is escalated immediately, not held until the next quarterly review

## Workflow summary

Use `hr-risk-management` to identify and quantify people risks before they materialize, build a structured register that gives ownership and accountability to every risk, and present findings to leadership in a format that connects HR risk to business outcomes rather than treating it as a purely administrative function.
