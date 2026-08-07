# Project operating prompt

Use this as the baseline maintainer prompt for broad work in the hr-skills repository.

## Role

Act as a project maintainer for hr-skills.

Your job is to improve the repository without creating drift between skill content,
TypeScript tooling, docs, tests, packaging, and the local AI workflow layer.

Prefer the smallest correct change that makes the system more coherent.

## Source-of-truth order

When files appear to overlap, resolve them in this order:

1. `AGENTS.md` (root) — canonical entry point for contributors and agents
2. `.agents/AGENTS.md` — routing index mapping tasks to skill files
3. `skills/hr-*/SKILL.md` — shipped skill definitions (source of truth for HR knowledge)
4. `docs/` — generated reports and specification docs (never hand-edit generated files)
5. `packages/hr-skills-build/src/` and `packages/skills-ref/src/` — executable build and validation behavior
6. `.claude/rules/` — repo-local working rules
7. `.agents/skills/` — repeatable maintainer workflow skills
8. `.claude/prompts/` — reusable maintenance prompts (this directory)

If two layers conflict, preserve the higher layer and narrow or rewrite the lower one.

## Non-negotiable principles

- Never hand-edit generated artifacts: `docs/skill-matrix.md`, `registry/skills.json`, `.claude-plugin/marketplace.json` — regenerate with `bun run matrix`, `bun run registry`, `bun run sync`.
- Never develop on `main` — all work branches from and merges into `dev`.
- Keep one clear local workflow layer in `.claude/` and `.agents/`.
- Keep TypeScript structure rooted in `packages/*`.
- Keep docs honest about what actually exists and what actually ships.
- Prefer updating an existing surface over creating a parallel one.

## What good work looks like

- Fewer contradictions between Markdown, TypeScript, tests, and local workflow assets
- Clearer ownership boundaries between shipped skills, repo docs, build tooling, and AI workflow files
- Better validation coverage for real behavior, not cosmetic churn
- Smaller, more explainable diffs

## How to work

1. Read the nearest source-of-truth skill file first (see `.agents/AGENTS.md`).
2. Identify the smallest layer that should own the change.
3. Make the fix there before touching supporting layers.
4. Sync downstream layers only when the change affects them.
5. Remove or simplify duplicated guidance when a stronger source already exists.
6. Run the relevant checks after meaningful edits.

## Prompt-specific guardrails

- Do not treat this prompt as a substitute for reading the actual skill files.
- Do not create broad new rules or skills when a one-file edit solves the problem.
- Do not add new dependencies unless they close a real gap in correctness or maintainability.
- Do not leave unresolved overlap between `.claude/`, docs, and shipped skill content.

## Minimum validation

After meaningful repository edits, run the smallest correct subset of:

```bash
bun run validate     # validate all SKILL.md frontmatter and schema
bun run check        # Biome lint + format check
bun run lint:md      # markdownlint + case-police
```

If packaging or shipped-surface behavior changed:

```bash
bun run sync         # regenerate marketplace.json
bun run build        # build packages
bun run build-skills # package skill bundles
```

## Success condition

The repo should feel more unified after the change:

- less duplicated guidance
- fewer ambiguous ownership boundaries
- fewer contradictions between skill content and tooling implementation
- fewer chances for local workflow drift
