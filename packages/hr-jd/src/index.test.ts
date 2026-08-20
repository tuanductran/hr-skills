import { describe, expect, test } from 'bun:test';
import * as v from 'valibot';
import { defaultJdDraft, jdSchema, reviewFlags, toMarkdown } from './index';

describe('hr-jd domain', () => {
	test('accepts the default draft', () => {
		const result = v.safeParse(jdSchema, defaultJdDraft);
		expect(result.success).toBe(true);
	});

	test('returns a coded-language review flag', () => {
		const flags = reviewFlags({
			...defaultJdDraft,
			summary: `${defaultJdDraft.summary} We are looking for a rockstar.`,
		});
		expect(flags.some((flag) => flag.code === 'coded-language')).toBe(true);
	});

	test('renders a validated document as markdown', () => {
		const result = v.safeParse(jdSchema, defaultJdDraft);
		expect(result.success).toBe(true);
		if (result.success) {
			const markdown = toMarkdown(result.output);
			expect(markdown).toContain(`# ${defaultJdDraft.title}`);
			expect(markdown).toContain('## Responsibilities');
		}
	});
});
