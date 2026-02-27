#!/usr/bin/env node
/**
 * Validate all HR skill SKILL.md files for correct structure and required fields
 */

import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { consola } from 'consola'
import { HR_SKILLS, SKILLS_DIR } from './config.js'

interface ValidationError {
  skill: string
  message: string
}

interface SkillFrontmatter {
  name?: string
  description?: string
  metadata?: {
    author?: string
    version?: string
  }
}

/**
 * Parse YAML-style frontmatter from a SKILL.md file
 */
function parseFrontmatter(content: string): SkillFrontmatter {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match)
    return {}

  const yaml = match[1]
  const result: SkillFrontmatter = {}

  const nameMatch = yaml.match(/^name:[ \t]*(\S[^\n\r]*)$/m)
  if (nameMatch)
    result.name = nameMatch[1].trim()

  const descMatch = yaml.match(/^description:[ \t]*(\S[^\n\r]*)$/m)
  if (descMatch)
    result.description = descMatch[1].trim()

  const authorMatch = yaml.match(/^[ \t]+author:[ \t]*(\S[^\n\r]*)$/m)
  const versionMatch = yaml.match(/^[ \t]+version:[ \t]*"?(\S[^"\n\r]*?)"?$/m)
  if (authorMatch || versionMatch) {
    result.metadata = {}
    if (authorMatch)
      result.metadata.author = authorMatch[1].trim()
    if (versionMatch)
      result.metadata.version = versionMatch[1].trim()
  }

  return result
}

/**
 * Validate a single skill SKILL.md
 */
async function validateSkill(skillName: string): Promise<ValidationError[]> {
  const errors: ValidationError[] = []
  const skillFile = join(SKILLS_DIR, skillName, 'SKILL.md')

  let content: string
  try {
    content = await readFile(skillFile, 'utf-8')
  }
  catch {
    errors.push({ skill: skillName, message: 'SKILL.md file not found' })
    return errors
  }

  const fm = parseFrontmatter(content)

  if (fm.name == null || fm.name === '') {
    errors.push({ skill: skillName, message: 'Missing frontmatter: name' })
  }
  else if (fm.name !== skillName) {
    errors.push({ skill: skillName, message: `Name mismatch: frontmatter says "${fm.name}", expected "${skillName}"` })
  }

  if (fm.description == null || fm.description === '') {
    errors.push({ skill: skillName, message: 'Missing frontmatter: description' })
  }
  else if (fm.description.length < 50) {
    errors.push({ skill: skillName, message: 'Description is too short (should be at least 50 characters)' })
  }

  if (fm.metadata?.author == null || fm.metadata.author === '') {
    errors.push({ skill: skillName, message: 'Missing metadata.author' })
  }

  if (fm.metadata?.version == null || fm.metadata.version === '') {
    errors.push({ skill: skillName, message: 'Missing metadata.version' })
  }

  // Check required sections
  const requiredSections = ['## Supported tasks', '## Key prompts', '## Tips']
  for (const section of requiredSections) {
    if (!content.includes(section)) {
      errors.push({ skill: skillName, message: `Missing required section: ${section}` })
    }
  }

  // Check minimum content length
  if (content.length < 1000) {
    errors.push({ skill: skillName, message: 'SKILL.md content is too short (less than 1000 characters)' })
  }

  return errors
}

/**
 * Main validation function
 */
async function validate() {
  consola.start('Validating HR Skills...')

  const allErrors: ValidationError[] = []

  for (const skillName of HR_SKILLS) {
    const errors = await validateSkill(skillName)
    if (errors.length > 0) {
      allErrors.push(...errors)
    }
    else {
      consola.success(skillName)
    }
  }

  if (allErrors.length > 0) {
    consola.error('Validation failed:')
    allErrors.forEach((error) => {
      consola.error(`  ${error.skill}: ${error.message}`)
    })
    process.exit(1)
  }
  else {
    consola.success(`All ${HR_SKILLS.length} HR skills are valid`)
  }
}

void validate()
