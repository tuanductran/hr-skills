# Writing a role-specific job description

## Context

A growth-stage fintech company is opening a Head of Product role for the first time. The hiring manager has written a draft job description that is heavily requirement-focused, lists 18 bullet points under qualifications, requires a computer science degree, and doesn't mention compensation or team context. The recruiter needs to rewrite it before posting.

## Step 1: Audit the existing JD

Sample prompt: "Score this job description against modern JD best practices and identify the three highest-priority improvements."

Expected response:

1. It leads with qualifications instead of the opportunity — candidates will stop reading before they understand why this role is compelling.
2. Eighteen qualification bullet points include several that are not genuinely required — this will suppress qualified candidate applications.
3. No compensation range is included — adding one will reduce time spent on misaligned candidates and improve application quality.

## Step 2: Rewrite the opening

Sample prompt: "Write an opportunity summary for a Head of Product at a growth-stage fintech company."

Expected response:

```text
We're building [product] to [mission]. As our first Head of Product, you'll define how we think about product — setting strategy, building the roadmap, and establishing the systems and team culture that scale us from [current ARR] to [target]. You'll report directly to the CEO and work closely with Engineering, Design, and Go-to-Market to ship products that matter.
```

## Step 3: Define success expectations

Sample prompt: "Draft the 30/60/90-day success expectations for a Head of Product at a Series B fintech company."

Expected response:

- First 30 days: understand the current product, customer feedback, and team capabilities; build relationships with engineering and GTM leads; identify the top 3 product bets and the top 3 blockers.
- First 60 days: ship one meaningful improvement; establish roadmap rhythm and prioritization criteria; present a 6-month product strategy to leadership.
- First 90 days: own the roadmap; have a point of view on team structure and hiring needs; establish the metrics the product team will use to measure success.

## Step 4: Clean up qualifications

Sample prompt: "Remove degree and years-of-experience requirements from this job description that aren't genuinely necessary for role success."

Expected response: Removed: "Computer Science or Engineering degree required," "10+ years of product experience." Retained: demonstrated experience shipping B2B fintech products, experience leading product teams, and track record of taking products from 0 to 1 in a resource-constrained environment.

## Step 5: Add compensation and team context

Sample prompt: "Write a compensation and team section for a Head of Product posting including salary range, equity, and team structure."

Expected response: A compensation block with a salary range, equity range (options or RSUs), benefits overview, and a two-sentence team context note about who the role will initially lead and what the anticipated team growth looks like.

## Workflow summary

Use `hr-job-description` to transform a requirement-heavy draft into a candidate-focused posting that leads with the opportunity, defines clear success expectations, removes unnecessary barriers, and includes compensation transparency — improving both application quality and time-to-fill.
