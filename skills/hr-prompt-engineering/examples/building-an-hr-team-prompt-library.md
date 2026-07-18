# Building an HR team prompt library

## Context

You are the Head of HR at a 350-person technology company. Your HR team of six uses AI tools daily for recruiting, performance management, employee communications, and HR operations. Outputs are inconsistent — each HR team member writes their own prompts from scratch, producing different tone, quality, and format across similar documents.

You want to build a shared HR prompt library that your team can use to produce consistent, high-quality outputs with less rework.

## Step 1 — Assess current prompt usage

**Sample prompt:**

> "We use AI tools across recruiting, performance management, and employee communications. Help me identify the top five HR tasks where a shared prompt library would save the most time and produce the most consistency."

**Expected skill response:**

- Map the highest-volume, highest-repetition HR tasks where prompt quality directly impacts document quality and turnaround time.
- Prioritize tasks where inconsistency causes visible business problems — for example, job descriptions that do not reflect company tone, or performance review narratives that vary wildly in quality across managers.
- Identify tasks where a good prompt template reduces a 30-minute writing task to a five-minute review-and-edit task.

**Recommended priority areas for most HR teams:**

| Task | Volume | Impact of better prompts |
|---|---|---|
| Job descriptions | High | Consistent tone, format, and inclusive language |
| Behavioral interview questions | High | Consistent structure and competency alignment |
| Performance review narratives | High | Consistent rating anchors and forward-looking language |
| Employee communications | Medium | Consistent message structure and approval-ready drafts |
| HR policy summaries | Medium | Plain-language consistency for employee-facing content |

## Step 2 — Design the prompt library structure

**Sample prompt:**

> "Design a folder structure for an HR prompt library organized by function. We want it to be easy for any HR team member to find the right prompt in under 30 seconds."

**Generated structure:**

```text
HR Prompt Library/
│
├── 01 Talent Acquisition/
│   ├── job-descriptions.md
│   ├── interview-questions.md
│   ├── candidate-communications.md
│   └── offer-letters.md
│
├── 02 Performance Management/
│   ├── performance-review-narratives.md
│   ├── goal-setting.md
│   └── performance-improvement-plans.md
│
├── 03 Employee Communications/
│   ├── change-communications.md
│   ├── policy-announcements.md
│   └── manager-talking-points.md
│
├── 04 HR Operations/
│   ├── policy-summaries.md
│   ├── onboarding-guides.md
│   └── process-checklists.md
│
└── 05 Templates and Standards/
    ├── prompt-writing-guide.md
    └── quality-checklist.md
```

## Step 3 — Write the first prompt template

**Sample prompt:**

> "Write a reusable job description prompt template that our HR team can use for any role. It should always produce consistent tone, format, and inclusive language. Include clear placeholders for role-specific information."

**Generated template:**

```text
Job Description Prompt Template

Act as an experienced HR content writer who specializes in clear, inclusive job descriptions.

Write a job description for a [ROLE TITLE] at [LEVEL: Junior / Mid / Senior / Lead / Manager / Director] in our [DEPARTMENT] team.

Context:
- Company type: [e.g., 350-person B2B SaaS company]
- Reporting to: [MANAGER TITLE]
- Work arrangement: [Remote / Hybrid / On-site] in [LOCATION]
- Key purpose of this role: [One sentence describing what this person will do]

Include the following sections in this order:
1. About the role (2 sentences)
2. Key responsibilities (5-7 bullets)
3. Required qualifications (4-6 bullets)
4. Preferred qualifications (2-4 bullets)
5. What we offer (3-4 bullets covering compensation, benefits, and culture)

Formatting rules:
- Use inclusive language throughout. Avoid gendered pronouns.
- Do not use jargon or acronyms without defining them.
- Keep the total length under 500 words.
- Write in second person ("You will..." not "The ideal candidate will...").
```

## Step 4 — Test and calibrate the template

**Sample prompt:**

> "Use the job description template to write a job description for a Senior Data Engineer, Level 4, reporting to the VP of Engineering, hybrid in Hanoi, Vietnam. The role is responsible for building and maintaining our data platform."

**Review criteria:**

After generating the output, the HR team should evaluate:

- Does the tone match our company voice?
- Is the format consistent with our current job descriptions?
- Did the AI include anything we never want (e.g., "rockstar", "ninja", "hustle culture")?
- Is the length appropriate?
- Are the responsibilities specific enough to be useful to a candidate?

**Refinement prompt:**

> "The output looks good but the tone is slightly too formal for our company. Also, we never use the phrase 'fast-paced environment'. Remove it and soften the overall tone to be more approachable while staying professional."

## Step 5 — Document the prompt standard

**Sample prompt:**

> "Write a one-page prompt writing guide for our HR team explaining how to use and customize prompts from our shared library. Keep it non-technical and practical."

**Generated guide outline:**

```text
HR Prompt Library — How to Use

What is a prompt?
A prompt is an instruction you give to an AI tool. A better prompt = a better output.

How to use a template:
1. Find the template that matches your task.
2. Replace all [BRACKETED PLACEHOLDERS] with your specific information.
3. Paste the complete prompt into the AI tool.
4. Review the output — edit as needed.
5. If the output needs improvement, add one clarifying instruction and try again.

How to add a prompt to the library:
1. Test the prompt at least three times on different examples.
2. Make sure it produces a usable output each time.
3. Add it to the correct folder with a clear filename.
4. Include a one-sentence note at the top explaining when to use it.

What not to include in prompts:
- Real employee names or IDs.
- Salary data linked to specific individuals.
- Medical or leave information.
- Any data your organization has not approved for use in AI tools.
```

## Step 6 — Run a team prompt review session

**Sample prompt:**

> "Design a 45-minute team session for six HR professionals to review and improve the prompt library together. Include agenda, activities, and how to capture decisions."

**Generated session agenda:**

```text
HR Prompt Library Review — 45-Minute Team Session

Objective: Identify the top three prompts to improve and agree on quality standards.

0:00 — Introduction (5 min)
Review the purpose of the session. Share the prompt library structure.

0:05 — Hot prompts (15 min)
Each team member shares the one prompt they use most. Vote on the top three to review.

0:20 — Live improvement (15 min)
For each of the top three prompts:
- Run the current prompt and review the output.
- Identify the top improvement.
- Draft the improved version together.

0:35 — Standards agreement (8 min)
Agree on: tone guidelines, format standards, and what never to include.

0:43 — Next steps (2 min)
Assign owners for updating the top three prompts. Schedule next review.
```

## Summary

Use `hr-prompt-engineering` to build a shared prompt library that helps your HR team produce consistent, high-quality AI outputs across every HR function — from recruiting to performance management to employee communications. Start with the highest-volume tasks, build tested templates, and document standards your whole team can follow.

> Related prompts: [Building and improving HR prompts](../prompts/building-and-improving-hr-prompts.md).
