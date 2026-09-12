import { MessageFlags, SlashCommandBuilder } from 'discord.js';

import { buildSkillListEmbed } from '../embeds/index.ts';
import {
	findSkillById,
	InvalidSearchQueryError,
	loadRegistry,
	searchSkills,
} from '../registry/index.ts';
import type { SkillCommand } from './types.ts';
import { SKILL_DOMAINS } from './types.ts';

export const findCommand: SkillCommand = {
	data: new SlashCommandBuilder()
		.setName('skill-find')
		.setDescription('Search the HR Skills registry by keyword')
		.addStringOption((option) =>
			option
				.setName('query')
				.setDescription(
					'Keyword to search for (tags, capabilities, trigger phrases…)',
				)
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName('domain')
				.setDescription('Restrict results to one domain')
				.setRequired(false)
				.addChoices(
					SKILL_DOMAINS.map((domain) => ({ name: domain, value: domain })),
				),
		)
		.addIntegerOption((option) =>
			option
				.setName('limit')
				.setDescription('Max results to return (default 5, max 10)')
				.setRequired(false)
				.setMinValue(1)
				.setMaxValue(10),
		),

	async execute(interaction) {
		const query = interaction.options.getString('query', true);
		const domain = interaction.options.getString('domain') ?? undefined;
		const limit = interaction.options.getInteger('limit') ?? 5;

		const registry = await loadRegistry();

		let response: ReturnType<typeof searchSkills>;
		try {
			response = searchSkills(
				{
					text: query,
					limit,
					...(domain
						? { domain: domain as (typeof SKILL_DOMAINS)[number] }
						: {}),
				},
				registry,
			);
		} catch (error) {
			if (error instanceof InvalidSearchQueryError) {
				await interaction.reply({
					content: `Invalid search query: ${error.message}`,
					flags: MessageFlags.Ephemeral,
				});
				return;
			}
			throw error;
		}

		const skills = response.results
			.map((result) => findSkillById(registry, result.skillId))
			.filter((skill) => skill !== undefined);

		const embed = buildSkillListEmbed(`Results for "${query}"`, skills);
		await interaction.reply({ embeds: [embed] });
	},
};
