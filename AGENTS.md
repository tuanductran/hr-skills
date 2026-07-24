# HR skills development guide

## Branch strategy

> [!IMPORTANT]
> **Never develop on the `main` branch.**
>
> - `main` is the **publishing branch** and only contains released skills.
> - `dev` is the **development branch** where all feature work, fixes, and content updates should occur.
> - Always create pull requests against `dev`, not `main`.

| Branch | Purpose | Direct commits |
|--------|---------|----------------|
| `main` | Publishing (`npx skills add tuanductran/hr-skills`) | Forbidden |
| `dev` | Development, tests, experiments | Via PR only |

## Commit convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>(<scope>): <short summary>
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | Add a new skill or a new feature to the tooling |
| `fix` | Fix a bug in a skill's content or in the tooling |
| `chore` | Maintenance tasks — deps, config, CI, `.gitignore` |
| `docs` | Changes to `docs/`, `README.md`, `AGENTS.md`, or any other documentation |
| `refactor` | Code restructuring with no behaviour change |
| `style` | Formatting, whitespace, markdownlint fixes |
| `test` | Add or update tests |
| `build` | Changes to the build system (`packages/`, `tsconfig`, `bun.lock`) |
| `ci` | Changes to GitHub Actions workflows |

### Scopes (optional)

Use the skill name or package name as scope when the change is isolated:

```text
feat(hr-recruiting): add ATS integration prompts
fix(hr-compliance): correct FMLA section length
chore(skills-ref): update bun dependency
docs(installation): add claude.ai paste method
```

### Rules

- Use the **imperative mood** in the summary: "add", "fix", "update" — not "added" or "fixes"
- Keep the summary under 72 characters
- Reference issues in the body when relevant: `Closes #42`
- Breaking changes: append `!` after the type and explain in the body

### Examples

```text
feat(hr-onboarding): add virtual onboarding prompts
fix(hr-analytics): correct turnover formula in tips
chore: upgrade markdownlint-cli to latest
docs: add skill-format specification to docs/
build(skills-ref): switch build target to bun
ci: add Biome job to hr-skills-ci workflow
```

Use these project commands from the repository root. After completing any task, validate the affected area and run the relevant lint checks:

```bash
bun install          # Install all dependencies (run once, or after package changes)
bun run sync         # Sync generated skill references after adding/removing a skill
bun run validate     # Validate all skill SKILL.md files
bun run matrix       # Generate docs/skill-matrix.md — snapshot of every skill's maturity tier
bun run registry     # Generate registry/skills.json — machine-readable skill registry (see docs/registry.md)
bun run plan "<intent>"  # Generate execution plan for a user intent (see docs/planner.md)
bun run execute "<intent>"  # Generate a plan and run it through the Workflow Runtime (see docs/runtime.md)
bun run evaluate     # Run the evaluation framework against eval/datasets (see docs/evaluation.md)
bun run test         # Run tests across workspace packages
bun run typecheck    # Run type-checking across workspace packages
bun run build        # Run all workspace build tasks through Turborepo
bun run check        # Run Biome checks without writing changes
bun run lint         # Run Biome checks with auto-fix
bun run format       # Format files with Biome formatter
bun run lint:md      # markdownlint + case-police on Markdown files
bun run lint:md:fix  # Markdown lint with auto-fix
bun run lint:links   # Check Markdown links in content, docs, and skills
bun run knip         # Detect unused files and dependencies
bun run release      # Release only: bump version, generate changelog, commit, tag, and push
```

Build, test, typecheck, validate, and sync tasks are orchestrated through Turborepo.

Tasks may run in parallel and use local caching based on `turbo.jsonc`.

When you add a new skill directory (for example `skills/hr-new-skill/SKILL.md`), run `bun run sync` first. It auto-discovers `hr-*` skill directories from `skills/`, then updates `.claude-plugin/marketplace.json` — no manual edits needed.

## Project structure

| Path | Purpose |
|------|---------|
| `skills/hr-*/SKILL.md` | Source skill definitions consumed by Claude Code and claude.ai |
| `skills/hr-*/content/` | Optional human-readable companion guidance for each HR skill domain |
| `skills/hr-*/prompts/` | Optional reusable prompt libraries grouped by HR topic |
| `skills/hr-*/examples/` | Optional practical end-to-end HR workflows and business scenarios |
| `docs/` | Skill format specification and generated reports |
| `docs/skill-matrix.md` | Generated skill maturity snapshot — do not edit manually, run `bun run matrix` |
| `docs/evaluation.md` | Evaluation framework architecture, dataset format, and golden fixture workflow |
| `packages/hr-skills-build/eval/datasets/` | Hand-authored evaluation datasets (planning scenarios) |
| `packages/hr-skills-build/eval/golden/` | Committed golden fixtures — expected planner/workflow outcomes, regenerate with `bun src/run-evaluation.ts --update-golden` from `packages/hr-skills-build` |
| `docs/registry.md` | Skill Registry architecture, schema, and extension guide |
| `registry/skills.json` | Generated machine-readable skill registry — do not edit manually, run `bun run registry` |
| `.claude-plugin/marketplace.json` | Generated marketplace metadata synced from skill frontmatter |
| `packages/hr-skills-build` | Build and maintenance tooling for validation, sync, and packaging support |
| `packages/skills-ref` | TypeScript library for reading, validating, and generating prompts from skill files |

