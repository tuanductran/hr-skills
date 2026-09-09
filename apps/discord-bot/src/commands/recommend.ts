import { MessageFlags, SlashCommandBuilder } from 'discord.js';

import { buildSkillListEmbed } from '../embeds.ts';
import {
	autocompleteSkills,
	findSkillById,
	getRecommendations,
	loadRegistry,
} from '../registry.ts';
import type { SkillCommand } from './types.ts';

export const recommendCommand: SkillCommand = {
	data: new SlashCommandBuilder()
		.setName('skill-recommend')
		.setDescription('Show skills commonly used together with a given skill')
		.addStringOption((option) =>
			option
				.setName('id')
				.setDescription('Skill ID or alias to get recommendations for')
				.setRequired(true)
				.setAutocomplete(true),
		)
		.addIntegerOption((option) =>
			option
				.setName('limit')
				.setDescription('Max recommendations to return (default 5, max 10)')
				.setRequired(false)
				.setMinValue(1)
				.setMaxValue(10),
		),

	async autocomplete(interaction) {
		const focusedValue = interaction.options.getFocused();
		const registry = await loadRegistry();
		const choices = autocompleteSkills(registry, focusedValue);
		await interaction.respond(choices);
	},

	async execute(interaction) {
		const id = interaction.options.getString('id', true);
		const limit = interaction.options.getInteger('limit') ?? 5;

		const registry = await loadRegistry();
		const source = findSkillById(registry, id);

		if (!source) {
			await interaction.reply({
				content: `No skill found matching \`${id}\`. Try \`/skill-find\` first.`,
				flags: MessageFlags.Ephemeral,
			});
			return;
		}

		const { recommendations } = getRecommendations(source.id, registry, limit);
		const skills = recommendations
			.map((rec) => findSkillById(registry, rec.id))
			.filter((skill) => skill !== undefined);

		const embed = buildSkillListEmbed(`Related to ${source.name}`, skills);
		await interaction.reply({ embeds: [embed] });
	},
};
