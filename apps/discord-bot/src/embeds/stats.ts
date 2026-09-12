import { EmbedBuilder } from 'discord.js';

import type { Registry } from '../registry/index.ts';
import { BRAND_COLOR } from './shared.ts';

export function buildStatsEmbed(registry: Registry): EmbedBuilder {
	const totalSkills = registry.skills.length;

	const domainCounts: Record<string, number> = {};
	const tierCounts: Record<string, number> = {};

	for (const skill of registry.skills) {
		domainCounts[skill.domain] = (domainCounts[skill.domain] ?? 0) + 1;
		tierCounts[skill.tier] = (tierCounts[skill.tier] ?? 0) + 1;
	}

	const topDomains = Object.entries(domainCounts)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 6)
		.map(([domain, count]) => `• \`${domain}\`: **${count}**`)
		.join('\n');

	const tierFormatted = Object.entries(tierCounts)
		.map(([tier, count]) => `• \`${tier}\`: **${count}**`)
		.join('\n');

	return new EmbedBuilder()
		.setColor(BRAND_COLOR)
		.setTitle('📊 HR Skills Registry Statistics')
		.setDescription(
			`The **hr-skills** registry provides production-ready Agent Skills for HR & talent operations.`,
		)
		.addFields(
			{ name: 'Total Skills', value: `\`${totalSkills}\``, inline: true },
			{
				name: 'Schema Version',
				value: `\`v${registry.schemaVersion}\``,
				inline: true,
			},
			{ name: 'Generated At', value: `\`${registry.generatedAt}\``, inline: true },
			{ name: 'Tiers Breakdown', value: tierFormatted, inline: false },
			{ name: 'Top Domains', value: topDomains, inline: false },
		)
		.setFooter({ text: 'hr-skills registry' });
}
