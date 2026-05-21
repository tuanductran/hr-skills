/** Skill-related error hierarchy. */

export class SkillError extends Error {
	constructor(message: string) {
		super(message);

		this.name = new.target.name;

		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class ParseError extends SkillError {}

export class ValidationError extends SkillError {
	public readonly errors: readonly string[];

	constructor(message: string, errors?: string[]) {
		super(message);

		this.errors = Object.freeze(errors ?? [message]);
	}
}
