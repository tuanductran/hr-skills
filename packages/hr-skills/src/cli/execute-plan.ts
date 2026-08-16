#!/usr/bin/env bun

/**
 * CLI: Generate an execution plan for a given intent and run it through the
 * Workflow Runtime (Phase 4.3).
 *
 * This CLI uses a stub step executor — it does not call any model or invoke
 * real skill content. Its purpose is to demonstrate and smoke-test the
 * Runtime's sequencing, context propagation, retries, events, and tracing
 * against a real plan produced by the Planner. Callers embedding the Runtime
 * in an actual agent should supply their own `StepExecutorFn`.
 *
 * Usage:
 *   bun run execute "create an onboarding checklist"
 *   bun run execute "help with succession planning and talent development"
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import {
	buildRegistry,
	executeWorkflow,
	generateExecutionPlan,
	stubStepExecutor,
} from 'hr-skills-build/server';
import { type CliUsage, cliSpinner, printUsageAndExit, runCli } from './cli-bootstrap.js';

const USAGE: CliUsage = {
	title: 'Workflow Runtime',
	usage: 'bun run execute "<user intent>"',
	example: 'bun run execute "Create interview questions for a senior manager"',
};

async function main() {
	const intent = process.argv[2];

	// `startsWith('--')` matters as much as the empty check: without it,
	// `bun run execute --help` built the registry and ran the runtime against
	// the literal intent "--help".
	if (!intent || intent.startsWith('--')) {
		printUsageAndExit(USAGE);
	}

	p.intro(USAGE.title);

	const spinner = cliSpinner();

	spinner.start('Building Skill Registry...');
	const registry = await buildRegistry();
	spinner.stop(`Registry ready (${registry.skillCount} skills)`);

	spinner.start(`Generating plan for: "${intent}"`);
	const plan = generateExecutionPlan(intent, registry);
	spinner.stop(
		`Plan generated (${plan.steps.length} step${plan.steps.length === 1 ? '' : 's'})`,
	);

	if (plan.steps.length === 0) {
		p.log.warn('Plan has no steps — nothing to execute.');
		p.outro('Done');
		process.exit(0);
	}

	spinner.start('Executing workflow...');
	const result = await executeWorkflow(plan, stubStepExecutor);
	spinner.stop(`Execution ${result.status}`);

	p.note(
		result.steps
			.map((step) => {
				const icon =
					step.status === 'completed'
						? '✓'
						: step.status === 'failed'
							? '✗'
							: '○';
				return `${icon} [${step.status}] ${step.skillId} (attempts: ${step.attempts})`;
			})
			.join('\n'),
		'STEP RESULTS',
	);

	p.note(
		result.events
			.map(
				(event) =>
					`[${event.order}] ${event.type}${event.skillId ? ` — ${event.skillId}` : ''}`,
			)
			.join('\n'),
		'EVENTS',
	);

	const outputPath = join(process.cwd(), 'execution-result.json');
	writeFileSync(outputPath, JSON.stringify(result, null, 2));
	p.log.success(`Execution result saved to: ${outputPath}`);

	p.outro(result.status === 'completed' ? 'Done' : 'Completed with failures');

	process.exit(result.status === 'completed' ? 0 : 1);
}

runCli(main, USAGE);
