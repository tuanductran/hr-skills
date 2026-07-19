# Strategic workforce plan for market expansion

## Context

You are the VP of People at a 600-person B2B software company headquartered in Vietnam. The CEO has announced a three-year strategy to expand into Southeast Asian markets — Singapore, Thailand, and Indonesia — while doubling revenue from 50M USD to 100M USD.

The CFO wants a workforce plan that shows what headcount investment is required, when, and what the cost implications are. The executive team needs this before the board meeting in six weeks.

## Step 1 — Translate the expansion strategy into workforce demand

**Sample prompt:**

> "We are expanding into Singapore, Thailand, and Indonesia over three years while doubling revenue. Translate this strategy into workforce demand implications by function — which teams need to grow, what new roles are required, and what capabilities don't currently exist in our workforce?"

**Expected skill response:**

- Break down workforce demand by function (Sales, Customer Success, Engineering, Operations, Finance, Legal/Compliance, HR) for each expansion market.
- Identify roles that are net-new to the company — for example, Country Manager, Regional Legal Counsel, Local Payroll Specialist.
- Flag capabilities the company currently lacks that market expansion will require: local regulatory knowledge, multilingual customer support, regional partner management.
- Estimate a demand range for each year rather than a single headcount figure, reflecting business uncertainty.

**Generated demand summary (Year 1 — Singapore launch):**

| Function | Current headcount | Year 1 demand | Net new roles | Key new role types |
|---|---|---|---|---|
| Sales | 45 | 55 | 10 | Regional Account Executive (SG), Sales Engineer (SG) |
| Customer Success | 20 | 26 | 6 | Customer Success Manager (SG), APAC Support Lead |
| Engineering | 150 | 155 | 5 | Localization Engineer, Security Engineer (APAC compliance) |
| Finance & Legal | 12 | 16 | 4 | Regional Finance Manager, Singapore Legal Counsel |
| HR & People Ops | 8 | 10 | 2 | HR Business Partner (APAC), Regional Payroll Specialist |
| **Total** | **235** | **262** | **27** | |

## Step 2 — Identify capability gaps

**Sample prompt:**

> "Based on our expansion into Singapore, Thailand, and Indonesia, identify the top five capability gaps in our current workforce that will block execution if not addressed in Year 1."

**Generated capability gap list:**

| Priority | Capability gap | Business risk if unaddressed | Closure strategy |
|---|---|---|---|
| 1 | Regional regulatory and employment law knowledge (SG, TH, ID) | Legal exposure in all three markets | Buy — hire Regional Legal Counsel |
| 2 | Enterprise sales motion for APAC market dynamics | Revenue targets missed in Year 1 | Buy + borrow — hire 2 AEs + engage sales advisory partner |
| 3 | Multilingual customer support (Bahasa, Thai) | Customer retention risk in TH and ID | Buy — hire local CSMs |
| 4 | Localization and internationalisation engineering | Product cannot adapt to local market requirements | Build + buy — upskill 3 engineers, hire 1 specialist |
| 5 | Cross-cultural leadership and distributed team management | Collaboration breakdown between HQ and regional teams | Build — manager development program in Q2 |

## Step 3 — Build the phased workforce roadmap

**Sample prompt:**

> "Build a phased workforce roadmap for the three-year Southeast Asia expansion. Show hiring targets by function and year, key capability investments, and workforce cost implications."

**Generated roadmap summary:**

```text
Year 1 — Singapore Launch (27 net new hires)
Focus: Establish Singapore hub. Prioritize legal, sales, and customer success.
Key hires: Country Manager SG, Regional Legal Counsel, 4 Account Executives,
           2 Customer Success Managers, APAC HR Business Partner.
Capability investment: Manager cross-cultural leadership program,
                       localization engineering upskill.
Workforce cost increase: ~18% on current payroll base.

Year 2 — Thailand Expansion (19 net new hires)
Focus: Replicate Singapore model in Bangkok. Add regional support capacity.
Key hires: Country Manager TH, 3 Account Executives, 2 Customer Success Managers,
           Thai-language support team (3 roles), Regional Finance Manager.
Capability investment: Regional talent pipeline development,
                       APAC management community of practice.
Workforce cost increase: ~11% on Year 1 payroll base.

Year 3 — Indonesia Expansion + Scale (22 net new hires)
Focus: Enter Jakarta market. Scale Singapore and Thailand functions.
Key hires: Country Manager ID, 3 Account Executives, Indonesia Legal Counsel,
           Bahasa-language support team (3 roles), APAC Operations Lead.
Capability investment: Senior leadership succession in APAC region.
Workforce cost increase: ~10% on Year 2 payroll base.

Total 3-year net new headcount: 68 roles
Estimated payroll investment (3-year cumulative): [to be modeled with Finance]
```

## Step 4 — Identify workforce risks

**Sample prompt:**

> "Identify the top workforce risks in this three-year expansion plan and suggest how to monitor and mitigate each."

**Generated risk register:**

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Country Manager hire fails in Singapore — wrong profile or delayed | Medium | High | Use executive search firm with APAC track record; extend timeline contingency to 6 months |
| Talent market scarcity for enterprise SaaS sales talent in Bangkok | High | Medium | Begin sourcing 6 months before Thailand launch; build referral pipeline from Singapore team |
| Regulatory compliance gap exposes company in first 90 days of Singapore entity | Medium | High | Engage employment law firm from Day 1; do not operate without Regional Legal Counsel in place |
| Headquarters-to-region collaboration breaks down | Medium | Medium | Invest in manager cross-cultural program before expansion launch; set explicit collaboration norms |
| Attrition accelerates in HQ due to expansion distraction | Low | Medium | Monitor HQ engagement monthly during Year 1; protect capacity of key HQ contributors |

## Step 5 — Prepare the executive brief

**Sample prompt:**

> "Write a one-page executive brief summarizing the workforce plan for the board meeting. Connect workforce investment to revenue outcomes and highlight the three decisions the board needs to make."

**Generated executive brief:**

```text
Southeast Asia Expansion — Workforce Plan Brief

Objective
Support the three-year expansion into Singapore, Thailand, and Indonesia through
targeted workforce investment aligned to each market launch milestone.

Workforce requirement
68 net new roles over three years, sequenced to market launch readiness:
Year 1 (SG): 27 hires — Year 2 (TH): 19 hires — Year 3 (ID): 22 hires.

Critical success factors
1. Country Managers must be in place 90 days before each market launch.
2. Regional Legal Counsel is required before any Singapore entity is operational.
3. Enterprise sales hiring in Thailand should begin 6 months before the Year 2 launch.

Three decisions for the board
1. Approve the Year 1 workforce investment budget before Q2 hiring begins.
2. Confirm the Singapore entity structure — determines employment law exposure and entity timeline.
3. Decide whether Country Managers are recruited externally or developed from internal candidates
   (external search adds 3–4 months; internal development adds capability risk).

Workforce cost
Total three-year payroll investment will be modeled with Finance. Year 1 represents an
estimated 18% increase on current payroll base, primarily in Sales and Customer Success.
```

## Summary

Use `hr-strategic-workforce-planning` to translate a major business strategy — in this case international market expansion — into a sequenced workforce roadmap with hiring targets, capability investments, risk identification, and executive-ready outputs.

> Related skills: [`hr-workforce-scenario-planning`](../../hr-workforce-scenario-planning/SKILL.md) to stress-test this plan against alternative expansion timelines, [`hr-workforce-capability`](../../hr-workforce-capability/SKILL.md) to design the capability building programs identified in this plan.
