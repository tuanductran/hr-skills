import { SlashCommandBuilder } from 'discord.js';

import { buildPlanEmbed } from '../embeds/index.ts';
import { generateExecutionPlan, loadRegistry } from '../registry/index.ts';
import type { SkillCommand } from './types.ts';

export const planCommand: SkillCommand = {
	data: new SlashCommandBuilder()
		.setName('skill-plan')
		.setDescription('Generate a multi-step execution plan for complex HR requests')
		.addStringOption((option) =>
			option
				.setName('intent')
				.setDescription(
					'Your HR goal/request (e.g., "Create onboarding plan and set 90-day performance goals")',
				)
				.setRequired(true),
		),

	async execute(interaction) {
		const intent = interaction.options.getString('intent', true);
		const registry = await loadRegistry();
		const plan = generateExecutionPlan(intent, registry);

		const embed = buildPlanEmbed(plan);
		await interaction.reply({ embeds: [embed] });
	},
};
