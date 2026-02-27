# HR skills development guide

## Branch strategy

> **IMPORTANT: Never develop on `main` branch!**
>
> - `main` is the **publishing branch** — it only contains released skills
> - `dev` is the **development branch** — all work happens here

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
chore: upgrade markdownlint-cli to 0.47
docs: add skill-format specification to docs/
build(skills-ref): switch build target to bun
ci: add ESLint job to hr-skills-ci workflow
```

After completing any task, validate skills and run the linter:

```bash
bun install          # Install all dependencies (run once, or after package changes)
bun run sync         # Sync skill references across all docs (run after adding/removing a skill)
bun run validate     # Validate all 15 skill SKILL.md files
bun run lint         # ESLint on TypeScript sources (0 errors required)
bun run lint:fix     # ESLint with auto-fix
bun run lint:md      # markdownlint + case-police on Markdown files
bun run lint:md:fix  # Markdown lint with auto-fix
bun run typecheck    # Type-check all packages with tsc
bun run build        # Build packages (skills-ref CLI → dist/)
bun run catalog      # Regenerate skills/CATALOG.md
```

When you add a new skill directory (for example `skills/hr-new-skill/SKILL.md`), run `bun run sync` first. It auto-updates `config.ts`, all documentation tables, `marketplace.json`, and skill counts across the project — no manual edits needed.

## Packages

| Package | Description |
|---------|-------------|
| `packages/hr-skills-build` | `validate.ts` and `catalog.ts` scripts — run via `bun run validate` / `bun run catalog` from root |
| `packages/skills-ref` | TypeScript library + CLI (`skills-ref`) for reading, validating, and generating prompts from skill files |

## Skill scopes

| Skill | Scope |
|-------|-------|
| **hr-analytics** | Help HR managers with HR analytics and data management. |
| **hr-compensation-benefits** | Help HR managers with compensation and benefits programs. |
| **hr-compliance** | Help HR managers with HR compliance and workplace policies. |
| **hr-conflict-resolution** | Help HR managers with workplace conflict resolution. |
| **hr-diversity-inclusion** | Help HR managers with diversity, equity, and inclusion initiatives. |
| **hr-employee-engagement** | Help HR managers with employee engagement strategies. |
| **hr-employee-relations** | Help HR managers with employee relations matters. |
| **hr-leadership-development** | Help HR managers with leadership development programs. |
| **hr-onboarding** | Help HR managers with employee onboarding and offboarding. |
| **hr-performance-management** | Help HR managers with performance management processes. |
| **hr-recruiting** | Help HR managers with end-to-end recruiting and talent acquisition. |
| **hr-technology** | Help HR managers with HR technology strategy and implementation. |
| **hr-training-development** | Help HR managers with learning and development programs. |
| **hr-vietnam-context** | Vietnam-specific HR guidance covering the Labor Code, Social Insurance Law, personal income tax registration, work permits for foreign workers, trade union obligations, and cultural norms for managing teams in Vietnam. |
| **hr-workforce-planning** | Help HR managers with workforce planning and strategy. |

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

- **Blank line before lists:** Always leave a blank line between a heading or paragraph and the list that follows. Missing blank lines cause markdownlint (`MD032`) and rendering errors.

  **For AI tools specifically:** every time you write a heading (`##`, `###`) or a bold label (`**Label:**`) that is immediately followed by a list, you MUST insert a blank line in between. This applies to every file in the project — `AGENTS.md`, `README.md`, `SKILL.md`, `docs/*.md`, and generated files. Run `bun run lint:md` to catch violations before committing.
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
- [ ] Each subtopic has 4–7 focused prompts
- [ ] Tips section provides actionable professional guidance

### Frontmatter

- [ ] `name` matches the skill directory name exactly
- [ ] `metadata.author` is set to `Tuan Duc Tran`
- [ ] `metadata.version` is set

### Structure

- [ ] `## Supported tasks` lists 8–12 concrete tasks
- [ ] `## Key prompts` is divided into logical subtopic sections
- [ ] `## Tips` has 4–6 professional best-practice tips
