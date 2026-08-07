---
paths:
  - packages/**/*.ts
  - .claude/hooks/**/*.sh
  - .github/workflows/**/*.yml
  - .github/workflows/**/*.yaml
---

# Performance and scaling rules

Use these rules when a change affects repo speed, CI time, validation cost, packaging time,
or repeated local workflows.

## What performance means here

This repository is not a latency-sensitive web app. The practical bottlenecks are:

- repeated full-tree scans across Markdown and TypeScript files
- duplicated validate, lint, and build passes through Turborepo
- packaging and extraction work that re-reads the same file sets
- CI steps that rerun expensive commands without clear need

Optimize for maintainable workflow speed, not theoretical micro-optimizations.

## Measure before changing

- prefer timing an existing command before rewriting it
- identify whether the cost is file scanning, Turborepo cache miss, subprocess startup, or packaging
- do not add complexity for tiny wins on non-critical paths

## Repo-specific optimization rules

- rely on Turborepo caching — avoid bypassing `turbo run` with direct `bun run` calls unless you need cache-busting
- avoid duplicate repo walks when a shared helper can provide the file list once
- prefer shared helpers in `packages/skills-ref/src/` for skill reading/validation and in `packages/hr-skills-build/src/shared/` for build utilities
- keep shell wrappers thin so TypeScript remains the single source of behavior
- prefer targeted `bun test <file>` runs before full `bun run test` while iterating
- keep eval datasets focused; each new case should earn its runtime cost
- avoid adding new build steps or wrappers when an existing canonical `bun run` command already exists

## TypeScript guidance

- prefer clear data structures and direct code over clever abstractions
- reduce repeated parsing or file reads when the same helper can be reused
- document non-obvious performance assumptions only when they matter to maintainers
- do not trade away typing, readability, or testability for small speed wins

## CI and workflow guidance

- keep GitHub Actions aligned with the narrowest checks needed for each workflow
- avoid rerunning packaging or validate commands in multiple jobs unless the split is intentional
- prefer Turborepo remote caching to reduce CI install and build times where possible

## Review checklist

- does this change reduce duplicate work rather than move it around
- does it keep one canonical command per workflow
- does it avoid new wrapper layers
- does it keep the repo easier to reason about than before
- are the added checks worth their runtime cost
