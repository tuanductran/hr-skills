/**
 * Configuration for HR Skills build tooling
 */

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const SKILLS_DIR = join(__dirname, '../../..', 'skills')

export const HR_SKILLS = [
  'hr-analytics',
  'hr-compensation-benefits',
  'hr-compliance',
  'hr-conflict-resolution',
  'hr-diversity-inclusion',
  'hr-employee-engagement',
  'hr-employee-relations',
  'hr-leadership-development',
  'hr-onboarding',
  'hr-performance-management',
  'hr-recruiting',
  'hr-technology',
  'hr-training-development',
  'hr-vietnam-context',
  'hr-workforce-planning',
] as const

export type HRSkillName = typeof HR_SKILLS[number]
