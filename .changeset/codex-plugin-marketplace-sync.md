---
"hr-skills-build": minor
---

Added Claude Code and Codex plugin manifest sync: `bun run sync` now also generates and validates `.claude-plugin/plugin.json`, `.codex-plugin/plugin.json`, and `.agents/plugins/marketplace.json`, keeping their `version`/description fields aligned with `package.json` and the current skill count alongside `.claude-plugin/marketplace.json`.
