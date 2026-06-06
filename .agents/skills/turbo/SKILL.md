---
name: turbo
description: "Turborepo (turbo) orchestration for monorepos: pipeline caching, task orchestration, and workspace scripts. Guidance for CI, caching, and integrating with Bun and workspace scripts."
metadata:
  author: "Tuan Duc Tran"
  version: "1.0.0"
---

# Turborepo (turbo) overview

Turborepo (`turbo`) is a high-performance build system and task orchestrator for monorepos. It provides task pipelines, remote/local caching, and parallel execution to speed builds and tests across workspaces.

## When to use Turborepo

- Use `turbo` in monorepos to coordinate tasks across packages (build, test, lint, sync).
- Use it to speed CI by leveraging cache layers and selective task execution.
- Use `turbo` when you need consistent task orchestration across packages and reproducible pipelines.

## What turbo provides

- Task orchestration via `turbo run <task>` with fine-grained filters
- Local and remote caching for build and test artifacts
- Parallel execution and pipeline graph visualization

## Integration with this repository

- This repository uses Turborepo to run package-level scripts from the root `package.json`. Common commands include:

```bash
# run build across packages
bun run build

# validate all skills (hr-skills-build validates SKILL.md files)
bun run validate

# sync metadata after adding/removing a skill
bun run sync

# regenerate skills catalog
bun run catalog

# package distributable skill zips
bun run zip
```

- Package-level scripts in `packages/hr-skills-build/package.json` map to `bun` commands that turbo orchestrates (for example `validate`, `sync`, `catalog`).

## CI recommendations

- Cache `~/.bun` and `node_modules` where appropriate, plus `turbo` cache directories to speed repeated runs.
- Run `bun install --frozen-lockfile` then `bun run typecheck` and `bun run validate` early in CI to fail fast on critical errors.
- Upload and restore `turbo` cache between CI runs when using remote caching.

## Examples

Run a filtered task for the build package only:

```bash
turbo run build --filter=packages/hr-skills-build
```

Run validate across the workspace (root `package.json` delegates to turbo):

```bash
bun run validate
```

## Tips

- Keep task definitions small and composable so `turbo` can optimize execution.
- Ensure tasks that produce cacheable outputs declare explicit outputs so caching is effective.
- Use `--filter` to constrain runs during development to specific packages.
