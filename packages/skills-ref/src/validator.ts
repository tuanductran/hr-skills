/** Skill validation logic. */

import { existsSync, readFileSync, statSync } from 'node:fs'
import { basename } from 'node:path'

import { ParseError } from './errors.js'
import { findSkillMd, parseFrontmatter } from './parser.js'

const MAX_SKILL_NAME_LENGTH = 64
const MAX_DESCRIPTION_LENGTH = 1024
const MAX_COMPATIBILITY_LENGTH = 500

const ALLOWED_FIELDS = new Set([
  'name',
  'description',
  'license',
  'allowed-tools',
  'metadata',
  'compatibility',
])

function validateName(name: unknown, skillDir: string): string[] {
  const errors: string[] = []

  if (name == null || typeof name !== 'string' || name.trim().length === 0) {
    return ['Field \'name\' must be a non-empty string']
  }

  const n = name.trim()

  if (n.length > MAX_SKILL_NAME_LENGTH) {
    errors.push(
      `Skill name '${n}' exceeds ${MAX_SKILL_NAME_LENGTH} character limit (${n.length} chars)`,
    )
  }

  if (n !== n.toLowerCase()) {
    errors.push(`Skill name '${n}' must be lowercase`)
  }

  if (n.startsWith('-') || n.endsWith('-')) {
    errors.push('Skill name cannot start or end with a hyphen')
  }

  if (n.includes('--')) {
    errors.push('Skill name cannot contain consecutive hyphens')
  }

  if (!/^[a-z0-9-]+$/.test(n)) {
    errors.push(
      `Skill name '${n}' contains invalid characters. Only letters, digits, and hyphens are allowed.`,
    )
  }

  const dirName = basename(skillDir)
  if (dirName !== n) {
    errors.push(`Directory name '${dirName}' must match skill name '${n}'`)
  }

  return errors
}

function validateDescription(description: unknown): string[] {
  if (description == null || typeof description !== 'string' || description.trim().length === 0) {
    return ['Field \'description\' must be a non-empty string']
  }

  if (description.length > MAX_DESCRIPTION_LENGTH) {
    return [
      `Description exceeds ${MAX_DESCRIPTION_LENGTH} character limit (${description.length} chars)`,
    ]
  }

  return []
}

function validateCompatibility(compatibility: unknown): string[] {
  if (typeof compatibility !== 'string') {
    return ['Field \'compatibility\' must be a string']
  }

  if (compatibility.length > MAX_COMPATIBILITY_LENGTH) {
    return [
      `Compatibility exceeds ${MAX_COMPATIBILITY_LENGTH} character limit (${compatibility.length} chars)`,
    ]
  }

  return []
}

function validateMetadataFields(metadata: Record<string, unknown>): string[] {
  const extra = Object.keys(metadata).filter(k => !ALLOWED_FIELDS.has(k))
  if (extra.length > 0) {
    return [
      `Unexpected fields in frontmatter: ${extra.sort().join(', ')}. Only ${[...ALLOWED_FIELDS].sort().join(', ')} are allowed.`,
    ]
  }
  return []
}

/**
 * Validate a skill directory.
 * Returns a list of error messages. Empty list means valid.
 */
export function validate(skillDir: string): string[] {
  if (!existsSync(skillDir)) {
    return [`Path does not exist: ${skillDir}`]
  }

  const stat = statSync(skillDir)
  if (!stat.isDirectory()) {
    return [`Not a directory: ${skillDir}`]
  }

  const skillMd = findSkillMd(skillDir)
  if (skillMd == null) {
    return ['Missing required file: SKILL.md']
  }

  let content: string
  try {
    content = readFileSync(skillMd, 'utf8')
  }
  catch (e) {
    return [`Failed to read SKILL.md: ${String(e)}`]
  }

  let metadata: Record<string, unknown>
  try {
    [metadata] = parseFrontmatter(content)
  }
  catch (e) {
    if (e instanceof ParseError)
      return [e.message]
    return [`Failed to parse SKILL.md: ${String(e)}`]
  }

  const errors: string[] = []
  errors.push(...validateMetadataFields(metadata))

  if (!('name' in metadata)) {
    errors.push('Missing required field in frontmatter: name')
  }
  else {
    errors.push(...validateName(metadata.name, skillDir))
  }

  if (!('description' in metadata)) {
    errors.push('Missing required field in frontmatter: description')
  }
  else {
    errors.push(...validateDescription(metadata.description))
  }

  if ('compatibility' in metadata) {
    errors.push(...validateCompatibility(metadata.compatibility))
  }

  return errors
}
