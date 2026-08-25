import { describe, expect, test } from 'bun:test';
import { PEOPLE_SYSTEM_STAGES } from './peopleSystem';

describe('People System Canvas stages', () => {
	test('has a stable, unique lifecycle order', () => {
		expect(PEOPLE_SYSTEM_STAGES).toHaveLength(6);
		expect(new Set(PEOPLE_SYSTEM_STAGES.map((stage) => stage.id)).size).toBe(
			PEOPLE_SYSTEM_STAGES.length,
		);
		expect(PEOPLE_SYSTEM_STAGES.map((stage) => stage.id)).toEqual([
			'diagnose',
			'design',
			'attract',
			'activate',
			'develop',
			'govern',
		]);
	});

	test('keeps each stage actionable', () => {
		for (const stage of PEOPLE_SYSTEM_STAGES) {
			expect(stage.skills.length).toBeGreaterThan(0);
			expect(stage.outcomes.length).toBeGreaterThan(0);
			expect(stage.gateText.length).toBeGreaterThan(20);
		}
	});
});
