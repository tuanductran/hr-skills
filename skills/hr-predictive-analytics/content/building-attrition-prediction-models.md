# Building Attrition Prediction Models

## Overview

Attrition prediction is the most common entry point into predictive people analytics, and also the model type most likely to be misused. Done well, it directs limited retention resources toward the employees and teams where intervention has the highest expected value. Done poorly, it becomes a black-box score that managers treat as a verdict rather than a signal — and one that can quietly encode bias if the underlying data reflects historical inequities in how attrition itself was managed.

The goal is not to predict attrition perfectly. It's to produce a ranked, explainable risk signal that's accurate enough to beat manager intuition alone, and transparent enough that HR can defend how it's used.

## Framing the Problem

Before touching data, define the prediction target precisely:

- **Voluntary vs. involuntary attrition** — these have different drivers and should almost never be modeled together. Combining them muddies both the signal and the resulting interventions.
- **Prediction horizon** — 90 days, 6 months, 12 months. A shorter horizon supports faster intervention but has less signal to work with; a longer horizon has more signal but less actionable urgency.
- **Population scope** — a single model rarely performs well across radically different populations (hourly retail staff vs. senior engineers have different attrition drivers). Segment the model by population where drivers plausibly differ, rather than forcing one model to generalize across all of them.

## Feature Selection

Useful predictive features generally fall into four groups:

| Group | Examples |
|---|---|
| Tenure and career dynamics | Time since last promotion, time in role, time since last raise |
| Engagement signals | Survey scores, eNPS trend, participation rate in optional programs |
| Manager and team context | Manager tenure, team attrition rate, span of control |
| Compensation position | Pay relative to internal band, pay relative to market benchmark |

Avoid features that are proxies for protected characteristics, even indirectly — zip code, alma mater, and certain tenure patterns can correlate with race, age, or gender in ways that reintroduce bias the model should be actively screened against. Run a disparate impact check on any feature with a plausible demographic correlation before including it, and drop features that show meaningful correlation.

## Model Selection and Validation

Interpretability should usually outweigh marginal accuracy gains for HR use cases. A well-tuned logistic regression or gradient-boosted tree with SHAP-based feature attribution is generally preferable to a more opaque model — HR and legal need to be able to explain, in plain language, why an individual scored as high-risk.

Validate using a **time-based split**, not a random split: train on data through a cutoff date, test on attrition that occurred after it. Random splits leak future information into training and produce misleadingly optimistic accuracy.

Report performance in terms decision-makers can act on, not just AUC:

- **Precision at top-decile risk** — of the employees flagged highest-risk, what share actually leave? This tells retention teams how much wasted effort to expect.
- **Recall at a defined risk threshold** — of the employees who actually left, what share did the model flag in advance? This tells you how many departures the model would have missed.

## Bias and Fairness Auditing

Before deployment, and on a recurring cycle afterward, run the model's outputs through a fairness audit:

- Compare flagging rates across demographic groups (where legally permissible to analyze) — a large disparity warrants investigation even if no single feature is an obvious proxy.
- Check whether the model's false positive and false negative rates are roughly balanced across groups, not just its overall accuracy.
- Document the audit process and results — this is often requested in employment litigation involving algorithmic tools, and the absence of documentation is itself a liability.

## From Score to Intervention

A risk score with no defined action attached is not useful and can be actively harmful if managers over-interpret it. Pair every deployment with:

- **A defined action for each risk tier** — what should a manager actually do differently for a high-risk employee versus a low-risk one?
- **A rule against using the score punitively.** The model predicts who might leave, not who is underperforming or disengaged in a way that justifies action against the employee. Conflating the two is a common and damaging misuse.
- **A feedback loop** — track whether flagged employees who received intervention had lower actual attrition than a comparable unflagged group, and use this to validate the model is adding value, not just generating activity.

## Governance and Communication

Attrition models touch sensitive territory — employees generally don't know they're being scored, and disclosure norms vary by jurisdiction and company culture. At minimum:

- Restrict access to individual-level scores to people with a legitimate need (typically HRBPs and the employee's direct manager, not broad leadership dashboards)
- Never share individual scores with the employee's peers or use them in team-wide communications
- Establish a policy for how long scores are retained and when they're refreshed or purged
- Revisit the model at least annually — attrition drivers shift with labor market conditions, and a model trained on a tight labor market will misfire in a loose one
