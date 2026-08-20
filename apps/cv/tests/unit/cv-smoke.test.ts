import { expect, test } from 'bun:test';
import { defaultCvDraft, reviewFlags, toMarkdown } from 'hr-cv';

test('CV Studio starts with a complete example profile', () => {
	expect(defaultCvDraft.fullName).toBe('Alex Morgan');
	expect(defaultCvDraft.experience.length).toBeGreaterThan(0);
	expect(
		reviewFlags(defaultCvDraft).some((flag) => flag.code === 'no-experience'),
	).toBe(false);
});

test('CV Studio produces Markdown backup content', () => {
	expect(toMarkdown(defaultCvDraft)).toContain('## Skills');
});
