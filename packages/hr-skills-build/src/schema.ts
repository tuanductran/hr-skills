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

// ---------------------------------------------------------------------------
// Skill registry schema
// ---------------------------------------------------------------------------

const SKILL_CATEGORIES = [
	'talent-acquisition',
	'onboarding-offboarding',
	'performance-talent',
	'compensation-rewards',
	'learning-development',
	'org-design-change',
	'workforce-analytics',
	'hr-technology-ai',
	'compliance-risk',
	'culture-experience',
	'global-project',
	'technical-hiring',
	'uncategorized',
] as const;

const RegistryEntrySchema = v.object({
	id: v.pipe(v.string(), v.minLength(1)),
	name: v.pipe(v.string(), v.minLength(1)),
	version: v.string(),
	description: v.string(),
	tier: v.picklist(['full', 'partial', 'bare']),
	domain: v.picklist(SKILL_CATEGORIES),
	tags: v.array(v.string()),
	aliases: v.array(v.string()),
	capabilities: v.array(v.string()),
	triggerPhrases: v.array(v.string()),
	paths: v.object({
		content: v.boolean(),
		prompts: v.boolean(),
		examples: v.boolean(),
	}),
	dependencies: v.array(v.string()),
	relatedSkills: v.array(v.string()),
});

export const RegistrySchema = v.object({
	schemaVersion: v.number(),
	generatedAt: v.string(),
	skillCount: v.number(),
	skills: v.array(RegistryEntrySchema),
});
