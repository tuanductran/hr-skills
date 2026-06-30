---
description: Scaffold a new hr-* skill directory with SKILL.md, content/, and examples/ templates
---

# New skill

Ask the user for the skill name. It must start with `hr-` and use kebab-case only (for example `hr-retention`, `hr-interviewing`). If the name does not follow this format, prompt again.

Once you have a valid name, derive these values:

- `<full-name>` — the full name the user provided (e.g. `hr-retention`)
- `<short-name>` — the part after `hr-` (e.g. `retention`), used as the filename for the content doc (no `hr-` prefix)
- `<Title Case>` — a human-readable title derived from `<short-name>` (e.g. `Retention`)

Then:

1. Create the directory `skills/<full-name>/`
2. Create `skills/<full-name>/SKILL.md` using the SKILL.md template below — replace every `<full-name>`, `<short-name>`, `<Title Case>`, and `<placeholder>` with appropriate content based on the skill name the user provided
3. Create the directory `skills/<full-name>/content/`
4. Create `skills/<full-name>/content/<short-name>.md` using the content template below
5. Create the directory `skills/<full-name>/examples/`
6. Ask the user for one realistic scenario name to scaffold the example around (e.g. "designing a retention plan for a startup"), derive `<scenario-slug>` from it in kebab-case, and create `skills/<full-name>/examples/<scenario-slug>.md` using the example template below
7. Make sure the content file's "Example Workflow" section links to `../examples/<scenario-slug>.md` and the example file may reference the content file via `../content/<short-name>.md` if relevant
8. Tell the user: "Skill scaffolded with `SKILL.md`, `content/<short-name>.md`, and `examples/<scenario-slug>.md`. Now edit the files to add real content, then run `bun run sync` followed by `bun run validate`."

## Directory structure produced

````txt
skills/<full-name>/
├── SKILL.md
├── content/
│   └── <short-name>.md
└── examples/
    └── <scenario-slug>.md
````

## SKILL.md template

Use this exact template for `skills/<full-name>/SKILL.md`:

````markdown
---
name: <full-name>
description: >
  A concise description of at least 50 characters that explains what this skill
  covers and when to use it. Include HR trigger phrases such as "write a [task]",
  "create a [deliverable]", or "analyze [topic]".
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# HR <short-name>

Brief one-paragraph overview of what this skill covers and who it helps.

## Supported tasks

- [Task 1]
- [Task 2]
- [Task 3]
- [Task 4]
- [Task 5]
- [Task 6]
- [Task 7]
- [Task 8]

## Key prompts

### [Subtopic 1]

1. "[Prompt for [context]]"
2. "[Prompt for [role] focused on [area]]"
3. "[Prompt using [variable] to [goal]]"
4. "[Prompt that addresses [scenario]]"

### [Subtopic 2]

1. "[Prompt for [context]]"
2. "[Prompt for [role] focused on [area]]"
3. "[Prompt using [variable] to [goal]]"
4. "[Prompt that addresses [scenario]]"

### [Subtopic 3]

1. "[Prompt for [context]]"
2. "[Prompt for [role] focused on [area]]"
3. "[Prompt using [variable] to [goal]]"
4. "[Prompt that addresses [scenario]]"

## Tips

- [Professional best-practice tip 1]
- [Professional best-practice tip 2]
- [Professional best-practice tip 3]
- [Professional best-practice tip 4]
````

## content template

Use this exact template for `skills/<full-name>/content/<short-name>.md`:

````markdown
# Understanding <Title Case> for Strategic HR Management

## Overview

> Related example: [<Scenario Title>](../examples/<scenario-slug>.md).

[One paragraph introducing what <short-name> covers, how it has evolved beyond a
narrow legacy definition, and what modern organizations now include under it.]

For HR professionals, understanding <short-name> is not about [doing everything at
once]. It is about developing the ability to [select the right approach], [read the
right signals], and [connect decisions to business outcomes].

## What <Title Case> Actually Means

Strategic <short-name> in modern organizations typically includes:

