---
paths:
  - '**/*'
---

# Repository workflow rules

Use these rules for repository-wide working discipline.

## Sources of truth

- `AGENTS.md` (root) — canonical, tool-agnostic entry point for contributors and agents
- `.agents/AGENTS.md` — routing index mapping tasks to the correct skill file
- `docs/engineering/skill-matrix.md` — generated skill maturity snapshot; never hand-edit, run `bun run matrix`
- `registry/skills.json` — generated machine-readable skill registry; never hand-edit, run `bun run registry`
- `.claude-plugin/marketplace.json` — generated marketplace metadata; never hand-edit, run `bun run sync`
- `.agents/skills/hr-skills-maintaining/SKILL.md` — full SKILL.md structure, frontmatter rules, and pre-publish checklist
- Prefer existing repo files over generic assumptions.

## Working style

- Make the smallest correct change first.
- Do not add new surfaces, modules, or docs unless there is a current need.
- Prefer updating existing files over creating parallel ones.
- Keep repo language plain, specific, and ASCII-safe in Markdown.
- Ensure all Markdown updates comply with `.markdownlint.yml` rules.

## Before editing

- Read the nearest source-of-truth skill file first (see `.agents/AGENTS.md` index).
- For `skills/hr-*/SKILL.md` changes, load `.agents/skills/hr-skills-maintaining/SKILL.md` before proceeding.
- Do not change generated artifacts (`docs/engineering/skill-matrix.md`, `registry/skills.json`, `.claude-plugin/marketplace.json`) by hand.

## After editing

Run these checks after meaningful changes:

```bash
bun run validate        # validate all SKILL.md files
bun run check           # Biome lint + format check
bun run lint:md         # markdownlint + case-police
```

If you added or removed a skill directory:

```bash
bun run sync            # auto-discovers skills and updates marketplace.json
bun run validate        # re-validate after sync
```

If the change touches TypeScript in `packages/*`:

```bash
bun run test            # run tests across workspace packages
bun run typecheck       # type-check all packages
```

If the change touches public URLs in Markdown:

```bash
bun run lint:links      # check external links in docs/ and skills/
```

Before pushing, keep the local CI mirror green:

```bash
bun run validate
bun run test
bun run check
```

If packaging or release behavior changed:

```bash
bun run build           # build packages
bun run build-skills    # package skill bundles
```

## AI tool guardrails

- Do not widen scope just because a change is possible.
- Do not invent product capabilities the repo does not implement.
- Do not hand-edit generated artifacts — regenerate them with the corresponding `bun run` command.
- Do not leave generated caches or build artifacts in the working tree unless intentionally part of the task.
