import { describe, expect, it } from 'bun:test';
import { ParseError, SkillError, ValidationError } from '../src/errors.js';

describe('SkillError', () => {
	it('is a proper Error subclass', () => {
		const err = new SkillError('msg');

		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(SkillError);

		expect(err.name).toBe('SkillError');
		expect(err.message).toBe('msg');

		// correct prototype chain check
		expect(Object.getPrototypeOf(err)).toBe(SkillError.prototype);
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

		// correct prototype chain check
		expect(Object.getPrototypeOf(err)).toBe(ParseError.prototype);
	});
});

describe('ValidationError', () => {
	it('defaults errors to [message]', () => {
		const err = new ValidationError('invalid');

		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(SkillError);
		expect(err).toBeInstanceOf(ValidationError);

		expect(err.name).toBe('ValidationError');
		expect(err.message).toBe('invalid');

		expect(err.errors).toEqual(['invalid']);
	});

	it('accepts explicit errors list', () => {
		const err = new ValidationError('many errors', ['err1', 'err2']);

		expect(err.errors).toEqual(['err1', 'err2']);
		expect(err.message).toBe('many errors');
	});

	it('always exposes readonly errors array', () => {
		const err = new ValidationError('x');

		expect(Array.isArray(err.errors)).toBe(true);

		// ensure immutability
		expect(Object.isFrozen(err.errors)).toBe(true);
	});
});
