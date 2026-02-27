#!/usr/bin/env node
/**
 * Sync all skill references across the project.
 *
 * Run this after adding or removing a skill directory. It will:
 *   1. Discover skills from the filesystem (skills/ directory)
 *   2. Update config.ts HR_SKILLS array
 *   3. Update skill count (e.g. "15 skills") in all docs
 *   4. Rebuild the skills table in docs/installation.md
 *   5. Rebuild the skill scopes table in AGENTS.md
 *   6. Add missing skill sections to docs/skills.md
 *   7. Rebuild .claude-plugin/marketplace.json plugins array
 *
 * Usage:
 *   bun run sync
 */

import { access, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { consola } from 'consola'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../../..')
const SKILLS_DIR = join(ROOT, 'skills')

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SkillMeta {
  name: string
  description: string
  /** Description without the "Use when …" clause */
  coverage: string
  /** Short one-liner for tables (~60 chars) */
  shortSummary: string
  /** Scope sentence for AGENTS.md table */
  scopeSentence: string
  /** Up to 5 quoted prompts from Key prompts section */
  triggerPhrases: string[]
  /** Supported tasks list */
  supportedTasks: string[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function exists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  }
  catch {
    return false
  }
}

/** Discover all skill directories that contain a SKILL.md file */
async function discoverSkills(): Promise<string[]> {
  const entries = await readdir(SKILLS_DIR, { withFileTypes: true })
  const skills: string[] = []
  for (const entry of entries) {
    if (!entry.isDirectory())
      continue
    const skillFile = join(SKILLS_DIR, entry.name, 'SKILL.md')
    if (await exists(skillFile))
      skills.push(entry.name)
  }
  return skills.sort()
}

/** Parse SKILL.md and extract all metadata needed for syncing */
async function parseSkillMeta(skillName: string): Promise<SkillMeta> {
  const content = await readFile(join(SKILLS_DIR, skillName, 'SKILL.md'), 'utf-8')

  // Frontmatter
  const yaml = content.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
  const name = (yaml.match(/^name:[ \t]*(\S[^\n\r]*)$/m)?.[1] ?? skillName).trim()
  const description = (yaml.match(/^description:[ \t]*(\S[^\n\r]*)$/m)?.[1] ?? '').trim()

  // Split description into coverage (before "Use when") and trigger context
  const useWhenIdx = description.search(/Use when/i)
  const coverage = useWhenIdx !== -1
    ? description.slice(0, useWhenIdx).trim().replace(/\.$/, '')
    : description.trim().replace(/\.$/, '')

  // Supported tasks
  const tasksBlock = content.match(/## Supported tasks\n\n([\s\S]*?)(?=\n##)/)?.[1] ?? ''
  const supportedTasks = tasksBlock
    .split('\n')
    .filter(l => l.startsWith('- '))
    .map(l => l.replace(/^- /, '').trim())

  // Extract up to 5 quoted prompts from Key prompts section for trigger phrases
  const keyPromptsBlock = content.match(/## Key prompts\n\n([\s\S]*?)(?=\n## Tips|\n---\n|$)/)?.[1] ?? ''
  const quotedPrompts: string[] = []
  for (const m of keyPromptsBlock.matchAll(/^(?:\d+\. |[-*] )"([^"]+)"/gm)) {
    if (quotedPrompts.length >= 5)
      break
    quotedPrompts.push(m[1])
  }

  // Short summary for installation table: first clause of coverage, max 65 chars
  const firstClause = coverage.split('—')[1]?.trim() ?? coverage
  const shortSummary = firstClause.length > 65
    ? `${firstClause.slice(0, 62)}…`
    : firstClause

  // Scope sentence for AGENTS.md: coverage, capitalise first word
  const scopeSentence = `${coverage.charAt(0).toUpperCase()}${coverage.slice(1)}.`

  return {
    name,
    description,
    coverage,
    shortSummary,
    scopeSentence,
    triggerPhrases: quotedPrompts,
    supportedTasks,
  }
}

// ---------------------------------------------------------------------------
// Updaters
// ---------------------------------------------------------------------------

/** Replace every occurrence of "\d+ (HR )?(skill|AI skill)" with the current count */
function updateCounts(content: string, count: number): string {
  return content
    .replace(/\b\d+ HR AI skills\b/g, `${count} HR AI skills`)
    .replace(/\b\d+ AI skill files\b/g, `${count} AI skill files`)
    .replace(/\bAll \d+ (HR )?skills?\b/g, `All ${count} $1skills`)
    .replace(/\bValidate all \d+ skill SKILL\.md files\b/g, `Validate all ${count} skill SKILL.md files`)
    .replace(/\bValidate all \d+ HR skill definitions\b/g, `Validate all ${count} HR skill definitions`)
    .replace(/\b✓ All \d+ HR skills are valid\b/g, `✓ All ${count} HR skills are valid`)
    .replace(/\bAll \d+ SKILL\.md files must pass\b/g, `All ${count} SKILL.md files must pass`)
    .replace(/\bInstall all \d+ skills at once\b/g, `Install all ${count} skills at once`)
    .replace(/\b> \d+ skills available\b/g, `> ${count} skills available`)
}

/** Rebuild the HR_SKILLS array in config.ts */
async function syncConfig(skills: string[]): Promise<boolean> {
  const path = join(__dirname, 'config.ts')
  const original = await readFile(path, 'utf-8')
  const list = skills.map(s => `  '${s}',`).join('\n')
  const updated = original.replace(
    /export const HR_SKILLS = \[\n[\s\S]*?\] as const/,
    `export const HR_SKILLS = [\n${list}\n] as const`,
  )
  if (updated === original)
    return false
  await writeFile(path, updated)
  return true
}

/** Rebuild the plugins array in marketplace.json */
async function syncMarketplace(metas: SkillMeta[]): Promise<boolean> {
  const path = join(ROOT, '.claude-plugin/marketplace.json')
  const raw = await readFile(path, 'utf-8')
  const json = JSON.parse(raw) as { name: string, description: string, plugins: unknown[] }

  const plugins = metas.map(m => ({
    name: m.name,
    source: './',
    description: m.description,
    skills: [`./skills/${m.name}`],
  }))

  json.plugins = plugins
  const updated = `${JSON.stringify(json, null, 2)}\n`
  if (updated === raw)
    return false
  await writeFile(path, updated)
  return true
}

/** Rebuild the skill scopes table in AGENTS.md (between ## Skill scopes and next ##) */
async function syncAgentsTable(metas: SkillMeta[]): Promise<boolean> {
  const path = join(ROOT, 'AGENTS.md')
  const original = await readFile(path, 'utf-8')

  const tableHeader = '| Skill | Scope |\n|-------|-------|'
  const rows = metas.map(m => `| **${m.name}** | ${m.scopeSentence} |`).join('\n')
  const newTable = `${tableHeader}\n${rows}`

  const updated = original.replace(
    /\| Skill \| Scope \|\n\|[-|]+\|\n[\s\S]*?(?=\n## )/,
    `${newTable}\n`,
  )
  if (updated === original)
    return false
  await writeFile(path, updateCounts(updated, metas.length))
  return true
}

/** Rebuild the skills table in docs/installation.md (between the table header and the "See skills.md" line) */
async function syncInstallationTable(metas: SkillMeta[]): Promise<boolean> {
  const path = join(ROOT, 'docs/installation.md')
  const original = await readFile(path, 'utf-8')

  const tableHeader = '| Skill | What it covers |\n|----------------|--------|'
  const rows = metas
    .map(m => `| \`${m.name}\` | ${m.shortSummary} |`)
    .join('\n')
  const newTable = `${tableHeader}\n${rows}`

  const updated = original.replace(
    /\| Skill \| What it covers \|\n\|[-|]+\|\n[\s\S]*?(?=\nSee \[skills\.md\])/,
    `${newTable}\n\n`,
  )
  if (updated === original)
    return false
  await writeFile(path, updateCounts(updated, metas.length))
  return true
}

/** Add missing skill sections to docs/skills.md without touching existing ones */
async function syncSkillsDocs(metas: SkillMeta[]): Promise<boolean> {
  const path = join(ROOT, 'docs/skills.md')
  let content = await readFile(path, 'utf-8')
  let changed = false

  for (const m of metas) {
    // Check if section already exists
    if (content.includes(`\n## ${m.name}\n`) || content.startsWith(`## ${m.name}\n`))
      continue

    const triggerList = m.triggerPhrases.length > 0
      ? m.triggerPhrases.map(p => `- "${p}"`).join('\n')
      : '- [Add trigger phrases here]'

    const section = [
      '',
      '---',
      '',
      `## ${m.name}`,
      '',
      `**What it covers:** ${m.coverage}.`,
      '',
      '**Use when you say:**',
      '',
      triggerList,
    ].join('\n')

    content = `${content.trimEnd() + section}\n`
    changed = true
  }

  if (changed || content !== await readFile(path, 'utf-8')) {
    await writeFile(path, updateCounts(content, metas.length))
    return true
  }
  return false
}

/** Apply count updates to simple files (README.md, package.json, docs/, packages/) */
async function syncCountsInFile(filePath: string, count: number): Promise<boolean> {
  const original = await readFile(filePath, 'utf-8')
  const updated = updateCounts(original, count)
  if (updated === original)
    return false
  await writeFile(filePath, updated)
  return true
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function sync(): Promise<void> {
  consola.start('Syncing HR skills project…')

  // 1. Discover skills
  const skillNames = await discoverSkills()
  consola.info(`Found ${skillNames.length} skills:`)
  for (const s of skillNames) consola.log(`  ${s}`)

  // 2. Parse metadata for all skills
  const metas = await Promise.all(skillNames.map(parseSkillMeta))

  // 3. Update config.ts
  const configChanged = await syncConfig(skillNames)
  consola[configChanged ? 'success' : 'info'](configChanged ? 'Updated config.ts' : 'config.ts already in sync')

  // 4. Update marketplace.json
  const marketplaceChanged = await syncMarketplace(metas)
  consola[marketplaceChanged ? 'success' : 'info'](marketplaceChanged ? 'Updated .claude-plugin/marketplace.json' : 'marketplace.json already in sync')

  // 5. Update AGENTS.md skill scopes table + counts
  const agentsChanged = await syncAgentsTable(metas)
  consola[agentsChanged ? 'success' : 'info'](agentsChanged ? 'Updated AGENTS.md' : 'AGENTS.md already in sync')

  // 6. Update docs/installation.md skills table + counts
  const installationChanged = await syncInstallationTable(metas)
  consola[installationChanged ? 'success' : 'info'](installationChanged ? 'Updated docs/installation.md' : 'docs/installation.md already in sync')

  // 7. Add missing sections to docs/skills.md
  const skillsDocChanged = await syncSkillsDocs(metas)
  consola[skillsDocChanged ? 'success' : 'info'](skillsDocChanged ? 'Updated docs/skills.md' : 'docs/skills.md already in sync')

  // 8. Update simple count references across remaining files
  const simpleFiles = [
    join(ROOT, 'README.md'),
    join(ROOT, 'package.json'),
    join(ROOT, 'docs/getting-started.md'),
    join(ROOT, 'docs/contributing.md'),
    join(ROOT, 'packages/hr-skills-build/README.md'),
  ]
  for (const f of simpleFiles) {
    const rel = f.replace(`${ROOT}/`, '')
    const changed = await syncCountsInFile(f, skillNames.length)
    consola[changed ? 'success' : 'info'](changed ? `Updated ${rel}` : `${rel} already in sync`)
  }

  consola.success('Sync complete')
}

void sync()
