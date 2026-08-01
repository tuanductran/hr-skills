# HR skills development guide

## Project overview

`hr-skills` is a Bun + Turborepo monorepo of domain-specific Agent Skills for HR and talent acquisition, distributed for Claude Code and claude.ai. Each skill lives at `skills/hr-*/SKILL.md`. Two internal TypeScript packages, `packages/hr-skills-build` and `packages/skills-ref`, validate, sync, and package the skills. Generated artifacts — `docs/skill-matrix.md`, `registry/skills.json`, `.claude-plugin/marketplace.json` — are derived from skill frontmatter and must never be hand-edited; regenerate them with the corresponding `bun run` command instead.

This file is the canonical, tool-agnostic entry point for both human contributors and AI agents. `CLAUDE.md` is a symlink to this file — edit `AGENTS.md` only. The detailed, day-to-day workflow guidance this file used to duplicate now lives in [`.agents/`](.agents/AGENTS.md) — see [Where things live](#where-things-live) below.

## Branch strategy

> [!IMPORTANT]
> **Never develop on the `main` branch.**
>
> - `main` is the **publishing branch** and only contains released skills.
> - `dev` is the **development branch** where all feature work, fixes, and content updates should occur.
> - Always create pull requests against `dev`, not `main`.

| Branch | Purpose | Direct commits |
|--------|---------|----------------|
| `main` | Publishing (`npx skills add tuanductran/hr-skills`) | Forbidden |
| `dev` | Development, tests, experiments | Via PR only |

## Quick start

```bash
bun install          # Install all dependencies (run once, or after package changes)
bun run validate      # Validate all skill SKILL.md files
bun run test          # Run tests across workspace packages
```

Every other command — the full list, plus what each one does and when to use it — is documented once, in [`.agents/skills/turbo/SKILL.md`](.agents/skills/turbo/SKILL.md) and [`.agents/skills/bun/SKILL.md`](.agents/skills/bun/SKILL.md), not repeated here.

## Where things live

This file stays intentionally short. Everything below is a **workflow**, not a one-time fact about the project — and workflows are owned by a single skill file under [`.agents/skills/`](.agents/skills/), so they can be loaded on demand and updated in one place instead of drifting across copies.

| Topic | Owned by |
|-------|----------|
| Full `bun run` / `turbo run` command reference | [`.agents/skills/turbo/SKILL.md`](.agents/skills/turbo/SKILL.md), [`.agents/skills/bun/SKILL.md`](.agents/skills/bun/SKILL.md) |
| Commit message format and Conventional Commits types | [`.agents/skills/github-awesome-copilot-git-commit/SKILL.md`](.agents/skills/github-awesome-copilot-git-commit/SKILL.md) |
| `SKILL.md` required structure, frontmatter, and pre-publish checklist | [`.agents/skills/hr-skills-maintaining/SKILL.md`](.agents/skills/hr-skills-maintaining/SKILL.md) |
| Markdown formatting, content-design rules, and the blank-line-before-list rule | [`.agents/skills/markdown/SKILL.md`](.agents/skills/markdown/SKILL.md) |
| Maintaining the root `SKILL.md` router | [`.agents/skills/hr-root-router-maintaining/SKILL.md`](.agents/skills/hr-root-router-maintaining/SKILL.md) |
| Security review of skill content | [`.agents/skills/skill-vetter/SKILL.md`](.agents/skills/skill-vetter/SKILL.md) |
| Whether a change needs a changeset | [`.agents/skills/changeset/SKILL.md`](.agents/skills/changeset/SKILL.md) |
| TypeScript, Biome, and Valibot conventions in `packages/*` | [`.agents/skills/typescript/SKILL.md`](.agents/skills/typescript/SKILL.md), [`.agents/skills/biome/SKILL.md`](.agents/skills/biome/SKILL.md), [`.agents/skills/valibot/SKILL.md`](.agents/skills/valibot/SKILL.md) |
| Everything above, indexed in one place | [`.agents/AGENTS.md`](.agents/AGENTS.md) |

When you add a new skill directory (for example `skills/hr-new-skill/SKILL.md`), run `bun run sync` first — it auto-discovers `hr-*` skill directories from `skills/` and updates `.claude-plugin/marketplace.json`. No manual edits needed.

## Project structure

| Path | Purpose |
|------|---------|
| `skills/hr-*/SKILL.md` | Source skill definitions consumed by Claude Code and claude.ai |
| `skills/hr-*/content/` | Optional human-readable companion guidance for each HR skill domain |
| `skills/hr-*/prompts/` | Optional reusable prompt libraries grouped by HR topic |
| `skills/hr-*/examples/` | Optional practical end-to-end HR workflows and business scenarios |
| `docs/` | Skill format specification and generated reports |
| `docs/skill-matrix.md` | Generated skill maturity snapshot — do not edit manually, run `bun run matrix` |
| `docs/evaluation.md` | Evaluation framework architecture, dataset format, and golden fixture workflow |
| `packages/hr-skills-build/eval/datasets/` | Hand-authored evaluation datasets (planning scenarios) |
| `packages/hr-skills-build/eval/golden/` | Committed golden fixtures — regenerate with `bun run evaluate -- --update-golden` from the repo root |
| `docs/registry.md` | Skill Registry architecture, schema, and extension guide |
| `registry/skills.json` | Generated machine-readable skill registry — do not edit manually, run `bun run registry` |
| `.claude-plugin/marketplace.json` | Generated marketplace metadata synced from skill frontmatter |
| `packages/hr-skills-build` | Build and maintenance tooling — validation, sync, registry/planner/runtime generation, and packaging |
| `packages/skills-ref` | TypeScript library for reading, validating, and generating prompts from skill files |

This repository uses Bun workspaces with Turborepo task orchestration; both packages above live under `packages/*`, and their build outputs are cached through Turborepo based on `turbo.jsonc`.
