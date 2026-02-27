import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { toPrompt } from '../src/prompt.js'

const SKILLS_DIR = join(import.meta.dir, '../../../skills')

describe('toPrompt', () => {
  it('returns empty available_skills block for no dirs', () => {
    const result = toPrompt([])
    expect(result).toBe('<available_skills>\n</available_skills>')
  })

  it('generates XML block for a real skill', () => {
    const result = toPrompt([join(SKILLS_DIR, 'hr-recruiting')])
    expect(result).toContain('<available_skills>')
    expect(result).toContain('<name>')
    expect(result).toContain('hr-recruiting')
    expect(result).toContain('<description>')
    expect(result).toContain('<location>')
    expect(result).toContain('</available_skills>')
  })

  it('includes all provided skills in output', () => {
    const dirs = [
      join(SKILLS_DIR, 'hr-recruiting'),
      join(SKILLS_DIR, 'hr-compliance'),
    ]
    const result = toPrompt(dirs)
    expect(result).toContain('hr-recruiting')
    expect(result).toContain('hr-compliance')
  })

  it('location points to a SKILL.md file', () => {
    const result = toPrompt([join(SKILLS_DIR, 'hr-onboarding')])
    expect(result).toContain('SKILL.md')
  })
})
