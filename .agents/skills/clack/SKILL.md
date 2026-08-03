---
name: clack
description: "Repository guidance for @clack/prompts usage in packages/hr-skills-build/src/cli/* and src/build/*. Covers the intro/spinner/note/outro/log CLI-output pattern this repo actually uses — not clack's interactive text/select/confirm prompts, which this repo does not use."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# clack

Repository guidance for [`@clack/prompts`](https://github.com/bombshell-dev/clack) (`^1.7.0`, see `package.json`) as used across `packages/hr-skills-build/src/cli/*.ts` and `packages/hr-skills-build/src/build/packages/hr-skills-build/src/build/sync.ts`.

> **This repo's clack usage is narrow and deliberate.** Every CLI here (`discover`, `recommend`, `execute-plan`, `generate-plan`, `run-evaluation`, `sync`, `validate`) is a single-shot, non-interactive script driven by `process.argv` — none of them collect input via clack's interactive prompts. Full upstream docs: [Getting Started](https://bomb.sh/docs/clack/basics/getting-started/), [Prompts](https://bomb.sh/docs/clack/packages/prompts/), [Best Practices](https://bomb.sh/docs/clack/guides/best-practices/).

## What this repo actually uses

Only five clack APIs appear anywhere in this codebase — confirmed by grepping `packages/hr-skills-build/src`:

| API | Purpose | Used in |
|---|---|---|
| `p.intro(title)` | Announce the CLI at start | Every `cli/*.ts` entry point |
| `p.outro(message)` | Announce completion at end | Every `cli/*.ts` entry point |
| `p.spinner()` / `.start()` / `.stop()` | Show progress during `buildRegistry()`, plan generation, etc. | `execute-plan.ts`, `generate-plan.ts`, `recommend.ts` |
| `p.note(message, title?)` | Print a multi-line info block (search results, recommendations) | `discover.ts`, `recommend.ts` |
| `p.log.{info,error,warn,success,message}` | Single-line status/error output | All `cli/*.ts`, routed through `packages/hr-skills-build/src/cli/packages/hr-skills-build/src/cli/cli-bootstrap.ts` |

## What this repo does NOT use — do not introduce it

- **No `text()`, `select()`, `confirm()`, `multiselect()`, `password()`, or any other interactive prompt.** These CLIs must stay scriptable (CI, `bunx`, piped output); blocking on stdin input would break that. If a task genuinely needs a human choice, that belongs in `.claude/commands/*.md` (Claude Code slash commands), not in `packages/hr-skills-build`'s CLIs.
- **No `isCancel()`.** It only matters when interactive prompts are in play — irrelevant here. Don't add it "for safety"; it signals dead code review comments.
- **No `@clack/core` low-level primitives** (`TextPrompt`, custom `Prompt` subclasses). `@clack/prompts` alone covers everything this repo needs.

If a future CLI genuinely needs interactive input, that's a deliberate scope change — flag it explicitly rather than silently adding `text()`/`select()` to keep the "always scriptable" invariant intact.

## Repository pattern

Every CLI entry point in `src/cli/*.ts` follows this shape (see `packages/hr-skills-build/src/cli/packages/hr-skills-build/src/cli/cli-bootstrap.ts`):

```typescript
import * as p from '@clack/prompts';
import { printUsageAndExit, runCli } from './cli-bootstrap.js';

async function main() {
	const intent = process.argv[2];
	if (!intent) {
		printUsageAndExit(
			'Usage: bun run my-command "<argument>"',
			'  bun run my-command "example"',
		);
	}

	p.intro('My Command');

	const spinner = p.spinner();
	spinner.start('Building Skill Registry...');
	const registry = await buildRegistry();
	spinner.stop(`Registry ready (${registry.skillCount} skills)`);

	// ... do the work, p.note(...) for structured output ...

	p.outro('Done');
}

runCli(main);
```

- `printUsageAndExit` / `runCli` (from `cli/cli-bootstrap.ts`) standardize the "missing arg" and "uncaught error" paths — see [`cli-bootstrap`](../../../packages/hr-skills-build/src/cli/cli-bootstrap.ts). Don't hand-roll `p.log.error(...); process.exit(1);` again; that duplication is exactly what `cli-bootstrap.ts` was extracted to remove (see [`dry-refactoring`](../dry-refactoring/SKILL.md)).
- `p.intro`/`p.outro` bookend the whole run — call each exactly once.
- `spinner.stop(message)` should report a concrete result (count, duration), not just "Done" — matches the existing `Registry ready (${registry.skillCount} skills)` style.

## Key prompts

### Adding a new CLI

- "Scaffold a new `src/cli/*.ts` entry point following this repo's clack pattern."
- "Wire this new CLI through `cli-bootstrap.ts`'s `runCli`/`printUsageAndExit`."

### Reviewing clack usage

- "Check whether this CLI change introduces an interactive prompt that would break scriptability."
- "Review this `p.spinner()` usage for a concrete stop message."
- "Is this `p.log.*` call redundant with what `cli-bootstrap.ts` already provides?"

## Tips

- Keep `p.intro`/`p.outro` messages short — they're a visual bookend, not a status report.
- Prefer `p.note()` over multiple `p.log.message()` calls when printing a related block (search results, a plan summary) — it groups visually.
- Never gate a `cli/*.ts` script on user input; that's the one hard rule this skill exists to protect.
