# Running an ATS vendor selection process

## Context

You are the Head of Talent Acquisition at a 700-person technology company. The company has been using a legacy ATS that was appropriate when the company had 200 employees but no longer supports the volume, structure, or reporting needs of a mature TA function. The CHRO has approved a replacement budget and wants a new system live within seven months.

You need to run a structured vendor selection process that produces a defensible recommendation and avoids the most common ATS implementation failure modes.

## Step 1 — Define the requirements

**Sample prompt:**

> "Write a vendor requirements document for an ATS replacement for a 700-person technology company with a TA team of 8. We hire approximately 200 roles per year across engineering, sales, and operations. Our current pain points are: weak reporting, no structured interview scorecards, poor candidate experience on mobile, and no integration with our HRIS (Workday)."

**Generated requirements document outline:**

```text
ATS Requirements — [Company] — [Date]

Company context
700 employees. 200 hires per year. TA team of 8. Roles: Engineering (45%),
Sales (30%), Operations (25%). Current system: [legacy ATS].

Core functional requirements (must-have)
- Structured interview scorecards with competency-based rating scales
- Mobile-optimized candidate application experience
- Workday integration via native or API connector
- Reporting: time-to-fill, source effectiveness, offer acceptance rate, pipeline by stage
- Configurable hiring workflows by role type (tech vs. non-tech)
- Candidate CRM for pipeline and talent community management
- Offer letter generation and e-signature

Nice-to-have
- AI-assisted candidate screening or ranking
- Video interview integration (native or via connector)
- DEI hiring metrics and reporting
- Employee referral portal

Integration requirements
- Workday HRIS: bidirectional hire handoff (new hire record creation in Workday on offer accept)
- Background check vendor: current provider [name]; must support API integration
- LinkedIn: job posting and candidate sourcing
- HRIS identity system: SSO via [Okta]

Security and compliance requirements
- SOC 2 Type II certification required
- GDPR compliance for candidate data (we have EU applicants)
- Data residency: EU candidate data must be stored in EU region
- Candidate data deletion on request must be supported

Success criteria at 12 months
- TA team reports time savings of at least 3 hours per week per recruiter
  vs. current system
- Structured scorecards used in 90%+ of final-round interviews
- Hiring manager satisfaction with ATS experience ≥ 7/10 (survey)
- Workday integration running with zero manual data entry for hire records
```

## Step 2 — Build the evaluation scorecard

**Sample prompt:**

> "Build a weighted vendor evaluation scorecard for our ATS selection comparing Greenhouse, Lever, and Ashby. Use our requirements document as the basis. Weight criteria by strategic importance."

**Generated scorecard (excerpt):**

| Criterion | Weight | Greenhouse | Lever | Ashby |
|---|---|---|---|---|
| Structured interview scorecards | 15% | 9 | 8 | 9 |
| Mobile candidate experience | 10% | 8 | 8 | 9 |
| Workday integration (native) | 15% | 9 | 7 | 7 |
| Reporting and analytics depth | 15% | 8 | 7 | 9 |
| Hiring manager UX | 10% | 8 | 8 | 9 |
| Candidate CRM capability | 10% | 7 | 9 | 7 |
| Implementation track record | 10% | 9 | 7 | 7 |
| Total cost of ownership (3 yr) | 10% | 7 | 8 | 8 |
| Security (SOC 2, GDPR) | 5% | 9 | 9 | 9 |
| **Weighted total** | **100%** | **8.3** | **7.8** | **8.3** |

### Tie-breaker analysis: Greenhouse vs. Ashby

Greenhouse scores higher on Workday integration maturity and implementation track record. Ashby scores higher on reporting depth and modern UX. Given our Workday dependency and the risk profile of a first-time structured implementation, Greenhouse is the lower-risk choice.

## Step 3 — Run structured demos

**Sample prompt:**

> "Write a demo script for our ATS vendor demos that tests our specific use cases rather than letting vendors show generic feature walkthroughs."

**Generated demo script:**

