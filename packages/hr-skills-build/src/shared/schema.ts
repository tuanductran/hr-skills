import * as v from 'valibot';

/**
 * Valibot schema for `.claude-plugin/marketplace.json`.
 * Used by `sync.ts` to parse and validate the file before updating it.
 */
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

/**
 * Valibot schema for the YAML frontmatter of a skill's `SKILL.md`.
 * All fields are optional — callers should treat a missing field as absent
 * rather than as an error at this layer (higher-level validation handles
 * required-field checks).
 */
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

/** TypeScript type inferred from {@link SkillFrontmatterSchema}. */
export type SkillFrontmatter = v.InferOutput<typeof SkillFrontmatterSchema>;

// ---------------------------------------------------------------------------
// Skill registry schema
// ---------------------------------------------------------------------------

/**
 * All valid domain category slugs for a skill entry.
 * Must stay in sync with `SkillCategory` in classifier.ts.
 */
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

/**
 * Valibot schema for a single entry in `registry/skills.json`.
 * Mirrors the `RegistryEntry` interface in types.ts.
 */
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

/**
 * Valibot schema for the full `registry/skills.json` document.
 * Used by `validate-registry.ts` to confirm the committed file conforms to
 * the expected shape before checking staleness, duplicates, and graph integrity.
 */
export const RegistrySchema = v.object({
	schemaVersion: v.number(),
	generatedAt: v.string(),
	skillCount: v.number(),
	skills: v.array(RegistryEntrySchema),
});
