#!/usr/bin/env bun

/**
 * CLI: Get "skills you might also need" recommendations for a given skill ID.
 *
 * Usage:
 *   bun src/recommend.ts hr-onboarding
 *   bun src/recommend.ts hr-onboarding --limit 3
 */

import * as p from '@clack/prompts';
import { buildRegistry, loadRelevanceSignalTable } from '../registry/registry.js';
import { getRecommendations, UnknownSkillError } from '../search/recommendations.js';

async function main() {
	const skillId = process.argv[2];

	if (!skillId) {
		p.log.error('Usage: bun src/recommend.ts <skill-id> [--limit N]');
		p.log.info('Example:');
		p.log.message('  bun src/recommend.ts hr-onboarding');
		process.exit(1);
	}

	const limitFlagIndex = process.argv.indexOf('--limit');
	const limit =
		limitFlagIndex !== -1 ? Number(process.argv[limitFlagIndex + 1]) : undefined;

	p.intro('Skill Recommendations');

	const spinner = p.spinner();
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

	try {
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
	} catch (error) {
		if (error instanceof UnknownSkillError) {
			p.log.error(error.message);
			process.exit(1);
		}
		throw error;
	}
}

main().catch((err) => {
	p.log.error(`Error: ${err.message}`);
	process.exit(1);
});
