# Auditing an AI-Ranked Shortlist for Hidden Bias

## Context

A recruiter notices that an AI-ranked shortlist for a senior engineering role skews heavily toward candidates from a small set of universities and none of the top-ranked candidates are women, despite a diverse applicant pool. Legal wants a documented review before proceeding.

## Step 1: Test for disparate impact and proxy variables

Sample prompt: "What statistical methods should we use to test for disparate impact in AI-assisted hiring decisions?" and "Identify proxy variables that could let our AI screening tool discriminate indirectly by gender even without using it directly."

Expected response: A recommendation to compare pass-through rates by gender and school tier using a standard adverse-impact ratio test, plus a flag that "school prestige" and certain extracurricular keywords can act as proxies correlated with gender and socioeconomic background.

## Step 2: Decide how to handle the flagged case

Sample prompt: "Write escalation criteria for when an AI ethics reviewer, not just a manager, must sign off on a flagged case" and "How do we handle a situation where an AI tool recommends an HR decision that a human reviewer believes is wrong?"

Expected response: Escalation criteria stating that any shortlist with a statistically significant disparate-impact ratio triggers manual re-ranking by a recruiter using the full applicant pool, with the AI score treated as one input, not the deciding factor.

## Step 3: Document and disclose

Sample prompt: "Draft a one-page ethical AI decision brief a hiring manager must sign before using AI-ranked shortlists in a final decision."

Expected response: A one-page brief recording the disparate-impact test result, the corrective action taken (manual re-ranking), and the hiring manager's acknowledgment that the final shortlist reflects human review, filed for audit purposes.

## Workflow summary

The team catches the skew through a proxy-variable and disparate-impact review, escalates rather than proceeding on the flawed shortlist, and documents the correction so the decision holds up under audit.
