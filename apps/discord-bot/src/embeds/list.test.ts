import { describe, expect, it } from 'bun:test';
import type { RegistryEntry } from '../registry/index.ts';
import { buildSkillListEmbed } from './list.ts';

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

describe('buildSkillListEmbed', () => {
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
});
