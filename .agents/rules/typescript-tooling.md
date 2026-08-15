---
paths:
  - packages/**/*.ts
  - tsconfig.json
  - biome.jsonc
---

# TypeScript and tooling rules

Use the repo's TypeScript tooling contract when changing code or developer workflows.

- keep TypeScript aligned with `tsconfig.json` at the repo root
- prefer Biome as the single lint, format, and code-quality tool for all TypeScript/JavaScript in `packages/*`
- run `bun run check` (Biome check without write) to validate before committing
- run `bun run lint` (Biome check with write) to auto-fix lint issues
- run `bun run format` (Biome format with write) to auto-fix formatting only
- prefer typed changes that continue to pass `bun run typecheck`
- update tests in `packages/*/test/**/*.test.ts` when a tooling or contract change affects observable behavior
- prefer shared helpers already in `packages/skills-ref/src/` and `packages/hr-skills-build/src/shared/` over duplicating logic
- do not create a new helper when a call site has a materially different contract or would become less clear than local explicit code
- prefer Valibot for schema definition and validation (see `.agents/skills/valibot/SKILL.md`)
- prefer `@clack/prompts` for CLI output in `packages/cli/src/cli/*` (see `.agents/skills/clack/SKILL.md`)
