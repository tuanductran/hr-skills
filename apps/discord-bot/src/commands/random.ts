import { SlashCommandBuilder } from 'discord.js';

import { buildSkillEmbed } from '../embeds.ts';
import { loadRegistry, pickRandomSkill } from '../registry.ts';
import type { SkillCommand } from './types.ts';

export const randomCommand: SkillCommand = {
	data: new SlashCommandBuilder()
		.setName('skill-random')
		.setDescription('Show a random HR Skill from the registry'),

	async execute(interaction) {
		const registry = await loadRegistry();
		const skill = pickRandomSkill(registry);
		await interaction.reply({ embeds: [buildSkillEmbed(skill)] });
	},
};
