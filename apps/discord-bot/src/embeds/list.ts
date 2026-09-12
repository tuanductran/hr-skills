import { EmbedBuilder } from 'discord.js';

import type { RegistryEntry } from '../registry/index.ts';
import { BRAND_COLOR, skillSummaryLine } from './shared.ts';

export function buildSkillListEmbed(
	title: string,
	skills: RegistryEntry[],
): EmbedBuilder {
	const embed = new EmbedBuilder().setColor(BRAND_COLOR).setTitle(title);

	if (skills.length === 0) {
		return embed.setDescription('No matching skills found.');
	}

	return embed.setDescription(
		skills.map((skill) => `• ${skillSummaryLine(skill)}`).join('\n'),
	);
}
