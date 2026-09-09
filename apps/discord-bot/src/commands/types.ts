import type {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
	SlashCommandOptionsOnlyBuilder,
	SlashCommandSubcommandsOnlyBuilder,
} from 'discord.js';

export interface SkillCommand {
	data:
		| SlashCommandBuilder
		| SlashCommandOptionsOnlyBuilder
		| SlashCommandSubcommandsOnlyBuilder;
	execute(interaction: ChatInputCommandInteraction): Promise<void>;
	autocomplete?(interaction: AutocompleteInteraction): Promise<void>;
}

/** The fixed, stable set of routing domains a skill can belong to. */
export const SKILL_DOMAINS = [
	'talent-acquisition',
	'onboarding-offboarding',
	'performance-talent',
	'compensation-rewards',
	'learning-development',
	'org-design-change',
	'workforce-analytics',
	'hr-technology-ai',
	'compliance-risk',
	'culture-experience',
	'global-project',
	'technical-hiring',
] as const;
