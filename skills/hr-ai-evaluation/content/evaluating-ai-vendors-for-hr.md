# Evaluating AI Vendors for HR

## Overview

HR technology procurement has always required skepticism about vendor claims. AI vendor evaluation requires more. The combination of opaque models, rapidly evolving capabilities, high-stakes use cases, and increasing regulatory scrutiny means that standard procurement due diligence is not sufficient.

This guide provides a structured approach to evaluating AI tools for HR use cases — from initial vendor qualification through pilot design and ongoing re-evaluation.

## Why Standard Procurement Is Not Enough

Conventional software procurement evaluates features, price, integration, and support. AI tools require additional scrutiny across three dimensions that standard procurement rarely addresses.

**Model opacity:** Unlike traditional software where behavior is deterministic and auditable, AI model behavior is probabilistic, context-dependent, and often not fully explainable by the vendor. "The model produces this output" is not a sufficient answer to why a candidate was scored the way they were.

**Bias risk:** AI models trained on historical data can encode historical discrimination patterns. Vendors may not know their model's disparate impact profile across your specific population until you measure it.

**Regulatory evolution:** The legal obligations around AI in employment decisions are changing faster than most procurement cycles. A tool that passes legal review today may create compliance exposure within 18 months.

## Phase 1: Vendor Qualification

Before investing in a deep evaluation, use these qualification questions to filter.

### Transparency questions

- Can you describe what data your model was trained on and how it was labeled?
- Has your model been independently audited for bias? By whom, when, and can we see the report?
- What is your process for disclosing model updates to customers?
- When the model produces an output, can you explain why it produced that specific output for a specific input?

If a vendor cannot provide substantive answers to these questions, or becomes defensive, that is a qualification signal.

### Compliance questions

- How do you support customers' compliance with NYC Local Law 144 (if applicable)?
- How does your model documentation support EU AI Act compliance for high-risk systems?
- What documentation do you provide to support our bias audit obligations?
- How are employment-related decisions made by your system logged and retained?

### Data handling questions

- What candidate or employee data does your system retain after processing?
- Where is data stored, and what are the data residency options?
- How is data deleted when a customer offboards?
- What is your subprocessor list and how do you notify customers of changes?

## Phase 2: Technical Evaluation

### Building the evaluation framework

Define your evaluation criteria before the vendor demo, not during it. Criteria should be weighted and agreed on by the full evaluation team — HR, legal, IT, and DEI stakeholders — before any vendor presents.

A standard framework covers:

**Accuracy and reliability** — Does the tool produce outputs that are correct and consistent? What is the error rate in realistic use cases?

**Fairness and bias** — Does the tool produce disparate outcomes across protected groups? What is the vendor's mechanism for detecting and correcting this?

**Explainability** — Can the tool explain its outputs in terms a human reviewer can evaluate and act on?

**Integration** — Can the tool connect to your existing ATS, HRIS, or communication platforms without excessive custom development?

**Security** — Does the tool meet your organization's security and data handling requirements?

**Vendor viability** — Is this vendor likely to still exist in 24 months? Do they have enterprise-grade support?

### Running the evaluation

**Use your own data where possible.** Ask vendors to demonstrate on realistic inputs, not their prepared demos. Provide sanitized samples of your actual job descriptions, candidate profiles, or performance data.

**Test edge cases.** How does the tool handle unusual inputs? An AI screening tool evaluated only on ideal candidate profiles does not tell you how it handles career changers, non-traditional backgrounds, or candidates with employment gaps.

**Measure disparate impact.** If legally permissible in your jurisdiction, run the tool against a sample of historical candidates where you know outcomes and demographic data. Calculate selection rates by group using the 80% rule as a minimum threshold.

**Compare outputs to human judgment.** For assessment or screening tools, have HR professionals independently evaluate the same sample the tool evaluates and compare results. Systematic divergences are investigation points, not automatic disqualifiers.

## Phase 3: Pilot Design

A pilot is the most important risk mitigation step in AI tool adoption. A well-designed pilot surfaces the issues that vendor demos are designed to conceal.

### Pilot design principles

**Controlled scope** — Limit the pilot to one use case, one team, and a defined time period. Expanding scope during the pilot contaminates the evaluation.

**Parallel run** — Where feasible, run the AI tool in parallel with your existing process rather than replacing it. Compare outputs side-by-side.

**Defined success criteria** — Establish what success looks like before the pilot starts, not after. Criteria should include quality, bias metrics, time savings, and user experience.

**Structured feedback collection** — Build in regular feedback sessions with pilot participants. Informal feedback is lost; structured feedback informs the go/no-go decision.

**Go/no-go criteria** — Define the conditions under which you would not proceed to full rollout before the pilot begins. This removes vendor pressure from the final decision.

### Pilot red flags

Watch for these signals during a pilot:

- User adoption is low because the output requires more editing than doing the task from scratch
- Output quality degrades for atypical inputs (non-standard roles, unusual candidate backgrounds)
- Disparate impact metrics show patterns across protected groups
- The vendor is slow to respond to issues found during the pilot
- Integration behaves differently in your environment than in the vendor demo

## Phase 4: Ongoing Re-evaluation

Approval is not permanent. Build re-evaluation into the governance structure from the start.

### Re-evaluation triggers

- Vendor updates the model (require notification in the contract)
- Regulatory changes that affect compliance obligations
- Internal audit findings
- Significant changes in the vendor's organizational or financial situation
- User-reported anomalies in output quality or consistency

### Ongoing monitoring

Designate a responsible owner for each AI tool — accountable not just for the vendor relationship but for ongoing performance. This person reviews bias metrics quarterly, coordinates with legal on regulatory developments, and escalates anomalies.

### Offboarding plan

Before signing a contract, agree on what offboarding looks like. What happens to your data? What is the transition path? Vendors that make offboarding difficult use that friction as a retention mechanism — negotiate data portability and deletion rights before you are trying to leave.
