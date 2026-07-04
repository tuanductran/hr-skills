# Format

Every HR skill lives in its own directory under `skills/`. A skill package consists of a required `SKILL.md` file and may include supporting knowledge in `content/`, reusable prompt libraries in `prompts/`, and practical workflows in `examples/`.

## Skill package structure

```text
skills/
└── hr-your-skill/
    ├── SKILL.md
    ├── content/
    │   ├── topic-1.md
    │   └── topic-2.md
    ├── prompts/
    │   ├── prompt-library-1.md
    │   └── prompt-library-2.md
    └── examples/
        ├── workflow-1.md
        └── workflow-2.md
```

- `SKILL.md` is **required**.
- `content/`, `prompts/`, and `examples/` are optional but recommended for larger skills.
- The directory name must exactly match the `name` field in `SKILL.md`.

## SKILL.md

`SKILL.md` defines when Claude should activate the skill, what the skill can do, and provides reusable prompts and guidance.

### File structure

A `SKILL.md` file consists of YAML frontmatter followed by a Markdown document.

```markdown
---
name: hr-your-skill
description: ...
metadata:
  author: ...
  version: "1.0.0"
---

# Skill title

...
```

### Frontmatter

| Field | Required | Description |
|--------|----------|-------------|
| `name` | Yes | Skill identifier in `kebab-case`. Must match the directory name. |
| `description` | Yes | One sentence describing what the skill does and when Claude should activate it. Include realistic HR trigger phrases. |
| `metadata.author` | Yes | Skill author's name. |
| `metadata.version` | Yes | Semantic version (for example `"1.0.0"`). |
| `license` | No | SPDX license identifier (for example `MIT`). |
| `compatibility` | No | Claude compatibility information. |

### Writing a good description

The description is the most important field because it determines when Claude activates the skill.

A good description should:

- explain the HR domain
- identify the target audience
- include realistic trigger phrases
- describe the types of requests the skill handles

Example:

```yaml
description: Help HR managers with end-to-end recruiting and talent acquisition. Use when asked to "write a job description", "create interview questions", "screen resumes", "develop employer branding", or similar recruiting tasks.
```

### Required sections

Every skill must contain these sections.

#### Supported tasks

A bullet list describing the HR tasks the skill supports.

Recommended: **8–12 tasks**.

Example:

```markdown
## Supported tasks

- Writing job descriptions
- Creating interview questions
- Screening resumes
```

#### Key prompts

Reusable prompt templates grouped into logical subtopics.

Recommendations:

- 3–6 subtopics
- 4–7 prompts per subtopic
- use numbered lists
- use `[placeholders]` for variable inputs

Example:

```markdown
## Key prompts

### Interview questions

1. "Generate behavioral interview questions for [role]."
2. "Create technical interview questions for [position]."
```

#### Tips

Professional best practices and practical HR guidance.

Recommended: **4–6 bullet points**.

Example:

```markdown
## Tips

- Standardize interview scorecards.
- Avoid unrealistic hiring requirements.
```

### Optional sections

Skills may include additional sections where appropriate.

Examples include:

- Domain knowledge
- Framework overviews
- Industry trends
- Role comparisons
- Best practices
- Common mistakes
- Hiring insights
- Reference tables
- Glossaries

Choose headings that best fit the subject matter.

### Writing guidelines

- Focus on reusable HR knowledge.
- Keep explanations concise and practical.
- Prefer structured headings over long paragraphs.
- Use bullet lists where appropriate.
- Avoid vendor marketing language.
- Avoid duplicated content already covered in supporting documents.
- Avoid time-sensitive information unless essential to the topic.

## content/*.md

Content files provide detailed reference material that supports a skill.

Unlike `SKILL.md`, content files explain concepts in depth rather than defining prompts or activation behavior.

### Purpose

Content files can be used to:

- explain HR concepts
- introduce technical domains
- provide frameworks
- compare approaches
- document best practices
- explain terminology

### File naming

Use descriptive `kebab-case` filenames.

Examples:

