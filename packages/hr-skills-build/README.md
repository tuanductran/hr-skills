# hr-skills-build

Build tooling for the HR Skills collection — validates SKILL.md files and generates the skills catalog.

## Scripts

```bash
# Validate all 15 HR skill definitions
bun run validate

# Generate skills/CATALOG.md
bun run catalog

# Run both validate + catalog
bun run build

# Watch mode — re-validates on file changes
bun run dev
```

Or run from the monorepo root:

```bash
bun run validate      # delegates to hr-skills-build
bun run catalog       # delegates to hr-skills-build
bun run build         # runs all package builds
```

## What it does

### `validate`

Checks every `skills/hr-*/SKILL.md` for:

- Required frontmatter fields: `name`, `description`, `metadata.author`, `metadata.version`
- `name` matches directory name
- `description` is at least 50 characters
- Required sections: `## Supported Tasks`, `## Key Prompts`, `## Tips`
- Minimum content length of 1 000 characters

```text
Validating HR Skills...

  ✓ hr-recruiting
  ✓ hr-performance-management
  ...
  ✓ hr-employee-engagement

✓ All 15 HR skills are valid
```

### `catalog`

Reads all `SKILL.md` files and writes `skills/CATALOG.md` — a single reference document listing every skill with its name, description, supported tasks, and a link to its source file.

## Source

| File | Purpose |
|------|---------|
| `src/config.ts` | `HR_SKILLS` list and `SKILLS_DIR` path |
| `src/validate.ts` | Validates frontmatter and required sections |
| `src/catalog.ts` | Generates `skills/CATALOG.md` |

## Requirements

Runs with [Bun](https://bun.sh) — no extra dependencies needed.
