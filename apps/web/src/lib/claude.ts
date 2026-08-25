export type ClaudeTemplateId = 'read' | 'summary' | 'checklist' | 'validate' | 'adapt';

export interface ClaudePromptTemplate {
	id: ClaudeTemplateId;
	label: string;
	description: string;
}

export const CLAUDE_PROMPT_TEMPLATES: ClaudePromptTemplate[] = [
	{
		id: 'read',
		label: 'Read the source',
		description: 'Open the source and prepare for follow-up questions.',
	},
	{
		id: 'summary',
		label: 'Team summary',
		description: 'Summarise the skill for an HR team.',
	},
	{
		id: 'checklist',
		label: 'Implementation checklist',
		description: 'Turn the guidance into practical next steps.',
	},
	{
		id: 'validate',
		label: 'Human review questions',
		description: 'Surface questions to validate with an HR or legal owner.',
	},
	{
		id: 'adapt',
		label: 'Adapt to a workflow',
		description: 'Adapt the source to a workflow without adding employee data.',
	},
];

export const CLAUDE_LINK_WARNING_LENGTH = 6_000;

export function getRawSkillUrl(skillId: string) {
	return `https://raw.githubusercontent.com/tuanductran/hr-skills/main/skills/${encodeURIComponent(skillId)}/SKILL.md`;
}

export function getClaudeTemplatePrompt(templateId: ClaudeTemplateId, skillId: string) {
	const rawSkillUrl = getRawSkillUrl(skillId);
	const source = `Read from ${rawSkillUrl}.`;

	switch (templateId) {
		case 'summary':
			return `${source}\n\nSummarise the ${skillId} skill for my HR team. Keep the output practical, distinguish source-backed guidance from assumptions, and do not use personal or confidential employee data.`;
		case 'checklist':
			return `${source}\n\nCreate a practical implementation checklist for ${skillId}. Identify decisions that need a named owner and flag items that need human HR, legal, or policy review.`;
		case 'validate':
			return `${source}\n\nWhat questions should I validate with a human HR or legal owner before using this ${skillId} guidance in a real workflow? Do not make employment or legal decisions for me.`;
		case 'adapt':
			return `${source}\n\nHelp me adapt the ${skillId} skill to a specific workflow. First ask for non-sensitive context only; do not request or process personal, confidential, or employee data.`;
		case 'read':
		default:
			return `Read from ${rawSkillUrl} so I can ask questions about it.`;
	}
}

export function buildClaudeUrl(prompt: string) {
	return `https://claude.ai/new?q=${encodeURIComponent(prompt.trim())}`;
}
