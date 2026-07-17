# Predictive Analytics in HR

## Overview

Predictive analytics in HR means using historical workforce data to forecast future outcomes — attrition risk, hiring success, flight risk for high performers, time-to-productivity for new hires, and leadership potential. Done well, it shifts HR from reactive to anticipatory. Done poorly, it produces confident-looking numbers with no meaningful predictive validity that drive flawed decisions.

This guide covers when predictive analytics adds genuine value, how to build models that are honest about their limitations, and how to avoid the most common pitfalls.

## When Predictive Analytics Is Worth Building

Not every HR question benefits from a predictive model. The conditions that make one worth building:

- The outcome you are predicting is **consequential** — it drives resource allocation, intervention design, or business planning
- You have **sufficient historical data** — typically 500+ data points minimum, ideally thousands, with the outcome variable represented at adequate frequency
- The outcome is **measurable** — voluntary attrition is; "becoming a high performer" often is not, because performance ratings are inconsistently applied
- You are prepared to **act on the predictions** — a model that predicts flight risk is only useful if there is an intervention to deploy for high-risk individuals

Common HR use cases that meet these conditions: voluntary attrition prediction, time-to-fill forecasting, offer acceptance likelihood, new hire ramp-time prediction.

Common HR use cases that often do not: performance prediction (rating inconsistency), leadership potential identification (definition drift), culture fit scoring (proxy risk).

## Attrition Prediction: The Most Common Model

Attrition prediction is the most widely deployed HR predictive model because the outcome (an employee leaving) is clearly defined, historically documented, and consequential.

### Typical input variables

- Tenure at current level and in current role
- Time since last compensation adjustment (relative to peer group)
- Manager change frequency
- Recent performance rating trend
- Engagement survey score trend
- Internal mobility history (lack of lateral movement over a long period is a signal)
- Commute distance or remote/hybrid arrangement
- Team attrition rate (attrition is socially contagious)

### Variables to avoid

Protected characteristics (race, gender, age, disability, national origin) and their proxies must not be inputs to employment-related predictive models. Even if a variable has predictive value in the data, using it creates disparate impact exposure. Work with legal before finalizing the feature set.

### What a valid model can tell you

A well-constructed attrition model tells you which employees are statistically similar to past employees who left voluntarily — not which employees will definitely leave. The output is a probability, not a prediction of individual behavior.

Treat model output as a triage signal: focus retention conversations on high-risk cohorts, not as a deterministic judgment about specific individuals.

## Model Validation: Non-Negotiable Steps

A model that has not been validated is not a predictive model — it is a correlation exercise with a confidence problem.

### Holdout validation

Split your historical data: train on 70-80% of it, validate on the remaining 20-30% that the model has never seen. Measure predictive accuracy (AUC-ROC for classification models, RMSE for regression) on the holdout set. A model that looks good on training data but poor on holdout data is overfit and will fail in production.

### Disparate impact testing

Run the model's outputs through a fairness analysis before deployment. Calculate output score distributions by protected group. Apply the 80% rule or other fairness thresholds appropriate to your context. Document the results and have legal review them.

### Calibration check

If the model says an employee has a 70% attrition risk, approximately 70% of employees with that score should actually leave. Check calibration across the score range, not just the top tier.

### Periodic revalidation

Models decay. Workforce composition changes, organizational conditions change, and the historical patterns the model learned may no longer apply. Revalidate predictive models at least annually, or after significant organizational changes.

## Communicating Predictive Analytics to Stakeholders

The gap between how data scientists think about model outputs and how business leaders use them is where most predictive analytics programs fail.

### What to communicate clearly

- The model predicts probability, not certainty — a 75% attrition risk score means "statistically similar to people who left" not "this person is leaving"
- The model's accuracy metrics and what they mean in plain terms (if the model correctly identifies 65% of voluntary leavers, what does that mean for how we should use it?)
- What actions the model is and is not designed to support
- That model output should never be the sole basis for employment decisions

### Common misuse patterns to prevent

- Using attrition risk scores to make retention investment decisions that disadvantage low-risk employees (creates inequity)
- Treating model scores as performance evaluations (they are not)
- Over-relying on the model and under-investing in manager judgment and direct feedback
- Sharing individual risk scores with those employees' direct managers without governance guardrails
