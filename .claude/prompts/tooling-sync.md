# Tooling sync prompt

Use this prompt for tooling and root-config synchronization passes in hr-skills.

- Start from `package.json`, `turbo.jsonc`, `biome.jsonc`, `tsconfig.json`, `lefthook.yml`, and `commitlint.config.ts`.
- Treat `package.json` scripts and `turbo.jsonc` task definitions as the source of truth for all `bun run` commands.
- Keep `biome.jsonc` as the single source for lint, format, and code-quality rules — do not add parallel tools.
- Verify `.claude/settings.json` permissions list matches the actual scripts in `package.json` (no stale or missing entries).
- Verify `.claude/hooks/` scripts call commands that exist in `package.json` or as installed binaries.
- Keep root config files (`tsconfig.json`, `biome.jsonc`, `commitlint.config.ts`) aligned with `packages/*/tsconfig.json` and workspace catalogs in `package.json`.
- Audit dependency bots (`renovate.json5`), Git hooks (`lefthook.yml`), Markdown tooling, and local build commands together.
- Remove stale config and duplicated logic rather than layering on more wrappers.
- Run `bun run check`, `bun run typecheck`, and `bun run validate` after meaningful tooling edits.
