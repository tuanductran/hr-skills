/** Skill-related error hierarchy. */

export class SkillError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SkillError'
  }
}

export class ParseError extends SkillError {
  constructor(message: string) {
    super(message)
    this.name = 'ParseError'
  }
}

export class ValidationError extends SkillError {
  readonly errors: string[]

  constructor(message: string, errors?: string[]) {
    super(message)
    this.name = 'ValidationError'
    this.errors = errors ?? [message]
  }
}
