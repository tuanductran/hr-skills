import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as v from 'valibot';

import { ROOT_DIR } from './constants.js';
import { buildRegistry } from './registry.js';
import { RegistrySchema } from './schema.js';
import type { RegistryEntry, SkillValidationIssue } from './types.js';

const REGISTRY_PATH = join(ROOT_DIR, 'registry', 'skills.json');

/**
 * Detect a cycle in the dependency graph starting from `startId`, using
 * iterative DFS with an explicit stack (safe for large graphs, no recursion
 * depth limit).
 */
function hasCycleFrom(
	startId: string,
	byId: ReadonlyMap<string, RegistryEntry>,
): boolean {
	const visiting = new Set<string>();
	const visited = new Set<string>();

	const stack: Array<{ id: string; depsIndex: number }> = [
		{ id: startId, depsIndex: 0 },
	];
	visiting.add(startId);

	while (stack.length > 0) {
		const frame = stack.at(-1);
		if (!frame) break;

		const entry = byId.get(frame.id);
		const deps = entry?.dependencies ?? [];

		if (frame.depsIndex >= deps.length) {
			visiting.delete(frame.id);
			visited.add(frame.id);
			stack.pop();
			continue;
		}

		const nextId = deps[frame.depsIndex];
		frame.depsIndex += 1;

		if (!nextId || visited.has(nextId)) continue;

		if (visiting.has(nextId)) return true;

		visiting.add(nextId);
		stack.push({ id: nextId, depsIndex: 0 });
	}

	return false;
}

/**
 * Validate the Skill Registry: schema conformance, staleness against the
 * current filesystem, duplicate IDs, dangling relationship references, and
 * dependency cycles.
 *
 * Mirrors the pattern already used for marketplace.json / router consistency
 * in validate.ts — recompute the expected artifact in memory and compare,
 * rather than trusting the committed file blindly.
 */
export async function validateRegistryConsistency(
	errors: SkillValidationIssue[],
): Promise<void> {
	let raw: string;

	try {
		raw = await readFile(REGISTRY_PATH, 'utf8');
	} catch {
		errors.push({
			skill: '(registry)',
			message: 'registry/skills.json not found — run "bun run registry"',
		});
		return;
	}

	let parsedJson: unknown;

	try {
		parsedJson = JSON.parse(raw);
	} catch {
		errors.push({
			skill: '(registry)',
			message: 'registry/skills.json is not valid JSON',
		});
		return;
	}

	const result = v.safeParse(RegistrySchema, parsedJson);

	if (!result.success) {
		errors.push({
			skill: '(registry)',
			message: `registry/skills.json does not match the expected schema: ${result.issues
				.map((issue) => issue.message)
				.join('; ')}`,
		});
		return;
	}

	const registry = result.output;

	// --- Staleness check: does the committed file match what we'd generate now? ---
	const expected = await buildRegistry();

	const expectedForCompare = { ...expected, generatedAt: registry.generatedAt };
	const onDiskForCompare = { ...registry };

	if (JSON.stringify(expectedForCompare) !== JSON.stringify(onDiskForCompare)) {
		errors.push({
			skill: '(registry)',
			message:
				'registry/skills.json is stale relative to skills/ — run "bun run registry" and commit the result',
		});
	}

	// --- Duplicate IDs ---
	const seen = new Set<string>();
	for (const entry of registry.skills) {
		if (seen.has(entry.id)) {
			errors.push({ skill: entry.id, message: 'Duplicate skill ID in registry' });
		}
		seen.add(entry.id);
	}

	const byId = new Map(
		registry.skills.map((entry) => [entry.id, entry as RegistryEntry]),
	);

	// --- Dangling references (dependencies, relatedSkills) ---
	for (const entry of registry.skills) {
		for (const depId of entry.dependencies) {
			if (!byId.has(depId)) {
				errors.push({
					skill: entry.id,
					message: `Dependency "${depId}" does not reference a known skill`,
				});
			}
		}

		for (const relatedId of entry.relatedSkills) {
			if (!byId.has(relatedId)) {
				errors.push({
					skill: entry.id,
					message: `Related skill "${relatedId}" does not reference a known skill`,
				});
			}
		}
	}

	// --- Circular dependencies ---
	for (const entry of registry.skills) {
		if (hasCycleFrom(entry.id, byId)) {
			errors.push({
				skill: entry.id,
				message: 'Circular dependency detected in registry dependency graph',
			});
		}
	}
}
