import * as v from 'valibot';

const TrimmedString = v.pipe(v.string(), v.trim());
const OptionalTrimmedString = v.optional(TrimmedString);
const MetadataSchema = v.record(v.string(), TrimmedString);

/**
 * Schema for the properties read from a skill's `SKILL.md` frontmatter.
 */
export const SkillPropertiesSchema = v.strictObject({
	name: TrimmedString,
	description: TrimmedString,
	license: OptionalTrimmedString,
	compatibility: OptionalTrimmedString,
	allowedTools: OptionalTrimmedString,
	metadata: v.optional(MetadataSchema),
});

/**
 * Parsed properties extracted from a skill's `SKILL.md` frontmatter.
 */
export type SkillProperties = v.InferOutput<typeof SkillPropertiesSchema>;
