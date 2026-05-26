import { describe, expect, it } from 'bun:test';
import {
	extractMatch,
	FRONTMATTER_REGEX,
	parseFrontmatter,
	TASKS_REGEX,
} from '../src/utils.js';

const SAMPLE_SKILL = `---
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

const SAMPLE_SKILL_CRLF = SAMPLE_SKILL.replaceAll('\n', '\r\n');

describe('extractMatch', () => {
	it('returns the first capture group when regex matches', () => {
		const result = extractMatch(/^name:[ \t]*(.+)$/m, 'name: hr-test');

		expect(result).toBe('hr-test');
	});

	it('returns null when regex does not match', () => {
		const result = extractMatch(/^missing:[ \t]*(.+)$/m, 'name: hr-test');

		expect(result).toBeNull();
	});
});

describe('parseFrontmatter', () => {
	it('parses simple single-line scalars', () => {
		const frontmatter = parseFrontmatter(SAMPLE_SKILL);

		expect(frontmatter.name).toBe('hr-test');
		expect(frontmatter.description).toBe('A test HR skill for validation purposes');
		expect(frontmatter.metadata?.author).toBe('Tuan Duc Tran');
		expect(frontmatter.metadata?.version).toBe('1.0.0');
	});

	it('parses quoted description containing colons', () => {
		const content = `---
name: hr-test
description: "Use when: hiring manager asks for pipeline health"
metadata:
  author: Tuan Duc Tran
  version: "1.2.3"
---`;

		const frontmatter = parseFrontmatter(content);

		expect(frontmatter.description).toBe(
			'Use when: hiring manager asks for pipeline health',
		);
	});

	it('parses multiline description with literal block scalar', () => {
		const content = `---
name: hr-test
description: |
  Line one about HR workflows.
  Line two: keep punctuation.
metadata:
  author: Tuan Duc Tran
  version: "1.2.3"
---`;

		const frontmatter = parseFrontmatter(content);

		expect(frontmatter.description).toContain('Line one about HR workflows.');
		expect(frontmatter.description).toContain('Line two: keep punctuation.');
	});

	it('parses multiline description with folded block scalar', () => {
		const content = `---
name: hr-test
description: >
  Help HR teams standardize interview loops
  and improve scorecard quality.
metadata:
  author: Tuan Duc Tran
  version: "1.2.3"
---`;

		const frontmatter = parseFrontmatter(content);

		expect(frontmatter.description).toContain(
			'Help HR teams standardize interview loops and improve scorecard quality.',
		);
	});
});

describe('FRONTMATTER_REGEX', () => {
	it('matches valid frontmatter block', () => {
		const match = extractMatch(FRONTMATTER_REGEX, SAMPLE_SKILL);

		expect(match).not.toBeNull();
		expect(match).toContain('name: hr-test');
	});

	it('extracts frontmatter from CRLF markdown', () => {
		const frontmatter = extractMatch(FRONTMATTER_REGEX, SAMPLE_SKILL_CRLF) ?? '';

		expect(frontmatter).toContain('name: hr-test');
		expect(frontmatter).toContain('author: Tuan Duc Tran');
	});
});

describe('TASKS_REGEX', () => {
	it('extracts supported tasks block', () => {
		const result = extractMatch(TASKS_REGEX, SAMPLE_SKILL);

		expect(result).not.toBeNull();
		expect(result).toContain('Doing something useful');
	});

	it('extracts supported tasks block from CRLF markdown', () => {
		const result = extractMatch(TASKS_REGEX, SAMPLE_SKILL_CRLF);

		expect(result).not.toBeNull();
		expect(result).toContain('Doing another useful thing');
	});
});
