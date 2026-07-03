import { describe, expect, it } from 'bun:test';

import { generateCatalog } from '../src/catalog.js';
import type { SkillCatalogEntry } from '../src/types.js';

const skills: SkillCatalogEntry[] = [
	{
		name: 'hr-frontend',
		description:
			'Help HR managers, recruiters, and talent acquisition teams understand Frontend Engineering concepts.',
		author: 'Tuan Duc Tran',
		version: '1.0.0',
		supportedTasks: [
			'Explaining frontend development concepts for non-technical recruiters',
			'Screening frontend candidates effectively',
			'Creating frontend interview questions and hiring scorecards',
		],
	},
	{
		name: 'hr-backend',
		description:
			'Help HR managers, recruiters, and talent acquisition teams understand Backend Engineering concepts.',
		author: 'Tuan Duc Tran',
		version: '1.0.0',
		supportedTasks: [
			'Understanding backend ecosystems and infrastructure',
			'Screening backend candidates effectively',
		],
	},
];

describe('generateCatalog()', () => {
	it('generates the catalog heading', () => {
		const markdown = generateCatalog(skills);

		expect(markdown).toStartWith('# HR Skills Catalog');
	});

	it('shows the total number of skills', () => {
		const markdown = generateCatalog(skills);

		expect(markdown).toContain('> 2 skills available for HR professionals');
	});

	it('includes every generated section', () => {
		const markdown = generateCatalog(skills);

		expect(markdown).toContain('hr-frontend');
		expect(markdown).toContain('hr-backend');
	});

	it('includes skill descriptions', () => {
		const markdown = generateCatalog(skills);

		expect(markdown).toContain(
			'Help HR managers, recruiters, and talent acquisition teams understand Frontend Engineering concepts.',
		);

		expect(markdown).toContain(
			'Help HR managers, recruiters, and talent acquisition teams understand Backend Engineering concepts.',
		);
	});

	it('contains markdown section separators', () => {
		const markdown = generateCatalog(skills);

		expect(markdown.match(/\n\n---\n\n/g)?.length).toBeGreaterThan(0);
	});

	it('supports an empty catalog', () => {
		const markdown = generateCatalog([]);

		expect(markdown).toContain('# HR Skills Catalog');
		expect(markdown).toContain('> 0 skills available for HR professionals');
	});

	it('ends with a newline', () => {
		const markdown = generateCatalog(skills);

		expect(markdown.endsWith('\n')).toBe(true);
	});
});