- [Capability 1]
- [Capability 2]
- [Capability 3]
- [Capability 4]
- [Capability 5]
- [Capability 6]
- [Capability 7]

<Title Case> today is less about [old framing] and more about
**[new framing, bolded]**.

## Key <Title Case> Categories

### [Category 1]

[One sentence describing what this category measures.]

Focuses on:

- [Sub-area 1]
- [Sub-area 2]
- [Sub-area 3]

### [Category 2]

[One sentence describing what this category measures.]

Focuses on:

- [Sub-area 1]
- [Sub-area 2]
- [Sub-area 3]

### [Category 3]

[One sentence describing what this category measures.]

Focuses on:

- [Sub-area 1]
- [Sub-area 2]
- [Sub-area 3]

## Core <Title Case> Concepts HR Should Understand

### Leading Indicators

Leading indicators are signals that predict future risk before it becomes visible
in lagging data. They allow HR to intervene early.

Examples include:

- [Example 1]
- [Example 2]
- [Example 3]

### Lagging Indicators

Lagging indicators measure outcomes that have already occurred. They confirm what
happened but cannot prevent it.

Examples include:

- [Example 1]
- [Example 2]
- [Example 3]

### [Domain-specific concept pair, e.g. "X Versus Y"]

[One paragraph explaining a key distinction unique to this skill area that is
commonly conflated by practitioners.]

### The <Title Case>-to-Decision Connection

A [metric/assessment/plan] without an owner, a target, and a review cadence does
not generate value. Every [data point] should connect to a specific decision or
intervention.

## How <Title Case> Systems Are Built in Practice

Modern <short-name> frameworks typically follow this structure:

1. [Step 1]
2. [Step 2]
3. [Step 3]
4. [Step 4]
5. [Step 5]
6. [Step 6]
7. [Step 7]
8. [Step 8]

This framework is often supported by:

- AI-assisted analysis tools (Claude, ChatGPT, Gemini)
- [Platform category 1]
- [Platform category 2]
- Early warning protocols for [risk type]

## What HR Should Look For in <Title Case>

### Strong Signals of Effective <Title Case>

- [Signal 1]
- [Signal 2]
- [Signal 3]
- [Signal 4]
- [Signal 5]

### Weak Signals of Ineffective <Title Case>

- [Signal 1]
- [Signal 2]
- [Signal 3]
- [Signal 4]
- [Signal 5]

## Common Misunderstandings in <Title Case>

### [Misunderstanding 1 Title]

[One paragraph explaining the misunderstanding and the more accurate view.]

### [Misunderstanding 2 Title]

[One paragraph explaining the misunderstanding and the more accurate view.]

### [Misunderstanding 3 Title]

[One paragraph explaining the misunderstanding and the more accurate view.]

### [Misunderstanding 4 Title]

[One paragraph explaining the misunderstanding and the more accurate view.]

## Modern <Title Case> Reality

HR teams today are expected to:

- [Expectation 1]
- [Expectation 2]
- [Expectation 3]
- [Expectation 4]
- [Expectation 5]
- [Expectation 6]

Effective <short-name> now requires both:

- [analytical/technical capability]
- and [communication/influence skill]

## Key Industry Benchmarks (2025–2026)

| Metric | Benchmark | Source |
|---|---|---|
| [Metric 1] | [Value] | [Source] |
| [Metric 2] | [Value] | [Source] |
| [Metric 3] | [Value] | [Source] |
| [Metric 4] | [Value] | [Source] |
| [Metric 5] | [Value] | [Source] |

## Example Workflow

See the [<Scenario Title>](../examples/<scenario-slug>.md)
for an example of applying this guide to an end-to-end <short-name> process.

## Conclusion

For HR managers and business partners, the key shift is this:

> [One or two sentence quote summarizing the strategic reframe of this skill area.]

Understanding this distinction improves:

- [Outcome 1]
- [Outcome 2]
- [Outcome 3]
- [Outcome 4]
````

## examples template

Use this exact template for `skills/<full-name>/examples/<scenario-slug>.md`:

````markdown
# <Scenario Title>

## Context

