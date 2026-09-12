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
// Claude Code plugin (.claude-plugin/plugin.json)
// ---------------------------------------------------------------------------

const ClaudePluginAuthorSchema = v.strictObject({
	name: NonEmptyString,
	url: v.optional(v.pipe(NonEmptyString, v.url())),
});

/**
 * Schema for the repo-root `.claude-plugin/plugin.json` manifest. Minimal
 * on purpose: `skills` is intentionally omitted since Claude Code
 * auto-discovers every `skills/hr-*` subdirectory containing a `SKILL.md`.
 */
export const ClaudePluginJsonSchema = v.strictObject({
	$schema: v.literal('https://www.schemastore.org/claude-code-plugin-manifest.json'),
	name: NonEmptyString,
	version: NonEmptyString,
	description: NonEmptyString,
	author: ClaudePluginAuthorSchema,
});

// ---------------------------------------------------------------------------
// Codex plugin (.codex-plugin/plugin.json)
// ---------------------------------------------------------------------------

const CodexPluginAuthorSchema = v.strictObject({
	name: NonEmptyString,
	url: v.optional(v.pipe(NonEmptyString, v.url())),
});

const CodexPluginInterfaceSchema = v.strictObject({
	displayName: NonEmptyString,
	shortDescription: NonEmptyString,
	longDescription: NonEmptyString,
	developerName: NonEmptyString,
	category: NonEmptyString,
	capabilities: v.array(NonEmptyString),
	websiteURL: v.pipe(NonEmptyString, v.url()),
});

/**
 * Schema for the repo-root `.codex-plugin/plugin.json` compatibility
 * manifest. Bundles every `skills/hr-*` directory as one Codex plugin via
 * `skills: "./skills/"` — Codex auto-discovers each subdirectory containing
 * a `SKILL.md` as an individual skill, so no per-skill manifest is needed.
 */
export const CodexPluginJsonSchema = v.strictObject({
	$schema: v.literal('https://www.schemastore.org/codex-plugin-manifest.json'),
	name: NonEmptyString,
	version: NonEmptyString,
	description: NonEmptyString,
	author: CodexPluginAuthorSchema,
	homepage: v.pipe(NonEmptyString, v.url()),
	repository: v.pipe(NonEmptyString, v.url()),
	license: NonEmptyString,
	keywords: v.array(NonEmptyString),
	skills: v.literal('./skills/'),
	interface: CodexPluginInterfaceSchema,
});

// ---------------------------------------------------------------------------
// Codex marketplace (.agents/plugins/marketplace.json)
// ---------------------------------------------------------------------------

const CodexMarketplaceSourceSchema = v.strictObject({
	source: v.literal('url'),
	url: v.pipe(NonEmptyString, v.url()),
	ref: NonEmptyString,
});

const CodexMarketplacePolicySchema = v.strictObject({
	installation: v.picklist(['AVAILABLE', 'INSTALLED_BY_DEFAULT', 'NOT_AVAILABLE']),
	authentication: v.picklist(['ON_INSTALL', 'ON_USE']),
});

const CodexMarketplacePluginSchema = v.strictObject({
	name: NonEmptyString,
	source: CodexMarketplaceSourceSchema,
	policy: CodexMarketplacePolicySchema,
	category: NonEmptyString,
});

/**
 * Schema for the repo-root `.agents/plugins/marketplace.json` — the Codex
 * counterpart to `.claude-plugin/marketplace.json`. Lists a single
 * `git-url`-sourced plugin entry pointing back at this repository.
 */
export const CodexMarketplaceJsonSchema = v.strictObject({
	name: NonEmptyString,
	interface: v.strictObject({ displayName: NonEmptyString }),
	plugins: v.array(CodexMarketplacePluginSchema),
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

export const SKILL_CATEGORIES = [
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
	domain: v.picklist(SKILL_CATEGORIES),
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
