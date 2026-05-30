---
description: Run pre-release build, test, typecheck, validation, and lint checks
---

# Release check

Checklist

1. `bun run build`
2. `bun run test`
3. `bun run typecheck`
4. `bun run validate`
5. `bun run lint`
6. `bun run lint:md`
7. `bun run knip`

Report a pass/fail summary for each step and surface key failure details.
