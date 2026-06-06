# Project overview

This repository is a Bun + Turborepo monorepo hosting 25 HR AI skills for Claude Code and claude.ai. Each skill lives in `skills/hr-*/SKILL.md`. The project uses Bun as the runtime and Turborepo for orchestration.

Essential commands

| Command | Purpose |
|---|---|
| `bun install` | install dependencies |
| `bun run validate` | validate all SKILL.md files |
| `bun run sync` | sync metadata after adding/removing a skill |
| `bun run catalog` | regenerate skills/CATALOG.md |
| `bun run zip` | generate distributable zip packages |
| `bun run build` | build all workspace packages |
| `bun run test` | run tests |
| `bun run typecheck` | type-check all packages |
| `bun run lint` | Biome checks with auto-fix |
| `bun run lint:md` | markdownlint + case-police |
| `bun run lint:md:fix` | markdownlint with auto-fix |

Workflow when adding a new skill

1. Create `skills/hr-<name>/SKILL.md`
2. Run `bun run sync`
3. Run `bun run validate`
4. Run `bun run catalog`
5. Run `bun run zip`

SKILL.md required structure

- YAML frontmatter: `name`, `description`, `metadata.author` (must be "Tuan Duc Tran"), `metadata.version`
- `name` must match directory name exactly
- `description` minimum 50 characters and include realistic HR trigger phrases
- Required sections: `## Supported tasks`, `## Key prompts`, `## Tips`
- `## Supported tasks`: 8–12 bullet items
- `## Key prompts`: 3–6 named subtopics, 4–7 prompts each, use `[placeholders]`
- `## Tips`: 4–6 bullet items
- Max 500 lines total
- No time-sensitive content (laws, versions, vendor-specific details)
- Always leave a blank line between a heading or bold label and the list that follows

Content standards (Atlassian guidelines)

- Sentence case for all headings
- Do not use `e.g.`, `i.e.`, `etc.` or `&` — write "for example", "that is", "and so on", "and"
- No periods at the end of headings
- Avoid gerunds in headings (use "Add a skill" not "Adding a skill")
- Use "they/their" for unknown gender

Branch and commit rules

- Never develop on `main` — use `dev` branch
- Use Conventional Commits format: `<type>(<scope>): <summary>`
- Types: feat, fix, chore, docs, refactor, style, test, build, ci
- Scope examples: `hr-recruiting`, `skills-ref`, `hr-skills-build`
- Summary under 72 characters, imperative mood

Workspace packages

- `packages/hr-skills-build` — validation, catalog, sync, zip tooling
- `packages/skills-ref` — TypeScript library for reading and validating skill files

Notes

Keep SKILL.md files concise and follow the repository's lint and validation scripts before opening a pull request to `dev`.
