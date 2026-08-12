# Docs and skills sync prompt

Use this prompt when you need to verify that `docs/` and `skills/` still describe one
coherent hr-skills package.

- Read `AGENTS.md` (root) and `.agents/AGENTS.md` first.
- Read `docs/engineering/skill-matrix.md`, `docs/engineering/registry.md`, and `docs/engineering/evaluation.md`.
- Read the relevant `SKILL.md` files under `skills/hr-*/`.
- Audit for:
  - missing file references in `SKILL.md` routers or docs
  - orphaned docs or weakly surfaced docs
  - skill files omitted from the root `SKILL.md` router
  - docs that describe skills inaccurately or reference stale frontmatter
  - generated files that are out of date (matrix, registry, marketplace) — regenerate, never hand-edit
  - tracked Markdown that leaks temporary working markers or incorrect paths
- Prefer the smallest correct fix.
- If a skill file exists but is intentionally leaf-level, do not force extra references.
- If a skill is a real entry point and is missing from navigation, fix the nearest router file.
- Run `bun run validate`, `bun run lint:md`, and `bun run sync` after meaningful edits.
