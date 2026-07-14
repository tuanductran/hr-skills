# Building a Skills Taxonomy and Workforce Skills Plan for a Scaling Technology Company

## Context

You are the Head of Talent and Workforce Planning at a 320-person technology company that
builds AI infrastructure software. The company has just approved an 18-month product
roadmap that requires significant expansion in AI engineering, MLOps, and platform
reliability skills. The CEO has asked the board to approve a $4.2M L&D and hiring budget
to close the capability gap — but the board has pushed back, asking for evidence that the
organization understands exactly which skills are missing, at what scale, and whether the
gap should be closed through hiring, development, or partnerships.

Simultaneously, three senior engineers left in the past quarter for competitors offering
clearer growth paths, and exit interviews all mentioned the same thing: they could not see
how to grow their skills toward the roles they wanted. The L&D team has a 200-course
library but no skills tagging, so employees have no way to know which courses build which
capabilities. And the HRIS currently has job titles and performance scores but no skills
data at all. You have been asked to build a skills taxonomy from scratch, run a workforce
skills gap analysis, and produce a board-ready workforce capability report — in 90 days.

## Step 1 — Choosing Where to Start

**Sample prompt:**

> "We need a board-ready skills gap analysis in 90 days, three engineers just left
> citing unclear career paths, and we have no skills data in our HRIS at all. Where
> do I start?"

**Expected skill response:**

Given your situation — a board deadline, active retention risk linked to career path
visibility, and zero existing skills infrastructure — start with two priority areas
in parallel:

**Retention risk containment (the career path concern):**

- Have direct, individual career conversations with the next tier of senior engineers
  most likely to share the same frustration as those who left — waiting for a taxonomy
  to be built before addressing the signal compounds the risk
- Identify whether the career visibility concern is a taxonomy problem (no skills
  framework to navigate) or a conversation problem (managers are not having growth
  discussions regardless of tools available)
- Move quickly — the three departures are already visible to the remaining team, and
  the absence of a visible response compounds the perception that growth is not a
  priority

**Taxonomy scope and data source clarity (the board deadline):**

- Define the taxonomy scope before building anything — a full 320-person taxonomy
  covering all functions in 90 days is not realistic; an Engineering and Product
  taxonomy anchored to the AI roadmap is
- Audit existing data sources before attempting to build a skills inventory from scratch:
  job descriptions, performance reviews, L&D completion records, and LinkedIn profiles
  are all usable inputs that can seed the taxonomy without a manual survey of every
  employee
- Align with the CFO and CPO on what "board-ready" actually means before designing the
  report — a credible gap analysis with prioritized investment recommendations is
  achievable in 90 days; a full workforce skills census is not

The board deadline and the retention concern are not separate problems — both trace back
to the absence of a skills intelligence foundation that should have been built as the
company scaled. You need a scoping decision first, or the 90-day window will be consumed
by design work rather than data and insight.

> **Avoid:** Do not launch a company-wide employee self-assessment survey as the first
> step. A 320-person survey with no validated taxonomy framework to map responses
> against will produce unusable, inconsistent data and will signal to employees that
> HR is conducting a skills audit with no clear purpose — which compounds the
> retention risk rather than addressing it.

## Step 2 — Modeling Taxonomy Structure Options

**Sample prompt:**

> "Help me model a few structural options for how we design the taxonomy hierarchy
> before I commit to an approach, since we are building from nothing."

**Skill walkthrough:**

**Option A — Flat skills list (no hierarchy):**

```text
Structure: A single-level list of skills tagged to roles, with no
           domain or cluster grouping
Trade-off: Fast to build initially, but produces a list that is
           impossible to navigate, maintain, or use for gap analysis
           at scale — every analysis requires manually sorting an
           undifferentiated list
```

**Option B — Three-tier hierarchy (Domain → Cluster → Skill):**

```text
Structure:
  Domain: AI and Machine Learning
    Cluster: Model Development
      Skills: PyTorch, model fine-tuning, experiment tracking,
              model evaluation and benchmarking
    Cluster: MLOps and Deployment
      Skills: ML pipeline orchestration, model serving,
              monitoring and drift detection, CI/CD for ML
  Domain: Platform and Infrastructure
    Cluster: Reliability Engineering
      Skills: SLO design, incident management, chaos engineering,
              observability tooling
Trade-off: Requires more upfront design effort, but produces a
           taxonomy that is navigable by employees, matchable by
           AI tools, and maintainable through cluster-level updates
           rather than individual skill-by-skill revisions
```

