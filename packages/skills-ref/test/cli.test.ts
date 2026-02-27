import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'

const CLI = join(import.meta.dir, '../src/cli.ts')
const SKILLS_DIR = join(import.meta.dir, '../../../skills')

async function runCli(...args: string[]): Promise<{ stdout: string, stderr: string, exitCode: number }> {
  const proc = Bun.spawn(['bun', CLI, ...args], {
    stdout: 'pipe',
    stderr: 'pipe',
  })
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ])
  return { stdout, stderr, exitCode }
}

describe('skills-ref CLI', () => {
  describe('version', () => {
    it('prints version and exits 0', async () => {
      const { stdout, exitCode } = await runCli('version')
      expect(exitCode).toBe(0)
      expect(stdout).toMatch(/skills-ref v\d+\.\d+\.\d+/)
    })

    it('--version flag works', async () => {
      const { stdout, exitCode } = await runCli('--version')
      expect(exitCode).toBe(0)
      expect(stdout).toMatch(/skills-ref v/)
    })
  })

  describe('validate', () => {
    it('exits 0 for a valid skill directory', async () => {
      const { exitCode, stdout } = await runCli('validate', join(SKILLS_DIR, 'hr-recruiting'))
      expect(exitCode).toBe(0)
      expect(stdout).toContain('Valid skill')
    })

    it('exits 1 for a non-existent path', async () => {
      const { exitCode, stderr } = await runCli('validate', '/non/existent/path')
      expect(exitCode).toBe(1)
      expect(stderr).toContain('Validation failed')
    })

    it('exits 1 with no arguments', async () => {
      const { exitCode, stderr } = await runCli('validate')
      expect(exitCode).toBe(1)
      expect(stderr).toContain('validate requires a path argument')
    })

    it('accepts SKILL.md file path (resolves to parent dir)', async () => {
      const { exitCode } = await runCli('validate', join(SKILLS_DIR, 'hr-recruiting', 'SKILL.md'))
      expect(exitCode).toBe(0)
    })
  })

  describe('read-properties', () => {
    it('outputs valid JSON for a real skill', async () => {
      const { exitCode, stdout } = await runCli('read-properties', join(SKILLS_DIR, 'hr-recruiting'))
      expect(exitCode).toBe(0)
      const parsed = JSON.parse(stdout) as { name: string, description: string }
      expect(parsed.name).toBe('hr-recruiting')
      expect(typeof parsed.description).toBe('string')
    })

    it('exits 1 with no arguments', async () => {
      const { exitCode, stderr } = await runCli('read-properties')
      expect(exitCode).toBe(1)
      expect(stderr).toContain('read-properties requires a path argument')
    })
  })

  describe('to-prompt', () => {
    it('generates XML block for a real skill', async () => {
      const { exitCode, stdout } = await runCli('to-prompt', join(SKILLS_DIR, 'hr-recruiting'))
      expect(exitCode).toBe(0)
      expect(stdout).toContain('<available_skills>')
      expect(stdout).toContain('hr-recruiting')
      expect(stdout).toContain('</available_skills>')
    })

    it('exits 1 with no arguments', async () => {
      const { exitCode, stderr } = await runCli('to-prompt')
      expect(exitCode).toBe(1)
      expect(stderr).toContain('to-prompt requires at least one path argument')
    })

    it('accepts multiple skill paths', async () => {
      const { exitCode, stdout } = await runCli(
        'to-prompt',
        join(SKILLS_DIR, 'hr-recruiting'),
        join(SKILLS_DIR, 'hr-compliance'),
      )
      expect(exitCode).toBe(0)
      expect(stdout).toContain('hr-recruiting')
      expect(stdout).toContain('hr-compliance')
    })
  })

  describe('unknown command', () => {
    it('exits 1 and shows usage', async () => {
      const { exitCode, stderr } = await runCli('unknown-cmd')
      expect(exitCode).toBe(1)
      expect(stderr).toContain('Unknown command')
    })
  })

  describe('help', () => {
    it('--help prints usage and exits 0', async () => {
      const { exitCode, stdout } = await runCli('--help')
      expect(exitCode).toBe(0)
      expect(stdout).toContain('Usage:')
      expect(stdout).toContain('Commands:')
    })
  })
})
