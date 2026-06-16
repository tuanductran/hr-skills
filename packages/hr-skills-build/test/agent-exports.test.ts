import { describe, expect, it } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { exportAgentSkills } from '../src/agent-exports.js';
import { AGENT_EXPORT_TARGETS } from '../src/agent-targets.js';
import { getHrSkills } from '../src/config.js';

const ROOT = join(import.meta.dir, '../../..');
const EXPORT_ROOT = join(ROOT, '.agent-exports');

describe('agent export targets', () => {
	it('supports the roadmap agent ecosystem targets', () => {
		expect(AGENT_EXPORT_TARGETS.map((target) => target.id).sort()).toEqual([
			'claude',
			'codex',
			'cursor',
			'gemini',
		]);
	});

	it('defines one output file per target', () => {
		for (const target of AGENT_EXPORT_TARGETS) {
			expect(target.filename.length).toBeGreaterThan(0);
			expect(target.description.length).toBeGreaterThan(20);
		}
	});

	it('generates deterministic compatibility exports', async () => {
		await exportAgentSkills();

		const firstManifest = await Bun.file(join(EXPORT_ROOT, 'manifest.json')).text();

		await exportAgentSkills();

		const secondManifest = await Bun.file(join(EXPORT_ROOT, 'manifest.json')).text();
		const manifest = JSON.parse(secondManifest);
		const skillNames = await getHrSkills();

		expect(secondManifest).toBe(firstManifest);
		expect(manifest.schemaVersion).toBe(1);
		expect(manifest.targets.map((target: { id: string }) => target.id)).toEqual(
			AGENT_EXPORT_TARGETS.map((target) => target.id),
		);
		expect(manifest.skills.map((skill: { name: string }) => skill.name)).toEqual(
			skillNames,
		);

		for (const skillName of skillNames) {
			const source = await readFile(
				join(ROOT, 'skills', skillName, 'SKILL.md'),
				'utf8',
			);
			const claude = await readFile(
				join(EXPORT_ROOT, 'claude', skillName, 'SKILL.md'),
				'utf8',
			);
			const codex = await readFile(
				join(EXPORT_ROOT, 'codex', skillName, 'AGENTS.md'),
				'utf8',
			);
			const cursor = await readFile(
				join(EXPORT_ROOT, 'cursor', skillName, 'rule.mdc'),
				'utf8',
			);
			const gemini = await readFile(
				join(EXPORT_ROOT, 'gemini', skillName, 'GEMINI.md'),
				'utf8',
			);

			expect(claude).toBe(`${source.trim()}\n`);
			expect(codex).toStartWith(`# ${skillName} Codex instructions\n`);
			expect(codex).not.toStartWith('---\n');
			expect(cursor).toStartWith('---\ndescription: ');
			expect(cursor).toContain('\nalwaysApply: false\n---\n');
			expect(gemini).toStartWith(`# ${skillName} Gemini instructions\n`);
			expect(gemini).not.toStartWith('---\n');
		}
	});
});
