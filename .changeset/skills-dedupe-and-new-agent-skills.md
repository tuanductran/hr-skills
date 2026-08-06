---
"hr-skills": minor
---

Added three repository agent skills — `.agents/skills/clack`, `.agents/skills/jscpd`, and `.agents/skills/dry-refactoring` — documenting this repo's actual `@clack/prompts` usage and duplicate-detection/refactoring conventions. Fixed generated PR review comments (`skill-review` CLI) linking to relative paths that don't resolve inside a GitHub PR comment body; they now use absolute GitHub blob URLs. Fixed the `description` field format in `.github/skill-template.md` and `.claude/commands/new-skill.md`, which used a YAML folded block scalar inconsistent with `docs/format.md` and every existing skill.
