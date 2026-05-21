# Skill format

Every HR skill is a single `SKILL.md` file inside a named directory under `skills/`.

This repository uses a Bun + Turborepo workspace structure. Skill content lives in `skills/`, while tooling and automation scripts live in `packages/`.

## Directory structure

```text
.
├── skills/
│   └── hr-your-skill/
│       └── SKILL.md
├── packages/
│   ├── hr-skills-build/
│   └── skills-ref/
├── docs/
├── scripts/
└── turbo.json
```

The skill directory name must match the `name` field in the frontmatter exactly.

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
| `description` | Yes | One sentence describing what the skill does and when Claude should activate it. Include realistic HR trigger phrases. |
| `metadata.author` | Yes | Skill author's name |
| `metadata.version` | Yes | Semantic version string, for example `"1.0.0"` |
| `license` | No | SPDX license identifier, for example `MIT` |
| `compatibility` | No | Claude version compatibility note |

### Writing a good `description`

The description is the most important field because it determines when Claude activates the skill. Be specific and include realistic HR trigger phrases:

```yaml
# Too vague
description: Helps with HR tasks related to recruiting.

# Better — specific domain + clear trigger phrases
description: Help HR managers with end-to-end recruiting and talent acquisition.
  Use when asked to "write a job description", "create interview questions",
  "screen resumes", "develop employer branding", or similar recruiting tasks.
```

## Body sections

The body must contain these three sections in order.

### `## Supported tasks`

A bullet list of 8–12 concrete HR tasks this skill handles.

```markdown
## Supported tasks

- Writing and optimising job descriptions
- Creating behavioral interview questions
- Screening resumes and evaluating candidates
```

### `## Key prompts`

Grouped prompt templates organised by subtopic (3–6 subtopics, 4–7 prompts each). Use numbered lists and `[placeholders]` for variable inputs.

```markdown
## Key prompts

### Job descriptions

1. "What are the key responsibilities for a [job title] at [company]?"
2. "Write a bias-free job description for a [role] that attracts diverse candidates."

### Interview questions

1. "Generate behavioral interview questions for [role] focused on [competency]."
```

### `## Tips`

4–6 bullet points of professional best-practice guidance. Keep them actionable and practical.

```markdown
## Tips

- Standardise interview scoring rubrics to reduce bias and improve hiring quality.
- Track recruiting metrics such as time-to-fill and offer acceptance rate.
```

## Quality checklist

Before committing a skill, verify:

- [ ] `name` matches the directory name exactly
- [ ] `description` contains realistic HR trigger phrases
- [ ] `description` is concise and activation-focused
- [ ] `metadata.author` and `metadata.version` are set
- [ ] `## Supported tasks` has 8–12 items
- [ ] `## Key prompts` is grouped into 3–6 named subtopics
- [ ] Each subtopic has 4–7 prompts
- [ ] Prompts use `[placeholders]` for variable inputs
- [ ] `## Tips` has 4–6 actionable recommendations
- [ ] File is under 500 lines
- [ ] No time-sensitive content such as laws, versions, or vendor-specific details
- [ ] `bun run validate` passes with 0 errors

## Validation

Run validation from the project root:

```bash
bun run validate
```

This validates frontmatter fields, required sections, naming conventions, and minimum content structure.

## Development workflow

This repository uses Turborepo task orchestration with Bun workspaces.

Common commands:

```bash
bun run build
bun run test
bun run typecheck
bun run validate
bun run sync
```

Run a task for a specific package:

```bash
turbo run build --filter=skills-ref
turbo run typecheck --filter=hr-skills-build
```

Run a package script directly with Bun:

```bash
bun run --filter skills-ref build
bun run --filter hr-skills-build validate
```
