#!/usr/bin/env bun
/** CLI for skills-ref library. */

import { basename, dirname, resolve } from 'node:path'
import process from 'node:process'
import { SkillError } from './errors.js'
import { toDict } from './models.js'
import { readProperties } from './parser.js'
import { toPrompt } from './prompt.js'
import { validate } from './validator.js'

const VERSION = '0.1.0'

function isSkillMdFile(p: string): boolean {
  const base = basename(p).toLowerCase()
  return base === 'skill.md'
}

function resolveSkillPath(p: string): string {
  return isSkillMdFile(p) ? dirname(p) : p
}

function printUsage(): void {
  console.log(`skills-ref v${VERSION}

Reference library for Agent Skills.

Usage:
  skills-ref <command> [options]

Commands:
  validate <path>              Validate a skill directory
  read-properties <path>       Read and print skill properties as JSON
  to-prompt <paths...>         Generate <available_skills> XML for agent prompts
  version                      Print version

Exit codes:
  0: Success
  1: Validation errors or parse error
`)
}

function cmdValidate(args: string[]): number {
  if (args.length === 0) {
    console.error('Error: validate requires a path argument')
    return 1
  }

  const skillPath = resolveSkillPath(resolve(args[0]))
  const errors = validate(skillPath)

  if (errors.length > 0) {
    console.error(`Validation failed for ${skillPath}:`)
    for (const err of errors) {
      console.error(`  - ${err}`)
    }
    return 1
  }

  console.log(`Valid skill: ${skillPath}`)
  return 0
}

function cmdReadProperties(args: string[]): number {
  if (args.length === 0) {
    console.error('Error: read-properties requires a path argument')
    return 1
  }

  try {
    const skillPath = resolveSkillPath(resolve(args[0]))
    const props = readProperties(skillPath)
    console.log(JSON.stringify(toDict(props), null, 2))
    return 0
  }
  catch (e) {
    if (e instanceof SkillError) {
      console.error(`Error: ${e.message}`)
      return 1
    }
    throw e
  }
}

function cmdToPrompt(args: string[]): number {
  if (args.length === 0) {
    console.error('Error: to-prompt requires at least one path argument')
    return 1
  }

  try {
    const resolvedPaths = args.map(p => resolveSkillPath(resolve(p)))
    const output = toPrompt(resolvedPaths)
    console.log(output)
    return 0
  }
  catch (e) {
    if (e instanceof SkillError) {
      console.error(`Error: ${e.message}`)
      return 1
    }
    throw e
  }
}

function main(): void {
  const [, , command, ...rest] = process.argv

  if (!command || command === '--help' || command === '-h') {
    printUsage()
    process.exit(0)
  }

  if (command === 'version' || command === '--version' || command === '-v') {
    console.log(`skills-ref v${VERSION}`)
    process.exit(0)
  }

  let exitCode: number

  switch (command) {
    case 'validate':
      exitCode = cmdValidate(rest)
      break
    case 'read-properties':
      exitCode = cmdReadProperties(rest)
      break
    case 'to-prompt':
      exitCode = cmdToPrompt(rest)
      break
    default:
      console.error(`Unknown command: ${command}`)
      printUsage()
      exitCode = 1
  }

  process.exit(exitCode)
}

main()
