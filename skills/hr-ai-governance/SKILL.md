---
name: hr-ai-governance
description: "Help HR and compliance teams govern the responsible use of AI in HR processes, including hiring algorithms, monitoring tools, and policy design. Use when asked to design an AI governance policy for HR, assess bias risk in a hiring algorithm, write an AI use policy for HR, audit an HR AI tool, or similar HR AI governance tasks."
metadata:
  author: Tuan Duc Tran
  version: "1.0.2"
---

# HR AI governance

Helps HR and compliance teams govern the responsible, compliant use of AI tools across the employee lifecycle, from hiring algorithms to performance analytics and employee monitoring.

## Supported tasks

- Drafting an AI use policy for HR processes
- Assessing bias and disparate-impact risk in AI-driven hiring tools
- Designing a governance review process for adopting new HR AI tools
- Writing employee-facing disclosures about AI use in HR decisions
- Mapping AI-related regulatory requirements relevant to HR (e.g., automated employment decision tools)
- Designing human-in-the-loop review requirements for AI-assisted decisions
- Building an AI vendor due-diligence checklist for HR tools
- Drafting data privacy guidance for AI tools processing employee data
- Auditing existing HR AI tools against governance standards
- Designing escalation processes for AI-related employee complaints
- Classifying HR AI use cases by decision impact and required oversight
- Designing data-flow, retention, correction, and appeal controls for HR AI systems

## Key prompts

### Policy and governance design

1. "Draft an AI use policy governing how HR may use AI tools in hiring and performance decisions."
2. "Design a governance review process required before adopting a new HR AI tool."
3. "Write a human-in-the-loop requirement for AI-assisted hiring decisions."
4. "Create an escalation process for employees who want to contest an AI-assisted decision."
5. "Draft documentation standards HR must follow when using AI in employment decisions."

### Risk and bias assessment

1. "Design a bias audit framework for an AI-driven resume screening tool."
2. "Identify disparate-impact risks in an AI-based candidate ranking system."
3. "Create a checklist to evaluate an AI vendor's fairness and transparency practices."
4. "Draft questions to ask an AI hiring tool vendor about training data and validation testing."
5. "Assess data privacy risks of an AI tool that analyzes employee communications."

### Use-case triage and operational controls

1. "Classify [HR AI use case] as administrative assistance, decision support, or automated decision-making and define the required controls."
2. "Map the data flow, retention, access, and deletion controls for [AI tool] processing [employee or candidate data]."
3. "Design a monitoring and appeal process for [AI-assisted HR decision] that records overrides, incidents, and correction requests."
4. "Create a pre-pilot, launch, and post-launch review checklist for [HR AI use case]."

### Disclosure and training

1. "Write an employee-facing disclosure explaining how AI is used in the hiring process."
2. "Draft training content for HR staff on responsible and compliant AI use."
3. "Create talking points for a manager asked about AI use in performance reviews."
4. "Summarize regulatory requirements for automated employment decision tools in [jurisdiction]."
5. "Draft a candidate notice required before using an AI assessment tool in hiring."

## Tips

- Require human review of any AI-assisted decision with material employment consequences (hiring, termination, promotion).
- Document what data trains and validates any AI hiring tool before adoption, not after a complaint.
- Disclose AI use to candidates and employees clearly, in plain language, ahead of the decision being made.
- Reassess AI tools periodically for bias, since model behavior and underlying data can drift over time.
- Treat prompts, uploads, outputs, and vendor logs as potential employee-data surfaces; define their controls before launch.
- Classify the use case before evaluating the vendor so governance effort follows employment impact, not product novelty.

## Common mistakes

- Adopting AI hiring tools without vendor documentation on bias testing or validation studies.
- Treating AI output as final without a meaningful human review step.
- Failing to notify candidates or employees that an AI tool is involved in a decision affecting them.
- Assuming one-time bias testing is sufficient without ongoing monitoring.
