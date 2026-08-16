import { describe, expect, test } from 'bun:test';
import { parseFrontmatter } from 'hr-skills-ref/client';
import { ROOT_DIR, SKILLS_DIR } from 'hr-skills-ref/server';
import { searchSkills } from '../src/index.client.js';
import { buildRegistry } from '../src/server/index.js';

describe('public package surfaces', () => {
	test('keeps the client barrel browser-safe and callable', () => {
		const [frontmatter] = parseFrontmatter(
			'---\nname: hr-surface\ndescription: surface\n---\n',
		);
		expect(frontmatter['name']).toBe('hr-surface');
		expect(searchSkills).toBeFunction();
	});

	test('exposes server-only build and reference APIs explicitly', () => {
		expect(buildRegistry).toBeFunction();
		expect(ROOT_DIR).toBeString();
		expect(SKILLS_DIR).toBeString();
	});
});
