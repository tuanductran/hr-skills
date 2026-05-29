# HR agent skills

A collection of HR skills for Claude.ai and Claude Code that help HR managers with their day-to-day work. Skills are packaged AI prompt libraries that extend Claude's capabilities across all major HR domains.

Built by [Tuan Duc Tran](https://github.com/tuanductran) for members of the Zalo **HR/TA Job Onsite/Hybrid/Remote** group — a community for Human Resources and Talent Acquisition professionals sharing Onsite, Hybrid, and Remote job opportunities.

Skills follow the [Agent Skills](https://agentskills.io/) format.

## Coverage

Modern technical recruiting and HR knowledge covering software engineering domains, hiring workflows, people operations, compliance, leadership, onboarding, analytics, and employee experience.

## Installation

**Claude Code:**

```bash
cp -r skills/hr-{skill-name} ~/.claude/skills/
```

**claude.ai:** Add the skill's `SKILL.md` to your project knowledge, or paste the content into the conversation.

## Skill structure

Each skill contains:

- `SKILL.md` — Skill definition with supported tasks and AI prompts for HR managers

## Development

This is a [Bun](https://bun.sh/) and [Turborepo](https://turborepo.dev/) monorepo. Run all commands from the project root.

```bash
bun install          # Install all dependencies
bun run validate     # Validate all skill SKILL.md files
bun run catalog      # Regenerate skills/CATALOG.md
bun run sync         # Sync skill references and generated project metadata
bun run build        # Build all workspace packages through Turborepo
bun run test         # Run tests across all workspace packages
bun run typecheck    # Type-check all workspace packages
bun run check        # Run Biome checks without applying changes
bun run lint         # Run Biome checks with auto-fix
bun run format       # Format files with Biome
bun run lint:md      # markdownlint + case-police on Markdown files
bun run lint:md:fix  # markdownlint + case-police with auto-fix
bun run lint:links   # Check Markdown links in skills/
bun run knip         # Detect unused files and dependencies
bun run zip          # Generate distributable skill zip packages
bun run release      # Bump version, generate changelog, commit, tag, and push
```

### Packages

| Package | Description |
|---------|-------------|
| `packages/hr-skills-build` | Build and maintenance tooling for validating skills, generating catalogs, syncing metadata, and packaging skills |
| `packages/skills-ref` | TypeScript library for reading, validating, and prompting skill files |

## License

MIT
