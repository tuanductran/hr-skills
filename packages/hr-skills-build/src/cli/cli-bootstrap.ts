/**
 * Shared bootstrap helpers for `src/cli/*.ts` entry points.
 *
 * `execute-plan.ts`, `generate-plan.ts`, `run-evaluation.ts`, `discover.ts`,
 * and `recommend.ts` each ended with the identical
 * `main().catch((err) => { p.log.error(...); process.exit(1); })` block, and
 * several also repeated the same "print usage, print an example, exit 1"
 * shape when a required argument was missing (jscpd flagged multiple pairs
 * across these files). Both now live here once.
 */

import * as p from '@clack/prompts';

/**
 * Run a CLI `main()` function, logging uncaught errors through `@clack/prompts`
 * and exiting with status 1. Every `cli/*.ts` entry point should end with
 * `runCli(main);` instead of hand-rolling its own `.catch(...)`.
 *
 * @param main - The CLI's entry point.
 */
export function runCli(main: () => Promise<void>): void {
	main().catch((err: unknown) => {
		const message = err instanceof Error ? err.message : String(err);
		p.log.error(`Error: ${message}`);
		process.exit(1);
	});
}

/**
 * Print a "missing required argument" usage message (usage line + one
 * example invocation) and exit with status 1. Call this when `value` is
 * falsy; callers keep control of the exact wording since each CLI's usage
 * differs, only the three-line shape is shared.
 *
 * @param usageLine - One-line usage summary, e.g. `Usage: bun run plan <intent>`.
 * @param exampleLine - One example invocation shown under "Example:".
 * @returns Never returns — always exits the process.
 */
export function printUsageAndExit(usageLine: string, exampleLine: string): never {
	p.log.error(usageLine);
	p.log.info('Example:');
	p.log.message(exampleLine);
	process.exit(1);
}