```text
ATS Vendor Demo — Required Scenarios (90 minutes)

Scenario 1: Engineering hiring workflow (20 min)
Walk through opening a Senior Software Engineer requisition.
Show: approval workflow, job post to LinkedIn, structured scorecard setup
with 5 competencies, hiring manager interview assignment, candidate evaluation,
and offer generation.
We will provide: our actual competency list and a sample offer letter template.

Scenario 2: Reporting (15 min)
Show us these specific reports without advance setup:
- Time-to-fill by department for the last 90 days
- Source effectiveness (applicants and hires by source)
- Pipeline conversion rate by stage
- Offer acceptance rate by role level
We will assess: whether these are native reports or require custom build.

Scenario 3: Workday integration (15 min)
Demonstrate or walk through your Workday integration:
- How does an accepted offer trigger a new hire record in Workday?
- What fields map automatically vs. require manual entry?
- What happens if a hire is rescinded after Workday record creation?

Scenario 4: Candidate experience (10 min)
Show us the mobile application experience for a candidate.
We will test on a real phone during the demo.

Scenario 5: Hiring manager experience (10 min)
Log in as a hiring manager (not an admin) and show:
- How does a hiring manager see their open roles and candidate pipeline?
- How do they submit a scorecard after an interview?
- Can they give an offer approval from mobile?

Scenario 6: Questions (20 min)
Open Q&A covering: implementation timeline, support model,
reference customers at our scale, and pricing structure.
```

## Step 4 — Negotiate the contract

**Sample prompt:**

> "Draft negotiation talking points for our ATS contract negotiation with Greenhouse. We have a competing proposal from Ashby that is 15% cheaper. We want: a rate cap on annual increases, a 90-day renewal opt-out window, Workday integration SLA, and data portability on exit."

**Generated negotiation talking points:**

```text
Opening position
We have selected Greenhouse as our preferred vendor and have a competing proposal
at 15% lower cost. We are prepared to sign this quarter if we can align on key terms.

Priority asks:
1. Price: Match the competing proposal or close the gap to within 5%.
2. Rate cap: Annual renewal increases capped at CPI or 3%, whichever is lower.
3. Renewal window: 90-day opt-out window (current proposal: 30 days).
4. Workday integration SLA: Hire record created in Workday within 2 hours of offer
   acceptance in Greenhouse. SLA breach credit of [X]% of monthly fee.
5. Data portability: On contract termination, all candidate and requisition data
   returned in CSV format within 30 days. Greenhouse deletes all data within 90 days.
   Confirm this is in the contract, not just the DPA.

Secondary asks (flex):
- Implementation support hours included in Year 1.
- Admin training included in implementation package.
- Access to customer success manager (not just support portal) for first 12 months.
```

## Step 5 — Plan the implementation

**Sample prompt:**

> "Build a 7-month ATS implementation plan from contract signature to go-live. Include: key milestones, Workday integration sequencing, TA team training, and parallel-run period."

**Generated implementation timeline:**

```text
Month 1: Kickoff and configuration
- Kickoff with Greenhouse implementation manager.
- Document all hiring workflows, approval chains, and scorecard templates.
- Begin Workday integration scoping with HR IT.

Month 2–3: Build and configure
- Configure workflows, scorecards, and offer templates in Greenhouse.
- Build and test Workday integration in sandbox environments.
- Configure LinkedIn job posting integration.

Month 4: User acceptance testing
- TA team tests all configured workflows with real role scenarios.
- Hiring manager pilot group tests review and scorecard flows.
- Workday integration tested end-to-end with test hire records.

Month 5: Parallel run
- New requisitions opened in both legacy ATS and Greenhouse simultaneously.
- TA team uses Greenhouse as primary; legacy ATS as backup.
- Identify and resolve configuration gaps before cutover.

Month 6: Go-live and cutover
- All active requisitions migrated to Greenhouse.
- Legacy ATS set to read-only.
- TA team and hiring manager training completed.

Month 7: Stabilization
- 30-day post-go-live review with Greenhouse CSM.
- Address open configuration items from parallel run.
- Confirm Workday integration running with zero manual entries.
```

## Summary

Use `hr-vendor-management` to run a structured ATS selection — from clear requirements and weighted evaluation through defensible contract negotiation and implementation planning — avoiding the most common failure modes of demo-led selection and post-signature surprises.

> Related skills: [`hr-system-integration`](../../hr-system-integration/SKILL.md) for designing and testing the Workday integration identified in this selection process.
