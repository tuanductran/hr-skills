import * as v from 'valibot';

/**
 * Valibot schema for the properties read from a skill's `SKILL.md` frontmatter.
 *
 * Only `name` and `description` are required; all other fields are optional.
 * String values are trimmed of leading and trailing whitespace during parsing.
 */
export const SkillPropertiesSchema = v.object({
	/** Skill identifier (required). Must match the containing directory name. */
	name: v.pipe(v.string(), v.trim()),
	/** Short description of what the skill does (required). */
	description: v.pipe(v.string(), v.trim()),
	/** SPDX license identifier for the skill content (optional). */
	license: v.optional(v.pipe(v.string(), v.trim())),
	/** Compatibility notes for the skill, e.g. supported Claude versions (optional). */
	compatibility: v.optional(v.pipe(v.string(), v.trim())),
	/** Comma-separated list of Claude tools this skill is permitted to use (optional). */
	allowedTools: v.optional(v.pipe(v.string(), v.trim())),
	/** Arbitrary key-value metadata pairs from the `metadata:` block (optional). */
	metadata: v.optional(v.record(v.string(), v.pipe(v.string(), v.trim()))),
});

/** TypeScript type inferred from {@link SkillPropertiesSchema}. */
export type SkillProperties = v.InferOutput<typeof SkillPropertiesSchema>;
