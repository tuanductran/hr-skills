import * as v from 'valibot';

// ---------------------------------------------------------------------------
// Common schemas
// ---------------------------------------------------------------------------

const TrimmedString = v.pipe(v.string(), v.trim());
const NonEmptyString = v.pipe(TrimmedString, v.minLength(1));
const EmailString = v.pipe(TrimmedString, v.email());

// ---------------------------------------------------------------------------
// Marketplace
// ---------------------------------------------------------------------------

const MarketplaceOwnerSchema = v.strictObject({
	name: NonEmptyString,
	email: EmailString,
});

const MarketplacePluginSchema = v.strictObject({
	name: NonEmptyString,
	source: v.literal('./'),
	description: NonEmptyString,
	skills: v.array(v.pipe(NonEmptyString, v.startsWith('./skills/'))),
});

/**
 * Schema for `.claude-plugin/marketplace.json`.
 */
export const MarketplaceJsonSchema = v.strictObject({
	$schema: v.literal('https://json.schemastore.org/claude-code-marketplace.json'),
	name: NonEmptyString,
	description: NonEmptyString,
	owner: MarketplaceOwnerSchema,
	plugins: v.array(MarketplacePluginSchema),
});

// ---------------------------------------------------------------------------
// Skill frontmatter
// ---------------------------------------------------------------------------

const MetadataSchema = v.strictObject({
	author: v.optional(NonEmptyString),
	version: v.optional(NonEmptyString),
});

/**
 * Schema for `SKILL.md` frontmatter.
 */
export const SkillFrontmatterSchema = v.strictObject({
	name: v.optional(NonEmptyString),
	description: v.optional(NonEmptyString),
	metadata: v.optional(MetadataSchema),
});

/** TypeScript type inferred from {@link SkillFrontmatterSchema}. */
export type SkillFrontmatter = v.InferOutput<typeof SkillFrontmatterSchema>;

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

const SkillCategories = [
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

const RegistryPathsSchema = v.strictObject({
	content: v.boolean(),
	prompts: v.boolean(),
	examples: v.boolean(),
});

const RegistryEntrySchema = v.strictObject({
	id: NonEmptyString,
	name: NonEmptyString,
	version: NonEmptyString,
	description: NonEmptyString,
	tier: v.picklist(['full', 'partial', 'bare']),
	domain: v.picklist(SkillCategories),
	tags: v.array(NonEmptyString),
	aliases: v.array(NonEmptyString),
	capabilities: v.array(NonEmptyString),
	triggerPhrases: v.array(NonEmptyString),
	paths: RegistryPathsSchema,
	dependencies: v.array(NonEmptyString),
	relatedSkills: v.array(NonEmptyString),
});

/**
 * Schema for `registry/skills.json`.
 */
export const RegistrySchema = v.strictObject({
	schemaVersion: v.pipe(v.number(), v.minValue(1)),
	generatedAt: NonEmptyString,
	skillCount: v.pipe(v.number(), v.minValue(0)),
	skills: v.array(RegistryEntrySchema),
});
