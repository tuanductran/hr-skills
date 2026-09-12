import { describe, expect, it } from 'bun:test';
import type { RegistryEntry } from '../registry/index.ts';
import { buildSkillEmbed } from './skill.ts';

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

describe('buildSkillEmbed', () => {
	it('builds skill embed with fields', () => {
		const embed = buildSkillEmbed(mockSkill);
		const data = embed.toJSON();
		expect(data.title).toBe('HR Onboarding');
		expect(data.description).toBe(
			'Automates employee onboarding workflows and task checklists.',
		);
		expect(data.fields?.length).toBe(7);
	});
});
