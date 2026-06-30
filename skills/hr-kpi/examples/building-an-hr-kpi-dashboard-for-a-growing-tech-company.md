# Building an HR KPI Dashboard for a Growing Tech Company

## Context

You are an HR Manager at a 150-person B2B SaaS company that has grown from 60 to 150 employees in 18 months. The CEO wants monthly HR reporting at the leadership level, the CFO is asking why headcount costs are rising faster than revenue, and the Head of Engineering flagged that the tech team has seen 4 unexpected resignations this quarter. You have raw data in spreadsheets but no dashboard, no benchmarks, and no structured reporting process yet.

## Step 1 — Choosing the Right KPIs to Start With

**Sample prompt:**

> "We are a 150-person SaaS company that grew fast. We have no HR dashboard yet. Where do I start and which KPIs actually matter right now?"

**Expected skill response:**

Given your situation — rapid growth, rising headcount costs, and visible attrition in engineering — start with three priority areas:

**Retention signals (most urgent):**

- Voluntary Turnover Rate (overall and by department)
- First-Year Turnover Rate
- Average Employee Tenure

Four unexpected resignations in one department in one quarter is a leading indicator of a deeper problem. You need to quantify how widespread this is before your next leadership meeting.

**Cost efficiency signals (CFO's concern):**

- Labor Expense / Revenue (%)
- HR Expense per Employee
- Cost per Hire

Fast-growing companies often see this ratio climb before it stabilizes. You need to show the CFO whether this is a structural shift or a temporary scaling artifact.

**Recruiting throughput (operational baseline):**

- Time to Fill
- Cost per Hire
- % Positions Filled Internally

At 150 people and growing, your recruiting pipeline is under constant pressure. These three metrics will tell you if the process is keeping pace or creating hidden bottlenecks.

> **Avoid:** Do not try to track all 150 KPIs at once. Build a working dashboard with 8–10 metrics first, prove the cadence works, then expand coverage next quarter.

## Step 2 — Calculating Your Baseline Metrics

**Sample prompt:**

> "I have this data for Q2: we started the quarter with 138 employees, ended with 150, had 7 voluntary resignations, 2 involuntary terminations, and 21 new hires. Help me calculate the key turnover metrics."

**Skill walkthrough:**

**Average headcount for the period:**

```txt
(138 + 150) / 2 = 144
```

**Voluntary Turnover Rate:**

```txt
7 voluntary departures / 144 average headcount × 100 = 4.9% for the quarter
Annualized: 4.9% × 4 = ~19.4% annually
```

**Total Turnover Rate (voluntary + involuntary):**

```txt
(7 + 2) / 144 × 100 = 6.25% for the quarter
Annualized: ~25%
```

**Net headcount growth:**

```txt
21 new hires − 9 total departures = +12 net headcount
```

**Benchmark context:**

The global voluntary turnover rate for the technology sector is approximately 12% annually (Mercer 2025). At ~19.4% annualized, your voluntary turnover is running roughly 60% above the industry benchmark. Combined with the concentration in engineering flagged by the Head of Engineering, this warrants immediate investigation — not just monitoring.

> **Financial impact estimate:** If average fully-loaded compensation in engineering is $120,000 USD, replacing one engineer costs 75–150% of annual salary ($90,000–$180,000 USD). Four unexpected departures in one quarter represents $360,000–$720,000 USD in replacement cost before accounting for lost productivity and team disruption.

## Step 3 — Diagnosing the Turnover Problem

**Sample prompt:**

> "Our voluntary turnover is too high, especially in engineering. I need to understand why before presenting to leadership. What questions should I be asking and what data do I need?"

**Skill response — diagnostic framework:**

Before presenting to leadership, gather signals across four dimensions:

**1. Exit interview data:**

- What reasons are departing employees citing?
- Are they going to a competitor, a different industry, or leaving the workforce?
- How long after joining did they decide to leave?

Common root causes at fast-growing SaaS companies: compensation falling behind market rates, manager quality issues, unclear growth paths, role scope changing faster than people can adapt, and burnout from sustained high-growth pace.

**2. Tenure pattern analysis:**

- Are the resignations concentrated among employees hired in a specific period (for example, during the growth surge 12–18 months ago)?
- Is First-Year Turnover Rate elevated compared to the overall rate?
- Are the departures senior, junior, or distributed across levels?

**3. Department and manager correlation:**

- Is attrition concentrated under specific managers?
- Has the engineering team structure, reporting lines, or leadership changed in the past 6–12 months?
- What is the span of control for engineering managers — are they overloaded?

**4. Compensation positioning:**

- When did you last run a compensation benchmark for engineering roles?
- Have you lost anyone to a company offering significantly higher pay?
- Is your total compensation package (salary, equity, benefits) competitive for your market and stage?

> **What to bring to leadership:** Do not walk in with a single number. Bring the trend (quarterly turnover over 4–6 quarters), the department breakdown, a cost estimate of the attrition impact, and at least one hypothesis about root cause backed by exit data or manager observations.

## Step 4 — Building the Leadership Dashboard

**Sample prompt:**

> "Help me design a monthly HR dashboard that I can present to the CEO and CFO. I use Google Sheets. I need it to be simple and focused on what executives care about."

**Skill response — dashboard structure:**

Design your executive dashboard around three sections: workforce health, cost efficiency, and pipeline performance. Each section should show the current value, the prior period value, and the benchmark target.

**Section 1 — Workforce health (CEO priority):**

| Metric | This Month | Last Month | Target | Benchmark |
|--------|------------|------------|--------|-----------|
| Voluntary Turnover Rate (annualized) | | | <12% | 12% (tech sector) |
| First-Year Turnover Rate (annualized) | | | <20% | 26% (SHRM) |
| Average Employee Tenure (months) | | | — | Track trend |
| Total Headcount | | | Per plan | — |
| Net Headcount Change | | | Per plan | — |

**Section 2 — Cost efficiency (CFO priority):**

| Metric | This Month | Last Month | Target | Benchmark |
|--------|------------|------------|--------|-----------|
| Labor Expense / Revenue (%) | | | <55% | 50–60% (SaaS) |
| HR Expense per Employee | | | — | Track trend |
| Cost per Hire | | | <$6,000 | $5,475 (SHRM 2025) |
| Benefits Expense per Employee | | | — | 30–40% of HR cost |

**Section 3 — Pipeline performance (operational):**

| Metric | This Month | Last Month | Target | Benchmark |
|--------|------------|------------|--------|-----------|
| Open Requisitions | | | — | — |
| Time to Fill (days) | | | <45 days | 42 days (SHRM) |
| % Positions Filled Internally | | | >20% | >20% |
| New Hires This Month | | | Per plan | — |

**Implementation notes for Google Sheets:**

- Use one tab per section with a summary tab that pulls key cells into a one-page view
- Add conditional formatting: green when at or better than target, yellow within 10% of target, red when beyond threshold
- Include a three-sentence narrative summary at the top of the summary tab — this is what leadership reads first
- Update data on the first business day of each month for the prior month

## Step 5 — Presenting to the CFO

**Sample prompt:**

> "The CFO asked why labor costs are growing faster than revenue. I have the data but I don't know how to frame the answer. Help me structure this conversation."

**Skill response — CFO communication framework:**

CFOs think in ratios and trends, not headcount stories. Structure your response in three parts:

**Part 1 — Confirm the observation with data:**

"You are correct that our Labor Expense / Revenue ratio increased from 48% in Q1 to 54% in Q2. This was driven by three factors: 21 new hires in Q2 (the largest single-quarter addition in company history), a compensation adjustment in engineering to address market positioning, and 9 departures creating replacement costs and temporary dual-payroll overlap."

**Part 2 — Contextualize against the plan and the market:**

"For a SaaS company at our growth stage and revenue run rate, a labor ratio between 50–60% is within the expected range. Our Q2 ratio of 54% is elevated but not structurally concerning — it reflects the lag between hiring investment and revenue contribution from new headcount. Based on our current pipeline and no further unplanned attrition, we expect this ratio to normalize toward 50% by Q4."

**Part 3 — Flag the real risk and what you are doing about it:**

"The more meaningful risk is that voluntary turnover in engineering is running at approximately 19% annualized, above the 12% sector benchmark. Each unexpected departure in engineering costs an estimated $90,000–$180,000 in replacement cost. I am presenting a retention action plan at next month's leadership review with three targeted interventions for Q3."

> **Key principle:** CFOs respond to numbers, trends, benchmarks, and risk-adjusted cost implications. Avoid HR jargon. Translate every metric into financial language.

## Step 6 — Using AI to Analyze HR Data

**Sample prompt:**

> "I have my Q2 turnover data in a spreadsheet. How do I use Claude or ChatGPT to get useful analysis out of it without being a data analyst?"

**Skill response — AI-assisted analysis workflow:**

**Step 1 — Prepare your data:**

Export your data to CSV or paste it directly into the chat. Include columns for: employee ID (anonymized), department, hire date, termination date (if applicable), termination type (voluntary / involuntary / transfer), role level, and manager ID.

**Step 2 — Use this prompt structure:**

```txt
I am an HR Manager at a 150-person SaaS company.
Here is my Q2 workforce data:
[paste your data here]

Please:
1. Calculate voluntary turnover rate, involuntary turnover rate,
   and first-year turnover rate for the quarter
2. Identify which departments or manager groups show the highest
   concentration of voluntary departures
3. Flag any tenure patterns — are departures clustering around
   specific months of tenure?
4. Compare results to these benchmarks:
   - Voluntary turnover benchmark (tech sector): 12% annually
   - First-year turnover benchmark: 26% annually (SHRM)
5. Summarize the top 2–3 risks in plain language suitable
   for a CEO briefing
```

**Step 3 — Follow up with action planning:**

```txt
Based on this analysis, draft a 90-day retention action plan
for the engineering department. Focus on interventions that
are low-cost and can be implemented without a policy change.
Format as: Action / Owner / Timeline / Success Metric.
```

**What AI does well here:**
- Calculating and comparing ratios quickly
- Identifying patterns across large datasets
- Translating data into narrative summaries for leadership
- Generating draft action plans and benchmark comparisons

**What AI cannot replace:**
- Exit interview context and employee sentiment
- Manager relationship dynamics and team culture observations
- Final judgment on which interventions are politically feasible in your organization

## Step 7 — Designing a Recruiting Efficiency Review

**Sample prompt:**

> "We spent a lot on recruiting this year but I'm not sure if it's efficient. How do I evaluate whether our recruiting function is performing well?"

**Skill response — recruiting efficiency audit:**

Evaluate your recruiting function across four dimensions:

**Speed:**

| Metric | Your Number | Benchmark | Status |
|--------|-------------|-----------|--------|
| Time to Fill (all roles) | ? days | 42 days (SHRM) | |
| Time to Fill (engineering) | ? days | 60–75 days | |
| Requisition days on hold | ? days | <10 days | |

Time to Fill above benchmark is usually caused by: unclear job requirements, slow interview scheduling, or bottlenecked hiring manager availability — not a sourcing problem.

**Cost:**

| Metric | Your Number | Benchmark | Status |
|--------|-------------|-----------|--------|
| Cost per Hire | ? | $5,475 USD (SHRM 2025) | |
| Agency / headhunter % of total recruiting spend | ? | <30% ideally | |
| Source mix: inbound vs outbound vs referrals | ? | Referrals = lowest CPH | |

**Quality:**

| Metric | Your Number | Target | Status |
|--------|-------------|--------|--------|
| First-Year Turnover Rate | ? | <20% | |
| Offer acceptance rate | ? | >85% | |
| % Positions filled internally | ? | >20% | |

High first-year turnover is often a recruiting quality signal — it means hires are not well-matched to role or culture expectations at the point of screening.

**Capacity:**

| Metric | Your Number | Benchmark | Status |
|--------|-------------|-----------|--------|
| Requisitions per recruiter | ? | 15–20 (standard) | |
| Hires per recruiter per year | ? | 40–60 (standard) | |

> **Common finding at fast-growing companies:** Recruiting cost is elevated not because the process is inefficient, but because the company over-relies on external agencies for hard-to-fill roles. The fastest fix is usually improving the employee referral program — referrals produce the lowest cost per hire and the highest first-year retention rate.

## Step 8 — Writing the Quarterly HR Report for Leadership

**Sample prompt:**

> "I need to write a Q2 HR report for our CEO and CFO. I have all the numbers but I don't know how to structure it. Give me a template."

**Generated report template:**

```text
Q2 HR REPORT — [COMPANY NAME]
Prepared by: [HR Manager Name]
Date: [Date]
Audience: CEO, CFO, Leadership Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTIVE SUMMARY (3 sentences)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[One sentence on workforce growth and headcount status.]
[One sentence on the most important risk or concern this quarter.]
[One sentence on the primary focus for Q3.]

Example:
"We grew from 138 to 150 employees in Q2, adding a net 12 people
against a plan of 15. Voluntary turnover in engineering reached
19% annualized — 60% above sector benchmark — representing an
estimated $360,000–$720,000 in replacement cost risk for H2.
Our Q3 priority is executing a targeted retention plan for the
engineering team while maintaining our recruiting pace for the
3 remaining open roles."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: WORKFORCE SNAPSHOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total headcount (end of quarter): ___
Net change vs prior quarter: ___
New hires: ___ | Voluntary departures: ___ | Involuntary: ___
Headcount vs plan: ___ (on track / ahead / behind)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: RETENTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Voluntary turnover rate (Q2): ___% | Annualized: ___%
Benchmark (tech sector): 12% annually
Status: [Above / At / Below benchmark]

First-year turnover rate: ___% | Benchmark: 26% (SHRM)
Departments with elevated attrition: ___
Root cause hypothesis: ___
Action in progress: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: COST EFFICIENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Labor Expense / Revenue: ___% | Prior quarter: ___% | Target: <55%
Cost per Hire (Q2): $___ | Benchmark: $5,475 (SHRM 2025)
HR Expense per Employee: $___
Note on variance vs prior quarter: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: RECRUITING PIPELINE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total hires in Q2: ___
Open requisitions end of quarter: ___
Average Time to Fill: ___ days | Benchmark: 42 days (SHRM)
% Positions filled internally: ___% | Target: >20%
Offer acceptance rate: ___%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: RISKS AND ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Risk 1: [Description] | Likelihood: H/M/L | Financial exposure: $___
Action: ___ | Owner: ___ | Deadline: ___

Risk 2: [Description] | Likelihood: H/M/L | Financial exposure: $___
Action: ___ | Owner: ___ | Deadline: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 6: Q3 TARGETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
KPI 1: Reduce voluntary turnover in engineering to ___% annualized
KPI 2: Fill ___ open requisitions by end of Q3
KPI 3: Reduce Labor Expense / Revenue to ___% by Q3 end
```

## Full HR KPI Workflow Summary

```text
Identify organizational priority (retention / cost / recruiting / growth)
                    ↓
Select 5–10 KPIs aligned to that priority
                    ↓
Establish baseline calculations with current data
                    ↓
Benchmark against industry standards (SHRM, Mercer, Gallup, ATD)
                    ↓
Build a simple dashboard with trend tracking and targets
                    ↓
Use AI to analyze patterns and generate action plan drafts
                    ↓
Present to leadership with financial framing and risk context
                    ↓
Review and update KPI set every quarter as priorities shift
```

### Common HR Measurement Mistakes

| Mistake | How to avoid it |
|---------|----------------|
| Reporting a turnover number without a benchmark | Always pair the metric with the industry benchmark — a number without context is just noise |
| Tracking 30+ KPIs from the start | Begin with 5–10 that match current organizational priorities; expand coverage quarterly |
| Presenting to the CFO using HR terminology | Translate every metric into financial impact — cost, risk exposure, and business outcome |
| Measuring outputs (training hours) instead of outcomes (performance change) | Connect activity metrics to business impact wherever data allows |
| Treating lagging indicators as early warning | Build a leading indicator layer: pulse scores, manager effectiveness ratings, internal mobility rates |
| Running exit interviews but not analyzing the data | Exit data is only valuable if it is aggregated, trended, and acted on — collect it systematically |
| Building a dashboard no one reads | Design for the decision-maker's perspective; ask leadership what questions they need answered, not what data you have available |
