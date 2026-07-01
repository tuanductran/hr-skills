# Hiring a Senior Data Engineer

## Context

You are an HR Manager at a growing e-commerce company. The Head of Data needs to hire **1 Senior Data Engineer** to rebuild the data pipeline infrastructure, migrate from a legacy ETL system to a modern ELT architecture on BigQuery, and support both the analytics team and an upcoming machine learning initiative. You have no technical background and need end-to-end support throughout the hiring process.

## Step 1 — Translating Technical Requirements from the Head of Data

**Sample prompt:**

> "Our Head of Data says we need a Senior Data Engineer who understands ELT, dbt, BigQuery, and can support ML pipelines down the line. What does any of this actually mean for me as a recruiter?"

**Expected skill response:**

- **ELT (Extract, Load, Transform)** = the modern approach to moving data: first pull raw data from all sources (orders, website events, CRM) and load it into a central cloud storage system, then transform it there — more flexible and scalable than the older ETL approach where transformation happened before loading
- **dbt (data build tool)** = a tool that lets data engineers write transformation logic in SQL and manage it like software code — with version control, documentation, and testing built in. It has become the standard for analytics engineering in 2026
- **BigQuery** = Google's cloud data warehouse — where all transformed data lives and gets queried by analysts and dashboards. The engineer needs to understand how to design data models that perform well and cost efficiently at scale
- **ML pipeline support** = as the company later builds machine learning features (recommendations, demand forecasting), the data engineer needs to ensure clean, well-structured data is available for those models to train on
- This is a **Data Engineering** role — not Data Science, not Analytics, not BI. The focus is building and maintaining the infrastructure that everyone else depends on

## Step 2 — Writing the Job Description

**Sample prompt:**

> "Write a JD for a Senior Data Engineer at an e-commerce company. Requirements: BigQuery, dbt, Python, Airflow, with future ML pipeline support. Team of 6 in the data org."

**Sample JD generated:**

```text
Senior Data Engineer — E-commerce Data Platform

About us:
[Company] is a fast-growing e-commerce platform serving 2M+ customers
across Southeast Asia. Our 6-person data org powers everything from
executive dashboards to personalization features. We are rebuilding our
data infrastructure to support the next phase of growth.

What you will do:
- Lead the migration from legacy ETL to a modern ELT architecture on BigQuery
- Design and maintain scalable data pipelines using Airflow and Python
- Build and own dbt transformation layers that serve analytics and BI teams
- Define data modeling standards, testing practices, and documentation workflows
- Collaborate with Data Scientists to ensure clean, ML-ready datasets
- Monitor data quality, pipeline reliability, and cost efficiency at scale

Requirements:
- 4+ years of data engineering experience with ownership of production pipelines
- Strong SQL skills and deep familiarity with BigQuery or similar cloud warehouses
- Hands-on experience with dbt for transformation layer management
- Experience building and maintaining orchestration workflows (Airflow or Dagster)
- Python proficiency for pipeline development and data processing
- Understanding of data modeling — dimensional modeling, star schema, or similar

Nice to have:
- Experience supporting ML feature stores or training data pipelines
- Familiarity with streaming data systems (Kafka or Pub/Sub)
- Background in e-commerce, marketplace, or high-transaction-volume data environments
- Experience with data quality frameworks (Great Expectations or similar)

Compensation: Competitive + performance bonus

Not a fit if:
- Your data experience is limited to writing SQL reports or building dashboards
- You have not owned a production pipeline end-to-end
- You are looking for a Data Science or analytics role
```

**Skill note:**

> ⚠️ Do not combine Data Engineering + Data Science + BI + ML Engineering + Analytics into a single JD. These are distinct specializations. A single JD that demands all of them is a signal the company does not understand its own data needs — and will be ignored by strong candidates.

## Step 3 — Building the Interview Question Set

**Sample prompt:**

> "Create an interview question set for a Senior Data Engineer covering both technical depth and behavioral signals. I need to understand what strong answers look like without a data background."

**Generated question set:**

### Technical Questions (for the technical interviewer)

