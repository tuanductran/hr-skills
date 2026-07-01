# Building a Pay Equity Remediation Plan for a Scaling Company

## Context

You are the Total Rewards Manager at a 280-person fintech company preparing for a Series C round. The investors' diligence checklist includes a pay equity audit, and Legal has flagged that your last ad-hoc review (done two years ago, before the company doubled in size) is no longer credible. The CEO wants a clean answer before the board meeting in six weeks. You have compensation data in your HRIS, market benchmarking data from your last survey cycle, and no formal pay equity methodology, remediation budget, or governance process in place.

## Step 1 — Choosing the Right Methodology to Start With

**Sample prompt:**

> "We need a defensible pay equity analysis before our Series C diligence and a board meeting in six weeks. We've never run a formal one. Where do I start?"

**Expected skill response:**

Given your situation — investor diligence pressure, a board deadline, and no prior formal methodology — start with three priority areas:

**Methodology selection (defensibility concern):**

- Use a multiple regression analysis controlling for legitimate pay factors: role, level, location, tenure, and performance rating
- Avoid simple group-average comparisons (for example, "average pay for women vs men") as a standalone methodology — they do not control for role mix and will not hold up to investor or legal scrutiny
- Decide in advance which factors are "legitimate" (job-related) versus which would themselves require justification (for example, prior salary history)

A six-week timeline with a board deadline means you need a methodology that is rigorous enough to be credible, but not so complex that it cannot be completed and explained in time.

**Population scoping (manageability concern):**

- Segment the analysis by comparable role groups, not the whole company as one pool
- Exclude populations too small for statistical significance (fewer than roughly 5–8 people per comparison group) and flag them for qualitative review instead

At 280 people, some role groups will be statistically thin. You need to decide upfront how those will be handled so it does not stall the timeline.

**Governance and confidentiality (legal concern):**

- Engage Legal early and consider conducting the initial analysis under attorney-client privilege
- Limit access to raw results to a small, named group until remediation decisions are finalized

> **Avoid:** Do not run the analysis informally in a shared spreadsheet without privilege protections. An unprotected pay equity analysis that surfaces a gap can itself become discoverable and create legal exposure if it is not acted on appropriately.

## Step 2 — Preparing and Structuring the Data

**Sample prompt:**

> "I have compensation data for 280 employees: base salary, bonus target, role, level, department, location, gender, ethnicity, tenure, and last performance rating. Help me structure this for a regression analysis."

**Skill walkthrough:**

**Required data fields for a defensible model:**

```text
Dependent variable:     Base salary (or total cash compensation, run separately)
Independent variables:  Job level, role family, location, tenure, performance rating
Protected class fields: Gender, ethnicity (used to TEST for gaps, not as model inputs)
```

**Data cleaning checks before running the model:**

```text
1. Confirm every employee has a valid job level and role family mapping
   (mismatched leveling is the single most common cause of false-positive gaps)
2. Standardize location into consistent pay zones, not raw city names
3. Confirm performance ratings are from the same review cycle for all employees
4. Flag and separately review anyone in a transitional state
   (recent promotion, recent transfer, recent leave return)
```

**Running the baseline model:**

```text
Model: Base Salary ~ Level + Role Family + Location + Tenure + Performance Rating

Output: A predicted salary for each employee based on legitimate factors,
compared against their actual salary — the difference is the "residual"

A statistically significant difference in residuals correlated with gender
or ethnicity, after controlling for legitimate factors, indicates a potential
unexplained pay gap requiring further review.
```

**Benchmark context:**

Pay equity audits conducted under this type of regression methodology are the current standard expected by investors, auditors, and regulators in markets with active pay transparency legislation. A company at your stage that has not yet formalized this process is not unusual, but completing it now — proactively, ahead of a forced disclosure — is significantly more defensible than waiting for a complaint or audit to trigger it.

> **Financial impact framing:** Unexplained pay gaps typically require remediation in the range of 1–3% of total payroll when caught at a reasonable scale and addressed proactively. Left unaddressed, the same gaps create legal exposure, investor diligence risk, and employee trust damage that cost considerably more to resolve after the fact.

