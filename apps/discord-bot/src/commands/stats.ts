import { SlashCommandBuilder } from 'discord.js';

import { buildStatsEmbed } from '../embeds.ts';
import { loadRegistry } from '../registry.ts';
import type { SkillCommand } from './types.ts';

export const statsCommand: SkillCommand = {
	data: new SlashCommandBuilder()
		.setName('skill-stats')
		.setDescription('Show overview statistics and metrics of the HR Skills registry'),

	async execute(interaction) {
		const registry = await loadRegistry();
		const embed = buildStatsEmbed(registry);
		await interaction.reply({ embeds: [embed] });
	},
};
