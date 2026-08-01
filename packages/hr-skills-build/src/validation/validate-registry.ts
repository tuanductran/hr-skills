import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as v from 'valibot';
import { buildRegistry, loadRelevanceSignalTable } from '../registry/registry.js';
import type { RelevanceSignalTable } from '../search/relevance-signals.js';
import { ROOT_DIR } from '../shared/constants.js';
import { RegistrySchema } from '../shared/schema.js';
import type { RegistryEntry, SkillValidationIssue } from '../shared/types.js';

const REGISTRY_PATH = join(ROOT_DIR, 'registry', 'skills.json');

/**
 * A signal is "high evidence" — strong enough that its absence from
 * `relatedSkills` is worth flagging — when the co-selection rate is at
 * least this high AND it's backed by more than a single observation (a
 * lone co-occurrence is not enough to call a pattern, however high its
 * rate looks as a 1/1 ratio).
 */
const HIGH_EVIDENCE_CO_SELECTION_RATE = 0.5;
const HIGH_EVIDENCE_MIN_OBSERVATIONS = 2;

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
	// Must load the same relevance signal table generate-registry.ts uses
	// (Phase 6.1-B) — otherwise a signal-blended committed registry would
	// always look "stale" against a signal-free recomputation here.
	const signalTable = await loadRelevanceSignalTable();
	const expected = await buildRegistry(signalTable);

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

/**
 * Warn when a high-evidence usage-informed relevance signal (Phase 6.1) is
 * absent from a skill's `relatedSkills` list — Phase 6.1-B's second
 * deliverable.
 *
 * This is deliberately a warning, not an error: `reRankRelatedSkills()`
 * already tends to surface high-evidence pairs (see relevance-signals.ts),
 * so a miss here usually means a skill already has `limit` (5) higher-
 * scored entries crowding it out — worth a maintainer's attention, not a
 * build failure. Follows the same `(input, warnings)` shape as
 * `detectDuplicates()` and `validateSemanticConsistency()` so `validate.ts`
 * can run all three concurrently in its warnings group.
 *
 * A signal counts as "high evidence" when its `coSelectionRate` is at
 * least {@link HIGH_EVIDENCE_CO_SELECTION_RATE} AND it's backed by at
 * least {@link HIGH_EVIDENCE_MIN_OBSERVATIONS} observations — see the
 * constants' doc comments for the rationale.
 *
 * @param registry - The registry to check (already-built or loaded).
 * @param signalTable - The relevance signal table to check against, or
 *   `undefined` if none is available — in which case this is a no-op
 *   (nothing to warn about without evidence).
 * @param warnings - Warnings array to append to (mutated in place).
 */
export function validateRelatedSkillsAgainstSignals(
	registry: { skills: ReadonlyArray<Pick<RegistryEntry, 'id' | 'relatedSkills'>> },
	signalTable: RelevanceSignalTable | undefined,
	warnings: SkillValidationIssue[],
): void {
	if (!signalTable) return;

	const byId = new Map(registry.skills.map((entry) => [entry.id, entry]));

	for (const signal of signalTable.signals) {
		if (signal.coSelectionRate < HIGH_EVIDENCE_CO_SELECTION_RATE) continue;
		if (signal.observedCount < HIGH_EVIDENCE_MIN_OBSERVATIONS) continue;

		const source = byId.get(signal.sourceSkill);
		if (!source) continue; // dangling signal reference — registry consistency already flags this class of issue elsewhere

		if (!source.relatedSkills.includes(signal.targetSkill)) {
			warnings.push({
				skill: signal.sourceSkill,
				message: `High-evidence usage signal (${Math.round(signal.coSelectionRate * 100)}% co-selection across ${signal.observedCount} observations) with "${signal.targetSkill}" is not reflected in relatedSkills`,
			});
		}
	}
}