**Option C — Skills ontology with relationship mapping (full graph):**

```text
Structure: Three-tier hierarchy plus defined relationships between
           skills — prerequisite skills, adjacent skills, and
           skills that commonly co-occur in target roles
Trade-off: Most powerful for AI-assisted matching and learning
           path generation, but requires a platform investment
           (Eightfold, Beamery, Workday Skills Cloud) to implement
           and maintain — beyond the scope of a 90-day build
           without existing tooling
```

**Benchmark context:**

A three-tier hierarchy (Option B) is the right starting structure for a 90-day build.
It is specific enough to enable role matching and L&D tagging, stable enough that
cluster-level updates accommodate new skills without rebuilding the entire structure,
and achievable without a platform investment that cannot be approved within the board
timeline.

> **Recommendation framing:** Start with Option B scoped to Engineering and Product,
> anchored to the AI product roadmap skills requirements. Use O*NET and ESCO as
> reference frameworks for the AI and software engineering domains to avoid building
> skill definitions from scratch. Plan Option C as a phase-two investment proposal
> included in the board budget request.

## Step 3 — Diagnosing the Retention Risk Behind the Taxonomy Gap

**Sample prompt:**

> "Three senior engineers left citing unclear career paths. I need to understand
> whether this is a taxonomy problem or a management conversation problem before
> I build the entire solution around a technology fix."

**Skill response — diagnostic framework:**

Before assuming the taxonomy is the root cause, gather signals across four dimensions:

**1. Career path visibility concerns:**

- Did the engineers who left describe a specific capability or role they wanted to
  grow toward, and find no documented path — or did they describe a more general
  feeling of stagnation with no specific skill or role goal?
- Is there any career path documentation that exists today, even informally — and if
  so, was it accessible to the engineers who left, or known only to senior leadership?

**2. Management conversation frequency and quality:**

- Were these engineers receiving regular, structured career development conversations
  with their managers, or were 1:1s focused primarily on delivery and project status?
- Did their managers know they were considering leaving before they gave notice — or
  was the departure a surprise, suggesting the career conversation was not happening
  at all?

**3. Market and competitive pull factors:**

- Are the destination companies offering a specific capability (a skills-based growth
  track, a clear ML specialization path, a Staff/Principal level) that this company
  does not currently have?
- Is this a push from lack of career visibility here, or a pull toward something
  specific a competitor offered — the intervention differs significantly depending
  on the answer?

**4. Remaining team sentiment:**

- Have you conducted stay interviews or targeted conversations with the remaining
  senior engineers to assess whether the career path concern is isolated or shared
  broadly?
- Are there specific individuals in the remaining team who are at similar career stages
  to those who left and showing early disengagement signals?

> **What to bring to leadership:** Do not present the three departures as evidence
> that a skills taxonomy alone will solve the retention problem. Bring a clear picture
> of which aspects are taxonomy-fixable (no documented skills or growth paths) versus
> management-behavior gaps (career conversations not happening regardless of tools)
> versus competitive compensation or role factors that require a different response.

## Step 4 — Building the Skills Inventory

**Sample prompt:**

> "Help me build a skills inventory for the Engineering function without running a
> company-wide self-assessment survey as the first step."

**Skill response — multi-source inventory design:**

| Inventory Source | Current Status | Action Needed |
|------------------|----------------|----------------|
| Job descriptions | Available for most roles | Extract skill requirements using AI-assisted parsing; validate with function leads |
| Performance review data | Available for past 2 cycles | Identify skill-related strengths and development themes mentioned in review narratives |
| L&D completion records | Available but untagged | Map completed courses to skills clusters retroactively using the taxonomy hierarchy |
| LinkedIn profiles | Accessible for most employees | Use Eightfold or manual review to infer skills from work history and endorsements |
| Manager skill nominations | Not yet collected | Run a structured 30-minute skills mapping session per team lead after taxonomy draft is complete |
| Employee self-assessment | Not yet launched | Launch a targeted, validated self-assessment after the taxonomy is drafted — not before |

**Recommended inventory build sequence:**

1. Extract skills from job descriptions using AI parsing; this produces a role-level skills
   baseline without requiring employee input at the start
2. Validate the extracted skills against the three-tier taxonomy hierarchy with function
   leads in a 60-minute working session per domain
3. Retroactively tag the L&D course library to the taxonomy clusters — this immediately
   enables skills-to-learning connections without waiting for the full inventory