```text
understanding-artificial-intelligence.md
employee-lifecycle.md
salary-benchmarking.md
```

### Structure

Content files are intentionally flexible.

A typical structure is:

```markdown
# Title

## Overview

...

## Main topics

...

## Practical guidance

...

## Conclusion
```

Choose headings that fit the topic rather than following a rigid template.

### Writing guidelines

Content should:

- explain concepts clearly
- assume little prior knowledge
- use practical HR language
- prefer examples over abstract theory
- use headings and bullet lists
- include comparisons where useful

Avoid:

- prompt libraries
- duplicated SKILL.md content
- marketing material
- unnecessary implementation details

### Cross references

When relevant, link to related workflows.

Example:

```markdown
> Related example: [Senior AI Engineer hiring workflow](../examples/hiring-a-senior-ai-engineer.md).
```

## prompts/*.md

Prompt files provide curated collections of reusable prompts for a specific HR topic within the skill.

Unlike `SKILL.md`, prompt files are intended to be extensive prompt libraries that users can reuse, customize, and expand.

### Purpose

Prompt files can be used to:

- organize prompts by HR topic
- provide reusable prompt templates
- cover beginner to advanced use cases
- include prompt variations
- accelerate common HR workflows
- reduce repetitive prompt writing

### File naming

Use descriptive `kebab-case` filenames.

Examples:

```text
analyzing-employee-data.md
behavioral-interview-prompts.md
performance-review-prompts.md
salary-negotiation-prompts.md
employee-engagement-prompts.md
```

### Structure

Each prompt file should focus on a single topic.

A typical structure is:

```markdown
# Prompt topic

Brief introduction explaining when these prompts are useful.

- "Prompt 1..."
- "Prompt 2..."
- "Prompt 3..."
```

The introduction should provide context without becoming a long tutorial.

### Writing guidelines

Prompt libraries should:

- focus on one HR topic
- include natural, reusable prompts
- use `[placeholders]` for customizable values
- provide prompt variations where appropriate
- cover a range of practical scenarios
- encourage high-quality, detailed AI responses

Avoid:

- implementation instructions
- duplicated prompts already listed in `SKILL.md`
- unrelated HR topics
- excessively long explanations
- prompts that depend on time-sensitive information

## examples/*.md

Example files demonstrate realistic HR workflows using the skill.

They show how HR professionals can apply the skill to solve real business problems.

### Purpose

Examples should:

- demonstrate end-to-end workflows
- provide realistic business scenarios
- show effective prompts
- illustrate expected outputs
- teach users how to apply the skill

### File naming

Use descriptive `kebab-case` filenames.

Examples:

```text
hiring-a-senior-ai-engineer.md
creating-a-performance-improvement-plan.md
conducting-an-exit-interview.md
```

### Structure

A typical example follows this pattern:

```markdown
# Scenario title

## Context

...

## Step 1

Sample prompt

Expected response

## Step 2

...

## Workflow summary
```

The exact headings may vary depending on the workflow.

### Writing guidelines

Examples should:

- begin with realistic business context
- use natural HR prompts
- demonstrate complete workflows
- include practical outputs
- explain important decisions when helpful

Avoid:

- isolated prompt examples
- unrealistic scenarios
- artificial toy examples
- workflows without business context

## Quality checklist

Before submitting a skill package, verify:

- [ ] Directory name matches the `name` field.
- [ ] `SKILL.md` contains all required sections.
- [ ] The description includes realistic activation phrases.
- [ ] Supporting content is organized logically.
- [ ] Prompt libraries are grouped by topic and easy to reuse.
- [ ] Examples demonstrate realistic HR workflows.
- [ ] Links between files are valid.
- [ ] All Markdown files use consistent formatting.
- [ ] No duplicated information across files.
- [ ] No unnecessary time-sensitive content.
- [ ] Validation passes successfully.

## Validation

Run validation from the project root:

```bash
bun run validate
```

Validation checks include:

- frontmatter fields
- required sections
- naming conventions
- directory structure
- internal links
- basic content structure
