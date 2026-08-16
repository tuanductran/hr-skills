import { describe, expect, it } from 'bun:test';
import type { BaseIssue } from 'valibot';

import { ParseError, SkillError, ValidationError } from '../src/errors.js';

describe('SkillError', () => {
	it('is a proper Error subclass', () => {
		const err = new SkillError('msg');

		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(SkillError);

		expect(err.name).toBe('SkillError');
		expect(err.message).toBe('msg');

		expect(Object.getPrototypeOf(err)).toBe(SkillError.prototype);
	});

	it('supports ErrorOptions.cause', () => {
		const cause = new Error('root cause');

		const err = new SkillError('msg', { cause });

		expect(err.cause).toBe(cause);
	});
});

describe('ParseError', () => {
	it('inherits from SkillError correctly', () => {
		const err = new ParseError('parse fail');

		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(SkillError);
		expect(err).toBeInstanceOf(ParseError);

		expect(err.name).toBe('ParseError');
		expect(err.message).toBe('parse fail');

		expect(Object.getPrototypeOf(err)).toBe(ParseError.prototype);
	});

	it('supports ErrorOptions.cause', () => {
		const cause = new Error('yaml error');

		const err = new ParseError('parse fail', { cause });

		expect(err.cause).toBe(cause);
	});
});

describe('ValidationError', () => {
	it('stores validation issues', () => {
		const issues = [
			{
				kind: 'schema',
				type: 'string',
				input: 123,
				expected: 'string',
				message: 'Expected string',
			},
		] as unknown as readonly BaseIssue<unknown>[];

		const err = new ValidationError('validation failed', issues);

		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(SkillError);
		expect(err).toBeInstanceOf(ValidationError);

		expect(err.name).toBe('ValidationError');
		expect(err.message).toBe('validation failed');

		expect(err.issues).toBe(issues);
	});

	it('freezes the issues array', () => {
		const issues = [] as unknown as readonly BaseIssue<unknown>[];

		const err = new ValidationError('validation failed', issues);

		expect(Array.isArray(err.issues)).toBe(true);
		expect(Object.isFrozen(err.issues)).toBe(true);
	});

	it('supports ErrorOptions.cause', () => {
		const cause = new Error('validation cause');

		const err = new ValidationError('validation failed', [], { cause });

		expect(err.cause).toBe(cause);
	});
});
