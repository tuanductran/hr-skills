---
paths:
  - .claude/hooks/**/*.sh
  - lefthook.yml
---

# Shell scripting rules

Use these rules when editing bash or shell scripts in this repository.

## Scope

These scripts are local workflow helpers for a Bun + TypeScript monorepo. They should
stay thin, predictable, and easy to audit.

## Core rules

- keep shell scripts as wrappers, not as places for core business logic
- prefer `packages/hr-skills-build/src/` for real logic when TypeScript already owns the contract
- start with a clear shebang — prefer `#!/usr/bin/env bash` for bash scripts
- include a short header comment when the script's purpose is not obvious from the filename
- use `set -euo pipefail`
- avoid `eval`
- quote variable expansions
- prefer `${var}` form when it improves clarity around variable boundaries
- prefer `[[ ... ]]` in bash scripts
- use functions for reusable blocks instead of repeating command groups inline
- keep the main execution flow short and readable
- keep status output short and useful
- fail fast with plain error messages
- prefer safe, modern bash features such as `local`, arrays, and `[[ ... ]]`
- declare immutable values with `readonly` when a variable should not be reassigned

## Repo-specific guidance

- hooks in `.claude/hooks/` must use `$CLAUDE_PROJECT_DIR` (or `$CODEX_PROJECT_DIR`) to locate the repo root
- do not duplicate argument parsing in shell when the TypeScript entrypoint already does it
- keep wrapper commands aligned with `package.json` scripts and `turbo.jsonc` task definitions
- if a script changes command behavior, update the matching docs or hooks in the same pass

## Temporary files and cleanup

- use `mktemp` when temporary files or directories are needed
- clean up temporary resources with `trap` when the script creates them
- initialize temporary path variables defensively before a cleanup trap may reference them
- do not leave caches or throwaway artifacts in the working tree unless the task explicitly requires them

## Structured data

- prefer `jq` for JSON parsing in shell scripts
- if the script only forwards JSON to a TypeScript process, do not parse it in shell at all
- treat parser failures as real failures — do not keep going on malformed structured input
- if `jq` is unavailable, use `grep` with a narrow pattern as a fallback

## Safety and review posture

- validate required parameters before doing work
- prefer explicit `case` handling for small argument sets over fragile positional parsing
- avoid broad globbing or destructive cleanup when a narrower path is available
- keep scripts readable enough that another maintainer can audit them quickly
- when useful, run `bash -n path/to/script.sh` locally to check syntax

## Output and portability

- keep user-facing output concise — one clear status or error at a time
- avoid decorative banners or noisy logging unless the script is intentionally operator-facing
- prefer ASCII output unless the surrounding file already uses non-ASCII intentionally
- if a script is bash-specific, be clear about that rather than pretending it is POSIX shell

## Performance posture

- avoid repeated full-repo scans inside loops
- avoid spawning multiple `bun` processes when one command already performs the work
- prefer one canonical `bun run` command over stacked wrapper layers

## Validation

After changing shell scripts, run the narrowest relevant checks first:

```bash
bash -n .claude/hooks/<script>.sh   # syntax check
bash .claude/hooks/<script>.sh < /dev/null  # smoke test with empty input
```
