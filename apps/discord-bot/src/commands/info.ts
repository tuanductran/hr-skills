import { MessageFlags, SlashCommandBuilder } from 'discord.js';

import { buildSkillEmbed } from '../embeds.ts';
import { autocompleteSkills, findSkillById, loadRegistry } from '../registry.ts';
import type { SkillCommand } from './types.ts';

export const infoCommand: SkillCommand = {
	data: new SlashCommandBuilder()
		.setName('skill-info')
		.setDescription('Show full details for one HR Skill')
		.addStringOption((option) =>
			option
				.setName('id')
				.setDescription('Skill ID or alias, e.g. "hr-onboarding" or "onboarding"')
				.setRequired(true)
				.setAutocomplete(true),
		),

	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const registry = await loadRegistry();
		const choices = autocompleteSkills(registry, focusedValue);
		await interaction.respond(choices);
	},

	async execute(interaction) {
		const id = interaction.options.getString('id', true);
		const registry = await loadRegistry();
		const skill = findSkillById(registry, id);

		if (!skill) {
			await interaction.reply({
				content: `No skill found matching \`${id}\`. Try \`/skill-find\` first.`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		await interaction.reply({ embeds: [buildSkillEmbed(skill)] });
	},
};
