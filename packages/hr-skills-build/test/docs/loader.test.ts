import { describe, expect, test } from 'bun:test';
import { buildDocumentationData, humanizeIdentifier } from '../../src/docs/loader.js';

describe('public documentation data', () => {
	test('humanizes identifiers without degrading common HR acronyms', () => {
		expect(humanizeIdentifier('hr-ai-governance')).toBe('AI Governance');
		expect(humanizeIdentifier('hr-hris')).toBe('HRIS');
		expect(humanizeIdentifier('hr-workforce-planning')).toBe('Workforce Planning');
	});

	test('enriches every canonical skill with readable source content', async () => {
		const documentation = await buildDocumentationData();
		const ids = documentation.skills.map((skill) => skill.id);

		expect(documentation.schemaVersion).toBe(1);
		expect(documentation.skillCount).toBe(documentation.skills.length);
		expect(new Set(ids).size).toBe(ids.length);
		expect(
			documentation.domains.reduce((total, domain) => total + domain.skillCount, 0),
		).toBe(documentation.skillCount);

		for (const skill of documentation.skills) {
			expect(skill.content.length).toBeGreaterThan(0);
			expect(skill.content.startsWith('---')).toBeFalse();
			expect(skill.displayName.length).toBeGreaterThan(0);
		}
	});
});
