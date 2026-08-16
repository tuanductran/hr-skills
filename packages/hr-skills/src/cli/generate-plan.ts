#!/usr/bin/env bun

/**
 * CLI: Generate an execution plan for a given intent.
 *
 * Usage:
 *   bun run plan "create an onboarding checklist"
 *   bun run plan "help with succession planning and talent development"
 */

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import {
	buildRegistry,
	generateExecutionPlan,
	suggestPlanImprovements,
	validateExecutionPlan,
} from 'hr-skills-build/server';
import { type CliUsage, cliSpinner, printUsageAndExit, runCli } from './cli-bootstrap.js';

const USAGE: CliUsage = {
	title: 'Execution Plan Generator',
	usage: 'bun run plan "<user intent>"',
	example: 'bun run plan "Create interview questions for a senior manager"',
};

async function main() {
	const intent = process.argv[2];

	// `startsWith('--')` matters as much as the empty check: without it,
	// `bun run plan --help` built the registry and generated a plan for the
	// literal intent "--help".
	if (!intent || intent.startsWith('--')) {
		printUsageAndExit(USAGE);
	}

	p.intro(USAGE.title);

	const spinner = cliSpinner();

	spinner.start('Building Skill Registry...');
	const registry = await buildRegistry();
	spinner.stop(`Registry ready (${registry.skillCount} skills)`);

	spinner.start(`Analyzing intent: "${intent}"`);
	const plan = generateExecutionPlan(intent, registry);
	spinner.stop('Plan generated');

	// Validate plan
	const validation = validateExecutionPlan(plan, registry);

	// Output plan details
	p.note(
		`  
Intent: ${plan.intent}  
Complexity: ${plan.complexity}  
Skills Selected: ${plan.steps.length}  
Summary: ${plan.summary}  
${plan.notes && plan.notes.length > 0 ? `Notes:\n${plan.notes.map((note) => `  • ${note}`).join('\n')}` : ''}  
  `,
		'EXECUTION PLAN',
	);

	// Capability matching
	p.note(
		plan.capabilityMatches
			.map((match) => {
				const status = match.isMatched ? '✓' : '✗';
				const matches =
					match.matches.length > 0
						? match.matches
								.map(
									(m, i) =>
										`   ${i + 1}. ${m.skillId} (${m.matchType}, score: ${m.score.toFixed(2)})\n      ${m.explanation}`,
								)
								.join('\n')
						: match.unmatchedReason || '';
				return `${status} "${match.capability}"\n${matches}`;
			})
			.join('\n\n'),
		'CAPABILITY MATCHING',
	);

	// Execution steps
	p.note(
		plan.steps.length === 0
			? '(No steps — plan is empty)'
			: plan.steps
					.map((step) => {
						const deps =
							step.dependencies.length > 0
								? `Dependencies: ${step.dependencies.join(', ')}`
								: '';
						return `[${step.order + 1}] ${step.skillId}  
     Reason: ${step.reason}  
     ${step.rationale ? `Rationale: ${step.rationale}` : ''}  
     ${deps}`;
					})
					.join('\n\n'),
		'EXECUTION STEPS',
	);

	// Validation results
	if (validation.isValid && validation.issues.length === 0) {
		p.log.success('Plan is valid with no issues');
	} else {
		for (const issue of validation.issues) {
			const icon =
				issue.severity === 'error'
					? '✗'
					: issue.severity === 'warning'
						? '⚠'
						: 'ℹ';
			p.log.message(`${icon} [${issue.severity.toUpperCase()}] ${issue.code}`);
			p.log.message(`   ${issue.message}`);
		}
	}

	const suggestions = suggestPlanImprovements(plan, registry);
	if (suggestions.length > 0) {
		p.note(suggestions.map((s) => `• ${s}`).join('\n'), 'IMPROVEMENT SUGGESTIONS');
	}

	// Save as JSON
	const outputPath = join(process.cwd(), 'execution-plan.json');
	writeFileSync(outputPath, JSON.stringify({ plan, validation, suggestions }, null, 2));

	p.log.success(`Execution plan saved to: ${outputPath}`);

	p.outro(validation.isValid ? 'Done' : 'Completed with issues');

	process.exit(validation.isValid ? 0 : 1);
}

runCli(main, USAGE);
