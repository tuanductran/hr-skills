import { describe, expect, it } from 'bun:test';
import { buildSkillDocsSection } from '../src/sync.js';

const baseMeta = {
	name: 'hr-test',
	description: 'desc',
	coverage: 'help hr teams with testing sync behavior',
	shortSummary: 'summary',
	scopeSentence: 'Help hr teams with testing sync behavior.',
	supportedTasks: ['Task 1'],
};

describe('buildSkillDocsSection', () => {
	it('skips section when no trigger phrases are available', () => {
		const section = buildSkillDocsSection({
			...baseMeta,
			triggerPhrases: [],
		});

		expect(section).toBeNull();
	});

	it('never emits the legacy placeholder trigger line', () => {
		const section = buildSkillDocsSection({
			...baseMeta,
			triggerPhrases: ['Write a PIP for [employee_name]'],
		});

		expect(section).not.toBeNull();
		expect(section).not.toContain('- [Add trigger phrases here]');
		expect(section).toContain('- "Write a PIP for [employee_name]"');
	});
});
