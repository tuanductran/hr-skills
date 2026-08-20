import { describe, expect, test } from 'bun:test';
import { defaultCvDraft, reviewFlags, toMarkdown } from './index';

describe('hr-cv schema helpers', () => {
	test('provides a valid starter CV', () => {
		expect(defaultCvDraft.fullName).toBeTruthy();
		expect(defaultCvDraft.experience.length).toBeGreaterThan(0);
		expect(defaultCvDraft.sectionOrder).toContain('experience');
	});

	test('flags incomplete profile language', () => {
		const flags = reviewFlags({ ...defaultCvDraft, summary: '', skills: [] });
		expect(flags.map((flag) => flag.code)).toEqual(
			expect.arrayContaining(['short-summary', 'few-skills']),
		);
	});

	test('exports readable markdown', () => {
		const markdown = toMarkdown(defaultCvDraft);
		expect(markdown).toContain('# Alex Morgan');
		expect(markdown).toContain('## Experience');
		expect(markdown).toContain('## Skills');
	});
});
