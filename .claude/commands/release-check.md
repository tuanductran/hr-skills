---
description: Run pre-release build, test, typecheck, validation, and lint checks
---

# Release check

Checklist

1. `bun run build`
2. `bun run test`
3. `bun run typecheck`
4. `bun run validate`
5. `bun run matrix`
6. `bun run lint`
7. `bun run lint:md`
8. `bun run knip`

Report a pass/fail summary for each step and surface key failure details.
