# Prompts

Reusable maintainer prompts for broad passes in the hr-skills repository.
These are not Claude Code slash commands — load them manually when starting a focused maintenance session.

| Prompt | When to use |
|---|---|
| [`project-operating-prompt.md`](project-operating-prompt.md) | Baseline for any broad maintenance pass — read this first |
| [`master-maintainer.md`](master-maintainer.md) | Quick-start for broad repository maintenance |
| [`content-graph-audit.md`](content-graph-audit.md) | Audit `docs/`, `skills/`, and `registry/` as a connected graph |
| [`docs-skills-sync.md`](docs-skills-sync.md) | Verify `docs/` and `skills/` describe one coherent package |
| [`packaging-audit.md`](packaging-audit.md) | Audit packaging, `dist/`, and generated artifact freshness |
| [`security-hardening.md`](security-hardening.md) | Harden hooks, workflows, and shell scripts |
| [`release-readiness.md`](release-readiness.md) | Pre-release checklist before publishing a new version |
| [`tooling-sync.md`](tooling-sync.md) | Sync `package.json`, `biome.jsonc`, `turbo.jsonc`, and `.claude/settings.json` |
