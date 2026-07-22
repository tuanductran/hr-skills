# Rolling Out an Attrition Risk Model Without Overstating Certainty

## Context

A people analytics team built a model that flags sales reps as high, medium, or low attrition risk based on tenure, engagement scores, and manager change history. Sales leadership wants the flags sent directly to frontline managers, but the analytics lead is concerned about managers treating scores as verdicts rather than signals.

## Step 1: Check the model before rollout

Sample prompt: "Assess this attrition model's feature importance output for potential bias before we let managers see individual risk scores" and "Compare this model's predictive accuracy against a simple tenure-based heuristic to decide whether the added complexity is worth it."

Expected response: A bias check confirming the model isn't over-weighting a factor correlated with a protected characteristic (for example, recent parental leave inflating the "manager change" feature), plus a comparison showing the model modestly outperforms a simple tenure heuristic, justifying its use if deployed responsibly.

## Step 2: Design responsible manager usage

Sample prompt: "Design a process for how managers should use attrition risk flags as a conversation prompt, not an automated verdict."

Expected response: A process where a "high risk" flag prompts the manager to have a genuine career or workload check-in within two weeks, explicitly framed as a prompt to investigate rather than a fact about the employee, with guidance not to mention the score or model to the employee directly.

## Step 3: Make the output understandable

Sample prompt: "Explain this model's top five predictors in plain language for an HRBP audience with no data science background."

Expected response: A plain-language explanation translating feature importance into business terms — for example, "reps who haven't had a recent role change or recognition in the last two quarters show the strongest risk signal" — so HRBPs can coach managers without needing to understand the underlying statistics.

## Workflow summary

The team validates the model for bias and real predictive value before rollout, designs manager usage so flags prompt a conversation instead of a judgment, and translates the model's output into language HRBPs and managers can actually act on responsibly.
