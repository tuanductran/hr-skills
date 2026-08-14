/**
 * Shared bootstrap helpers for `src/cli/*.ts` entry points.
 *
 * `execute-plan.ts`, `generate-plan.ts`, `run-evaluation.ts`, `discover.ts`,
 * and `recommend.ts` each ended with the identical
 * `main().catch((err) => { p.log.error(...); process.exit(1); })` block, and
 * several also repeated the same "print usage, print an example, exit 1"
 * shape when a required argument was missing (jscpd flagged multiple pairs
 * across these files). Both now live here once.
 *
 * Three CLI-wide behaviours are enforced here rather than per command:
 *
 * 1. `--help` / `-h` prints usage and exits 0 without doing any work. Every
 *    command used to treat it as a positional argument, so `bun run evaluate
 *    --help` ran the whole evaluation suite and `bun run plan --help`
 *    generated a plan for the literal intent `"--help"`.
 * 2. Usage and error output is bookended by `p.intro`/`p.outro`. Without an
 *    intro, `@clack/prompts` renders its `│` gutter with no `┌` above it and
 *    no `└` below, so the output box is visibly unterminated.
 * 3. A live spinner is stopped with the error before exiting — see
 *    {@link cliSpinner}.
 */

import * as p from '@clack/prompts';

/**
 * Usage text for one CLI, shared by its `--help` screen and its
 * "missing required argument" error so the two can't drift apart.
 */
export interface CliUsage {
	/** The command's `p.intro()` title, so `--help` shows the same header as a real run. */
	title: string;
	/** One-line invocation summary, e.g. ``bun run plan "<user intent>"``. */
	usage: string;
	/** One concrete example invocation. */
	example: string;
}

const HELP_FLAGS = new Set(['--help', '-h']);

/**
 * The spinner most recently created by {@link cliSpinner} and not yet stopped.
 *
 * `@clack/prompts` repaints a running spinner every 80ms by moving the cursor
 * up and erasing downward, which wipes out anything written beneath it — and
 * its `process.on('exit')` handler then stamps "Canceled" over the area. So an
 * error logged while a spinner is live is invisible: the user sees only
 * "Canceled" with no reason. {@link runCli} therefore routes the message
 * through the spinner itself whenever one is running.
 */
let activeSpinner: p.SpinnerResult | undefined;

/**
 * Create a `@clack/prompts` spinner that {@link runCli} can stop if the
 * command throws. Use this instead of calling `p.spinner()` directly in
 * `src/cli/*.ts`, otherwise a failure mid-spin loses its error message.
 *
 * Registration is tied to `start`/`stop` rather than to creation, because
 * these CLIs reuse a single spinner across several phases — registering once at
 * creation would leave every phase after the first unprotected.
 *
 * @returns A spinner that registers itself while running.
 */
export function cliSpinner(): p.SpinnerResult {
	const instance = p.spinner();
	const start = instance.start.bind(instance);
	const stop = instance.stop.bind(instance);

	instance.start = (msg?: string) => {
		activeSpinner = instance;
		start(msg);
	};

	instance.stop = (msg?: string) => {
		activeSpinner = undefined;
		stop(msg);
	};

	return instance;
}

/**
 * Print a command's usage block inside an opened `@clack/prompts` box. Leaves
 * the box open for the caller to close with `p.outro`.
 *
 * @param usage - The command's title, usage line, and example.
 */
function printUsage(usage: CliUsage): void {
	p.intro(usage.title);
	p.note(`${usage.usage}\n\nExample:\n  ${usage.example}`, 'USAGE');
}

/**
 * Run a CLI `main()` function. Handles `--help`/`-h` before any work happens,
 * logs uncaught errors through `@clack/prompts`, and exits with status 1.
 * Every `cli/*.ts` entry point should end with `runCli(main, USAGE);` instead
 * of hand-rolling its own `.catch(...)`.
 *
 * @param main - The CLI's entry point.
 * @param usage - Usage text for `--help`. Omit only for a command that takes
 *   no arguments at all.
 */
export function runCli(main: () => Promise<void>, usage?: CliUsage): void {
	if (usage && process.argv.slice(2).some((arg) => HELP_FLAGS.has(arg))) {
		printUsage(usage);
		p.outro('Asked for help — nothing was run.');
		process.exit(0);
	}

	main().catch((err: unknown) => {
		const message = err instanceof Error ? err.message : String(err);
		const spinner = activeSpinner;
		activeSpinner = undefined;

		if (spinner) {
			spinner.error(`Error: ${message}`);
		} else {
			p.log.error(`Error: ${message}`);
		}

		p.outro('Failed');
		process.exit(1);
	});
}

/**
 * Print a usage message for a bad invocation and exit with status 1. Call this
 * when a required argument is missing — or is a flag, since a bare flag in the
 * positional slot means the argument was never supplied — and also for an
 * out-of-range flag value or an unrecognized flag, overriding
 * {@link CliUsage.usage} with the specific complaint.
 *
 * @param usage - The same {@link CliUsage} passed to {@link runCli}, so the
 *   error and the `--help` screen stay identical.
 * @returns Never returns — always exits the process.
 */
export function printUsageAndExit(usage: CliUsage): never {
	printUsage(usage);
	p.outro('Invalid arguments');
	process.exit(1);
}
