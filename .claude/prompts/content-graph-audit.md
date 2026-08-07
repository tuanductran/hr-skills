# Skill content audit prompt

Use this prompt for a focused audit of `docs/`, `skills/`, and `registry/` as one
connected knowledge graph.

- Read `AGENTS.md` (root), `.agents/AGENTS.md`, and `docs/skill-matrix.md` first.
- Treat `skills/hr-*/SKILL.md` as the shipped source of truth.
- Treat `docs/` as the explanation and specification layer around shipped skills.
- Treat `registry/skills.json` and `.claude-plugin/marketplace.json` as generated — never edit them by hand; run `bun run registry` and `bun run sync` to regenerate.
- Check for:
  - skill directories missing from the root `SKILL.md` router
  - stale or broken internal links
  - skill indexes that omit real files
  - docs that fail to route readers to existing surfaces
  - skills that exist in `skills/` but are not discoverable from the right entry points
- Prefer updating existing indexes and guide files before creating new docs.
- Do not invent new skill packages just to make the graph feel fuller.
- Keep fixes structural and navigational unless a real content contradiction is found.
- Run `bun run lint:md` and `bun run validate` after meaningful edits.
