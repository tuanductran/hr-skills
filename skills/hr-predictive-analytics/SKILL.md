---
name: hr-predictive-analytics
description: Help people analytics teams build and interpret predictive models for HR outcomes like attrition risk, performance, and hiring success. Use when asked to "build an attrition prediction model", "predict which employees are flight risks", "identify predictors of hiring success", "build a predictive people analytics model", or "interpret this predictive model's results for HR".
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# Predictive people analytics

Build, validate, and responsibly interpret predictive models for HR outcomes — attrition risk, performance trajectory, and hiring success — so people decisions can be informed by evidence rather than intuition alone.

## Supported tasks

- Framing an HR question as a predictive modeling problem
- Identifying relevant predictors for attrition, performance, or hiring success models
- Selecting appropriate features from HRIS, engagement, and performance data
- Interpreting model outputs (risk scores, feature importance) for HR audiences
- Validating predictive models for accuracy and stability over time
- Assessing predictive models for bias and disparate impact before use
- Translating model outputs into actionable manager and HR interventions
- Designing attrition risk flagging processes that avoid over-reliance on scores
- Communicating predictive analytics findings without overstating certainty
- Governing appropriate use and access of predictive model outputs
- Comparing predictive model performance against simpler baseline approaches
- Retiring or retraining models as underlying workforce dynamics shift

## Key prompts

### Framing and building

1. "Frame [HR question, e.g. 'which employees are likely to leave in the next 6 months'] as a predictive modeling problem — what data and approach would this need?"
2. "What predictors are commonly associated with attrition risk, and which of these could we responsibly use given our available data?"
3. "What features would be relevant for a model predicting hiring success for [role type], and how would we validate them against actual performance outcomes?"
4. "What data quality issues in our HRIS would we need to fix before a predictive model on [outcome] would be trustworthy?"

### Interpreting and validating

1. "Explain this model's feature importance output in plain language for an HR business partner audience."
2. "How should we validate whether this attrition prediction model is actually accurate and stable over time, not just fitted to historical data?"
3. "Assess this predictive model for potential bias or disparate impact against protected groups before we put it into use."
4. "How do we explain a false positive or false negative from this model to an employee or manager who questions the result?"

### Applying responsibly

1. "Design a process for how managers should use attrition risk flags — as a conversation prompt, not an automated verdict."
2. "How do we communicate predictive analytics findings to leadership without overstating certainty or implying the model is deterministic?"
3. "What governance should control who can access individual-level predictive risk scores, and for what purposes?"
4. "Should this model's output ever be shared directly with the employee it concerns, or only used internally by HR and managers?"

### Ongoing management

1. "How should we monitor this predictive model over time and decide when it needs retraining or retirement?"
2. "Compare this model's performance against a simple baseline (e.g., tenure-based heuristic) — is the added complexity worth it?"
3. "What would trigger us to retire this model entirely rather than retrain it?"
4. "How do we audit whether managers are actually using model output responsibly rather than over-relying on it?"

## Tips

- Predictive models suggest correlation, not causation or certainty — use them to prompt human judgment and conversation, never as an automated final decision, especially for anything affecting individual employees.
- Test for bias before deployment, not after a complaint — models trained on historical HR data can encode and amplify past inequities.
- Keep humans in the loop for any action that affects an individual employee based on a model output; risk scores should inform managers, not replace them.
- Explain models in plain language to the people who will act on them — a model nobody understands won't be trusted or used correctly.
- Revisit and retrain models periodically; workforce dynamics, labor markets, and business conditions shift, and a stale model quietly becomes wrong.
