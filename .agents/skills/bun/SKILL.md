---
name: bun
description: "Bun as a runtime, package manager, bundler, and test runner. Practical migration notes from Node and usage guidance."
metadata:
  author: "Tuan Duc Tran"
  version: "1.0.0"
---

# Bun runtime overview

Bun is an all-in-one JavaScript runtime and toolkit that provides a runtime, package manager, bundler, and test runner with a focus on speed.

## When to choose Bun

- Prefer Bun for new JavaScript/TypeScript projects where install and startup speed matter, and a small tooling surface is desirable.
- Prefer Node when you require the widest ecosystem compatibility, depend on native tooling that assumes Node, or have dependencies with known Bun incompatibilities.

Use cases: adopting Bun for new packages, migrating from Node, writing or debugging Bun scripts and tests.

## What Bun provides

- Runtime: a fast drop-in runtime implemented on JavaScriptCore (written in Zig) with many Node-compatible APIs.
- Package manager: `bun install` is significantly faster than many alternatives; lockfile is `bun.lock` (text). Older versions used `bun.lockb` (binary).
- Bundler: built-in bundler and transpiler for applications and libraries.
- Test runner: `bun test` with a Jest-like API.

## Migrating from Node

- Replace `node script.js` with `bun run script.js` or `bun script.js`.
- Use `bun install` instead of `npm install` (this repository uses `bun` as the package manager; see `package.json` preinstall hook `bunx only-allow bun`).
- Most packages work, but verify compatibility; prefer `bun run` for npm-script equivalents.
- Use `bunx` (or `bunx <cmd>`) for one-off executable runs similar to `npx`.

## Notes on reproducible installs

For reproducible installs in CI or deployment workflows, use:

```bash
bun install --frozen-lockfile
```

## Integration with this repository

- This monorepo uses Turborepo for orchestration. Common workspace scripts (defined in the repository `package.json`) include:

```bash
# validate all skills: runs hr-skills-build validate task
bun run validate

# sync metadata after adding/removing a skill
bun run sync

# regenerate skills catalog
bun run catalog

# package distributable skill zips
bun run zip

# build all workspace packages
bun run build

# run tests and typecheck
bun run test
bun run typecheck

# linting and formatting
bun run lint
bun run lint:md
bun run lint:md:fix
```

- The repo installs Lefthook for Git hooks (`prepare` script runs `lefthook install`). Respect the preinstall hook which enforces Bun usage (`bunx only-allow bun`).

## CI recommendations for this project

- In CI, run `bun install --frozen-lockfile` then `bun run typecheck` and `bun run validate` early to fail fast on type or skill-format issues.
- Use `turbo` caching for repeated builds in CI to speed workloads.

## Examples

Install and run

```bash
# install dependencies (creates or updates bun.lock)
bun install

# run scripts or files
bun run dev
bun run src/index.ts
bun src/index.ts
```

Scripts and env

```bash
bun run --env-file=.env dev
FOO=bar bun run script.ts
```

Tests

```bash
bun test
bun test --watch
```

```typescript
// test/example.test.ts
import { expect, test } from "bun:test";

test("add", () => {
  expect(1 + 2).toBe(3);
});
```

## Common issues and guidance

- `bun install` creates a `node_modules` layout that can differ due to extensive symlink usage; tooling that depends on exact layout may need validation.
- Some older or niche dependencies may be incompatible with Bun; in those cases fallback to Node may be necessary.
- When deploying to a runtime that supports Bun, ensure build/runtime settings and commands are configured appropriately.

