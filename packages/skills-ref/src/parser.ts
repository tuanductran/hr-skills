/** YAML frontmatter parsing for SKILL.md files. */

import type { SkillProperties } from './models.js'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ParseError, ValidationError } from './errors.js'

/** Find SKILL.md in a skill directory. Prefers uppercase, accepts lowercase. */
export function findSkillMd(skillDir: string): string | null {
  for (const name of ['SKILL.md', 'skill.md']) {
    const p = join(skillDir, name)
    if (existsSync(p))
      return p
  }
  return null
}

/** Parse YAML frontmatter from SKILL.md content. Returns [metadata, body]. */
export function parseFrontmatter(content: string): [Record<string, unknown>, string] {
  if (!content.startsWith('---')) {
    throw new ParseError('SKILL.md must start with YAML frontmatter (---)')
  }

  const parts = content.split('---')
  if (parts.length < 3) {
    throw new ParseError('SKILL.md frontmatter not properly closed with ---')
  }

  const frontmatterStr = parts[1]
  const body = parts.slice(2).join('---').trim()

  const metadata = parseSimpleYaml(frontmatterStr)
  return [metadata, body]
}

/** Minimal YAML parser for SKILL.md frontmatter (key: value, nested via indentation). */
function parseSimpleYaml(yaml: string): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  const lines = yaml.split('\n')

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trimEnd()
    if (!trimmed || trimmed.startsWith('#')) {
      i++
      continue
    }

    const colonIdx = trimmed.indexOf(':')
    if (colonIdx === -1) {
      i++
      continue
    }

    const key = trimmed.slice(0, colonIdx).trim()
    const rest = trimmed.slice(colonIdx + 1).trim()
    const indent = line.search(/\S/)

    if (rest === '' || rest === '|' || rest === '>') {
      // Nested object: collect indented children
      const nested: Record<string, string> = {}
      i++
      while (i < lines.length) {
        const childLine = lines[i]
        const childTrimmed = childLine.trimEnd()
        if (!childTrimmed) {
          i++
          break
        }
        const childIndent = childLine.search(/\S/)
        if (childIndent <= indent)
          break
        const childColon = childTrimmed.indexOf(':')
        if (childColon !== -1) {
          const ck = childTrimmed.slice(0, childColon).trim()
          const cv = childTrimmed.slice(childColon + 1).trim()
          nested[ck] = unquote(cv)
        }
        i++
      }
      result[key] = nested
      continue
    }

    result[key] = unquote(rest)
    i++
  }

  return result
}

function unquote(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"'))
    || (value.startsWith('\'') && value.endsWith('\''))
  ) {
    return value.slice(1, -1)
  }
  return value
}

/** Type guard: checks that a value is a plain (non-array) object. */
function isPlainObject(v: unknown): v is Record<string, unknown> {
  return v != null && typeof v === 'object' && !Array.isArray(v)
}

/**
 * Read skill properties from SKILL.md frontmatter.
 * Does NOT perform full validation — use validate() for that.
 */
export function readProperties(skillDir: string): SkillProperties {
  const skillMd = findSkillMd(skillDir)
  if (skillMd == null) {
    throw new ParseError(`SKILL.md not found in ${skillDir}`)
  }

  const content = readFileSync(skillMd, 'utf8')
  const [metadata] = parseFrontmatter(content)

  if (!('name' in metadata)) {
    throw new ValidationError('Missing required field in frontmatter: name')
  }
  if (!('description' in metadata)) {
    throw new ValidationError('Missing required field in frontmatter: description')
  }

  const rawName = metadata.name
  const rawDescription = metadata.description

  if (typeof rawName !== 'string' || rawName.trim().length === 0) {
    throw new ValidationError('Field \'name\' must be a non-empty string')
  }
  if (typeof rawDescription !== 'string' || rawDescription.trim().length === 0) {
    throw new ValidationError('Field \'description\' must be a non-empty string')
  }

  const metaRecord: Record<string, string> | undefined = isPlainObject(metadata.metadata)
    ? Object.fromEntries(
        Object.entries(metadata.metadata).map(([k, v]) => [k, String(v)]),
      )
    : undefined

  return {
    name: rawName.trim(),
    description: rawDescription.trim(),
    license: metadata.license != null ? String(metadata.license) : undefined,
    compatibility: metadata.compatibility != null ? String(metadata.compatibility) : undefined,
    allowedTools: metadata['allowed-tools'] != null ? String(metadata['allowed-tools']) : undefined,
    metadata: metaRecord,
  }
}
