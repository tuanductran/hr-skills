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
