#!/usr/bin/env bun
/**
 * Generate a catalog of all HR skills with their names and descriptions
 */

import { join } from 'node:path'
import process from 'node:process'
import { consola } from 'consola'
import { HR_SKILLS, SKILLS_DIR } from './config.js'

// Regex patterns
const fmRegex = /^---\n([\s\S]*?)\n---/
const nameRegex = /^name:[ \t]*(\S[^\n\r]*)$/m
const descriptionRegex = /^description:[ \t]*(\S[^\n\r]*)$/m
const authorRegex = /^[ \t]+author:[ \t]*(\S[^\n\r]*)$/m
const versionRegex = /^[ \t]+version:[ \t]*"?(\S[^"\n\r]*?)"?$/m
const tasksRegex = /## Supported tasks\n\n([\s\S]*?)(?=\n##)/
const dashSpaceRegex = /^- /

interface SkillCatalogEntry {
  name: string
  description: string
  author: string
  version: string
  supportedTasks: string[]
}

/**
 * Parse SKILL.md and extract catalog information
 */
async function parseSkill(skillName: string): Promise<SkillCatalogEntry | null> {
  const skillFile = join(SKILLS_DIR, skillName, 'SKILL.md')

  let content: string
  try {
    content = await Bun.file(skillFile).text()
  }
  catch {
    consola.error(`Could not read ${skillName}/SKILL.md`)
    return null
  }

  // Parse frontmatter
  const fmMatch = content.match(fmRegex)
  const yaml = fmMatch ? fmMatch[1] : ''

  const name = (yaml.match(nameRegex)?.[1] ?? skillName).trim()
  const description = (yaml.match(descriptionRegex)?.[1] ?? '').trim()
  const author = (yaml.match(authorRegex)?.[1] ?? '').trim()
  const version = (yaml.match(versionRegex)?.[1] ?? '1.0.0').trim()

  // Extract supported tasks
  const tasksMatch = content.match(tasksRegex)
  const supportedTasks = tasksMatch
    ? tasksMatch[1]
        .split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => line.replace(dashSpaceRegex, '').trim())
    : []

  return { name, description, author, version, supportedTasks }
}

/**
 * Generate markdown catalog
 */
function generateCatalog(skills: SkillCatalogEntry[]): string {
  let md = '# HR Skills Catalog\n\n'
  md += `> ${skills.length} skills available for HR professionals\n\n`
  md += '---\n\n'

  for (const skill of skills) {
    md += `## ${skill.name}\n\n`
    md += `${skill.description}\n\n`
    md += `**Version:** ${skill.version} | **Author:** ${skill.author}\n\n`
    if (skill.supportedTasks.length > 0) {
      md += '**Supported tasks:**\n\n'
      skill.supportedTasks.forEach((task) => {
        md += `- ${task}\n`
      })
      md += '\n'
    }
    md += '---\n\n'
  }

  return `${md.trimEnd()}\n`
}

/**
 * Main catalog function
 */
async function catalog() {
  const listOnly = process.argv.includes('--list')

  consola.start('Generating HR Skills catalog...')

  const skills: SkillCatalogEntry[] = []

  for (const skillName of HR_SKILLS) {
    const entry = await parseSkill(skillName)
    if (entry) {
      skills.push(entry)
      if (listOnly) {
        consola.log(`  ${entry.name}: ${entry.description.slice(0, 80)}...`)
      }
    }
  }

  if (!listOnly) {
    const catalogContent = generateCatalog(skills)
    const outputFile = join(SKILLS_DIR, 'CATALOG.md')
    await Bun.write(outputFile, catalogContent)
    consola.success(`Catalog written to skills/CATALOG.md (${skills.length} skills)`)
  }
}

void catalog()
