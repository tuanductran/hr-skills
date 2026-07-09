import * as v from 'valibot';

export const SkillPropertiesSchema = v.object({
	name: v.pipe(v.string(), v.trim()),
	description: v.pipe(v.string(), v.trim()),
	license: v.optional(v.pipe(v.string(), v.trim())),
	compatibility: v.optional(v.pipe(v.string(), v.trim())),
	allowedTools: v.optional(v.pipe(v.string(), v.trim())),
	metadata: v.optional(v.record(v.string(), v.pipe(v.string(), v.trim()))),
});

export type SkillProperties = v.InferOutput<typeof SkillPropertiesSchema>;
