import type { SkillCategory } from './classifier.js';

// ---------------------------------------------------------------------------
// Skill matrix types
// ---------------------------------------------------------------------------

export type Tier = 'full' | 'partial' | 'bare';

export interface SkillRow {
	name: string;
	displayName: string;
	tier: Tier;
	hasContent: boolean;
	hasPrompts: boolean;
	hasExamples: boolean;
	contentFiles: number;
	version: string;
	description: string;
}

// ---------------------------------------------------------------------------
// Skill directory types
// ---------------------------------------------------------------------------

export interface SkillDirectoryOptions {
	readonly prefix?: string;
	readonly sort?: boolean;
}

export interface SkillMeta {
	name: string;
	description: string;
	coverage: string;
	scopeSentence: string;
	triggerPhrases: string[];
	supportedTasks: string[];
}

/**
 * A single validation issue found in a skill.
 *
 * Named `SkillValidationIssue` (not `ValidationError`) to avoid a naming
 * collision with the `ValidationError` class exported by `skills-ref`, which
 * has a different shape and different semantics. Both names exist in the same
 * monorepo — keeping them distinct prevents IDE auto-import confusion.
 */
export interface SkillValidationIssue {
	skill: string;
	message: string;
}

// ---------------------------------------------------------------------------
// Skill registry types
// ---------------------------------------------------------------------------

/**
 * A single skill entry in the generated Skill Registry.
 *
 * This is the canonical, machine-readable record for one skill — the schema
 * that `registry/skills.json` conforms to. Runtime agents should read this
 * instead of parsing SKILL.md prose.
 */
export interface RegistryEntry {
	/** Directory / frontmatter name, e.g. "hr-onboarding". Primary key. */
	id: string;
	/** Human-readable display name (currently same as id by convention). */
	name: string;
	/** Semver-ish version string from SKILL.md frontmatter (metadata.version). */
	version: string;
	/** One-sentence description, trimmed from frontmatter. */
	description: string;
	/** Maturity tier: full, partial, or bare. */
	tier: Tier;
	/** Routing domain this skill belongs to (see classifier.ts). */
	domain: SkillCategory;
	/** Free-form tags used for cross-referencing and search (see classifier.ts). */
	tags: string[];
	/** Short slugs usable as alternate lookup keys, e.g. "onboarding" for "hr-onboarding". */
	aliases: string[];
	/** Capabilities this skill supports — sourced from its "## Supported tasks" section. */
	capabilities: string[];
	/** Sample trigger phrases — sourced from its "## Key prompts" section. */
	triggerPhrases: string[];
	/** Which optional content subdirectories exist on disk. */
	paths: {
		content: boolean;
		prompts: boolean;
		examples: boolean;
	};
	/**
	 * Other skill IDs commonly used together with this one, derived from
	 * `CATEGORY_META.preamble` cross-references in classifier.ts. Empty when
	 * no explicit pairing is documented for the skill's domain.
	 */
	dependencies: string[];
	/**
	 * Other skill IDs in the same domain, ranked by shared-tag overlap and
	 * capped — a lightweight, fully deterministic recommendation graph.
	 */
	relatedSkills: string[];
}

/**
 * The full generated Skill Registry document.
 */
export interface Registry {
	/** Bump when the shape of RegistryEntry changes in a breaking way. */
	schemaVersion: number;
	/** ISO date (YYYY-MM-DD) the registry was generated on. */
	generatedAt: string;
	/** Total number of skills indexed. */
	skillCount: number;
	skills: RegistryEntry[];
}

// ---------------------------------------------------------------------------
// Planner and validation types
// ---------------------------------------------------------------------------

export type SelectionReason =
	| 'direct-capability-match'
	| 'alias-match'
	| 'domain-expert'
	| 'dependency-requirement'
	| 'recommended-pairing'
	| 'related-skill';

export interface ExecutionStep {
	/** Skill ID (e.g. "hr-onboarding"). */
	skillId: string;
	/** Sequential position in the plan (0-indexed). */
	order: number;
	/** Why this skill was selected. */
	reason: SelectionReason;
	/** Optional explanation for complex reasoning. */
	rationale?: string;
	/** Skill IDs that must be executed before this one (if any). */
	dependencies: string[];
	/** Optional context that will be passed from previous steps. */
	contextInputs?: Record<string, unknown>;
}

export interface CapabilityMatch {
	/** The requested capability from user intent. */
	capability: string;
	/** Matched skills ranked by relevance. */
	matches: Array<{
		skillId: string;
		matchType: 'direct' | 'partial' | 'related';
		score: number; // 0.0 to 1.0
		explanation: string;
	}>;
	/** Whether this capability has at least one match. */
	isMatched: boolean;
	/** Explanation if capability could not be matched. */
	unmatchedReason?: string;
}

export interface ExecutionPlan {
	/** User's original intent (normalized). */
	intent: string;
	/** Extracted capabilities from the intent. */
	requestedCapabilities: string[];
	/** How each capability matched against available skills. */
	capabilityMatches: CapabilityMatch[];
	/** Ordered list of skills to execute. */
	steps: ExecutionStep[];
	/** Summary of the plan for human review. */
	summary: string;
	/** Total estimated complexity (simple/moderate/complex). */
	complexity: 'simple' | 'moderate' | 'complex';
	/** Optional warnings or considerations. */
	notes?: string[];
}

export interface PlanValidationIssue {
	code: string;
	severity: 'error' | 'warning' | 'info';
	message: string;
	context?: Record<string, unknown>;
}

export interface PlanValidationResult {
	isValid: boolean;
	issues: PlanValidationIssue[];
}
