# Release readiness prompt

Use this prompt for release readiness passes before publishing a new version of hr-skills.

- Audit the repo as a product system, not only as TypeScript code.
- Prioritize skill content accuracy, schema validity, Markdown integrity, packaging, and CI.
- Check `.github/workflows/` alongside docs and tests.
- Verify `CHANGELOG.md` reflects all changes since the last release.
- Verify changesets are present for every releasable change (`bun run changeset`).
- Confirm generated artifacts are up to date — `docs/engineering/skill-matrix.md`, `registry/skills.json`, `.claude-plugin/marketplace.json`.
- Prefer focused test runs and targeted validation before widening scope.
- Before tagging or publishing, run the full pre-release checklist:

```bash
bun run validate
bun run test
bun run check
bun run lint:md
bun run build
bun run build-skills
bun run sync
bun run registry
bun run matrix
```
