import { EmbedBuilder } from 'discord.js';

import type { RegistryEntry } from '../registry/index.ts';
import { BRAND_COLOR, truncateList } from './shared.ts';

export function buildSkillEmbed(skill: RegistryEntry): EmbedBuilder {
	return new EmbedBuilder()
		.setColor(BRAND_COLOR)
		.setTitle(skill.name)
		.setDescription(skill.description)
		.addFields(
			{ name: 'ID', value: `\`${skill.id}\``, inline: true },
			{ name: 'Domain', value: `\`${skill.domain}\``, inline: true },
			{ name: 'Tier', value: `\`${skill.tier}\``, inline: true },
			{ name: 'Version', value: `\`${skill.version}\``, inline: true },
			{ name: 'Tags', value: truncateList(skill.tags) },
			{ name: 'Capabilities', value: truncateList(skill.capabilities) },
			{ name: 'Aliases', value: truncateList(skill.aliases) },
		)
		.setFooter({ text: 'hr-skills registry' });
}
