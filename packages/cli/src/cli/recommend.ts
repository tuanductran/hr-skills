#!/usr/bin/env bun

/**
 * CLI: Get "skills you might also need" recommendations for a given skill ID.
 *
 * Usage:
 *   bun run recommend hr-onboarding
 *   bun run recommend hr-onboarding --limit 3
 */

import * as p from '@clack/prompts';
import {
	buildRegistry,
	loadRelevanceSignalTable,
} from '../../../hr-skills-build/src/registry/registry.js';
import { getRecommendations } from '../../../hr-skills-build/src/search/recommendations.js';
import { type CliUsage, cliSpinner, printUsageAndExit, runCli } from './cli-bootstrap.js';

const USAGE: CliUsage = {
	title: 'Skill Recommendations',
	usage: 'bun run recommend <skill-id> [--limit N]',
	example: 'bun run recommend hr-onboarding',
};

async function main() {
	const skillId = process.argv[2];

	// `startsWith('--')` matters as much as the empty check: without it,
	// `bun run recommend --limit 3` spent a full registry build before failing
	// with `Unknown skill ID: "--limit"`.
	if (!skillId || skillId.startsWith('--')) {
		printUsageAndExit(USAGE);
	}

	const limitFlagIndex = process.argv.indexOf('--limit');
	const limit =
		limitFlagIndex !== -1 ? Number(process.argv[limitFlagIndex + 1]) : undefined;

	// `--limit 0` and `--limit abc` used to reach getRecommendations() as 0/NaN,
	// where `slice(0, limit)` returned nothing and the CLI reported "No
	// recommendations available for <skill>" — blaming the skill for a bad flag.
	if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) {
		printUsageAndExit({
			...USAGE,
			usage: '--limit must be a positive integer',
		});
	}

	p.intro(USAGE.title);

	const spinner = cliSpinner();
	spinner.start('Building Skill Registry...');
	// Load the same usage-informed relevance signal table generate-registry.ts
	// uses (Phase 6.1-B/C), so ad-hoc recommendations here match what's
	// actually committed to registry/skills.json instead of silently
	// falling back to static tag-overlap-only ranking.
	const signalTable = await loadRelevanceSignalTable();
	const registry = await buildRegistry(signalTable);
	spinner.stop(
		signalTable
			? `Registry ready (${registry.skillCount} skills, signal-blended relatedSkills)`
			: `Registry ready (${registry.skillCount} skills)`,
	);

	// An UnknownSkillError propagates to runCli, which reports it and closes the
	// clack box — the local catch that used to live here logged the message and
	// exited without an outro, leaving the box unterminated.
	const result = getRecommendations(skillId, registry, limit);

	if (result.recommendations.length === 0) {
		p.log.warn(`No recommendations available for "${skillId}"`);
	} else {
		p.note(
			result.recommendations
				.map(
					(rec) =>
						`${rec.rank}. ${rec.id} (${rec.domain})\n   ${rec.description}`,
				)
				.join('\n\n'),
			`RECOMMENDATIONS FOR ${result.skillId}`,
		);
	}

	p.outro('Done');
}

runCli(main, USAGE);
