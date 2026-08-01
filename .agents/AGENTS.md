# Project overview

> This is the routing index for agent workflows in this repository. The canonical, human-facing entry point is [`/AGENTS.md`](../AGENTS.md) at the repository root — keep that short; every workflow below lives in exactly one skill file here, not restated in either place.

This repository is a Bun + Turborepo monorepo hosting HR AI skills for Claude Code and claude.ai. Each skill lives in `skills/hr-*/SKILL.md`.

## Critical rule

Never develop on `main` — branch from and open pull requests against `dev`.

## Skill index

| When you need to... | Load |
|---|---|
| Run or find a `bun run` / `turbo run` command | [`skills/turbo/SKILL.md`](skills/turbo/SKILL.md), [`skills/bun/SKILL.md`](skills/bun/SKILL.md) |
| Write a commit message or split changes into commits | [`skills/github-awesome-copilot-git-commit/SKILL.md`](skills/github-awesome-copilot-git-commit/SKILL.md) |
| Create, edit, or validate a `skills/hr-*/SKILL.md` package | [`skills/hr-skills-maintaining/SKILL.md`](skills/hr-skills-maintaining/SKILL.md) |
| Update the root `SKILL.md` router (add/remove/move a skill entry) | [`skills/hr-root-router-maintaining/SKILL.md`](skills/hr-root-router-maintaining/SKILL.md) |
| Write or fix Markdown — formatting, content-design rules, links | [`skills/markdown/SKILL.md`](skills/markdown/SKILL.md) |
| Security-review a `SKILL.md` before installing or publishing | [`skills/skill-vetter/SKILL.md`](skills/skill-vetter/SKILL.md) |
| Decide if a PR needs a changeset, or write one | [`skills/changeset/SKILL.md`](skills/changeset/SKILL.md) |
| Write or review TypeScript in `packages/*` | [`skills/typescript/SKILL.md`](skills/typescript/SKILL.md) |
| Configure or debug Biome lint/format rules | [`skills/biome/SKILL.md`](skills/biome/SKILL.md) |
| Define or validate a schema with Valibot | [`skills/valibot/SKILL.md`](skills/valibot/SKILL.md) |
| Rewrite AI-sounding prose to read more naturally | [`skills/humanizer/SKILL.md`](skills/humanizer/SKILL.md) |
| Generate or fill a PDF | [`skills/pdf/SKILL.md`](skills/pdf/SKILL.md) |

## Fastest path: adding a new skill

1. Create `skills/hr-<name>/SKILL.md` (or run the `/new-skill` command in `.claude/commands/new-skill.md`, which scaffolds this for you)
2. Run `bun run sync`
3. Run `bun run validate`

For the full required structure, frontmatter rules, and pre-publish checklist, load `skills/hr-skills-maintaining/SKILL.md` — don't guess, and don't duplicate its content here.

## Workspace packages

- `packages/hr-skills-build` — validation, sync, registry/planner/runtime generation, and packaging tooling
- `packages/skills-ref` — TypeScript library for reading and validating skill files