4. Run manager skills nomination sessions to add skills visible through daily work but
   not captured in job descriptions or self-assessment
5. Launch a targeted employee self-assessment after the taxonomy is validated — focused
   on proficiency level confirmation rather than skill identification from scratch

> **Common mistake to avoid:** Starting with employee self-assessment before the
> taxonomy is validated. Without a structured framework to assess against, self-assessment
> data is inconsistent, unverifiable, and useless for gap analysis. Employees will rate
> themselves differently against the same skill unless the proficiency definitions are
> explicit and the skill descriptions are unambiguous.

## Step 5 — Running the Skills Gap Analysis

**Sample prompt:**

> "I have a draft skills inventory for Engineering. Help me run a gap analysis that
> will produce a board-ready prioritized investment recommendation."

**Skill response — gap analysis design:**

**Step 1 — Define the target skills profile:**

Translate the 18-month AI product roadmap into a required skills profile:

```text
Critical skills required for roadmap execution:
  AI/ML Domain:
    — Large language model fine-tuning (Working proficiency: 8 engineers needed;
      current supply: 2)
    — ML pipeline orchestration at scale (Advanced: 5 needed; current supply: 1)
    — Model evaluation and benchmarking (Working: 6 needed; current supply: 3)
  Platform Domain:
    — Distributed systems reliability (Advanced: 4 needed; current supply: 4 — no gap)
    — Observability tooling design (Working: 6 needed; current supply: 2)
```

**Step 2 — Map current supply against target:**

For each critical skill cluster, document:
- How many employees hold the skill at each proficiency level today
- How many are needed at each proficiency level to execute the roadmap
- The net gap in headcount-equivalent terms

**Step 3 — Prioritize gaps by business impact:**

Not all gaps are equal. Prioritize by two dimensions:

```text
High Impact + High Gap → Build AND Buy immediately (LLM fine-tuning)
High Impact + Moderate Gap → Build internally with accelerated development
Moderate Impact + High Gap → Buy externally or partner/contract
Low Impact + Any Gap → Defer; monitor but do not invest now
```

**Step 4 — Model build/buy/borrow options for each priority gap:**

```text
Gap: LLM fine-tuning — 6 engineers needed, 2 exist
  Build: 12-month upskilling program, Degreed + external specialist trainer
         Cost: $180K; timeline: 12 months to Working proficiency
  Buy: 4 external hires at Senior Engineer level
       Cost: ~$800K fully loaded; timeline: 3-6 months to hire
  Borrow: 2 contractor specialists embedded for 6 months
          Cost: ~$240K; timeline: immediate but not sustainable
  Recommendation: Hire 2, build 4 through accelerated upskilling
```

> **What to bring to the board:** A gap analysis table showing the top 5 priority skill
> clusters, the current supply vs. required headcount at each level, and a
> build/buy/borrow cost comparison for each. The board is being asked to approve a
> $4.2M budget — they need to see which specific skills that budget is closing, not
> a general capability investment narrative.

## Step 6 — Presenting the Skills Plan to the Board

**Sample prompt:**

> "I need to present the skills taxonomy, gap analysis, and investment recommendation
> to the board in 90 days. How do I frame a build-from-scratch plan credibly?"

**Skill response — board communication framework:**

Boards respond to a workforce capability plan that connects skill gaps directly to product
and revenue risk, not to a skills management process narrative. Structure the presentation
in three parts.

**Part 1 — Connect skills to strategy and risk:**

"The 18-month product roadmap requires capabilities in LLM fine-tuning, MLOps at scale,
and platform observability that our current workforce does not hold at sufficient depth.
Without closing these gaps, two of the five roadmap workstreams carry a delivery risk we
assess as high. We have built the evidence base for this assessment in the past 90 days."

**Part 2 — Present the evidence, not just the conclusion:**

"We audited skills across 180 Engineering and Product employees using job description
analysis, manager input, and L&D records. We mapped those skills against the roadmap
requirements. Here are the top five priority gaps by impact — LLM fine-tuning,
ML pipeline orchestration, model evaluation, observability tooling, and distributed
inference infrastructure — with current supply and required headcount at each."

**Part 3 — Present the investment breakdown and ask for approval:**

