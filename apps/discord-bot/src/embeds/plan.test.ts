import { describe, expect, it } from 'bun:test';
import type { ExecutionPlan } from '../registry/index.ts';
import { buildPlanEmbed } from './plan.ts';

const mockPlan: ExecutionPlan = {
	intent: 'Onboard senior software engineer',
	requestedCapabilities: ['create-checklist'],
	capabilityMatches: [
		{
			capability: 'create-checklist',
			matches: [
				{
					skillId: 'hr-onboarding',
					matchType: 'direct',
					score: 1.0,
					explanation: 'Exact capability match',
				},
			],
			isMatched: true,
		},
	],
	steps: [
		{
			skillId: 'hr-onboarding',
			order: 0,
			reason: 'direct-capability-match',
			rationale: 'Matches onboarding capability',
			dependencies: [],
		},
	],
	summary: 'Plan uses 1 skill to address user intent.',
	complexity: 'simple',
};

describe('buildPlanEmbed', () => {
	it('builds execution plan embed', () => {
		const embed = buildPlanEmbed(mockPlan);
		const data = embed.toJSON();
		expect(data.title).toBe('📋 HR Skill Execution Plan');
		expect(data.description).toContain('Onboard senior software engineer');
	});
});
