import { ALLOWED_TOOLS_KEY } from './constants.js';
import type { SkillProperties } from './schema.js';

/**
 * Convert a skill's {@link SkillProperties} to a plain dictionary suitable for
 * serialization (e.g. JSON output or YAML round-tripping).
 *
 * Only fields with defined, non-null values are included in the result —
 * optional properties are omitted rather than serialized as `null`.
 * The `allowedTools` field is keyed as `"allowed-tools"` to match the raw
 * frontmatter field name expected by the Claude plugin format.
 *
 * @param props - The validated skill properties to convert.
 * @returns A `Record<string, unknown>` containing only the present fields.
 */
export function toDict(props: SkillProperties): Record<string, unknown> {
	const result: Record<string, unknown> = {
		name: props.name,
		description: props.description,
	};

	if (props.license != null) result['license'] = props.license;

	if (props.compatibility != null) result['compatibility'] = props.compatibility;

	if (props.allowedTools != null) result[ALLOWED_TOOLS_KEY] = props.allowedTools;

	if (props.metadata && Object.keys(props.metadata).length > 0)
		result['metadata'] = { ...props.metadata };

	return result;
}
