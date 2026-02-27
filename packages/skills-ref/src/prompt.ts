/** Generate <available_skills> XML prompt block for agent system prompts. */

import { join, resolve } from 'node:path'
import { findSkillMd, readProperties } from './parser.js'

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Generate the <available_skills> XML block for inclusion in agent prompts.
 *
 * @param skillDirs - List of paths to skill directories
 * @returns XML string with <available_skills> block
 *
 * @example
 * ```xml
 * <available_skills>
 * <skill>
 * <name>hr-recruiting</name>
 * <description>Recruiting and talent acquisition prompts</description>
 * <location>/path/to/hr-recruiting/SKILL.md</location>
 * </skill>
 * </available_skills>
 * ```
 */
export function toPrompt(skillDirs: string[]): string {
  if (skillDirs.length === 0) {
    return '<available_skills>\n</available_skills>'
  }

  const lines: string[] = ['<available_skills>']

  for (const skillDir of skillDirs) {
    const resolved = resolve(skillDir)
    const props = readProperties(resolved)

    lines.push('<skill>')
    lines.push('<name>')
    lines.push(escapeXml(props.name))
    lines.push('</name>')
    lines.push('<description>')
    lines.push(escapeXml(props.description))
    lines.push('</description>')

    const skillMdPath = findSkillMd(resolved)
    lines.push('<location>')
    lines.push(skillMdPath ?? join(resolved, 'SKILL.md'))
    lines.push('</location>')

    lines.push('</skill>')
  }

  lines.push('</available_skills>')
  return lines.join('\n')
}
