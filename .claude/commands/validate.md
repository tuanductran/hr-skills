---
description: Run repository validation and markdown linting for SKILL.md files
---

# Validate

Runs `bun run validate` to validate all `SKILL.md` files, then runs `bun run lint:md` for markdown linting. Reports a concise summary of errors found in each step.

Steps

1. Run `bun run validate`
2. If errors, collect and report filenames and short messages
3. Run `bun run lint:md`
4. Report markdown lint warnings and errors
