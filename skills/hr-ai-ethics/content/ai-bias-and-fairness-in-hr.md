# AI Bias and Fairness in HR

## Overview

AI bias in HR is documented, consequential, and legally actionable. Amazon's internal recruiting tool was scrapped after it was found to systematically downrank resumes from women. Hirevue and other video interview AI tools have faced scrutiny for penalizing candidates based on facial features correlated with race. Algorithmic performance tools have been shown to disadvantage workers with certain disability profiles.

For HR professionals, AI ethics is not an abstract concern — it is a concrete compliance, legal, and people-risk challenge that requires active governance, not passive trust in vendor claims.

## Why AI Bias Happens in HR Systems

Understanding the mechanism helps HR teams ask better vendor questions and design better audit processes.

### Training data bias

AI models learn patterns from historical data. If your historical hiring decisions favored certain demographics (which most organizations' do, to some degree), the model learns to replicate those patterns. It does not need to use protected characteristics directly — it will learn proxies.

Common proxies for protected characteristics:

- Zip code or commute distance → race, socioeconomic status
- Gap in employment history → gender, disability, caregiving status
- Name or communication style → race, national origin
- Graduation year → age
- School name → socioeconomic status, race

### Label bias

In supervised learning, the model is trained on human-labeled data. If the humans labeling "good candidate" or "poor performer" had biased judgment, the model inherits and scales that bias. Labels from past hiring managers are particularly problematic.

### Feedback loop bias

When a biased AI tool influences decisions, those decisions become the next round of training data, reinforcing and amplifying the original bias over time.

## Fairness Definitions: Why They Conflict

There is no single correct definition of algorithmic fairness. The major definitions are mathematically incompatible — satisfying one makes it impossible to fully satisfy the others. HR teams must consciously choose which definition governs their context.

### Demographic parity

The model produces positive outcomes (hire, advance, flag as high-potential) at equal rates across demographic groups.

**When to prioritize:** DEI goals, correcting historical underrepresentation, initial hiring pool expansion.

**Tradeoff:** May require the model to advance candidates with lower predicted scores from some groups to equalize rates.

### Equal opportunity (equal true positive rate)

Among truly qualified candidates, the model identifies them at equal rates across groups.

**When to prioritize:** Screening and assessment tools where missing qualified candidates from any group is the primary concern.

**Tradeoff:** Does not control for false positive rates (advancing unqualified candidates) across groups.

### Calibration

When the model gives a score of 80%, that score should mean the same thing regardless of which group the candidate belongs to.

**When to prioritize:** When the score is used to rank candidates and meaningful differentiation within groups matters.

**Tradeoff:** Calibration and equal opportunity cannot both be satisfied when base rates differ between groups.

The right approach is to involve legal counsel, DEI experts, and — in some jurisdictions — external auditors in choosing and documenting your fairness standard.

## Conducting an AI Bias Audit

A bias audit is not a one-time vendor certification review. It is an ongoing process.

### What to request from vendors

- Training data composition by demographic group (where legally permissible to collect)
- Disparate impact analysis by protected characteristic across key outputs
- False positive and false negative rates by demographic group
- Whether the model has been independently audited, and by whom
- Methodology for ongoing bias monitoring in production

### What to test yourself

- Run the tool on a sample of historical candidates where you know outcomes
- Compare output scores or decisions across demographic groups using available data
- Check whether removing protected characteristics changes outputs significantly
- Test with synthetic candidate profiles designed to isolate specific characteristics

### Disparate impact threshold

A common legal threshold is the 80% rule (the four-fifths rule): if the selection rate for a protected group is less than 80% of the rate for the group with the highest selection rate, disparate impact is present. This is a minimum legal floor, not a quality standard.

## Building an Ethical AI Governance Structure for HR

### Policy layer

An ethical AI use policy for HR should specify:

- Which HR decisions AI may assist with, which it may not influence, and which remain fully human
- Required transparency to employees and candidates when AI is used
- Human review requirements for each decision type
- How employees and candidates may request human review of AI-influenced decisions
- Who is accountable for AI tool governance and periodic review

### Oversight layer

Designate a responsible owner for each AI tool in production — not just the vendor relationship owner, but someone accountable for ongoing fairness and accuracy. This person should:

- Review bias metrics quarterly or after model updates
- Coordinate with legal on regulatory developments
- Escalate anomalies and facilitate independent audits when warranted

### Audit layer

Schedule periodic third-party audits for AI tools used in high-stakes HR decisions. As regulation tightens (EU AI Act, NYC Local Law 144, emerging US state requirements), documentation of audits and audit findings will be a compliance requirement, not just a best practice.

## Regulatory Landscape

The regulatory environment for AI in employment is evolving rapidly.

- **NYC Local Law 144 (2023):** Requires bias audits for automated employment decision tools used in New York City hiring and promotion, with public disclosure of audit results.
- **EU AI Act:** Classifies employment-related AI systems as high-risk, requiring conformity assessments, transparency, and human oversight.
- **US EEOC guidance:** Has clarified that Title VII applies to AI tools used in employment decisions — disparate impact via algorithm is not a defense.
- **Colorado, Illinois, Maryland:** Have enacted or are developing state-level AI employment regulations.

HR teams should not assume vendor compliance covers your organization's legal exposure — the obligation sits with the employer using the tool.
