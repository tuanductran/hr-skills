import { describe, expect, it } from 'bun:test'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { ParseError } from '../src/errors.js'
import { findSkillMd, parseFrontmatter, readProperties } from '../src/parser.js'

const SKILLS_DIR = join(import.meta.dir, '../../../skills')

describe('parseFrontmatter', () => {
  it('parses valid frontmatter', () => {
    const content = `---\nname: hr-test\ndescription: A test skill\n---\n\n## Body\n`
    const [meta, body] = parseFrontmatter(content)
    expect(meta.name).toBe('hr-test')
    expect(meta.description).toBe('A test skill')
    expect(body).toContain('## Body')
  })

  it('parses nested metadata fields', () => {
    const content = `---\nname: hr-test\ndescription: desc\nmetadata:\n  author: Alice\n  version: "1.0"\n---\n`
    const [meta] = parseFrontmatter(content)
    expect(meta.metadata).toEqual({ author: 'Alice', version: '1.0' })
  })

  it('throws ParseError if content does not start with ---', () => {
    expect(() => parseFrontmatter('no frontmatter')).toThrow(ParseError)
  })

  it('throws ParseError if frontmatter is not closed', () => {
    expect(() => parseFrontmatter('---\nname: hr-test\n')).toThrow(ParseError)
  })

  it('handles quoted string values', () => {
    const content = `---\nname: "hr-test"\ndescription: "A quoted skill"\n---\n`
    const [meta] = parseFrontmatter(content)
    expect(meta.name).toBe('hr-test')
    expect(meta.description).toBe('A quoted skill')
  })
})

describe('findSkillMd', () => {
  it('returns path for existing SKILL.md', () => {
    const result = findSkillMd(join(SKILLS_DIR, 'hr-recruiting'))
    expect(result).not.toBeNull()
    expect(result).toContain('SKILL.md')
  })

  it('returns null for directory without SKILL.md', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'skill-test-'))
    try {
      expect(findSkillMd(tmp)).toBeNull()
    }
    finally {
      rmSync(tmp, { recursive: true })
    }
  })
})

describe('readProperties', () => {
  it('reads properties from a real skill directory', () => {
    const props = readProperties(join(SKILLS_DIR, 'hr-recruiting'))
    expect(props.name).toBe('hr-recruiting')
    expect(typeof props.description).toBe('string')
    expect(props.description.length).toBeGreaterThan(0)
  })

  it('throws ParseError if no SKILL.md found', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'skill-test-'))
    try {
      expect(() => readProperties(tmp)).toThrow(ParseError)
    }
    finally {
      rmSync(tmp, { recursive: true })
    }
  })

  it('throws ValidationError if name field is missing', () => {
    const tmp = mkdtempSync(join(tmpdir(), 'skill-test-'))
    writeFileSync(join(tmp, 'SKILL.md'), `---\ndescription: desc\n---\n`)
    try {
      expect(() => readProperties(tmp)).toThrow()
    }
    finally {
      rmSync(tmp, { recursive: true })
    }
  })
})