## Step 3 — Interpreting the Results and Diagnosing Root Causes

**Sample prompt:**

> "Our regression flagged a statistically significant gap in our Engineering department. I need to understand why before this goes to the board. What should I be checking?"

**Skill response — diagnostic framework:**

Before concluding the gap is unexplained, check four dimensions:

**1. Leveling accuracy:**

- Are all flagged employees correctly leveled relative to their actual scope of work?
- Has anyone been performing above their current level without a corresponding promotion?

Incorrect leveling is the most common root cause of an apparent pay gap — it is often a leveling problem disguised as a pay problem.

**2. Hiring versus internal progression patterns:**

- Were the lower-paid individuals hired externally at a lower starting offer, or did they progress more slowly through internal merit cycles?
- Is there a pattern by hire cohort — for example, did a compensation philosophy change mid-way through the company's growth, leaving an older cohort behind market?

**3. Negotiation and offer-process variance:**

- Does your offer approval process allow significant manager discretion that could introduce inconsistency?
- Is there a pattern of certain managers consistently extending offers at the lower end of the approved band?

**4. Performance rating distribution:**

- Are performance ratings themselves distributed evenly across groups, or is there a separate pattern suggesting rating bias that is then flowing into merit-based pay differences?

If ratings are biased, the pay gap is a downstream symptom — both the rating process and the pay gap need separate remediation paths.

> **What to bring to the board:** Do not present a single statistic. Bring the methodology summary, the size and statistical confidence of the gap, the root-cause hypothesis by category (leveling, hiring, progression, ratings), and a remediation plan with a budget and timeline already attached.

## Step 4 — Building the Remediation Plan

**Sample prompt:**

> "We've confirmed a real, unexplained pay gap affecting about 14 employees. Help me design a remediation plan and budget."

**Skill response — remediation structure:**

Design the remediation plan around three components: who gets adjusted, how much, and when it lands.

**Remediation scope (who qualifies):**

| Criteria | Approach |
|----------|----------|
| Statistically significant residual gap | Include all employees flagged above the agreed significance threshold |
| Gap explained by a legitimate factor on closer review | Exclude, but document the justification clearly |
| Borderline cases near the significance threshold | Route to a secondary manager and HR review before deciding |

**Adjustment sizing:**

```text
For each included employee:
  Target adjustment = bring residual gap to within an agreed tolerance
  (commonly within 2–3% of the model-predicted salary, not necessarily to zero,
   to avoid overcorrection noise in the statistical model)

Example:
  Employee predicted salary: $128,000
  Actual salary: $114,500
  Adjustment to bring within 2% tolerance: ~$11,000 increase
```

**Budget summary for this cohort:**

```text
14 employees flagged for adjustment
Total remediation cost: approximately $145,000 (one-time base salary impact)
Represents approximately 0.6% of total company payroll

This is within the typical 1–3% range expected for a first formal pay equity
remediation at this company size and growth stage.
```

**Timing and rollout:**

- Implement adjustments in a single off-cycle action rather than waiting for the next annual merit cycle, to limit the duration of known unexplained gaps
- Do not require manager justification for the adjustment beyond the equity analysis itself — this is a compensation correction, not a performance-based increase

> **Common mistake to avoid:** Rolling remediation adjustments into the regular merit budget. This understates the true cost of the gap to leadership and can cause the remediation amount to crowd out normal merit increases for unrelated employees.

## Step 5 — Presenting the Findings to the Board

**Sample prompt:**

> "I need to present the pay equity findings and remediation plan to the board in two weeks. I have the data but I don't want to create alarm or look like the company has a major problem. Help me frame this."

**Skill response — board communication framework:**

Boards and investors think in risk exposure, governance maturity, and trend direction — not individual case stories. Structure the presentation in three parts.

**Part 1 — State the methodology and findings with data:**

