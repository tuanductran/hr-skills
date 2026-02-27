# Skill format

Every HR skill is a single `SKILL.md` file inside a named directory under `skills/`.

## Directory structure

```text
skills/
  hr-your-skill/
    SKILL.md
```

The directory name must match the `name` field in the frontmatter exactly.

## File structure

A `SKILL.md` file has two parts: YAML frontmatter and a Markdown body.

```markdown
---
name: hr-your-skill
description: ...
metadata:
  author: ...
  version: "1.0.0"
---

# Skill title

...body...
```

### Frontmatter fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Skill name in `kebab-case`. Must match the directory name. |
| `description` | Yes | One sentence. What the skill does and **when to activate it**. Include realistic HR trigger phrases. |
| `metadata.author` | Yes | Skill author's name |
| `metadata.version` | Yes | Semantic version string, for example `"1.0.0"` |
| `license` | No | SPDX license identifier, for example `MIT` |
| `compatibility` | No | Claude version compatibility note |

### Writing a good `description`

The description is the most important field — it determines when Claude loads the skill. Be specific and include real trigger phrases HR professionals use:

```yaml
# Too vague
description: Helps with HR tasks related to recruiting.

# Good — specific domain + concrete trigger phrases
description: Help HR managers with end-to-end recruiting and talent acquisition.
  Use when asked to "write a job description", "create interview questions",
  "screen resumes", "develop employer branding", or any other recruiting task.
```

## Body sections

The body must contain these three sections in order.

### `## Supported Tasks`

A bullet list of 8–12 concrete HR tasks this skill handles.

```markdown
## Supported tasks

- Writing and optimising job descriptions
- Creating behavioral interview questions
- Screening resumes and evaluating candidates
```

### `## Key Prompts`

Grouped prompt templates organised by subtopic (3–6 subtopics, 4–7 prompts each). Use numbered lists. Use `[placeholders]` for variable inputs.

```markdown
## Key prompts

### Job descriptions

1. "What are the key responsibilities for a [job title] at [company]?"
2. "Write a bias-free job description for a [role] that attracts diverse candidates."

### Interview questions

1. "Generate behavioral interview questions for [role] focused on [competency]."
```

### `## Tips`

4–6 bullet points of professional best-practice guidance. Should be actionable and non-obvious.

```markdown
## Tips

- Standardise interview scoring rubrics to reduce bias and improve hiring quality.
- Track recruiting metrics (time-to-fill, offer acceptance rate) to improve over time.
```

## Quality checklist

Before committing a skill, verify:

- [ ] `name` matches the directory name exactly
- [ ] `description` contains specific trigger phrases
- [ ] `description` is a single sentence (or a compact multi-line YAML scalar)
- [ ] `metadata.author` and `metadata.version` are set
- [ ] `## Supported Tasks` has 8–12 items
- [ ] `## Key Prompts` is grouped into 3–6 named subtopics
- [ ] Each subtopic has 4–7 prompts
- [ ] Prompts use `[placeholders]` for variable inputs
- [ ] `## Tips` has 4–6 actionable tips
- [ ] File is under 500 lines
- [ ] No time-sensitive content (laws, tool names, version numbers)
- [ ] `bun run validate` passes with 0 errors

## Validation

Run `bun run validate` from the project root to check all skills automatically:

```bash
bun run validate
```

This checks frontmatter fields, required sections, and minimum content length.
