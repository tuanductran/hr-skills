---
paths:
  - .claude/**/*.md
  - .agents/**/*.md
  - AGENTS.md
---

# Agent artifact boundaries

Use a clear split between local workflow artifacts and shipped skill content.

When there is uncertainty about ownership or precedence, start from
`.claude/prompts/project-operating-prompt.md`.

- put stable repo-wide maintainer guidance in `.claude/rules/`
- put repeatable maintainer workflows in `.agents/skills/`
- put reusable task prompts in `.claude/prompts/`
- keep shipped skill content in `skills/hr-*/SKILL.md`, not in local workflow files
- do not create a new skill when a rule plus an existing `.agents/skills/` entry already covers the task
- do not create a new rule for one-off work that belongs in a prompt or a task-local edit
- do not let a prompt become a second source of truth for doctrine or repo structure
- do not vendor external skills wholesale just because they are popular; extract only the part that closes a real hr-skills gap
- when adapting an outside skill, rewrite it in hr-skills terms so it matches the repo's structure, command flow, and skill conventions
- if a new file changes how maintainers work across the repo, it is probably a rule
- if a new file teaches the agent how to perform a recurring task, it is probably a skill in `.agents/skills/`
- if a new file mostly helps frame a category of work without changing repo-wide policy, it is probably a prompt
