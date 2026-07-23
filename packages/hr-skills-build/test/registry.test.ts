import { describe, expect, it } from 'bun:test';
import * as v from 'valibot';

import { buildRegistry } from '../src/registry.js';
import { RegistrySchema } from '../src/schema.js';
import { validateRegistryConsistency } from '../src/validate-registry.js';

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
});

describe('validateRegistryConsistency()', () => {
	it('reports no errors when registry/skills.json is in sync', async () => {
		const errors: Array<{ skill: string; message: string }> = [];

		await validateRegistryConsistency(errors);

		expect(errors).toEqual([]);
	});
});
