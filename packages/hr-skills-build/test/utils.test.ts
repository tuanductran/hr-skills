import { describe, expect, it } from 'bun:test';
import {
	AUTHOR_REGEX,
	DESCRIPTION_REGEX,
	extractMatch,
	FRONTMATTER_REGEX,
	NAME_REGEX,
	TASKS_REGEX,
	VERSION_REGEX,
} from '../src/utils.js';

// Sample frontmatter for regex tests
const SAMPLE_FRONTMATTER = `---
name: hr-test
description: A test HR skill for validation purposes
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

## Supported tasks

- Doing something useful
- Doing another useful thing
`;

describe('extractMatch', () => {
	it('returns the first capture group when regex matches', () => {
		const result = extractMatch(/^name:[ \t]*(.+)$/m, 'name: hr-test');

		expect(result).toBe('hr-test');
	});

	it('returns null when regex does not match', () => {
		const result = extractMatch(/^missing:[ \t]*(.+)$/m, 'name: hr-test');

		expect(result).toBeNull();
	});

	it('trims whitespace from the captured value', () => {
		const result = extractMatch(/^name:[ \t]*(.+)$/m, 'name:   hr-test   ');

		expect(result).toBe('hr-test');
	});
});

describe('FRONTMATTER_REGEX', () => {
	it('matches valid frontmatter block', () => {
		const match = extractMatch(FRONTMATTER_REGEX, SAMPLE_FRONTMATTER);

		expect(match).not.toBeNull();
		expect(match).toContain('name: hr-test');
	});

	it('returns null when no frontmatter is present', () => {
		const result = extractMatch(
			FRONTMATTER_REGEX,
			'# No frontmatter here\n\n## Body',
		);

		expect(result).toBeNull();
	});
});

describe('NAME_REGEX', () => {
	it('extracts skill name from frontmatter', () => {
		const frontmatter = extractMatch(FRONTMATTER_REGEX, SAMPLE_FRONTMATTER) ?? '';

		expect(extractMatch(NAME_REGEX, frontmatter)).toBe('hr-test');
	});

	it('returns null when name field is absent', () => {
		expect(extractMatch(NAME_REGEX, 'description: something')).toBeNull();
	});
});

describe('DESCRIPTION_REGEX', () => {
	it('extracts description from frontmatter', () => {
		const frontmatter = extractMatch(FRONTMATTER_REGEX, SAMPLE_FRONTMATTER) ?? '';

		expect(extractMatch(DESCRIPTION_REGEX, frontmatter)).toBe(
			'A test HR skill for validation purposes',
		);
	});
});

describe('AUTHOR_REGEX', () => {
	it('extracts indented author value', () => {
		const frontmatter = extractMatch(FRONTMATTER_REGEX, SAMPLE_FRONTMATTER) ?? '';

		expect(extractMatch(AUTHOR_REGEX, frontmatter)).toBe('Tuan Duc Tran');
	});

	it('returns null when author is not present', () => {
		expect(extractMatch(AUTHOR_REGEX, 'name: hr-test\ndescription: desc')).toBeNull();
	});
});

describe('VERSION_REGEX', () => {
	it('extracts version without surrounding quotes', () => {
		const frontmatter = extractMatch(FRONTMATTER_REGEX, SAMPLE_FRONTMATTER) ?? '';

		expect(extractMatch(VERSION_REGEX, frontmatter)).toBe('1.0.0');
	});

	it('handles unquoted version values', () => {
		const content = '---\nname: hr-test\nmetadata:\n  version: 2.0.0\n---\n';
		const frontmatter = extractMatch(FRONTMATTER_REGEX, content) ?? '';

		expect(extractMatch(VERSION_REGEX, frontmatter)).toBe('2.0.0');
	});
});

describe('TASKS_REGEX', () => {
	it('extracts supported tasks block', () => {
		const result = extractMatch(TASKS_REGEX, SAMPLE_FRONTMATTER);

		expect(result).not.toBeNull();
		expect(result).toContain('Doing something useful');
	});

	it('returns null when Supported tasks section is absent', () => {
		const result = extractMatch(TASKS_REGEX, '## Key prompts\n\nSome content\n');

		expect(result).toBeNull();
	});
});
