import type {
	DocumentationData,
	DocumentationDomain,
	DocumentationSkill,
	Registry,
} from 'hr-skills-build/client';

export type HrSkill = DocumentationSkill;
export type HrSkillSummary = Omit<HrSkill, 'content' | 'prompts' | 'examples'>;
export type HrDomain = DocumentationDomain;
export interface HrSkillsSnapshot extends Omit<DocumentationData, 'skills'> {
	skills: readonly HrSkillSummary[];
}

const registryCache = new WeakMap<HrSkillsSnapshot, Registry>();

export function toRegistry(snapshot: HrSkillsSnapshot): Registry {
	const cached = registryCache.get(snapshot);
	if (cached) return cached;
	const registry: Registry = {
		schemaVersion: snapshot.schemaVersion,
		generatedAt: snapshot.generatedAt,
		skillCount: snapshot.skillCount,
		skills: [...snapshot.skills] as unknown as Registry['skills'],
	};
	registryCache.set(snapshot, registry);
	return registry;
}
