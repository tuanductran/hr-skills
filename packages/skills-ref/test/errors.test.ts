import { describe, expect, it } from 'bun:test'
import { ParseError, SkillError, ValidationError } from '../src/errors.js'

describe('SkillError', () => {
  it('is an Error subclass', () => {
    const err = new SkillError('msg')
    expect(err).toBeInstanceOf(Error)
    expect(err.name).toBe('SkillError')
    expect(err.message).toBe('msg')
  })
})

describe('ParseError', () => {
  it('is a SkillError subclass', () => {
    const err = new ParseError('parse fail')
    expect(err).toBeInstanceOf(SkillError)
    expect(err.name).toBe('ParseError')
    expect(err.message).toBe('parse fail')
  })
})

describe('ValidationError', () => {
  it('defaults errors to [message]', () => {
    const err = new ValidationError('invalid')
    expect(err).toBeInstanceOf(SkillError)
    expect(err.name).toBe('ValidationError')
    expect(err.errors).toEqual(['invalid'])
  })

  it('accepts explicit errors list', () => {
    const err = new ValidationError('many errors', ['err1', 'err2'])
    expect(err.errors).toEqual(['err1', 'err2'])
    expect(err.message).toBe('many errors')
  })
})
