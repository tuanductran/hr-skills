/** Data models for Agent Skills. */

export interface SkillProperties {
	name: string;
	description: string;
	license?: string;
	compatibility?: string;
	allowedTools?: string;
	metadata?: Record<string, string | string[]>;
}

const ALLOWED_TOOLS_KEY = 'allowed-tools' as const;

export function toDict(props: SkillProperties): Record<string, unknown> {
	const result: Record<string, unknown> = {
		name: props.name,
		description: props.description,
	};

	if (props.license != null) {
		result.license = props.license;
	}

	if (props.compatibility != null) {
		result.compatibility = props.compatibility;
	}

	if (props.allowedTools != null) {
		result[ALLOWED_TOOLS_KEY] = props.allowedTools;
	}

	if (props.metadata && Object.keys(props.metadata).length > 0) {
		result.metadata = { ...props.metadata };
	}

	return result;
}