"The $4.2M budget covers: $1.8M for six targeted external hires in the two highest-impact
gaps; $1.2M for an accelerated internal upskilling program across the remaining three gaps
using a combination of Degreed, external specialist trainers, and structured stretch
assignments; and $1.2M for the skills platform investment (Eightfold) that will automate
skills tracking, L&D matching, and internal mobility matching going forward. Without
the platform investment, the skills gap will re-emerge within 18 months as the roadmap
evolves."

> **Key principle:** A board approves a workforce budget when the ask is connected to
> a specific delivery risk, the evidence is specific and verifiable, and the investment
> is broken down by use case. A general "skills development investment" narrative will
> not survive a skeptical nominations or audit committee.

## Step 7 — Using AI to Scale the Taxonomy Build

**Sample prompt:**

> "I need to tag 200 L&D courses to the taxonomy, write proficiency definitions for
> 80 skills, and draft the board report. How do I use Claude or ChatGPT to accelerate
> this without producing something generic?"

**Skill response — AI-assisted taxonomy workflow:**

**For skills proficiency definition drafting:**

```text
I am building a skills taxonomy for a 320-person AI infrastructure
technology company. I need proficiency level definitions for skills
in the MLOps cluster.

Skill: ML pipeline orchestration
Proficiency levels to define:
- Awareness: can describe the concept and common tools
- Working: can build and maintain pipelines using existing frameworks
  under guidance
- Advanced: independently designs and optimizes pipelines for
  production at scale; troubleshoots complex failures
- Expert: defines MLOps architecture standards for the organization;
  evaluates new tooling and frameworks; mentors others

Please write one to two sentences per level that are specific,
observable, and differentiated enough that a manager could use them
to assess an engineer without asking HR for interpretation.
```

**For L&D course tagging:**

```text
I am tagging a 200-course L&D library to a three-tier skills
taxonomy for an AI infrastructure software company. Here are the
first 10 courses with their descriptions. For each course, identify:
1. The skill domain it belongs to
2. The skill cluster it belongs to
3. The specific skills it develops (maximum 4 per course)
4. The proficiency level it is appropriate for (Awareness /
   Working / Advanced)

[Paste course titles and descriptions]
```

**For board report narrative:**

```text
I need to write the executive summary of a board workforce
capability report for an AI software company. Here are the data
inputs: [paste gap analysis table]. Please draft a 3-paragraph
executive summary connecting the gap data to product delivery risk,
the build/buy/borrow recommendation, and the budget justification.
Write in direct, data-grounded language appropriate for a board
audience, not an HR audience.
```

**What AI does well here:**
- Drafting proficiency definitions at scale from a structured input framework
- Tagging large content libraries to taxonomy clusters consistently
- Generating board-ready narrative from structured gap analysis data

**What AI cannot replace:**
- SME validation that the drafted proficiency definitions reflect how the skill is
  actually used in this company's specific technical context
- Judgment on whether a skill classification decision is politically sensitive
  within a specific function
- The board relationship credibility that comes from a CHRO or CPO presenting
  in person with full ownership of the analysis

## Step 8 — Designing the Governance and Currency Model

**Sample prompt:**

> "Once we launch the taxonomy, I do not want it to be out of date in 12 months. How
> do I build a governance model that keeps it current without requiring a full rebuild
> every year?"

**Skill response — governance design:**

Build the governance model around three mechanisms, each with a specific owner and cadence.

**Skills emergence monitoring:**

- Quarterly review of Lightcast and LinkedIn labor market data for new skills appearing
  in target role job postings at competitor and leading-edge companies
- Any skill appearing in more than 15% of relevant external job postings that is not yet
  in the taxonomy is flagged for addition review

**Internal skill evolution tracking:**

- Semi-annual review of L&D completion patterns and performance review skill mentions
  to identify skills growing in internal relevance
- Function leads nominate skills for addition, revision, or retirement through a defined
  submission process; taxonomy owner approves or escalates

**Governance cadence:**

| Governance Mechanism | Owner | Frequency |
|----------------------|-------|-----------|
| External skills emergence scan | Workforce Planning Analyst | Quarterly |
| Internal skill nomination review | Taxonomy Owner (HR) | Semi-annual |
| Full taxonomy accuracy audit | HR + Function SMEs | Annual |
| Proficiency definition validation | Manager calibration session | Annual |
| L&D content re-tagging for new/revised skills | L&D team | Rolling |

> **Common finding at scaling companies:** Skills taxonomies drift fastest in the highest-
> velocity technical domains — AI, data, and platform engineering — where new tools,
> frameworks, and paradigms emerge faster than annual review cycles can capture. Building
> a lightweight quarterly scan of external job postings specifically for these domains
> is the single most effective mechanism for keeping the taxonomy current without a
> full annual rebuild.

