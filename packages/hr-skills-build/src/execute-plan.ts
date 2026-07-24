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
 *   bun src/execute-plan.ts "create an onboarding checklist"
 *   bun src/execute-plan.ts "help with succession planning and talent development"
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import { generateExecutionPlan } from './planner.js';
import { buildRegistry } from './registry.js';
import { executeWorkflow } from './runtime.js';
import type { ExecutionStep, RuntimeContext } from './types.js';

/**
 * A stub step executor for CLI demonstration purposes. Real integrations
 * should replace this with logic that actually invokes the skill (for
 * example, loading its SKILL.md and prompting a model).
 */
const stubStepExecutor = (step: ExecutionStep, context: RuntimeContext): unknown => {
	return {
		skillId: step.skillId,
		note: `Stub output for ${step.skillId}`,
		precedingSteps: Object.keys(context.toObject()),
	};
};

async function main() {
	const intent = process.argv[2];

	if (!intent) {
		p.log.error('Usage: bun src/execute-plan.ts "<user intent>"');
		p.log.info('Example:');
		p.log.message(
			'  bun src/execute-plan.ts "Create interview questions for a senior manager"',
		);
		process.exit(1);
	}

	p.intro('Workflow Runtime');

	const spinner = p.spinner();

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

main().catch((err) => {
	p.log.error(`Error: ${err.message}`);
	process.exit(1);
});
