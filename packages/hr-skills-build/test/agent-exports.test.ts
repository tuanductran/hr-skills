import { describe, expect, it } from 'bun:test';
import { AGENT_EXPORT_TARGETS } from '../src/agent-targets.js';

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
});
