#!/usr/bin/env node
/**
 * Generate a catalog of all HR skills with their names and descriptions
 */

import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import process from 'node:process'
import { consola } from 'consola'
import { HR_SKILLS, SKILLS_DIR } from './config.js'

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
    content = await readFile(skillFile, 'utf-8')
  }
  catch {
    consola.error(`Could not read ${skillName}/SKILL.md`)
    return null
  }

  // Parse frontmatter
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/)
  const yaml = fmMatch ? fmMatch[1] : ''

  const name = (yaml.match(/^name:[ \t]*(\S[^\n\r]*)$/m)?.[1] ?? skillName).trim()
  const description = (yaml.match(/^description:[ \t]*(\S[^\n\r]*)$/m)?.[1] ?? '').trim()
  const author = (yaml.match(/^[ \t]+author:[ \t]*(\S[^\n\r]*)$/m)?.[1] ?? '').trim()
  const version = (yaml.match(/^[ \t]+version:[ \t]*"?(\S[^"\n\r]*?)"?$/m)?.[1] ?? '1.0.0').trim()

  // Extract supported tasks
  const tasksMatch = content.match(/## Supported tasks\n\n([\s\S]*?)(?=\n##)/)
  const supportedTasks = tasksMatch
    ? tasksMatch[1]
        .split('\n')
        .filter(line => line.startsWith('- '))
        .map(line => line.replace(/^- /, '').trim())
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
    await writeFile(outputFile, catalogContent, 'utf-8')
    consola.success(`Catalog written to skills/CATALOG.md (${skills.length} skills)`)
  }
}

void catalog()
