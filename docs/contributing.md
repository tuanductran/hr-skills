# Contributing

Contributions are welcome — new skills, improvements to existing skills, and fixes to the build tooling.

## Prerequisites

- [Bun](https://bun.sh/) ≥ 1.0
- Node.js is not required — Bun handles everything

## Setup

```bash
git clone https://github.com/tuanductran/hr-skills.git
cd hr-skills
bun install
```

## Before you submit

Run the full check suite from the project root:

```bash
bun run validate    # All 15 SKILL.md files must pass
bun run lint        # 0 ESLint errors required
bun run lint:md     # 0 markdownlint errors required
bun run typecheck   # 0 TypeScript errors required
```

All four checks must pass before opening a pull request.

## Adding a new skill

### 1. Create the skill directory

```bash
mkdir skills/hr-your-skill-name
```

Directory name rules: lowercase, hyphens only, must start with `hr-`.

### 2. Write SKILL.md

Use this template:

```markdown
---
name: hr-your-skill-name
description: One-sentence description. Include trigger phrases like "Write a ...", "Conduct a ...", or "Analyse ...".
metadata:
  author: Your Name
  version: "1.0.0"
---

# HR skill title

Brief paragraph describing what this skill covers.

## Supported tasks

- Task one
- Task two
(8–12 tasks)

## Key prompts

### Subtopic one

1. "Prompt one for [variable]"
2. "Prompt two for [context]"
(4–7 prompts per subtopic, 3–6 subtopics)

### Subtopic two

1. "..."

## Tips

- Tip one (professional best-practice guidance)
- Tip two
(4–6 tips)
```

See [skill-format.md](./skill-format.md) for the full specification.

### 3. Sync skill references

Run the sync script to auto-update all references (config, docs, tables, counts, marketplace):

```bash
bun run sync
```

This updates `config.ts`, `AGENTS.md`, `docs/installation.md`, `docs/skills.md`, `.claude-plugin/marketplace.json`, and all skill count references across the project. No manual edits are needed.

### 4. Validate and regenerate the catalog

```bash
bun run validate   # Must pass with 0 errors
bun run catalog    # Regenerates skills/CATALOG.md
```

### 5. Open a pull request

- Target the `dev` branch (never `main` directly)
- Include a short description of the HR domain the skill covers
- Confirm all four checks pass in the PR description

## Improving an existing skill

Edit the relevant `skills/hr-*/SKILL.md` file directly. Re-run:

```bash
bun run validate
bun run lint:md
```

## Improving the build tooling

The TypeScript packages live in `packages/`. Changes there should:

- Keep `bun run lint` at 0 errors
- Keep `bun run typecheck` at 0 errors
- Not break `bun run validate` or `bun run catalog`

## Questions

Open an issue on GitHub if you're unsure about scope or approach before writing code.
