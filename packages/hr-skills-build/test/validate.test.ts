import { describe, expect, it } from 'bun:test';
import { first } from '../src/helpers.js';
import type { ValidationError } from '../src/types.js';
import {
	validateAuthor,
	validateBlankLines,
	validateContentLength,
	validateFrontmatter,
	validateLineCount,
	validateRequiredSections,
	validateSupportedTasks,
	validateTips,
} from '../src/validate.js';

function createErrors(): ValidationError[] {
	return [];
}

const validContent = `---
name: hr-test
description: This is a sufficiently long description for validation purposes.
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# HR Test

## Supported tasks

- Task 1
- Task 2
- Task 3
- Task 4
- Task 5
- Task 6
- Task 7
- Task 8

## Key prompts

Some prompt content.

## Tips

- Tip 1
- Tip 2
- Tip 3
- Tip 4

${'Lorem ipsum '.repeat(300)}
`;

const tooFewTasks = `---
name: hr-test
description: This is a sufficiently long description for validation purposes.
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# HR Test

## Supported tasks

- Task 1
- Task 2
- Task 3

## Key prompts

Some prompt content.

## Tips

- Tip 1
- Tip 2
- Tip 3
- Tip 4

${'Lorem ipsum '.repeat(300)}
`;

const tooFewTips = `---
name: hr-test
description: This is a sufficiently long description for validation purposes.
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

# HR Test

## Supported tasks

- Task 1
- Task 2
- Task 3
- Task 4
- Task 5
- Task 6
- Task 7
- Task 8

## Key prompts

Some prompt content.

## Tips

- Tip 1

${'Lorem ipsum '.repeat(300)}
`;

describe('validateFrontmatter()', () => {
	it('accepts valid frontmatter', () => {
		const errors = createErrors();

		validateFrontmatter('hr-test', validContent, errors);

		expect(errors).toEqual([]);
	});

	it('rejects mismatched skill name', () => {
		const errors = createErrors();

		validateFrontmatter(
			'hr-test',
			validContent.replace('name: hr-test', 'name: hr-other'),
			errors,
		);

		expect(errors.some((e) => e.message.includes('Frontmatter name mismatch'))).toBe(
			true,
		);
	});

	it('requires metadata.version', () => {
		const errors = createErrors();

		validateFrontmatter(
			'hr-test',
			validContent.replace('version: "1.0.0"', ''),
			errors,
		);

		expect(errors.some((e) => e.message.includes('Missing metadata.version'))).toBe(
			true,
		);
	});
});

describe('validateAuthor()', () => {
	it('accepts a normalized author name', () => {
		const errors = createErrors();

		validateAuthor('hr-test', 'Tuan Duc Tran', errors);

		expect(errors).toEqual([]);
	});

	it('rejects missing author', () => {
		const errors = createErrors();

		validateAuthor('hr-test', undefined, errors);

		expect(errors.some((e) => e.message.includes('Missing metadata.author'))).toBe(
			true,
		);
	});

	it('rejects incorrect capitalization', () => {
		const errors = createErrors();

		validateAuthor('hr-test', 'tuan duc tran', errors);

		expect(errors.some((e) => e.message.includes('Title Case'))).toBe(true);
	});
});

describe('validateRequiredSections()', () => {
	it('accepts required sections', () => {
		const errors = createErrors();

		validateRequiredSections('hr-test', validContent, errors);

		expect(errors).toEqual([]);
	});

	it('reports missing sections', () => {
		const errors = createErrors();

		validateRequiredSections(
			'hr-test',
			validContent.replace('## Tips', '## Notes'),
			errors,
		);

		expect(errors.some((e) => e.message.includes('Missing required section'))).toBe(
			true,
		);
	});
});

describe('validateSupportedTasks()', () => {
	it('accepts between 8 and 12 tasks', () => {
		const errors = createErrors();

		validateSupportedTasks('hr-test', validContent, errors);

		expect(errors).toEqual([]);
	});

	it('rejects fewer than 8 tasks', () => {
		const errors = createErrors();

		validateSupportedTasks('hr-test', tooFewTasks, errors);

		expect(errors).toHaveLength(1);
		expect(first(errors).message).toContain('expected 8-12 tasks');
	});
});

describe('validateTips()', () => {
	it('accepts 4-6 tips', () => {
		const errors = createErrors();

		validateTips('hr-test', validContent, errors);

		expect(errors).toEqual([]);
	});

	it('rejects too few tips', () => {
		const errors = createErrors();

		validateTips('hr-test', tooFewTips, errors);

		expect(errors).toHaveLength(1);
		expect(first(errors).message).toContain('expected 4-6 tips');
	});
});

describe('validateLineCount()', () => {
	it('accepts files under 500 lines', () => {
		const errors = createErrors();

		validateLineCount('hr-test', validContent, errors);

		expect(errors).toEqual([]);
	});

	it('rejects files over 500 lines', () => {
		const errors = createErrors();

		const longContent = Array.from({ length: 501 }, (_, i) => `Line ${i + 1}`).join(
			'\n',
		);

		validateLineCount('hr-test', longContent, errors);

		expect(errors).toHaveLength(1);
		expect(first(errors).message).toContain('maximum 500 lines');
	});
});

describe('validateContentLength()', () => {
	it('accepts sufficiently long content', () => {
		const errors = createErrors();

		validateContentLength('hr-test', validContent, errors);

		expect(errors).toEqual([]);
	});
});

describe('validateBlankLines()', () => {
	it('accepts blank lines before lists', () => {
		const errors = createErrors();

		validateBlankLines('hr-test', validContent, errors);

		expect(errors).toEqual([]);
	});

	it('detects missing blank line before a list', () => {
		const errors = createErrors();

		validateBlankLines(
			'hr-test',
			`## Heading
- Item`,
			errors,
		);

		expect(errors).toHaveLength(1);
		expect(first(errors).message).toContain('Missing blank line');
	});
});
