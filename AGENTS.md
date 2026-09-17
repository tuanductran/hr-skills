# HR skills development guide

## Project overview

`hr-skills-monorepo` is a Bun + Turborepo monorepo of domain-specific Agent Skills for HR and talent acquisition, distributed for Claude Code and claude.ai. Each skill lives at `skills/hr-*/SKILL.md`. The publishable `hr-skills` package provides the `hr-skills` executable; `packages/hr-skills-build` and `packages/hr-skills-ref` provide the TypeScript library surfaces, while `packages/hr-skills-tsdoc` owns multi-package TSDoc API generation. Generated artifacts — `docs/engineering/skill-matrix.md`, `docs/engineering/api.md`, `registry/skills.json`, `registry/relevance-signals.json`, `.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, `.agents/plugins/marketplace.json`, and the root `SKILL.md` router — are derived from canonical source data and must never be hand-edited; regenerate them with the corresponding `bun run` command instead.

This file is the canonical, tool-agnostic entry point for both human contributors and AI agents. `CLAUDE.md` at the repo root is a symlink to this file (`CLAUDE.md -> AGENTS.md`) so Claude Code picks up the same content automatically — **never edit or delete `CLAUDE.md` directly**; doing so (especially with a tool that doesn't preserve symlinks) silently replaces the symlink with a diverging copy. Always edit `AGENTS.md` instead. The detailed, day-to-day workflow guidance lives in [`.agents/skills/`](.agents/skills/) and [`.claude/`](.claude/) — see [Where things live](#where-things-live) below.

## Branch strategy

> [!IMPORTANT]
> **Never develop on the `main` branch.**
>
> - `main` is the **publishing branch** and only contains released skills.
> - `dev` is the **development branch** where feature work, fixes, experiments, and content updates occur directly.
> - Pull requests are opened against `main` when changes from `dev` are ready for release.

| Branch | Purpose | Direct commits |
|--------|---------|----------------|
| `main` | Publishing (`npx hr-skills --help`) | Forbidden |
| `dev` | Development, tests, experiments | Allowed |

CI runs automatically on every push to `dev`. The protected `main` branch accepts changes through pull requests with the required status checks.

## Quick start

```bash
bun install          # Install all dependencies (run once, or after package changes)
npx hr-skills --help # Run the published CLI without a global install
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
| CLI output patterns (`@clack/prompts`) in `packages/hr-skills/src/cli/*.ts` | [`.agents/skills/clack/SKILL.md`](.agents/skills/clack/SKILL.md) |
| Detecting and refactoring copy-paste duplication in `packages/*` | [`.agents/skills/jscpd/SKILL.md`](.agents/skills/jscpd/SKILL.md), [`.agents/skills/dry-refactoring/SKILL.md`](.agents/skills/dry-refactoring/SKILL.md) |

When you add a new skill directory (for example `skills/hr-new-skill/SKILL.md`), run `bun run sync` first — it auto-discovers `hr-*` skill directories from `skills/` and updates the generated plugin manifests and root `SKILL.md` router. No manual edits needed.

## Project structure

| Path | Purpose |
|------|---------|
| `skills/hr-*/SKILL.md` | Source skill definitions consumed by Claude Code and claude.ai |
| `skills/hr-*/content/` | Optional human-readable companion guidance for each HR skill domain |
| `skills/hr-*/prompts/` | Optional reusable prompt libraries grouped by HR topic |
| `skills/hr-*/examples/` | Optional practical end-to-end HR workflows and business scenarios |
| `apps/web/` | Public Next.js documentation and product surfaces |
| `docs/` | Skill format specification, architecture guidance, generated reports, and archived research |
| `docs/engineering/skill-matrix.md` | Generated skill maturity snapshot — do not edit manually, run `bun run matrix` |
| `docs/engineering/api.md` | Generated API reference — do not edit manually, run `bun run api-docs` |
| `docs/engineering/evaluation.md` | Evaluation framework architecture, dataset format, and golden fixture workflow |
| `packages/hr-skills-build/eval/datasets/` | Hand-authored evaluation datasets (planning scenarios) |
| `packages/hr-skills-build/eval/golden/` | Committed golden fixtures — regenerate with `bun run evaluate -- --update-golden` from the repo root |
| `docs/engineering/registry.md` | Skill Registry architecture, schema, and extension guide |
| `registry/skills.json` | Generated machine-readable skill registry — do not edit manually, run `bun run registry` |
| `registry/relevance-signals.json` | Generated relevance signal table — do not edit manually, run `bun run signals` |
| `.claude-plugin/marketplace.json` | Generated Claude marketplace metadata |
| `.claude-plugin/plugin.json` | Generated Claude plugin manifest |
| `.codex-plugin/plugin.json` | Generated Codex plugin manifest |
| `.agents/plugins/marketplace.json` | Generated Codex marketplace manifest |
| `SKILL.md` | Generated root skill router |
| `packages/hr-skills` | Publishable `hr-skills` executable package for npx/bunx and local CLI workflows |
| `packages/hr-skills-build` | Build and maintenance tooling — validation, sync, registry/planner/runtime generation, and packaging |
| `packages/hr-skills-ref` | TypeScript library with explicit `client` and Bun/Node `server` surfaces for reading and validating skill files |
| `packages/hr-skills-tsdoc` | TSDoc-compatible API generator for all public package surfaces |
| `docs/engineering/package-architecture.md` | Canonical client/server package boundaries and import rules |
| `.claude/rules/package-architecture.md` | Path-scoped enforcement guidance for client/server imports |

This repository uses Bun workspaces with Turborepo task orchestration; the packages above live under `packages/*`, and their build outputs are cached through `turbo.jsonc`.
