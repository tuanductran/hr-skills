import { EmbedBuilder } from 'discord.js';

import type { ExecutionPlan, Registry, RegistryEntry } from './registry.ts';

const BRAND_COLOR = 0x5865f2;
const EMBED_FIELD_LIMIT = 1024;

/** Discord embed fields cap at 1024 chars; truncate long joined lists safely. */
function truncateList(values: string[], emptyLabel = '_none_'): string {
	if (values.length === 0) return emptyLabel;

	const joined = values.map((value) => `\`${value}\``).join(', ');
	if (joined.length <= EMBED_FIELD_LIMIT) return joined;

	return `${joined.slice(0, EMBED_FIELD_LIMIT - 1)}…`;
}

function skillSummaryLine(skill: RegistryEntry): string {
	return `**${skill.name}** \`${skill.id}\` — ${skill.description}`;
}

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
