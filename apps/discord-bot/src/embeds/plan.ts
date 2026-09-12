import { EmbedBuilder } from 'discord.js';

import type { ExecutionPlan } from '../registry/index.ts';
import { BRAND_COLOR, EMBED_FIELD_LIMIT } from './shared.ts';

export function buildPlanEmbed(plan: ExecutionPlan): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setColor(BRAND_COLOR)
		.setTitle('📋 HR Skill Execution Plan')
		.setDescription(`**User Intent:**\n> "${plan.intent}"\n\n${plan.summary}`)
		.addFields(
			{
				name: 'Complexity',
				value: `\`${plan.complexity.toUpperCase()}\``,
				inline: true,
			},
			{ name: 'Steps', value: `\`${plan.steps.length}\``, inline: true },
		);

	if (plan.steps.length > 0) {
		const stepsFormatted = plan.steps
			.map(
				(step, idx) =>
					`**Step ${idx + 1}: \`${step.skillId}\`**\nRationale: ${step.rationale}${
						step.dependencies.length > 0
							? `\n*Requires:* ${step.dependencies.map((d) => `\`${d}\``).join(', ')}`
							: ''
					}`,
			)
			.join('\n\n');

		embed.addFields({
			name: 'Execution Sequence',
			value:
				stepsFormatted.length > EMBED_FIELD_LIMIT
					? `${stepsFormatted.slice(0, EMBED_FIELD_LIMIT - 1)}…`
					: stepsFormatted,
		});
	}

	if ('notes' in plan && Array.isArray((plan as { notes?: string[] }).notes)) {
		const notes = (plan as { notes: string[] }).notes;
		if (notes.length > 0) {
			embed.addFields({
				name: 'Planner Notes',
				value: notes.map((n) => `• ${n}`).join('\n'),
			});
		}
	}

	return embed.setFooter({ text: 'hr-skills deterministic planner' });
}
