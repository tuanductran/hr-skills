# Using GenAI to Summarize Exit Interview Themes

## Context

An HR business partner has 40 exit interview notes from the past quarter and needs to identify recurring themes for a retention review with leadership, without exposing individual employees' identifiable comments.

## Step 1: Draft the summarization prompt with guardrails

Sample prompt: "Summarize this batch of exit interview notes and identify the two most common themes without quoting any individual verbatim."

Expected response: A prompt structure that feeds in anonymized notes (names and identifying details stripped beforehand), asks for theme frequency and representative paraphrased patterns rather than direct quotes, and explicitly instructs against attributing any theme to a specific person or team of fewer than five people.

## Step 2: Review output quality before use

Sample prompt: "Draft a quality-review checklist an HR generalist should run through before sending a GenAI-drafted policy explanation to employees" (adapted to a leadership-facing summary).

Expected response: A checklist confirming the summary doesn't include identifiable quotes, that theme counts match a manual spot-check of the source notes, and that any sensitive theme (such as harassment mentions) is flagged for direct HR follow-up rather than folded into a generic summary line.

## Step 3: Present findings responsibly

Sample prompt: "Draft a GenAI usage guardrail specifically for compensation-related HR communications, given their sensitivity" (adapted as a general sensitivity guardrail for the leadership readout).

Expected response: Guidance to present themes as aggregate patterns with sample sizes attached (for example, "6 of 40 departures cited limited growth opportunity"), and to route any theme touching potential policy or legal risk to HR leadership for direct review before it appears in a broader readout.

## Workflow summary

The HR business partner uses GenAI to speed up theme identification across a large volume of notes, while keeping anonymization, human quality review, and sensitive-topic escalation firmly in place before anything reaches leadership.