| # | Question | What it tests | What a strong answer looks like |
|---|---------|---------------|---------------------------------|
| 1 | "Walk me through how you would design a data pipeline for an e-commerce platform ingesting orders, events, and CRM data into BigQuery." | End-to-end pipeline architecture thinking | Discusses source system characteristics, ingestion strategy, raw vs transformed layers, scheduling, and failure handling — not just "use Airflow and load to BigQuery" |
| 2 | "How do you structure your dbt project for a team of analysts who need to build on top of your models?" | Analytics engineering maturity | Mentions staging, intermediate, and mart layers, naming conventions, documentation, and testing strategy |
| 3 | "How do you handle late-arriving data or backfills in a production pipeline without breaking downstream dashboards?" | Operational reliability thinking | Discusses idempotency, incremental models, partition strategies, and communicating impact to stakeholders |
| 4 | "How have you approached data quality in a production environment?" | Data reliability ownership | References automated tests, anomaly detection, alerting, data contracts — not just "we checked it manually" |
| 5 | "What considerations do you have when designing a dataset that will be used both for BI reporting and ML model training?" | Cross-functional data system thinking | Discusses grain consistency, feature freshness, lineage tracking, and avoiding leakage in training data |
| 6 | "How do you think about cost management in BigQuery at scale?" | Cloud data maturity | Mentions query optimization, partitioning, clustering, materialization strategy, and monitoring slot usage |

### Behavioral Questions (HR can ask directly)

| # | Question | What it tests |
|---|---------|--------------|
| 1 | "Tell me about a data pipeline that failed in production and how you handled it." | Incident ownership and systematic debugging |
| 2 | "How do you manage competing priorities when both the analytics team and the ML team need something from you urgently?" | Cross-functional collaboration and prioritization |
| 3 | "Have you ever disagreed with how a business stakeholder wanted data structured? What did you do?" | Judgment, communication, and data integrity ownership |
| 4 | "How do you document your pipelines so the team is not dependent only on you?" | Knowledge sharing and engineering discipline |

## Step 4 — Evaluating a Portfolio or GitHub Profile

**Sample prompt:**

> "A candidate shared their GitHub and mentioned they have built several data pipelines. What should I look for to assess whether this is real depth or surface-level work?"

**Portfolio evaluation checklist generated by skill:**

### ✅ Strong signals

- [ ] Pipeline code shows clear separation between ingestion, transformation, and serving layers
- [ ] dbt project structure follows layered conventions (staging → intermediate → mart)
- [ ] README explains architectural decisions, not just setup instructions
- [ ] Evidence of data testing — schema tests, custom SQL tests, or quality checks
- [ ] Orchestration setup (Airflow DAGs, Dagster jobs) exists and is organized
- [ ] Handles failure scenarios — retries, alerting, dead letter queues
- [ ] SQL models are readable, well-named, and documented
- [ ] Shows evidence of working with real, messy data — not just clean tutorial datasets

### ⚠️ Worth asking about

- All projects are Jupyter notebooks with no pipeline or infrastructure context
- dbt usage is present but no testing or documentation layer
- Pipeline logic is entirely hardcoded with no parameterization or reusability
- Projects are solo with no evidence of collaboration or code review

### ❌ Concerning signals

- Only SQL queries and dashboards — no pipeline or infrastructure work
- No evidence of production usage or real data volumes
- Data models are flat and unstructured with no modeling conventions
- No data quality or error handling anywhere in the codebase

## Step 5 — Post-Interview Scorecard

**Sample prompt:**

> "Create a scorecard to evaluate a Senior Data Engineer after the full interview loop."

**Generated scorecard:**

```text
SENIOR DATA ENGINEER — INTERVIEW SCORECARD
Candidate: _____________________ | Date: _____________
Interviewer: ___________________|

SECTION 1: TECHNICAL SKILLS (40 points)
─────────────────────────────────────────
[ /10] Data Pipeline Architecture
       1–3: Builds basic pipelines but no system design thinking
       4–6: Designs reliable pipelines with ingestion, transformation, and serving layers
       7–10: End-to-end production architecture with failure handling, cost efficiency, and scale

[ /10] Data Modeling & dbt
       1–3: Writes SQL queries, no formal modeling knowledge
       4–6: Applies layered dbt conventions, writes tests and documentation
       7–10: Owns transformation architecture, enforces modeling standards across teams

[ /10] Data Quality & Reliability
       1–3: No structured approach to data quality
       4–6: Implements automated tests, monitors pipeline health
       7–10: Owns data quality framework with alerting, SLAs, and stakeholder communication

[ /10] Cloud Data Infrastructure
       1–3: Familiar with tools but no architecture ownership
       4–6: Works confidently in BigQuery or Snowflake with cost and performance awareness
       7–10: Designs scalable lakehouse or warehouse architecture with governance practices

SECTION 2: PRODUCTION DATA EXPERIENCE (20 points)
────────────────────────────────────────────────────
[ /10] Ownership of real production data pipelines
[ /5]  Incident response and pipeline debugging under pressure
[ /5]  Cross-functional support for analytics, BI, and ML consumers

SECTION 3: SYSTEM & BUSINESS THINKING (20 points)
───────────────────────────────────────────────────
[ /10] Ability to translate business needs into scalable data models
[ /5]  Trade-off reasoning (batch vs streaming, cost vs freshness, raw vs curated)
[ /5]  Data governance awareness (lineage, access control, documentation)

SECTION 4: COLLABORATION & LEADERSHIP (20 points)
───────────────────────────────────────────────────
[ /10] Collaboration with analytics, data science, and product teams
[ /5]  Mentoring and knowledge-sharing on data engineering practices
[ /5]  Communication and documentation quality for non-technical stakeholders

TOTAL: ____/100

HIRING THRESHOLDS:
 85–100:  Strong Hire
 70–84:   Hire (with a clear onboarding plan)
 55–69:   Needs discussion — flag specific gaps
 Below 55: No Hire

NOTES:
_________________________________________________
_________________________________________________
```

