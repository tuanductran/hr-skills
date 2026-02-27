import { describe, expect, it } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { validate } from '../src/validator.js'

const SKILLS_DIR = join(import.meta.dir, '../../../skills')

function makeTempSkill(content: string): string {
  const tmp = mkdtempSync(join(tmpdir(), 'skill-test-'))
  writeFileSync(join(tmp, 'SKILL.md'), content)
  return tmp
}

describe('validate', () => {
  it('returns no errors for a real HR skill', () => {
    const errors = validate(join(SKILLS_DIR, 'hr-recruiting'))
    expect(errors).toEqual([])
  })

  it('validates all 15 HR skills without errors', () => {
    const skillNames = [
      'hr-analytics',
      'hr-compensation-benefits',
      'hr-compliance',
      'hr-conflict-resolution',
      'hr-diversity-inclusion',
      'hr-employee-engagement',
      'hr-employee-relations',
      'hr-leadership-development',
      'hr-onboarding',
      'hr-performance-management',
      'hr-recruiting',
      'hr-technology',
      'hr-training-development',
      'hr-vietnam-context',
      'hr-workforce-planning',
    ]
    for (const name of skillNames) {
      const errors = validate(join(SKILLS_DIR, name))
      expect(errors).toEqual([])
    }
  })

  it('returns error for non-existent path', () => {
    const errors = validate('/non/existent/path')
    expect(errors.length).toBeGreaterThan(0)
    expect(errors[0]).toContain('does not exist')
  })

  it('returns error for missing SKILL.md', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'skill-test-'))
    try {
      const errors = validate(tmp)
      expect(errors).toContain('Missing required file: SKILL.md')
    }
    finally {
      rmSync(tmp, { recursive: true })
    }
  })

  it('returns error when name does not match directory name', () => {
    const tmp = makeTempSkill(`---\nname: wrong-name\ndescription: desc\n---\n`)
    try {
      const errors = validate(tmp)
      expect(errors.some(e => e.includes('must match skill name'))).toBe(true)
    }
    finally {
      rmSync(tmp, { recursive: true })
    }
  })

  it('returns error for missing required field name', () => {
    const tmp = makeTempSkill(`---\ndescription: desc\n---\n`)
    try {
      const errors = validate(tmp)
      expect(errors.some(e => e.includes('name'))).toBe(true)
    }
    finally {
      rmSync(tmp, { recursive: true })
    }
  })

  it('returns error for uppercase skill name', () => {
    const tmp = makeTempSkill(`---\nname: HR-Recruiting\ndescription: desc\n---\n`)
    try {
      const errors = validate(tmp)
      expect(errors.some(e => e.includes('lowercase'))).toBe(true)
    }
    finally {
      rmSync(tmp, { recursive: true })
    }
  })

  it('returns error for unexpected frontmatter fields', () => {
    const tmp = makeTempSkill(`---\nname: test\ndescription: desc\nunknown-field: value\n---\n`)
    try {
      const errors = validate(tmp)
      expect(errors.some(e => e.includes('Unexpected fields'))).toBe(true)
    }
    finally {
      rmSync(tmp, { recursive: true })
    }
  })

  it('returns error for name with consecutive hyphens', () => {
    const tmp = makeTempSkill(`---\nname: hr--test\ndescription: desc\n---\n`)
    try {
      const errors = validate(tmp)
      expect(errors.some(e => e.includes('consecutive hyphens'))).toBe(true)
    }
    finally {
      rmSync(tmp, { recursive: true })
    }
  })
})
