/**
 * Base error for all skill-related failures.
 */
export class SkillError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);
		this.name = new.target.name;
	}
}

/**
 * Error thrown when a skill cannot be parsed.
 */
export class ParseError extends SkillError {}

/**
 * Error thrown when a skill fails validation.
 */
export class ValidationError extends SkillError {
	constructor(
		message: string,
		public readonly errors: readonly string[] = [message],
		options?: ErrorOptions,
	) {
		super(message, options);
		Object.freeze(this.errors);
	}
}
