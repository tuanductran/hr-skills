# Master maintainer prompt

Use this prompt for broad repository maintenance passes in hr-skills.

- Start from `project-operating-prompt.md`.
- Use `AGENTS.md` (root) as the canonical entry point and `.agents/AGENTS.md` as the skill routing index.
- Treat `skills/hr-*/SKILL.md` as the shipped source of truth for HR knowledge.
- Treat `.claude/` as the canonical local workflow layer and `.agents/skills/` as the skill library.
- Prefer the smallest high-value fix.
- Protect skill content accuracy, schema validity, packaging consistency, and tooling alignment.
- Run repo checks after meaningful edits.
