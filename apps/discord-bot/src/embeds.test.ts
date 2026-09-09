import { describe, expect, it } from 'bun:test';
import {
	buildPlanEmbed,
	buildSkillEmbed,
	buildSkillListEmbed,
	buildStatsEmbed,
} from './embeds.ts';
import type { ExecutionPlan, Registry, RegistryEntry } from './registry.ts';

const mockSkill: RegistryEntry = {
	id: 'hr-onboarding',
	name: 'HR Onboarding',
	version: '1.0.0',
	description: 'Automates employee onboarding workflows and task checklists.',
	tier: 'full',
	domain: 'onboarding-offboarding',
	tags: ['onboarding', 'new-hire', 'checklist'],
	aliases: ['onboarding', 'welcome'],
	capabilities: ['create-checklist', 'send-welcome-email'],
	triggerPhrases: ['onboard new hire'],
	paths: {
		content: true,
		prompts: true,
		examples: true,
	},
	dependencies: [],
	relatedSkills: [],
};

const mockRegistry: Registry = {
	schemaVersion: 1,
	generatedAt: '2026-09-09',
	skillCount: 1,
	skills: [mockSkill],
};

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

describe('embeds helpers', () => {
	it('builds skill embed with fields', () => {
		const embed = buildSkillEmbed(mockSkill);
		const data = embed.toJSON();
		expect(data.title).toBe('HR Onboarding');
		expect(data.description).toBe(
			'Automates employee onboarding workflows and task checklists.',
		);
		expect(data.fields?.length).toBe(7);
	});

	it('builds skill list embed with empty list', () => {
		const embed = buildSkillListEmbed('Search Results', []);
		const data = embed.toJSON();
		expect(data.title).toBe('Search Results');
		expect(data.description).toBe('No matching skills found.');
	});

	it('builds skill list embed with skills', () => {
		const embed = buildSkillListEmbed('Search Results', [mockSkill]);
		const data = embed.toJSON();
		expect(data.title).toBe('Search Results');
		expect(data.description).toContain('• **HR Onboarding**');
	});

	it('builds execution plan embed', () => {
		const embed = buildPlanEmbed(mockPlan);
		const data = embed.toJSON();
		expect(data.title).toBe('📋 HR Skill Execution Plan');
		expect(data.description).toContain('Onboard senior software engineer');
	});

	it('builds registry stats embed', () => {
		const embed = buildStatsEmbed(mockRegistry);
		const data = embed.toJSON();
		expect(data.title).toBe('📊 HR Skills Registry Statistics');
		expect(data.fields?.length).toBe(5);
	});
});
