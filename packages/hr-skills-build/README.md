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

# Run validate + catalog through the package build
bun run build

# Watch mode — re-validates on file changes
bun run dev
```

Or run from the monorepo root:

```bash
bun run validate      # delegates to hr-skills-build
bun run sync          # delegates to hr-skills-build
bun run catalog       # delegates to hr-skills-build
bun run build         # runs all package builds
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

## Source

| File | Purpose |
|------|---------|
| `src/config.ts` | `SKILLS_DIR` path, `hr-` prefix, and skill discovery helper |
| `src/validate.ts` | Validates frontmatter and required sections |
| `src/catalog.ts` | Generates `skills/CATALOG.md` |

## Requirements

Runs with [Bun](https://bun.sh) — no extra dependencies needed.
