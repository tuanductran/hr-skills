import { describe, expect, it, beforeEach, afterEach } from 'bun:test';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import * as v from 'valibot';

import {
	buildRegistry,
	loadRelevanceSignalTable,
} from '../../src/registry/registry.js';
import type { RelevanceSignalTable } from '../../src/search/relevance-signals.js';
import { RELEVANCE_SIGNAL_SCHEMA_VERSION } from '../../src/search/relevance-signals.js';
import { RegistrySchema } from '../../src/shared/schema.js';
import type { SkillValidationIssue } from '../../src/shared/types.js';
import {
	validateRegistryConsistency,
	validateRelatedSkillsAgainstSignals,
} from '../../src/validation/validate-registry.js';

describe('buildRegistry()', () => {
	it('produces a registry that conforms to RegistrySchema', async () => {
		const registry = await buildRegistry();
		const result = v.safeParse(RegistrySchema, registry);

		expect(registry.schemaVersion).toBe(1);
		expect(registry.skillCount).toBe(registry.skills.length);
		expect(registry.skills.length).toBeGreaterThan(0);
		expect(result.success).toBe(true);
	});

	it('produces sorted, unique skill IDs', async () => {
		const registry = await buildRegistry();
		const ids = registry.skills.map((s) => s.id);
		const sorted = [...ids].sort((a, b) => a.localeCompare(b));

		expect(ids).toEqual(sorted);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('assigns every skill a known domain and a tier consistent with its paths', async () => {
		const registry = await buildRegistry();

		for (const skill of registry.skills) {
			expect(skill.domain).toBeTruthy();

			const subDirCount = [
				skill.paths.content,
				skill.paths.prompts,
				skill.paths.examples,
			].filter(Boolean).length;

			if (subDirCount === 3) expect(skill.tier).toBe('full');
			else if (subDirCount === 0) expect(skill.tier).toBe('bare');
			else expect(skill.tier).toBe('partial');
		}
	});

	it('only references known skill IDs in dependencies and relatedSkills', async () => {
		const registry = await buildRegistry();
		const ids = new Set(registry.skills.map((s) => s.id));

		for (const skill of registry.skills) {
			for (const dep of skill.dependencies) expect(ids.has(dep)).toBe(true);
			for (const related of skill.relatedSkills)
				expect(ids.has(related)).toBe(true);
			// A skill should never depend on or "relate to" itself.
			expect(skill.dependencies).not.toContain(skill.id);
			expect(skill.relatedSkills).not.toContain(skill.id);
		}
	});

	it('extracts technical-hiring dependencies from the classifier preamble', async () => {
		const registry = await buildRegistry();
		const technical = registry.skills.find((s) => s.id === 'hr-frontend');

		expect(technical).toBeDefined();
		expect(technical?.dependencies.length).toBeGreaterThan(0);
		expect(technical?.dependencies).toContain('hr-recruiting');
	});

	it('is deterministic across repeated builds (ignoring generatedAt)', async () => {
		const first = await buildRegistry();
		const second = await buildRegistry();

		const strip = (r: typeof first) => ({ ...r, generatedAt: '' });

		expect(JSON.stringify(strip(first))).toBe(JSON.stringify(strip(second)));
	});

	// -------------------------------------------------------------------
	// Phase 6.1-B — signal-augmented generation
	// -------------------------------------------------------------------

	it('with no signal table, produces the same relatedSkills as the explicit no-arg call', async () => {
		const withUndefined = await buildRegistry(undefined);
		const withNoArg = await buildRegistry();

		const strip = (r: typeof withUndefined) => ({ ...r, generatedAt: '' });
		expect(JSON.stringify(strip(withUndefined))).toBe(JSON.stringify(strip(withNoArg)));
	});

	it('blends in a signal-only pair that was absent from the static ranking', async () => {
		const baseline = await buildRegistry();
		const source = baseline.skills.find((s) => s.relatedSkills.length > 0);
		expect(source).toBeDefined();
		if (!source) return;

		// Pick any skill NOT already in the static relatedSkills list (and not
		// itself) to act as a strong, evidence-only target.
		const target = baseline.skills.find(
			(s) => s.id !== source.id && !source.relatedSkills.includes(s.id),
		);
		expect(target).toBeDefined();
		if (!target) return;

		const signalTable: RelevanceSignalTable = {
			schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
			generatedAt: '2026-01-01',
			sourceDatasets: ['test-fixture'],
			totalObservations: 10,
			signals: [
				{
					sourceSkill: source.id,
					targetSkill: target.id,
					coSelectionRate: 1,
					coSelectionCount: 10,
					observedCount: 10,
				},
			],
		};

		const blended = await buildRegistry(signalTable);
		const blendedSource = blended.skills.find((s) => s.id === source.id);

		// A coSelectionRate of 1.0 dominates the blend formula
		// (score = static*(1-0.3) + observed*0.3), so the evidence-only
		// target should now appear — and rank first, since 1*0.3 = 0.3 beats
		// even the top static item's (1)*(0.7) = 0.7... actually the static
		// top item still wins on raw score, so just assert presence, not rank,
		// to avoid over-asserting the exact blend formula here (that's
		// relevance-signals.test.ts's job).
		expect(blendedSource?.relatedSkills).toContain(target.id);
	});

	it('does not affect skills with no matching signals', async () => {
		const baseline = await buildRegistry();
		const untouchedId = baseline.skills.find((s) => s.id !== 'hr-onboarding')?.id;
		expect(untouchedId).toBeDefined();

		const signalTable: RelevanceSignalTable = {
			schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
			generatedAt: '2026-01-01',
			sourceDatasets: ['test-fixture'],
			totalObservations: 1,
			signals: [
				{
					sourceSkill: 'hr-onboarding',
					targetSkill: 'hr-offboarding',
					coSelectionRate: 1,
					coSelectionCount: 1,
					observedCount: 1,
				},
			],
		};

		const blended = await buildRegistry(signalTable);

		const baselineUntouched = baseline.skills.find((s) => s.id === untouchedId);
		const blendedUntouched = blended.skills.find((s) => s.id === untouchedId);

		expect(blendedUntouched?.relatedSkills).toEqual(baselineUntouched?.relatedSkills);
	});
});

describe('loadRelevanceSignalTable()', () => {
	let tmpDir: string;

	beforeEach(async () => {
		tmpDir = await mkdtemp(join(tmpdir(), 'relevance-signals-test-'));
	});

	afterEach(async () => {
		await rm(tmpDir, { recursive: true, force: true });
	});

	it('returns undefined when the file does not exist', async () => {
		const result = await loadRelevanceSignalTable(join(tmpDir, 'does-not-exist.json'));
		expect(result).toBeUndefined();
	});

	it('returns undefined for invalid JSON', async () => {
		const path = join(tmpDir, 'invalid.json');
		await writeFile(path, '{ not valid json', 'utf8');

		const result = await loadRelevanceSignalTable(path);
		expect(result).toBeUndefined();
	});

	it('returns undefined for a mismatched schemaVersion', async () => {
		const path = join(tmpDir, 'wrong-version.json');
		await writeFile(
			path,
			JSON.stringify({ schemaVersion: 999, signals: [] }),
			'utf8',
		);

		const result = await loadRelevanceSignalTable(path);
		expect(result).toBeUndefined();
	});

	it('returns undefined when signals is missing or not an array', async () => {
		const path = join(tmpDir, 'no-signals.json');
		await writeFile(
			path,
			JSON.stringify({ schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION }),
			'utf8',
		);

		const result = await loadRelevanceSignalTable(path);
		expect(result).toBeUndefined();
	});

	it('loads a valid signal table', async () => {
		const path = join(tmpDir, 'valid.json');
		const table: RelevanceSignalTable = {
			schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
			generatedAt: '2026-01-01',
			sourceDatasets: ['test-fixture'],
			totalObservations: 1,
			signals: [
				{
					sourceSkill: 'hr-a',
					targetSkill: 'hr-b',
					coSelectionRate: 1,
					coSelectionCount: 1,
					observedCount: 1,
				},
			],
		};
		await writeFile(path, JSON.stringify(table), 'utf8');

		const result = await loadRelevanceSignalTable(path);
		expect(result).toEqual(table);
	});
});

describe('validateRegistryConsistency()', () => {
	it('reports no errors when registry/skills.json is in sync', async () => {
		const errors: Array<{ skill: string; message: string }> = [];

		await validateRegistryConsistency(errors);

		expect(errors).toEqual([]);
	});
});

describe('validateRelatedSkillsAgainstSignals()', () => {
	function fixtureRegistry(skills: Array<{ id: string; relatedSkills: string[] }>) {
		return { skills };
	}

	it('is a no-op when there is no signal table', () => {
		const warnings: SkillValidationIssue[] = [];
		validateRelatedSkillsAgainstSignals(
			fixtureRegistry([{ id: 'hr-a', relatedSkills: [] }]),
			undefined,
			warnings,
		);
		expect(warnings).toEqual([]);
	});

	it('warns when a high-evidence signal is absent from relatedSkills', () => {
		const warnings: SkillValidationIssue[] = [];
		const signalTable: RelevanceSignalTable = {
			schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
			generatedAt: '2026-01-01',
			sourceDatasets: ['test-fixture'],
			totalObservations: 2,
			signals: [
				{
					sourceSkill: 'hr-a',
					targetSkill: 'hr-b',
					coSelectionRate: 1,
					coSelectionCount: 2,
					observedCount: 2,
				},
			],
		};

		validateRelatedSkillsAgainstSignals(
			fixtureRegistry([
				{ id: 'hr-a', relatedSkills: ['hr-c'] },
				{ id: 'hr-b', relatedSkills: [] },
			]),
			signalTable,
			warnings,
		);

		expect(warnings).toHaveLength(1);
		expect(warnings[0]?.skill).toBe('hr-a');
		expect(warnings[0]?.message).toContain('hr-b');
	});

	it('does not warn when the signal is already reflected in relatedSkills', () => {
		const warnings: SkillValidationIssue[] = [];
		const signalTable: RelevanceSignalTable = {
			schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
			generatedAt: '2026-01-01',
			sourceDatasets: ['test-fixture'],
			totalObservations: 2,
			signals: [
				{
					sourceSkill: 'hr-a',
					targetSkill: 'hr-b',
					coSelectionRate: 1,
					coSelectionCount: 2,
					observedCount: 2,
				},
			],
		};

		validateRelatedSkillsAgainstSignals(
			fixtureRegistry([{ id: 'hr-a', relatedSkills: ['hr-b'] }]),
			signalTable,
			warnings,
		);

		expect(warnings).toEqual([]);
	});

	it('does not warn below the co-selection rate threshold', () => {
		const warnings: SkillValidationIssue[] = [];
		const signalTable: RelevanceSignalTable = {
			schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
			generatedAt: '2026-01-01',
			sourceDatasets: ['test-fixture'],
			totalObservations: 4,
			signals: [
				{
					sourceSkill: 'hr-a',
					targetSkill: 'hr-b',
					coSelectionRate: 0.25,
					coSelectionCount: 1,
					observedCount: 4,
				},
			],
		};

		validateRelatedSkillsAgainstSignals(
			fixtureRegistry([{ id: 'hr-a', relatedSkills: [] }]),
			signalTable,
			warnings,
		);

		expect(warnings).toEqual([]);
	});

	it('does not warn on a single-observation signal, even at 100% rate', () => {
		const warnings: SkillValidationIssue[] = [];
		const signalTable: RelevanceSignalTable = {
			schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
			generatedAt: '2026-01-01',
			sourceDatasets: ['test-fixture'],
			totalObservations: 1,
			signals: [
				{
					sourceSkill: 'hr-a',
					targetSkill: 'hr-b',
					coSelectionRate: 1,
					coSelectionCount: 1,
					observedCount: 1,
				},
			],
		};

		validateRelatedSkillsAgainstSignals(
			fixtureRegistry([{ id: 'hr-a', relatedSkills: [] }]),
			signalTable,
			warnings,
		);

		expect(warnings).toEqual([]);
	});

	it('skips signals whose sourceSkill is not in the registry (dangling reference)', () => {
		const warnings: SkillValidationIssue[] = [];
		const signalTable: RelevanceSignalTable = {
			schemaVersion: RELEVANCE_SIGNAL_SCHEMA_VERSION,
			generatedAt: '2026-01-01',
			sourceDatasets: ['test-fixture'],
			totalObservations: 2,
			signals: [
				{
					sourceSkill: 'hr-does-not-exist',
					targetSkill: 'hr-b',
					coSelectionRate: 1,
					coSelectionCount: 2,
					observedCount: 2,
				},
			],
		};

		validateRelatedSkillsAgainstSignals(
			fixtureRegistry([{ id: 'hr-a', relatedSkills: [] }]),
			signalTable,
			warnings,
		);

		expect(warnings).toEqual([]);
	});
});
