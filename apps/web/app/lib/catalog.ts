import 'server-only';

import type { Registry } from 'hr-skills-build/client';
import { buildRegistry } from 'hr-skills-build/server';

const domainLabels = {
	'talent-acquisition': 'Talent acquisition',
	'onboarding-offboarding': 'People operations',
	'workforce-analytics': 'HR analytics',
	'learning-development': 'Learning & development',
	'compensation-rewards': 'Compensation & benefits',
	'hr-technology-ai': 'HR technology',
} as const;

export type CatalogDomain = keyof typeof domainLabels;

export interface CatalogData {
	readonly registry: Registry;
	readonly skillCount: number;
	readonly domainCount: number;
	readonly domainCounts: Readonly<Record<string, number>>;
}

export async function getCatalogData(): Promise<CatalogData> {
	const registry = await buildRegistry();
	const domainCounts: Record<string, number> = {};

	for (const skill of registry.skills) {
		domainCounts[skill.domain] = (domainCounts[skill.domain] ?? 0) + 1;
	}

	return {
		registry,
		skillCount: registry.skills.length,
		domainCount: new Set(registry.skills.map((skill) => skill.domain)).size,
		domainCounts,
	};
}

export function getDomainLabel(domain: CatalogDomain): string {
	return domainLabels[domain];
}
