import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { HR_SKILLS, SKILLS_DIR } from '../src/config.js'

describe('HR_SKILLS', () => {
  it('has 15 skills', () => {
    expect(HR_SKILLS.length).toBe(15)
  })

  it('all names are lowercase kebab-case', () => {
    for (const name of HR_SKILLS) {
      expect(name).toMatch(/^[a-z][a-z0-9-]*[a-z0-9]$/)
    }
  })

  it('all names start with hr-', () => {
    for (const name of HR_SKILLS) {
      expect(name.startsWith('hr-')).toBe(true)
    }
  })

  it('has no duplicates', () => {
    const set = new Set(HR_SKILLS)
    expect(set.size).toBe(HR_SKILLS.length)
  })
})

describe('SKILLS_DIR', () => {
  it('points to an existing directory', () => {
    expect(existsSync(SKILLS_DIR)).toBe(true)
  })

  it('contains all expected skill subdirectories', () => {
    for (const name of HR_SKILLS) {
      expect(existsSync(join(SKILLS_DIR, name))).toBe(true)
    }
  })
})
