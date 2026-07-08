---
description: Run sync, validate, and markdown lint after editing skills
---

# Sync and validate

Workflow

1. Run `bun run sync`
2. Run `bun run validate`
3. Run `bun run lint:md`

After each step, report success or list of errors. Stop early on fatal errors from `bun run sync` or `bun run validate` and surface logs.