## Step 6 — Understanding Technical Answers Without a Data Background

**Sample prompt:**

> "A candidate said: 'I designed the lakehouse architecture on Databricks with a medallion pattern — bronze for raw ingestion, silver for cleansed and conformed data, and gold for business-facing aggregations, with Delta Lake handling ACID transactions.' Is this a strong answer?"

**Skill explanation:**

- **Lakehouse on Databricks** = a modern data storage approach that combines the flexibility of a data lake (store everything, including raw files) with the structure of a data warehouse (organized for querying and analytics) — Databricks is one of the leading platforms for this
- **Medallion pattern (bronze / silver / gold)** = a layered data organization strategy where raw data lands in bronze untouched, gets cleaned and standardized in silver, and becomes business-ready aggregations in gold — this is an industry-standard architecture pattern, and naming it correctly signals real experience
- **Delta Lake** = a storage layer that adds reliability features (like transaction support) to a data lake — "ACID transactions" means the data stays consistent even if a pipeline fails halfway through
- **Assessment: Strong signal** — this candidate is not just describing tools, they are describing a deliberate architecture with clear separation of concerns and production reliability in mind. This is the language of someone who has designed and operated real data systems, not someone who has only taken online courses.

## Step 7 — Distinguishing Data Role Types

**Sample prompt:**

> "Our Head of Data said we might need either a 'Data Engineer' or an 'Analytics Engineer.' These sound the same to me. What is actually different?"

**Skill explanation:**

| Dimension | Data Engineer | Analytics Engineer |
|-----------|--------------|-------------------|
| Primary focus | Building the infrastructure that moves and stores data | Transforming raw data into clean, usable models for the business |
| Day-to-day | Pipelines, ingestion, orchestration, infrastructure | dbt models, metric definitions, data layer documentation |
| Output | Reliable data flowing into the warehouse | Business-ready datasets analysts and BI tools can trust |
| Screening signal | Pipeline architecture, cloud infra, orchestration | dbt depth, SQL modeling, business metric thinking |
| JD keywords | Airflow, Spark, Kafka, Python, ETL/ELT, BigQuery infra | dbt, semantic layer, data marts, Looker, metrics consistency |
| When to hire | You need the pipes built and data reliably delivered | You need raw data shaped into trusted business datasets |

> If your analysts are drowning in inconsistent data and no one owns the transformation layer — hire an **Analytics Engineer**. If data is not arriving reliably or pipelines keep breaking — hire a **Data Engineer**. Many growing companies need both, but they are distinct roles and should not be merged into one JD.

## Full Hiring Workflow Summary

```text
Identify which data role type is actually needed
                    ↓
Write a focused JD scoped to one specialization
                    ↓
CV screening: look for pipeline ownership, not just SQL or dashboards
                    ↓
Phone screen: behavioral questions + one pipeline design scenario
                    ↓
Technical interview (pipeline design + data modeling depth)
                    ↓
Take-home or live session: review or extend a dbt project or pipeline
                    ↓
HR debrief using scorecard
                    ↓
Offer / No Offer decision
```

### Common HR Mistakes When Hiring Data Professionals

| Mistake | How to avoid it |
|---------|----------------|
| Treating "knows SQL" as a strong signal for a Data Engineer role | SQL is a baseline expectation — look for pipeline architecture and infrastructure ownership |
| Combining Data Engineer + Data Scientist + BI + ML into one JD | Each is a separate specialization — ask the hiring manager to define the primary responsibility |
| Evaluating data candidates primarily through dashboards or Kaggle scores | Kaggle shows ML modeling skills, not production pipeline or system design depth |
| Ignoring data quality and reliability questions | A data engineer who has never thought about failure handling is a production risk |
| Confusing Data Analyst with Analytics Engineer | Analysts consume data; analytics engineers build the transformation layer analysts depend on |
| Not asking about cost management on cloud platforms | Cloud data costs scale fast — cost awareness is a strong signal of production maturity |
| Over-indexing on the number of tools listed on a resume | Depth of ownership in one production system matters more than a list of 15 tools never used in production |
