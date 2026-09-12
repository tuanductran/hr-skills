import { describe, expect, it } from 'bun:test';
import type { Registry } from '../registry/index.ts';
import { buildStatsEmbed } from './stats.ts';

const mockRegistry: Registry = {
	schemaVersion: 1,
	generatedAt: '2026-09-09',
	skillCount: 1,
	skills: [
		{
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
		},
	],
};

describe('buildStatsEmbed', () => {
	it('builds registry stats embed', () => {
		const embed = buildStatsEmbed(mockRegistry);
		const data = embed.toJSON();
		expect(data.title).toBe('📊 HR Skills Registry Statistics');
		expect(data.fields?.length).toBe(5);
	});
});
