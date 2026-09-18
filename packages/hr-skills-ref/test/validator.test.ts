import { describe, expect, it } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SKILLS_DIR } from '../src/server/constants.js';
import { discoverSkillNames, makeTempSkill } from '../src/server/helpers.js';
import { validate } from '../src/server/validator.js';

describe('validate', () => {
	it('returns no errors for a real HR skill', () => {
		const errors = validate(join(SKILLS_DIR, 'hr-recruiting'));
		expect(errors).toEqual([]);
	});

	it('validates all HR skills without errors', () => {
		const skillNames = discoverSkillNames();

		expect(skillNames.length).toBeGreaterThan(0);

		for (const name of skillNames) {
			const errors = validate(join(SKILLS_DIR, name));

			expect(errors).toEqual([]);
		}
	});

	it('returns error for non-existent path', () => {
		const errors = validate('/non/existent/path');
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0]).toContain('Path does not exist');
	});

	it('returns an error when the path is a file rather than a directory', () => {
		const tmp = mkdtempSync(join(tmpdir(), 'skill-test-'));
		const filePath = join(tmp, 'not-a-skill.md');
		writeFileSync(filePath, '# Not a skill\n', 'utf8');

		try {
			expect(validate(filePath)).toContain(`Not a directory: ${filePath}`);
		} finally {
			rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('returns error for missing SKILL.md', () => {
		const tmp = mkdtempSync(join(tmpdir(), 'skill-test-'));
		try {
			const errors = validate(tmp);
			expect(errors).toContain('Missing required file: SKILL.md');
		} finally {
			rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('returns error when name does not match directory name', () => {
		const tmp = makeTempSkill(`---
name: wrong-name
description: desc
---`);
		try {
			const errors = validate(tmp);
			expect(errors.some((e) => e.includes('must match skill name'))).toBe(true);
		} finally {
			rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('returns error for missing required field name', () => {
		const tmp = makeTempSkill(`---
description: desc
---`);
		try {
			const errors = validate(tmp);
			expect(errors.some((e) => e.includes('name'))).toBe(true);
		} finally {
			rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('returns error for uppercase skill name', () => {
		const tmp = makeTempSkill(`---
name: HR-Recruiting
description: desc
---`);
		try {
			const errors = validate(tmp);
			expect(errors.some((e) => e.includes('lowercase'))).toBe(true);
		} finally {
			rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('returns error for unexpected frontmatter fields', () => {
		const tmp = makeTempSkill(`---
name: test
description: desc
unknown-field: value
---`);
		try {
			const errors = validate(tmp);
			expect(errors.some((e) => e.includes('Unexpected fields'))).toBe(true);
		} finally {
			rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('returns error for consecutive hyphens in name', () => {
		const tmp = makeTempSkill(`---
name: hr--test
description: desc
---`);
		try {
			const errors = validate(tmp);
			expect(errors.some((e) => e.includes('consecutive hyphens'))).toBe(true);
		} finally {
			rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('returns an error for names with invalid characters', () => {
		const tmp = makeTempSkill(`---
name: hr_test
description: desc
---`);
		try {
			const errors = validate(tmp);
			expect(errors.some((error) => error.includes('invalid characters'))).toBe(
				true,
			);
		} finally {
			rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('returns an error for names with edge hyphens', () => {
		const tmp = makeTempSkill(`---
name: -hr-test-
description: desc
---`);
		try {
			const errors = validate(tmp);
			expect(
				errors.some((error) => error.includes('start or end with a hyphen')),
			).toBe(true);
		} finally {
			rmSync(tmp, { recursive: true, force: true });
		}
	});

	it('returns parse errors for invalid frontmatter', () => {
		const tmp = makeTempSkill(`---
		name:
  -
		---`);

		try {
			const errors = validate(tmp);

			expect(errors).toHaveLength(1);
			expect(typeof errors[0]).toBe('string');
			expect(errors[0]).not.toBe('');
		} finally {
			rmSync(tmp, {
				recursive: true,
				force: true,
			});
		}
	});
});
