# Contributing

Contributions are welcome — new HR skills, improvements to existing skills, documentation updates, and enhancements to the build and tooling workflow.

## Prerequisites

- [Bun](https://bun.sh/) ≥ 1.3.9
- Node.js is not required — Bun handles everything

## Setup

```bash
git clone https://github.com/tuanductran/hr-skills.git
cd hr-skills
bun install
```

## Before you submit

Run the full check suite from the project root:

Build and typecheck tasks are orchestrated through Turborepo and may run in parallel across workspace packages.

```bash
bun run validate    # Validate all SKILL.md files
bun run check       # 0 Biome check errors required
bun run lint:md     # 0 markdownlint errors required
bun run typecheck   # 0 TypeScript errors required
bun run build       # All workspace builds must complete successfully
```

All checks must pass before opening a pull request.

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
description: One-sentence description. Include trigger phrases like "Write a ...", "Conduct a ...", or "Analyze ...".
metadata:
  author: Tuan Duc Tran
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

See [format.md](./docs/format.md) for the full specification.

### 3. Sync skill references

Run the sync script to auto-update generated references and metadata:

```bash
bun run sync
```

This updates `.claude-plugin/marketplace.json`. No manual edits are needed.

### 4. Validate and package

```bash
bun run validate     # Must pass with 0 errors
```

After validation, update the root router so your skill is discoverable:

Update the root router at `.agents/skills/hr-root-router-maintaining` so your skill appears in the routing table. See `.agents/skills/hr-root-router-maintaining/SKILL.md` for guidance on the exact router update step.

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

The TypeScript workspace packages and build tooling live in `packages/`.

Workspace build outputs are cached through Turborepo based on the task configuration in `turbo.jsonc`.

Changes there should:

- Keep `bun run lint` at 0 errors
- Keep `bun run typecheck` at 0 errors
- Not break `bun run build`
- Not break `bun run validate`
- Not break `bun run sync`
- Not break generated package outputs

## Questions

Open an issue on GitHub if you're unsure about scope or approach before writing code.
