# hr-skills-build

Build tooling for the HR Skills collection — validates `SKILL.md` files, syncs generated references, and packages skill distributions.

> **Naming note:** The `hr-skills-` prefix signals this package is HR-domain-specific tooling
> that only works with the `tuanductran/hr-skills` monorepo. It is not a general-purpose
> Agent Skills library. For a domain-agnostic library, see [`skills-ref`](../skills-ref).

## Scripts

```bash
# Validate all HR skill definitions
bun run validate

# Sync generated references (marketplace.json)
bun run sync

# Run tests for the package tooling
bun run test

# Type-check package source
bun run typecheck

# Watch mode — re-validates on file changes
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

Checks every `skills/hr-*/SKILL.md` against 13 quality rules:

- Required frontmatter fields: `name`, `description`, `metadata.author`, `metadata.version`
- `name` matches directory name exactly
- `description` is at least 50 characters and includes trigger phrases
- Required sections: `## Supported tasks`, `## Key prompts`, `## Tips`
- Content length ≥ 1 000 characters
- Body length ≤ 500 lines
- `metadata.author` is exactly `Tuan Duc Tran`
- 8–12 supported task items
- 4–6 tip items
- Blank lines before lists (MD032 compliance)
- Key prompts: 3–6 subtopics, 4–7 prompts per subtopic
- Router ↔ filesystem ↔ marketplace.json three-way consistency

```text
Validating HR Skills...

  ✓ hr-recruiting
  ✓ hr-performance-management
  ...
  ✓ hr-employee-engagement

✓ All HR skills are valid
```

### `sync`

Discovers all `skills/hr-*` directories and rebuilds `.claude-plugin/marketplace.json`
from current skill frontmatter. Always run after adding or removing a skill.

## Source layout

| File | Purpose |
|------|---------|
| `src/config.ts` | Skill discovery — scans `skills/hr-*/` with `access()` checks |
| `src/constants.ts` | Regex patterns, directory paths, validation thresholds |
| `src/helpers.ts` | `discoverSkills`, `readSkill`, `normalizeAuthorName`, test helpers |
| `src/parser.ts` | YAML frontmatter parsing and `SkillMeta` extraction |
| `src/schema.ts` | Valibot schemas: `SkillFrontmatterSchema`, `MarketplaceJsonSchema` |
| `src/sync.ts` | Marketplace sync logic |
| `src/types.ts` | Shared types: `SkillMeta`, `SkillValidationIssue`, `SkillDirectoryOptions` |
| `src/validate.ts` | All validation rules and the main `validate()` entry point |

## Why not a library?

`hr-skills-build` is a CLI tool. It runs scripts directly via `bun src/validate.ts` —
there is no `build` step because there is no library output to emit. The `build` script
is a documented no-op that exists solely so Turborepo's task graph resolves correctly
(other packages declare `"dependsOn": ["^build"]`).

## Requirements

Runs with [Bun](https://bun.sh) — no extra runtime dependencies needed beyond the monorepo workspace.
