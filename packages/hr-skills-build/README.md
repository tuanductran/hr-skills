# hr-skills-build

Build tooling for the HR Skills collection — validates `SKILL.md` files, syncs generated references, and generates the skills catalog.

## Scripts

```bash
# Validate all HR skill definitions
bun run validate

# Generate skills/CATALOG.md
bun run catalog

# Sync generated references
bun run sync

# Generate Claude, Codex, Cursor, and Gemini exports
bun run export:agents

# Verify tracked generated artifacts
bun run verify:generated

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
bun run catalog       # delegates to hr-skills-build
bun run export:agents # delegates to hr-skills-build
bun run verify:generated
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
- Minimum content length of 1 000 characters
- `SKILL.md` body length under 500 lines
- `metadata.author` exactly set to `Tuan Duc Tran`
- 8–12 supported task items
- 4–6 tip items
- Blank lines before lists for MD032 compliance

```text
Validating HR Skills...

  ✓ hr-recruiting
  ✓ hr-performance-management
  ...
  ✓ hr-employee-engagement

✓ All HR skills are valid
```

### `catalog`

Reads all `SKILL.md` files and writes `skills/CATALOG.md` — a single reference document listing every skill with its name, description, supported tasks, and a link to its source file.

### `sync`

Discovers all `skills/hr-*` directories and rebuilds generated references in `AGENTS.md`, `docs/installation.md`, `docs/skills.md`, and `.claude-plugin/marketplace.json`.

### `export:agents`

Generates ignored compatibility exports under `.agent-exports/` for Claude, OpenAI Codex, Cursor, and Gemini. The command clears the export directory before writing so removed skills can't leave stale files behind.

### `verify:generated`

Regenerates tracked generated artifacts from `skills/hr-*/SKILL.md` and fails when `AGENTS.md`, `docs/`, or `skills/` have uncommitted generated drift.

## Source

| File | Purpose |
|------|---------|
| `src/config.ts` | `SKILLS_DIR` path, `hr-` prefix, and skill discovery helper |
| `src/validate.ts` | Validates frontmatter and required sections |
| `src/catalog.ts` | Generates `skills/CATALOG.md` |
| `src/sync.ts` | Syncs generated references and marketplace metadata |
| `src/agent-exports.ts` | Generates ignored multi-agent compatibility exports |

## Requirements

Runs with [Bun](https://bun.sh) — no extra dependencies needed.
