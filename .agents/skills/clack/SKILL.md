---
name: clack
description: "Repository guidance for @clack/prompts usage in packages/cli/src/cli/* and src/build/*. Covers the intro/spinner/note/outro/log CLI-output pattern this repo actually uses — not clack's interactive text/select/confirm prompts, which this repo does not use."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# clack

Repository guidance for [`@clack/prompts`](https://github.com/bombshell-dev/clack) (`^1.7.0`, see `package.json`) as used across `packages/cli/src/cli/*.ts` and `src/build/sync.ts`.

> **This repo's clack usage is narrow and deliberate.** Every CLI here (`discover`, `recommend`, `execute-plan`, `generate-plan`, `run-evaluation`, `sync`, `validate`) is a single-shot, non-interactive script driven by `process.argv` — none of them collect input via clack's interactive prompts. Full upstream docs: [Getting Started](https://bomb.sh/docs/clack/basics/getting-started/), [Prompts](https://bomb.sh/docs/clack/packages/prompts/), [Best Practices](https://bomb.sh/docs/clack/guides/best-practices/).

## What this repo actually uses

Only five clack APIs appear anywhere in this codebase — confirmed by grepping `packages/hr-skills-build/src`:

| API | Purpose | Used in |
|---|---|---|
| `p.intro(title)` | Announce the CLI at start | Every `cli/*.ts` entry point, plus `build/sync.ts` and `validation/validate.ts` |
| `p.outro(message)` | Announce completion at end — **including every failure path**, or the box is left unterminated | Same as `p.intro` |
| `p.spinner()` / `.start()` / `.stop()` | Show progress during `buildRegistry()`, validation, plan generation, etc. | Created via `cliSpinner()` in `discover.ts`, `execute-plan.ts`, `generate-plan.ts`, `recommend.ts`, `run-evaluation.ts`, `validation/validate.ts` |
| `p.note(message, title?)` | Print a multi-line info block (search results, recommendations, usage) | `discover.ts`, `recommend.ts`, `execute-plan.ts`, `generate-plan.ts`, `run-evaluation.ts`, `cli-bootstrap.ts` |
| `p.log.{info,error,warn,success,message}` | Single-line status/error output | All `cli/*.ts`, routed through `cli/cli-bootstrap.ts` |

`p.note` titles are SCREAMING CASE at every call site (`RESULTS FOR …`, `EXECUTION PLAN`, `USAGE`). Keep it that way.

## What this repo does NOT use — do not introduce it

- **No `text()`, `select()`, `confirm()`, `multiselect()`, `password()`, or any other interactive prompt.** These CLIs must stay scriptable (CI, `bunx`, piped output); blocking on stdin input would break that. If a task genuinely needs a human choice, that belongs in `.claude/commands/*.md` (Claude Code slash commands), not in `packages/hr-skills-build`'s CLIs.
- **No `isCancel()`.** It only matters when interactive prompts are in play — irrelevant here. Don't add it "for safety"; it signals dead code review comments.
- **No `@clack/core` low-level primitives** (`TextPrompt`, custom `Prompt` subclasses). `@clack/prompts` alone covers everything this repo needs.

If a future CLI genuinely needs interactive input, that's a deliberate scope change — flag it explicitly rather than silently adding `text()`/`select()` to keep the "always scriptable" invariant intact.

## Repository pattern

Every CLI entry point in `src/cli/*.ts` follows this shape (see `cli/cli-bootstrap.ts`):

```typescript
import * as p from '@clack/prompts';
import { type CliUsage, cliSpinner, printUsageAndExit, runCli } from './cli-bootstrap.js';

const USAGE: CliUsage = {
	title: 'My Command',
	usage: 'bun run my-command "<argument>"',
	example: 'bun run my-command "example"',
};

async function main() {
	const intent = process.argv[2];

	// Reject a bare flag in the positional slot too, not just an empty one.
	if (!intent || intent.startsWith('--')) {
		printUsageAndExit(USAGE);
	}

	p.intro(USAGE.title);

	const spinner = cliSpinner();
	spinner.start('Building Skill Registry...');
	const registry = await buildRegistry();
	spinner.stop(`Registry ready (${registry.skillCount} skills)`);

	// ... do the work, p.note(...) for structured output ...

	p.outro('Done');
}

runCli(main, USAGE);
```

- One `CliUsage` per command, shared by `printUsageAndExit`, `runCli`, and `p.intro(USAGE.title)`, so the `--help` screen and the bad-invocation error can't drift apart.
- **Pass `USAGE` to `runCli`.** That is what implements `--help`/`-h`: it prints usage and exits 0 *before* `main()` runs. Omit it and the command treats `--help` as a positional argument — which is how `bun run evaluate --help` once ran the whole evaluation suite and `bun run plan --help` generated a plan for the literal intent `"--help"`.
- **Use `cliSpinner()`, never `p.spinner()` directly.** A running spinner repaints every 80ms by erasing the lines beneath it, and clack's exit handler then stamps "Canceled" over the area — so an error thrown mid-spin is invisible. `cliSpinner()` registers the spinner so `runCli` can stop it with the real message.
- `printUsageAndExit` / `runCli` standardize the bad-invocation and uncaught-error paths — see [`cli-bootstrap`](../../../packages/cli/src/cli/cli-bootstrap.ts). Don't hand-roll `p.log.error(...); process.exit(1);` again; that duplication is exactly what `cli-bootstrap.ts` was extracted to remove (see [`dry-refactoring`](../dry-refactoring/SKILL.md)). Prefer letting a typed error propagate to `runCli` over catching it locally.
- `p.intro`/`p.outro` bookend the whole run — call each exactly once, **on success and failure alike**. `p.log.*` output renders with clack's `│` gutter but no `┌` above and no `└` below, so an `exit(1)` with no outro leaves a visibly broken box.
- Validate flag *values*, not just presence: `--limit 0` and `--limit abc` used to reach the search layer as `0`/`NaN` and produce "no results", blaming the query for a bad flag. Reject unknown flags too, rather than ignoring them.
- `spinner.stop(message)` should report a concrete result (count, duration), not just "Done" — matches the existing `Registry ready (${registry.skillCount} skills)` style.
- A CLI module that anything else imports (`validation/validate.ts` is imported by its own test) keeps its `if (import.meta.main)` guard around `runCli`, and parses `process.argv` *inside* it — otherwise a plain `import` runs the command or parses the host process's flags.

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
