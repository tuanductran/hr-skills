import type { RegistryEntry } from '../registry/index.ts';

export const BRAND_COLOR = 0x5865f2;
export const EMBED_FIELD_LIMIT = 1024;

/** Discord embed fields cap at 1024 chars; truncate long joined lists safely. */
export function truncateList(values: string[], emptyLabel = '_none_'): string {
	if (values.length === 0) return emptyLabel;

	const joined = values.map((value) => `\`${value}\``).join(', ');
	if (joined.length <= EMBED_FIELD_LIMIT) return joined;

	return `${joined.slice(0, EMBED_FIELD_LIMIT - 1)}…`;
}

export function skillSummaryLine(skill: RegistryEntry): string {
	return `**${skill.name}** \`${skill.id}\` — ${skill.description}`;
}