"We completed our first formal pay equity audit using a regression methodology controlling for level, role, location, tenure, and performance. The analysis covered all 280 employees across 11 statistically valid comparison groups. We identified a statistically significant unexplained gap affecting 14 employees, concentrated primarily in our Engineering organization."

**Part 2 — Contextualize against company stage and industry norms:**

"A gap of this size — approximately 0.6% of total payroll — is within the typical range identified during a first formal audit at a company of our size and growth trajectory. The root cause is primarily inconsistent leveling during our rapid scaling period over the last 18 months, not a single systemic policy issue."

**Part 3 — Present the remediation plan and governance going forward:**

"We are implementing a one-time off-cycle adjustment for the 14 affected employees, budgeted at approximately $145,000, to be completed before next month's payroll cycle. Going forward, we are building pay equity analysis into our standard offer approval and annual merit processes so gaps are caught and corrected continuously rather than accumulating between formal audits."

> **Key principle:** Boards and investors respond well to evidence of proactive governance. A company that finds and fixes its own gap before being forced to is viewed far more favorably than one with no process at all — frame the finding as evidence the process is working, not as a failure.

## Step 6 — Using AI to Support the Analysis

**Sample prompt:**

> "I have the regression output and a list of flagged employees. How do I use Claude or ChatGPT to help me draft the root-cause summary and board narrative without exposing sensitive employee-level data?"

**Skill response — AI-assisted analysis workflow:**

**Step 1 — Prepare your data safely:**

Aggregate and anonymize before pasting into any AI tool. Use role-group-level summaries (count flagged, average gap size, role family) rather than named individual records, especially for any tool without a private or enterprise data agreement in place.

**Step 2 — Use this prompt structure:**

```text
I am a Total Rewards Manager at a 280-person fintech company.
Here is our aggregated pay equity audit summary (no individual identifiers):
[paste anonymized summary data here]

Please:
1. Summarize the overall findings in plain language suitable for a board update
2. Draft a root-cause narrative connecting the gap to likely structural
   causes (leveling inconsistency, hiring cohort variance, rating distribution)
3. Suggest a remediation budget framing that contextualizes the dollar
   amount against total payroll
4. Draft three governance recommendations to prevent gap recurrence
5. Write a concise board-ready summary under 200 words
```

**Step 3 — Follow up with governance design:**

```text
Based on this summary, draft a standing pay equity governance process
that includes: when analysis is re-run, who reviews flagged offers
before approval, and how remediation budget is planned annually.
Format as: Process Step / Owner / Frequency.
```

**What AI does well here:**
- Drafting clear, board-ready narrative summaries from aggregated data
- Structuring root-cause hypotheses in plain language
- Generating governance process drafts to prevent recurrence
- Reframing technical statistical findings into business-risk language

**What AI cannot replace:**
- The statistical regression analysis itself, which requires proper modeling tools and review by someone trained in the methodology
- Legal judgment on privilege, disclosure obligations, and remediation defensibility
- Final sign-off on which employees are included in remediation

## Step 7 — Building Pay Equity Into the Standing Process

**Sample prompt:**

> "We've remediated the current gap, but I don't want to be back here in two years with the same problem. How do I build pay equity checks into our everyday compensation process?"

**Skill response — governance build:**

Embed pay equity review at three points in the standard compensation lifecycle rather than treating it as a standalone annual project.

**At the offer stage:**

- Require every new offer to be checked against the existing pay band and current incumbents in the same role and level before approval
- Flag any offer that would create more than an agreed tolerance gap relative to existing team members for a secondary review

**At the merit cycle:**

- Re-run the regression analysis using updated data before finalizing merit increase budgets
- Reserve a small percentage of the total merit budget specifically for equity adjustments identified during this check, separate from performance-based increases

**At the promotion and leveling review:**

- Audit leveling consistency across the population being promoted, not just the individuals under direct discussion
- Track whether promotion rates and resulting pay differ by demographic group over time, as a leading indicator before a regression flags a problem

**Standing governance cadence:**

