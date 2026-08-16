# hr-skills-build

Build tooling for the HR Skills collection — validates `SKILL.md` files and syncs generated references.

## Scripts

```bash
# Validate all HR skill definitions
bun run validate

# Sync generated references
bun run sync

# Build the TypeScript package (tsdown)
bun run build

# Build distribution artifacts (dist/hr-skills.zip, dist/hr-skills.skill)
bun run build-skills

# Run tests for the package tooling
bun run test

# Type-check package source
bun run typecheck

# Watch mode — rebuilds on file changes (tsdown --watch)
bun run dev
```

Or run from the monorepo root:

```bash
bun run validate      # delegates to hr-skills-build
bun run sync          # delegates to hr-skills-build
bun run test          # runs workspace tests
bun run typecheck     # runs workspace type-checking
```

## What it does

### `validate`

Checks every `skills/hr-*/SKILL.md` for:

- Required frontmatter fields: `name`, `description`, `metadata.author`, `metadata.version`
- `name` matches directory name
- `description` is at least 50 characters
- Required sections: `## Supported tasks`, `## Key prompts`, `## Tips`
- Minimum content length of 1000 characters
- `SKILL.md` body length under 500 lines
- `metadata.author` exactly set to `Tuan Duc Tran`
- 8-12 supported task items
- 4-6 tip items
- Blank lines before lists for MD032 compliance

```text
Validating HR Skills...

  ✓ hr-recruiting
  ✓ hr-performance-management
  ...
  ✓ hr-employee-engagement

✓ All HR skills are valid
```

### `sync`

Discovers all `skills/hr-*` directories and rebuilds generated references in `.claude-plugin/marketplace.json`.

## Source

| Folder | Purpose |
|--------|---------|
| `src/shared/` | Constants, frontmatter parser, and discovery/read helpers used across the package |
| `src/validation/` | Frontmatter/content/security validators, semantic duplicate detection |
| `src/registry/` | Builds the skill registry from `skills/hr-*` |
| `src/build/` | Zip packaging, marketplace sync, skill-matrix generation |
| `src/search/` | Skill search and recommendations |
| `src/planner/` | Intent-to-execution-plan generation |
| `src/runtime/` | Executes a generated plan against the registry |
| `src/evaluation/` | Scenario-based evaluation harness |
| `packages/hr-skills/` | Interactive command-line entry points for discovery, recommendation, planning, execution, evaluation, and skill review |

## Requirements

Runs with [Bun](https://bun.sh). Runtime dependencies (`valibot`, `yaml`, and the workspace's own `skills-ref`) are installed via `bun install` at the repo root — see `package.json` for versions. Builds with [tsdown](https://tsdown.dev). Interactive command-line workflows live in the separate [`cli`](../cli) workspace package.
