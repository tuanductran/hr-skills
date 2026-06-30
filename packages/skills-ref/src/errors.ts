/** Base error for all skill-related failures. */
export class SkillError extends Error {
	constructor(message: string, options?: ErrorOptions) {
		super(message, options);

		this.name = new.target.name;
	}
}

export class ParseError extends SkillError {}

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
