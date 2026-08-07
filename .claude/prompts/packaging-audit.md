# Packaging audit prompt

Use this prompt for packaging and distributed-bundle honesty passes in hr-skills.

- Start from `AGENTS.md` (root), `packages/hr-skills-build/src/`, and `.distignore`.
- Audit `.distignore`, build scripts, and `dist/` artifact contents together.
- Verify shipped skill bundles do not include repo-only files or internal tooling.
- Verify `registry/skills.json` and `.claude-plugin/marketplace.json` reflect the current skills — regenerate if stale with `bun run registry` and `bun run sync`.
- Check that `bun run build-skills` produces a self-contained, installable artifact.
- Prioritize fixing source-of-truth build inputs over adding workaround files.
- Rebuild artifacts after meaningful edits:

```bash
bun run build
bun run build-skills
bun run sync
bun run registry
```
