import { describe, expect, test } from 'bun:test';
import * as v from 'valibot';
import {
	defaultJdDraft,
	jdSchema,
	reviewFlags,
	slugify,
	toMarkdown,
} from '../../app/utils/jd-schema';
import { createSentryOptions } from '../../sentry.shared';

describe('JD schema adapter', () => {
	test('default draft is valid and has the required structured sections', () => {
		const parsed = v.safeParse(jdSchema, defaultJdDraft);
		expect(parsed.success).toBe(true);
		expect(defaultJdDraft.responsibilities.length).toBeGreaterThan(0);
		expect(defaultJdDraft.requiredSkills.length).toBeGreaterThan(0);
		expect(defaultJdDraft.successMetrics.length).toBeGreaterThan(0);
	});

	test('review flags identify vague or missing content without throwing', () => {
		const flags = reviewFlags({
			...defaultJdDraft,
			title: '',
			summary: 'Help the team do things better.',
			responsibilities: ['Support the team'],
		});
		expect(flags.length).toBeGreaterThan(0);
		expect(flags.every((flag) => flag.title && flag.detail)).toBe(true);
	});

	test('slugify produces safe deterministic export names', () => {
		expect(slugify('Senior People Operations Partner')).toBe(
			'senior-people-operations-partner',
		);
		expect(slugify('  R&D / People  ')).toBe('r-d-people');
	});

	test('Sentry options redact HR-sensitive request context', () => {
		const event = {
			user: { id: 'user-1', email: 'person@example.com' },
			request: {
				cookies: 'session=secret',
				data: { title: 'Confidential role' },
				headers: { authorization: 'secret' },
				query_string: 'token=secret',
			},
			contexts: { request: { body: 'private' } },
		};
		const scrubbed = createSentryOptions(
			'https://example.invalid/1',
			'production',
		).beforeSend?.(event);
		expect(scrubbed?.user).toBeUndefined();
		expect(scrubbed?.request).toEqual({});
		expect(scrubbed?.contexts).toEqual({});
	});

	test('Markdown export preserves headings and structured content', () => {
		const markdown = toMarkdown(defaultJdDraft);
		expect(markdown).toContain(`# ${defaultJdDraft.title}`);
		expect(markdown).toContain('## Responsibilities');
		expect(markdown).toContain('## Required skills');
		expect(markdown).toContain('## Success signals');
	});
});
