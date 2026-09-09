import { ALLOWED_TOOLS_KEY } from './constants.js';
import type { SkillProperties } from './schema.js';

/**
 * Converts validated skill properties to a plain object suitable for
 * serialization.
 *
 * @param props - Validated frontmatter properties.
 * @returns A plain object with only the fields that were present.
 */
export function toDict(props: SkillProperties): Record<string, unknown> {
	const result: Record<string, unknown> = {
		name: props.name,
		description: props.description,
	};

	if (props.license != null) {
		result['license'] = props.license;
	}

	if (props.compatibility != null) {
		result['compatibility'] = props.compatibility;
	}

	if (props.allowedTools != null) {
		result[ALLOWED_TOOLS_KEY] = props.allowedTools;
	}

	if (props.metadata && Object.keys(props.metadata).length > 0) {
		result['metadata'] = { ...props.metadata };
	}

	return result;
}
