import { describe, expect, it } from 'bun:test';
import { mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { validate } from '../src/validator.js';

const SKILLS_DIR = join(import.meta.dir, '../../../skills');

/**
 * Dynamically discover all HR skill directories so this test automatically
 * covers every skill that exists — no manual list to keep in sync.
 */
function discoverSkillNames(): string[] {
	return readdirSync(SKILLS_DIR, { withFileTypes: true })
		.filter((entry) => entry.isDirectory() && entry.name.startsWith('hr-'))
		.map((entry) => entry.name)
		.sort();
}

function makeTempSkill(content: string): string {
	const tmp = mkdtempSync(join(tmpdir(), 'skill-test-'));
	writeFileSync(join(tmp, 'SKILL.md'), content);
	return tmp;
}

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
});
