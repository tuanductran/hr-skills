import { describe, expect, it } from 'bun:test'
import { toDict } from '../src/models.js'

describe('toDict', () => {
  it('returns required fields only', () => {
    const result = toDict({ name: 'hr-test', description: 'A test skill' })
    expect(result).toEqual({ name: 'hr-test', description: 'A test skill' })
  })

  it('includes optional fields when provided', () => {
    const result = toDict({
      name: 'hr-test',
      description: 'A test skill',
      license: 'MIT',
      compatibility: 'claude-3',
      allowedTools: 'bash',
      metadata: { author: 'Alice', version: '1.0' },
    })
    expect(result.license).toBe('MIT')
    expect(result.compatibility).toBe('claude-3')
    expect(result['allowed-tools']).toBe('bash')
    expect(result.metadata).toEqual({ author: 'Alice', version: '1.0' })
  })

  it('omits undefined optional fields', () => {
    const result = toDict({ name: 'hr-test', description: 'desc' })
    expect('license' in result).toBe(false)
    expect('compatibility' in result).toBe(false)
    expect('allowed-tools' in result).toBe(false)
    expect('metadata' in result).toBe(false)
  })

  it('omits metadata when empty object', () => {
    const result = toDict({ name: 'hr-test', description: 'desc', metadata: {} })
    expect('metadata' in result).toBe(false)
  })
})