## Step 9 — Writing the Workforce Skills Report for Leadership

**Sample prompt:**

> "I need to report on taxonomy adoption and skills gap progress at the 6-month mark
> after launch. Give me a template."

**Generated report template:**

```text
WORKFORCE SKILLS PLAN STATUS REPORT — [COMPANY NAME]
Prepared by: [Head of Talent and Workforce Planning]
Date: [Date]
Audience: CEO, CPO, Board Nominations Committee

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EXECUTIVE SUMMARY (3 sentences)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[One sentence on overall taxonomy adoption and skills data coverage.]
[One sentence on the most significant gap closed or risk remaining.]
[One sentence on the focus for the next reporting period.]

Example:
"At the 6-month mark, 94% of Engineering and Product employees
have validated skills profiles in the taxonomy, and three of five
priority skill gaps have been materially reduced through a
combination of two external hires and targeted upskilling. The
LLM fine-tuning gap remains the highest-priority open risk, with
two hires in process and four engineers in the accelerated
upskilling track at the Working proficiency milestone. Our focus
through the next quarter is completing the LLM fine-tuning hire
pipeline, extending the taxonomy to the Data and GTM functions,
and launching the Eightfold-powered internal mobility matching
for employees."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1: TAXONOMY COVERAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Employees with validated skills profiles: ___%
Functions covered by the taxonomy: ___ of ___
L&D courses tagged to taxonomy skills: ___%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2: SKILLS GAP PROGRESS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Priority gaps materially closed since launch: ___ of ___
Engineers at target proficiency on roadmap-critical skills: ___
Build vs buy vs borrow actions in progress: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 3: RETENTION AND MOBILITY IMPACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Internal mobility matches made using skills taxonomy: ___
Voluntary departures among employees with active skills profiles: ___
Employee adoption rate (profiles viewed, updated, or used in career conversations): ___%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 4: RISKS AND ACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Risk 1: [Description] | Likelihood: H/M/L | Action: ___ | Owner: ___
Risk 2: [Description] | Likelihood: H/M/L | Action: ___ | Owner: ___

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 5: NEXT PERIOD TARGETS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Target 1: Close LLM fine-tuning gap through hire and upskilling completion
Target 2: Extend taxonomy and profiles to Data and GTM functions
Target 3: Run first quarterly external skills emergence scan and add new skills
```

## Full Skills Taxonomy Workflow Summary

```text
Identify trigger (board requirement, retention risk, product roadmap gap, L&D alignment)
                    ↓
Audit existing skills data sources before designing taxonomy structure
                    ↓
Model taxonomy hierarchy options and select appropriate granularity
                    ↓
Build skills inventory from multiple sources, not self-assessment alone
                    ↓
Run skills gap analysis prioritized by business impact, not gap volume
                    ↓
Model build/buy/borrow options for each priority gap with cost and timeline
                    ↓
Present the plan to leadership and the board with delivery risk framing
                    ↓
Use AI to scale taxonomy build: proficiency definitions, L&D tagging, gap narrative
                    ↓
Design governance model for taxonomy currency before go-live
                    ↓
Report on taxonomy adoption, gap closure, and mobility impact at each checkpoint
```

### Common Skills Taxonomy Mistakes

| Mistake | How to avoid it |
|---------|----------------|
| Launching a company-wide self-assessment before the taxonomy is validated | Build and validate the taxonomy hierarchy first; use self-assessment for proficiency confirmation only |
| Building a flat skills list with no hierarchy | Design a three-tier hierarchy (Domain → Cluster → Skill) before collecting any data |
| Running a gap analysis without prioritizing gaps by business impact | Map gaps against the product or business strategy to identify which gaps to act on first |
| Launching the taxonomy with no integration into hiring, L&D, or career tools | Define integration points before go-live; a taxonomy used only for reporting is not a taxonomy |
| Treating a competency framework as equivalent to a skills taxonomy | Use competency frameworks for role-success evaluation; use skills taxonomies for matching, mobility, and gap analysis |
| Building a skills inventory from job descriptions alone | Triangulate job descriptions with manager input, performance data, L&D records, and AI inference |
| Skipping a governance model at launch | Define the skills update cadence and owner before the taxonomy goes live; without governance, accuracy degrades within 12 months |
