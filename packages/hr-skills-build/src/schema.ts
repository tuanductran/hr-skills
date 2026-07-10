import * as v from 'valibot';

export const MarketplaceJsonSchema = v.object({
	name: v.string(),
	description: v.string(),
	plugins: v.array(
		v.object({
			name: v.string(),
			source: v.string(),
			description: v.string(),
			skills: v.array(v.string()),
		}),
	),
});

export const SkillFrontmatterSchema = v.object({
	name: v.optional(v.pipe(v.string(), v.trim())),
	description: v.optional(v.pipe(v.string(), v.trim())),
	metadata: v.optional(
		v.object({
			author: v.optional(v.pipe(v.string(), v.trim())),
			version: v.optional(v.pipe(v.string(), v.trim())),
		}),
	),
});

export type SkillFrontmatter = v.InferOutput<typeof SkillFrontmatterSchema>;
