/**
 * Registry access for the bot.
 *
 * The bot never parses `SKILL.md` files or rebuilds the registry itself —
 * it reads the committed `registry/skills.json` artifact (the same one
 * `apps/web` consumes) and reuses `hr-skills-build`'s own search and
 * recommendation logic, so ranking behavior stays identical everywhere.
 */

import { join } from 'node:path';
import type { ExecutionPlan, Registry, RegistryEntry } from 'hr-skills-build/client';
import {
	generateExecutionPlan,
	getRecommendations,
	searchSkills,
} from 'hr-skills-build/client';
import { ROOT_DIR } from 'hr-skills-ref/server';

const REGISTRY_PATH = join(ROOT_DIR, 'registry', 'skills.json');

let cachedRegistry: Registry | undefined;

/**
 * Load `registry/skills.json` once and cache it in memory for the life of
 * the process. The registry only changes on redeploy (`bun run registry`
 * runs in CI, not at bot runtime), so re-reading it per-interaction would
 * be wasted I/O.
 */
export async function loadRegistry(): Promise<Registry> {
	if (cachedRegistry) return cachedRegistry;

	const file = Bun.file(REGISTRY_PATH);

	if (!(await file.exists())) {
		throw new Error(
			`Registry not found at ${REGISTRY_PATH}. Run "bun run registry" at the repo root first.`,
		);
	}

	cachedRegistry = (await file.json()) as Registry;
	return cachedRegistry;
}

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

export type { ExecutionPlan, Registry, RegistryEntry };
export { generateExecutionPlan, getRecommendations, searchSkills };
