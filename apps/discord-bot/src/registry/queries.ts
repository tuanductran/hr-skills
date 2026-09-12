/**
 * Pure, in-memory lookups over an already-loaded registry. These reuse
 * `hr-skills-build`'s own search and recommendation logic where possible so
 * ranking behavior stays identical everywhere; this file only adds the small
 * bot-specific lookups (by id/alias, random pick, autocomplete) that the
 * shared package doesn't need to expose.
 */

import type { Registry, RegistryEntry } from 'hr-skills-build/client';

export function findSkillById(registry: Registry, id: string): RegistryEntry | undefined {
	return registry.skills.find((skill) => skill.id === id || skill.aliases.includes(id));
}

export function pickRandomSkill(registry: Registry): RegistryEntry {
	const { skills } = registry;
	if (!skills || skills.length === 0) {
		throw new Error('Skill registry is empty.');
	}
	const index = Math.floor(Math.random() * skills.length);
	// biome-ignore lint/style/noNonNullAssertion: index is in bounds
	return skills[index]!;
}

export function autocompleteSkills(
	registry: Registry,
	query: string,
	limit = 25,
): Array<{ name: string; value: string }> {
	const normalized = query.trim().toLowerCase();
	if (!normalized) {
		return registry.skills.slice(0, limit).map((s) => ({
			name: `${s.name} (${s.id})`,
			value: s.id,
		}));
	}

	const matches = registry.skills.filter(
		(s) =>
			s.id.toLowerCase().includes(normalized) ||
			s.name.toLowerCase().includes(normalized) ||
			s.aliases.some((a) => a.toLowerCase().includes(normalized)),
	);

	return matches.slice(0, limit).map((s) => ({
		name: `${s.name} (${s.id})`,
		value: s.id,
	}));
}