| Process Step | Owner | Frequency |
|--------------|-------|-----------|
| Offer-stage band and equity check | Compensation Analyst | Every offer |
| Full regression re-run | Total Rewards Manager | Before each merit cycle |
| Leveling consistency audit | Total Rewards + People Analytics | Quarterly |
| Board / leadership equity update | Total Rewards Director | Annually, or per investor requirement |

> **Common finding at fast-growing companies:** Pay equity gaps re-accumulate quietly during periods of rapid hiring and inconsistent leveling, not through any single bad decision. Building lightweight checks into the everyday process is far less costly than periodic large-scale remediation projects.

## Step 8 — Writing the Total Rewards Governance Report for Leadership

**Sample prompt:**

> "I need to document our new pay equity governance process for leadership and future audits. Give me a template."

**Generated report template:**

```text
PAY EQUITY GOVERNANCE REPORT — [COMPANY NAME]
Prepared by: [Total Rewards Manager Name]
Date: [Date]
Audience: CEO, Board, Legal, People Leadership

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTIVE SUMMARY (3 sentences)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[One sentence on the audit completed and overall finding.]
[One sentence on the remediation action taken.]
[One sentence on the standing governance process now in place.]

Example:
"We completed our first formal pay equity audit covering all 280
employees, identifying a 0.6% of payroll unexplained gap affecting
14 employees, primarily attributable to leveling inconsistency during
rapid scaling. A one-time remediation of $145,000 was implemented this
cycle, and pay equity checks are now embedded in our offer, merit,
and promotion processes to prevent recurrence."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: METHODOLOGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Analysis type: Multiple regression, controlling for level/role/location/tenure/performance
Population covered: ___ employees across ___ comparison groups
Statistical significance threshold used: ___
Privilege/confidentiality protections applied: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: FINDINGS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Employees flagged for review: ___
Employees confirmed for remediation: ___
Gap size as % of total payroll: ___%
Primary root cause(s) identified: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: REMEDIATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total remediation budget: $___
Implementation timeline: ___
Rollout method: [one-time off-cycle / phased over ___ cycles]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: STANDING GOVERNANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Offer-stage check process: ___
Merit-cycle re-run cadence: ___
Leveling audit cadence: ___
Reporting cadence to leadership/board: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: RISKS AND NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Risk 1: [Description] | Likelihood: H/M/L | Mitigation: ___
Risk 2: [Description] | Likelihood: H/M/L | Mitigation: ___
Next audit scheduled: ___
```

## Full Total Rewards Pay Equity Workflow Summary

```text
Identify trigger (investor diligence, regulation, leadership request, routine cadence)
                    ↓
Select a defensible regression methodology and engage Legal early
                    ↓
Clean and structure compensation data by role, level, location, tenure, performance
                    ↓
Run the analysis and diagnose root causes of any flagged gaps
                    ↓
Build a remediation plan with scope, budget, and timeline
                    ↓
Present findings to leadership and the board with risk framing
                    ↓
Use AI to draft narrative summaries from anonymized, aggregated data
                    ↓
Embed equity checks into offer, merit, and promotion processes going forward
```

### Common Total Rewards Mistakes

| Mistake | How to avoid it |
|---------|----------------|
| Running pay equity analysis without engaging Legal first | Engage Legal early and consider privilege protections before any formal analysis begins |
| Using simple group-average comparisons instead of regression | Control for legitimate factors (level, role, location, tenure, performance) before concluding a gap exists |
| Treating remediation as a one-time project | Embed equity checks into offer, merit, and promotion processes on an ongoing basis |
| Rolling remediation dollars into the regular merit budget | Track and report remediation spend separately from performance-based increases |
| Presenting findings to the board without a remediation plan attached | Always pair any flagged gap with scope, budget, and timeline before the leadership conversation |
| Pasting individual employee data into ungoverned AI tools | Aggregate and anonymize data before using AI tools without an enterprise data agreement |
| Assuming a pay gap means a single bad actor or policy | Diagnose across leveling, hiring, progression, and rating-distribution causes before concluding root cause |