[Two to four sentences setting up a realistic company situation: company size and
stage, the trigger event or pressure (CEO/CFO/board question, a flagged risk), and
what data or tooling is currently in place versus missing.]

## Step 1 — [Choosing/Identifying the Right Starting Point]

**Sample prompt:**

> "[A realistic question the user would ask the skill, in their own voice]"

**Expected skill response:**

[Guidance broken into 2–3 named sub-areas, each with a short rationale tying back
to the context above.]

> **Avoid:** [One sentence warning against a common overreach or mistake at this step.]

## Step 2 — [Calculating/Mapping Baseline Data]

**Sample prompt:**

> "[A realistic data-specific question]"

**Skill walkthrough:**

[Show a calculation, classification, or structured breakdown using a fenced `txt`
code block where appropriate.]

**Benchmark context:**

[One paragraph comparing the result to an industry benchmark, citing a source.]

> **[Financial/business impact estimate]:** [One paragraph translating the finding
> into a cost or risk figure.]

## Step 3 — [Diagnosing the Root Cause]

**Sample prompt:**

> "[A realistic diagnostic question]"

**Skill response — diagnostic framework:**

[Four numbered dimensions to investigate, each with 2–3 sub-questions.]

> **What to bring to leadership:** [One sentence on how to present findings credibly.]

## Step 4 — [Building the Core Deliverable]

**Sample prompt:**

> "[A realistic request for a framework, dashboard, or plan]"

**Skill response — [deliverable] structure:**

[Tables or structured sections showing the deliverable, broken into 2–3 parts.]

**Implementation notes:**

- [Note 1]
- [Note 2]
- [Note 3]

## Step 5 — [Presenting to Leadership]

**Sample prompt:**

> "[A realistic question about framing a difficult conversation]"

**Skill response — [stakeholder] communication framework:**

[Three labeled parts: confirm the observation, contextualize it, flag the real risk
and the action plan, each with a sample quoted line of dialogue.]

> **Key principle:** [One sentence on what this stakeholder responds to.]

## Step 6 — Using AI to Analyze the Data

**Sample prompt:**

> "[A realistic question about using Claude/ChatGPT on this data]"

**Skill response — AI-assisted analysis workflow:**

**Step 1 — Prepare your data:**

[What fields/columns to include, and any anonymization guidance.]

**Step 2 — Use this prompt structure:**

```txt
[A reusable structured prompt template the user can paste their own data into]
```

**Step 3 — Follow up with action planning:**

```txt
[A reusable follow-up prompt template]
```

**What AI does well here:**
- [Capability 1]
- [Capability 2]
- [Capability 3]

**What AI cannot replace:**
- [Limitation 1]
- [Limitation 2]
- [Limitation 3]

## Step 7 — [Designing a Forward-Looking Process]

**Sample prompt:**

> "[A realistic question about building something repeatable]"

**Skill response — [process] design:**

[Structured guidance, ideally with a table mapping process steps to owners and cadence.]

> **Common finding at [company type]:** [One paragraph naming a frequent root cause
> and the fastest practical fix.]

## Step 8 — Writing the [Recurring Report] for Leadership

**Sample prompt:**

> "[A realistic request for a reusable report template]"

**Generated report template:**

```text
[A full fill-in-the-blank report template with section headers, separated by
horizontal rule characters, matching the style of the skill's recurring
leadership reporting cadence]
```

## Full <Title Case> Workflow Summary

```text
[Step label]
                    ↓
[Step label]
                    ↓
[Step label]
                    ↓
[Step label]
                    ↓
[Step label]
                    ↓
[Step label]
                    ↓
[Step label]
                    ↓
[Step label]
```

### Common <Title Case> Mistakes

| Mistake | How to avoid it |
|---------|----------------|
| [Mistake 1] | [Fix 1] |
| [Mistake 2] | [Fix 2] |
| [Mistake 3] | [Fix 3] |
| [Mistake 4] | [Fix 4] |
| [Mistake 5] | [Fix 5] |
| [Mistake 6] | [Fix 6] |
| [Mistake 7] | [Fix 7] |
````
