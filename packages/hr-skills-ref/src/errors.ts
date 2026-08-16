import type { BaseIssue } from 'valibot';

/**
 * Base class for all skill-related errors.
 */
export class SkillError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);

		this.name = new.target.name;
	}
}

/**
 * Thrown when a skill cannot be parsed.
 */
export class ParseError extends SkillError {}

/**
 * Thrown when skill validation fails.
 */
export class ValidationError extends SkillError {
	constructor(
		message: string,
		readonly issues: readonly BaseIssue<unknown>[],
		options?: ErrorOptions,
	) {
		super(message, options);

		Object.freeze(this.issues);
	}
}