## Packages

This repository uses Bun workspaces with Turborepo task orchestration. All packages are located in `packages/*`.

Generated files and package build outputs are cached through Turborepo based on the task configuration in `turbo.jsonc`.

| Package | Description |
|---------|-------------|
| `packages/hr-skills-build` | Build and maintenance tooling for validating skills, syncing metadata, and packaging skill distributions |
| `packages/skills-ref` | TypeScript library (`skills-ref`) for reading, validating, and generating prompts from skill files |

## Content standards

All documentation and skill content follows [Atlassian's content design guidelines](https://atlassian.design/foundations/content/). The key rules that apply to this project:

**Language and grammar** — [atlassian.design/foundations/content/language-and-grammar](https://atlassian.design/foundations/content/language-and-grammar/)

- Use sentence case for all headings: capitalize the first word and proper nouns only.
- Don't use `e.g.`, `i.e.`, `etc.`, or `&` in prose — write "for example", "that is", "and so on", "and".
- Don't use periods at the end of headings.
- Avoid gerunds in headings — prefer "Add a skill" over "Adding a skill".
- Phrase list items in parallel. Fragmented items: lowercase first letter, no period. Complete sentences: capital first letter, period at end.

**Voice and tone** — [atlassian.design/foundations/content/voice-tone](https://atlassian.design/foundations/content/voice-tone/)

- Be clear, concise, and direct — get to the point and get out of the way.
- Use contractions ("don't", "can't") for a conversational, friendly tone.
- Adjust tone to context: practical and precise in technical sections, approachable in onboarding content.

**Inclusive writing** — [atlassian.design/foundations/content/inclusive-writing](https://atlassian.design/foundations/content/inclusive-writing/)

- Use "they/their" instead of gendered pronouns when the person's identity isn't known.
- Avoid idioms or culturally specific expressions that don't translate well.

## Common pitfalls and best practices

- **Blank line before lists:** Always leave a blank line between a heading or paragraph and the list that follows. Missing blank lines can cause rendering issues and the skill validator enforces this rule for `SKILL.md` files.

  **For AI tools specifically:** every time you write a heading (`##`, `###`) or a bold label (`**Label:**`) that is immediately followed by a list, you MUST insert a blank line in between. This applies to every file in the project — `AGENTS.md`, `README.md`, `SKILL.md`, `docs/*.md`, and generated files. Run `bun run validate` and `bun run lint:md` before committing when Markdown or skills change.
- **HR-domain only:** Prompts and guidance must cover HR-specific patterns and best practices, not generic management or business advice.
- **No obvious content:** Avoid widely-known basics. Focus on nuanced guidance that HR professionals actually need AI assistance with.
- **Required structure:** Each `SKILL.md` needs frontmatter (`name`, `description`, `metadata`), `## Supported tasks`, `## Key prompts` (grouped by subtopic), and `## Tips`.
- **SKILL.md is for AI agents:** Be concise — context window is a shared resource. Assume the agent is smart; only include what it doesn't already know. Use progressive disclosure — `SKILL.md` is an overview, not an exhaustive manual.
- **Trigger phrases matter:** The `description` field is what determines when the skill activates. Include specific, realistic HR trigger phrases like "Write a PIP", "Conduct a stay interview", "Analyze turnover".

## Checklist for effective skills

Before publishing a skill, verify:

### Core quality

- [ ] `description` is specific and includes key HR trigger phrases
- [ ] `description` covers both what the skill does and when to use it
- [ ] `SKILL.md` body is under 500 lines
- [ ] Prompts are grouped by meaningful subtopics
- [ ] No time-sensitive information (laws, tools, versions)
- [ ] Consistent HR terminology throughout
- [ ] Prompts use `[placeholders]` for variable inputs
- [ ] Each subtopic has 4-7 focused prompts
- [ ] Tips section provides actionable professional guidance

### Frontmatter

- [ ] `name` matches the skill directory name exactly
- [ ] `metadata.author` is set to `Tuan Duc Tran`
- [ ] `metadata.version` is set

### Structure

- [ ] `## Supported tasks` lists 8-12 concrete tasks
- [ ] `## Key prompts` is divided into logical subtopic sections
- [ ] `## Tips` has 4-6 professional best-practice tips
