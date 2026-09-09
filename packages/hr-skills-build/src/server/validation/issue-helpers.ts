/**
 * Shared helper for recording `SkillValidationIssue`s.
 *
 * Every validator in `validate.ts` and `security.ts` repeated the same
 * `errors.push({ skill: skillName, message })` shape (jscpd flagged this as
 * duplicated across 10+ locations). Extracted here so the shape only exists
 * once — if `SkillValidationIssue` ever grows a field, only this file needs
 * to change.
 */

import type { SkillValidationIssue } from '../shared/types.js';

/**
 * Record a validation issue for `skillName` on `errors`.
 *
 * Kept intentionally trivial — this is not a place for extra logic
 * (formatting, dedupe, etc.). Callers stay responsible for deciding
 * *whether* to report; this only standardizes *how*.
 *
 * @param errors - Issue list to push onto (mutated in place).
 * @param skillName - Skill identifier to attribute the issue to.
 * @param message - Human-readable issue description.
 */
export function pushIssue(
	errors: SkillValidationIssue[],
	skillName: string,
	message: string,
): void {
	errors.push({ skill: skillName, message });
}

/** A single named pattern check, as used by the `security.ts` pattern lists. */
export interface LabeledPattern {
	pattern: RegExp;
	label: string;
}

/**
 * Test `text` against every entry in `patterns` and report one issue per
 * match via `messageFor(label)`.
 *
 * `security.ts` had this same `for (const { pattern, label } of LIST) { if
 * (pattern.test(text)) { ...push... } }` shape in three places
 * (`validateSecurityCommands`, `validateSensitivePaths`,
 * `validateCredentialLeaks`) — jscpd flagged each pair. Each caller keeps its
 * own list and message wording; only the iterate-and-report shape is shared.
 *
 * @param errors - Issue list to push onto (mutated in place).
 * @param skillName - Skill identifier to attribute issues to.
 * @param text - Text to test each pattern against.
 * @param patterns - Named patterns to check.
 * @param messageFor - Builds the issue message from a matched pattern's label.
 */
export function checkPatternList(
	errors: SkillValidationIssue[],
	skillName: string,
	text: string,
	patterns: readonly LabeledPattern[],
	messageFor: (label: string) => string,
): void {
	for (const { pattern, label } of patterns) {
		if (pattern.test(text)) {
			pushIssue(errors, skillName, messageFor(label));
		}
	}
}
