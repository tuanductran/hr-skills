/** Supported agent export targets for HR skills. */

export const AGENT_EXPORT_TARGETS = [
	{
		id: 'claude',
		label: 'Claude',
		filename: 'SKILL.md',
		description: 'Native Claude skill export that preserves SKILL.md frontmatter.',
	},
	{
		id: 'codex',
		label: 'OpenAI Codex',
		filename: 'AGENTS.md',
		description:
			'Codex instruction export for repository and coding-agent workflows.',
	},
	{
		id: 'cursor',
		label: 'Cursor',
		filename: 'rule.mdc',
		description: 'Cursor rule export for project-scoped AI assistance.',
	},
	{
		id: 'gemini',
		label: 'Gemini',
		filename: 'GEMINI.md',
		description: 'Gemini CLI instruction export for HR skill guidance.',
	},
] as const;

export type AgentExportTarget = (typeof AGENT_EXPORT_TARGETS)[number]['id'];
