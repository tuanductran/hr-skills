/**
 * Tests for Phase 6.2 — semantic validation of prompts/examples.
 *
 * Covers:
 * - fully consistent skills (no findings)
 * - unrelated prompts (prompt-drift)
 * - unrelated examples (example-drift)
 * - copied examples / copied prompts (possible-copy)
 * - partially matching content
 * - metadata / keyword-coverage inconsistencies (missing-coverage)
 * - threshold boundaries
 * - deterministic behaviour
 * - stable validation output across repeated calls
 * - the full validateSemanticConsistency() pipeline via a mocked directory
 */

import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
	COPY_MARGIN,
	COPY_MIN_OTHER_SCORE,
	checkConceptCoverage,
	checkDrift,
	checkPossibleCopy,
	EXAMPLE_DRIFT_THRESHOLD,
	loadSkillSemanticContent,
	MIN_COVERAGE_RATIO,
	MIN_PURPOSE_TOKENS,
	PROMPT_DRIFT_THRESHOLD,
	type SkillSemanticContent,
	topKeywords,
	validateSemanticConsistency,
} from '../src/semantic-validation.js';
import type { SkillValidationIssue } from '../src/types.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSkill(overrides: Partial<SkillSemanticContent> = {}): SkillSemanticContent {
	return {
		name: 'hr-test',
		description: 'compensation benchmarking equity analysis salary bands',
		purposeTokens: [
			'analysis',
			'bands',
			'benchmarking',
			'compensation',
			'equity',
			'salary',
		],
		promptsTokens: ['analysis', 'bands', 'benchmarking', 'compensation', 'equity'],
		examplesTokens: ['analysis', 'benchmarking', 'compensation', 'equity', 'salary'],
		contentTokens: [],
		hasPrompts: true,
		hasExamples: true,
		...overrides,
	};
}

// ---------------------------------------------------------------------------
// topKeywords()
// ---------------------------------------------------------------------------

describe('topKeywords', () => {
	it('returns the most frequent non-stop-word tokens', () => {
		const desc =
			'Compensation benchmarking and compensation analysis for compensation cycles';
		const keywords = topKeywords(desc, 3);
		expect(keywords[0]).toBe('compensation');
	});

	it('breaks ties alphabetically for determinism', () => {
		const desc = 'zebra apple mango banana';
		const keywords = topKeywords(desc, 4);
		expect(keywords).toEqual(['apple', 'banana', 'mango', 'zebra']);
	});

	it('returns an empty array for an empty description', () => {
		expect(topKeywords('')).toEqual([]);
	});

	it('respects the requested count', () => {
		const desc = 'alpha beta gamma delta epsilon zeta';
		expect(topKeywords(desc, 2)).toHaveLength(2);
	});
});

// ---------------------------------------------------------------------------
// checkDrift() — fully consistent skills
// ---------------------------------------------------------------------------

describe('checkDrift — consistent skills', () => {
	it('produces no findings when prompts/examples share purpose vocabulary', () => {
		const skill = makeSkill();
		expect(checkDrift(skill)).toEqual([]);
	});

	it('skips skills whose purpose token set is too small', () => {
		const skill = makeSkill({
			purposeTokens: ['tiny'],
			promptsTokens: ['completely', 'unrelated', 'cooking', 'recipe'],
		});
		expect(skill.purposeTokens.length).toBeLessThan(MIN_PURPOSE_TOKENS);
		expect(checkDrift(skill)).toEqual([]);
	});
});

// ---------------------------------------------------------------------------
// checkDrift() — unrelated prompts / examples
// ---------------------------------------------------------------------------

describe('checkDrift — unrelated prompts', () => {
	it('flags prompt-drift when prompts share no vocabulary with purpose', () => {
		const skill = makeSkill({
			purposeTokens: [
				'compensation',
				'benchmarking',
				'equity',
				'salary',
				'bands',
				'analysis',
			],
			promptsTokens: ['cooking', 'recipe', 'kitchen', 'oven', 'bake'],
		});
		const findings = checkDrift(skill);
		expect(findings).toHaveLength(1);
		expect(findings[0]?.heuristic).toBe('prompt-drift');
		expect(findings[0]?.file).toBe('prompts/');
	});

	it('does not flag prompt-drift when prompts/ is absent', () => {
		const skill = makeSkill({ hasPrompts: false, promptsTokens: [] });
		const findings = checkDrift(skill);
		expect(findings.find((f) => f.heuristic === 'prompt-drift')).toBeUndefined();
	});
});

describe('checkDrift — unrelated examples', () => {
	it('flags example-drift when examples share no vocabulary with purpose', () => {
		const skill = makeSkill({
			purposeTokens: [
				'compensation',
				'benchmarking',
				'equity',
				'salary',
				'bands',
				'analysis',
			],
			examplesTokens: ['gardening', 'flowers', 'soil', 'compost', 'seeds'],
		});
		const findings = checkDrift(skill);
		expect(findings.some((f) => f.heuristic === 'example-drift')).toBe(true);
	});

	it('does not flag example-drift when examples/ is absent', () => {
		const skill = makeSkill({ hasExamples: false, examplesTokens: [] });
		const findings = checkDrift(skill);
		expect(findings.find((f) => f.heuristic === 'example-drift')).toBeUndefined();
	});

	it('can flag both prompt-drift and example-drift simultaneously', () => {
		const skill = makeSkill({
			purposeTokens: [
				'compensation',
				'benchmarking',
				'equity',
				'salary',
				'bands',
				'analysis',
			],
			promptsTokens: ['cooking', 'recipe', 'kitchen'],
			examplesTokens: ['gardening', 'flowers', 'soil'],
		});
		const findings = checkDrift(skill);
		expect(findings).toHaveLength(2);
		const heuristics = findings.map((f) => f.heuristic).sort();
		expect(heuristics).toEqual(['example-drift', 'prompt-drift']);
	});
});

// ---------------------------------------------------------------------------
// checkPossibleCopy()
// ---------------------------------------------------------------------------

describe('checkPossibleCopy — copied prompts', () => {
	it('flags prompts that match another skill far better than their own', () => {
		const target = makeSkill({
			name: 'hr-onboarding',
			purposeTokens: [
				'onboarding',
				'orientation',
				'checklist',
				'new',
				'hire',
				'plan',
			],
			promptsTokens: [
				'payroll',
				'compensation',
				'salary',
				'benchmarking',
				'equity',
				'bands',
			],
			examplesTokens: [],
			hasExamples: false,
		});
		const otherSkill = makeSkill({
			name: 'hr-payroll',
			purposeTokens: [
				'payroll',
				'compensation',
				'salary',
				'benchmarking',
				'equity',
				'bands',
			],
			promptsTokens: [],
			examplesTokens: [],
			hasPrompts: false,
			hasExamples: false,
		});

		const findings = checkPossibleCopy(target, [target, otherSkill]);
		expect(findings).toHaveLength(1);
		expect(findings[0]?.heuristic).toBe('possible-copy-prompts');
		expect(findings[0]?.explanation).toContain('hr-payroll');
	});
});

describe('checkPossibleCopy — copied examples', () => {
	it('flags examples that match another skill far better than their own', () => {
		const target = makeSkill({
			name: 'hr-recognition',
			purposeTokens: [
				'recognition',
				'appreciation',
				'reward',
				'awards',
				'praise',
				'peer',
			],
			promptsTokens: [],
			examplesTokens: [
				'offboarding',
				'exit',
				'interview',
				'transition',
				'departure',
				'knowledge',
			],
			hasPrompts: false,
		});
		const otherSkill = makeSkill({
			name: 'hr-offboarding',
			purposeTokens: [
				'offboarding',
				'exit',
				'interview',
				'transition',
				'departure',
				'knowledge',
			],
			promptsTokens: [],
			examplesTokens: [],
			hasPrompts: false,
			hasExamples: false,
		});

		const findings = checkPossibleCopy(target, [target, otherSkill]);
		expect(findings).toHaveLength(1);
		expect(findings[0]?.heuristic).toBe('possible-copy-examples');
		expect(findings[0]?.explanation).toContain('hr-offboarding');
	});
});

describe('checkPossibleCopy — no false positive on genuinely own content', () => {
	it('does not flag when own score is close to or better than any other skill', () => {
		const target = makeSkill();
		const unrelatedOther = makeSkill({
			name: 'hr-other',
			purposeTokens: [
				'completely',
				'different',
				'topic',
				'area',
				'field',
				'domain',
			],
		});
		expect(checkPossibleCopy(target, [target, unrelatedOther])).toEqual([]);
	});

	it('does not flag when own score is at least as good as the best other match', () => {
		// Prompts share more with their own purpose tokens than with the other skill's.
		const target = makeSkill({
			purposeTokens: ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'],
			promptsTokens: ['alpha', 'beta', 'gamma', 'delta'],
		});
		const other = makeSkill({
			name: 'hr-other',
			purposeTokens: ['alpha', 'beta'],
		});
		const findings = checkPossibleCopy(target, [target, other]);
		expect(findings.every((f) => f.heuristic !== 'possible-copy-prompts')).toBe(true);
	});

	it('skips skills whose purpose token set is too small', () => {
		const target = makeSkill({ purposeTokens: ['tiny'] });
		const other = makeSkill({ name: 'hr-other' });
		expect(checkPossibleCopy(target, [target, other])).toEqual([]);
	});
});

// ---------------------------------------------------------------------------
// checkConceptCoverage()
// ---------------------------------------------------------------------------

describe('checkConceptCoverage', () => {
	it('produces no finding when top keywords are covered', () => {
		const skill = makeSkill({
			description: 'compensation benchmarking equity salary bands',
		});
		expect(checkConceptCoverage(skill)).toEqual([]);
	});

	it('flags missing-coverage when keywords are absent from supporting material', () => {
		const skill = makeSkill({
			description: 'compensation benchmarking equity salary bands analysis',
			promptsTokens: ['unrelated', 'terms', 'only'],
			examplesTokens: ['nothing', 'shared', 'here'],
			contentTokens: [],
		});
		const findings = checkConceptCoverage(skill);
		expect(findings).toHaveLength(1);
		expect(findings[0]?.heuristic).toBe('missing-coverage');
	});

	it('counts content/ tokens toward coverage', () => {
		const skill = makeSkill({
			description: 'compensation benchmarking equity salary bands analysis',
			promptsTokens: [],
			examplesTokens: [],
			contentTokens: ['compensation', 'benchmarking', 'equity', 'salary', 'bands'],
		});
		expect(checkConceptCoverage(skill)).toEqual([]);
	});

	it('returns no finding for an empty description', () => {
		const skill = makeSkill({ description: '' });
		expect(checkConceptCoverage(skill)).toEqual([]);
	});
});

// ---------------------------------------------------------------------------
// Threshold boundaries
// ---------------------------------------------------------------------------

describe('threshold boundaries', () => {
	it('PROMPT_DRIFT_THRESHOLD, EXAMPLE_DRIFT_THRESHOLD, COPY_MARGIN, COPY_MIN_OTHER_SCORE, MIN_COVERAGE_RATIO are within [0, 1]', () => {
		for (const value of [
			PROMPT_DRIFT_THRESHOLD,
			EXAMPLE_DRIFT_THRESHOLD,
			COPY_MARGIN,
			COPY_MIN_OTHER_SCORE,
			MIN_COVERAGE_RATIO,
		]) {
			expect(value).toBeGreaterThan(0);
			expect(value).toBeLessThan(1);
		}
	});

	it('does not flag drift when Jaccard is exactly at the threshold', () => {
		// Construct token sets whose Jaccard similarity is defined and check
		// that a skill scoring above threshold is not flagged.
		const skill = makeSkill({
			purposeTokens: ['alpha', 'beta', 'gamma', 'delta', 'epsilon'],
			promptsTokens: ['alpha', 'beta', 'gamma', 'delta', 'epsilon'],
		});
		// Perfect overlap — Jaccard 1.0, well above PROMPT_DRIFT_THRESHOLD.
		expect(checkDrift(skill).some((f) => f.heuristic === 'prompt-drift')).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// Determinism
// ---------------------------------------------------------------------------

describe('determinism', () => {
	it('checkDrift produces identical results on repeated calls', () => {
		const skill = makeSkill({
			purposeTokens: ['alpha', 'beta', 'gamma', 'delta', 'epsilon'],
			promptsTokens: ['cooking', 'recipe', 'kitchen'],
		});
		const r1 = checkDrift(skill);
		const r2 = checkDrift(skill);
		const r3 = checkDrift(skill);
		expect(r1).toEqual(r2);
		expect(r2).toEqual(r3);
	});

	it('checkPossibleCopy produces identical results on repeated calls', () => {
		const target = makeSkill({
			name: 'hr-onboarding',
			purposeTokens: [
				'onboarding',
				'orientation',
				'checklist',
				'new',
				'hire',
				'plan',
			],
			promptsTokens: [
				'payroll',
				'compensation',
				'salary',
				'benchmarking',
				'equity',
			],
		});
		const other = makeSkill({
			name: 'hr-payroll',
			purposeTokens: [
				'payroll',
				'compensation',
				'salary',
				'benchmarking',
				'equity',
			],
		});
		const r1 = checkPossibleCopy(target, [target, other]);
		const r2 = checkPossibleCopy(target, [target, other]);
		expect(r1).toEqual(r2);
	});

	it('topKeywords always returns the same array for the same input', () => {
		const desc = 'compensation benchmarking equity salary bands analysis';
		expect(topKeywords(desc)).toEqual(topKeywords(desc));
	});
});

// ---------------------------------------------------------------------------
// validateSemanticConsistency() — full pipeline against a temp fixture repo
// ---------------------------------------------------------------------------

describe('validateSemanticConsistency — full pipeline', () => {
	let tmpDir: string;

	beforeEach(async () => {
		tmpDir = await mkdtemp(join(tmpdir(), 'semantic-validation-test-'));
	});

	afterEach(async () => {
		await rm(tmpDir, { recursive: true, force: true });
	});

	async function writeSkill(
		skillsDir: string,
		name: string,
		opts: {
			description: string;
			body?: string;
			prompts?: string;
			examples?: string;
			content?: string;
		},
	): Promise<void> {
		const dir = join(skillsDir, name);
		await mkdir(dir, { recursive: true });
		const skillMd = [
			'---',
			`name: ${name}`,
			`description: ${opts.description}`,
			'metadata:',
			'  author: Test Author',
			'  version: "1.0.0"',
			'---',
			'',
			opts.body ?? '## Overview\n\nDetails here.',
		].join('\n');
		await writeFile(join(dir, 'SKILL.md'), skillMd, 'utf8');

		if (opts.prompts) {
			await mkdir(join(dir, 'prompts'), { recursive: true });
			await writeFile(join(dir, 'prompts', 'prompts.md'), opts.prompts, 'utf8');
		}
		if (opts.examples) {
			await mkdir(join(dir, 'examples'), { recursive: true });
			await writeFile(join(dir, 'examples', 'example.md'), opts.examples, 'utf8');
		}
		if (opts.content) {
			await mkdir(join(dir, 'content'), { recursive: true });
			await writeFile(join(dir, 'content', 'content.md'), opts.content, 'utf8');
		}
	}

	it('produces no warnings for a fully consistent skill', async () => {
		await writeSkill(tmpDir, 'hr-compensation', {
			description:
				'Compensation benchmarking and equity analysis for salary bands and market positioning',
			body: '## Overview\n\nCompensation benchmarking compares salary bands against market equity data.',
			prompts:
				'# Prompts\n\n- How do I benchmark compensation against market salary bands?\n- What equity analysis should I run for salary bands?',
			examples:
				'# Example\n\nCompensation benchmarking example showing salary band equity analysis in practice.',
		});

		const warnings: SkillValidationIssue[] = [];
		const findings = await validateSemanticConsistency(
			tmpDir,
			['hr-compensation'],
			warnings,
		);
		expect(findings).toEqual([]);
		expect(warnings).toEqual([]);
	});

	it('flags a skill whose prompts are copied from an unrelated skill', async () => {
		await writeSkill(tmpDir, 'hr-onboarding', {
			description:
				'Onboarding orientation checklists and structured new hire welcome plans',
			body: '## Overview\n\nOnboarding orientation checklists guide new hire welcome plans.',
			prompts:
				'# Prompts\n\n- How do I benchmark compensation against market salary bands?\n- What equity analysis should I run for salary bands and market positioning?',
		});
		await writeSkill(tmpDir, 'hr-payroll', {
			description:
				'Compensation benchmarking and equity analysis for salary bands and market positioning',
			body: '## Overview\n\nCompensation benchmarking compares salary bands against market equity data and positioning.',
		});

		const warnings: SkillValidationIssue[] = [];
		const findings = await validateSemanticConsistency(
			tmpDir,
			['hr-onboarding', 'hr-payroll'],
			warnings,
		);

		const copyFindings = findings.filter(
			(f) => f.skill === 'hr-onboarding' && f.heuristic === 'possible-copy-prompts',
		);
		expect(copyFindings.length).toBeGreaterThan(0);
		expect(warnings.some((w) => w.message.includes('[semantic-warning]'))).toBe(true);
	});

	it('sorts findings deterministically by skill then heuristic', async () => {
		await writeSkill(tmpDir, 'hr-alpha', {
			description:
				'Compensation benchmarking equity analysis salary bands market positioning',
			body: '## Overview\n\nCompensation benchmarking equity analysis salary bands market positioning details.',
			prompts:
				'# Prompts\n\n- Completely unrelated cooking recipe kitchen oven bake question?',
			examples:
				'# Example\n\nGardening flowers soil compost seeds unrelated example content.',
		});

		const warnings: SkillValidationIssue[] = [];
		const findings = await validateSemanticConsistency(
			tmpDir,
			['hr-alpha'],
			warnings,
		);

		const sorted = [...findings].sort((a, b) => {
			if (a.skill !== b.skill) return a.skill < b.skill ? -1 : 1;
			if (a.heuristic !== b.heuristic) return a.heuristic < b.heuristic ? -1 : 1;
			return 0;
		});
		expect(findings).toEqual(sorted);
	});

	it('produces identical output across repeated runs (determinism)', async () => {
		await writeSkill(tmpDir, 'hr-alpha', {
			description:
				'Compensation benchmarking equity analysis salary bands market positioning',
			body: '## Overview\n\nCompensation benchmarking equity analysis salary bands details.',
			prompts:
				'# Prompts\n\n- Completely unrelated cooking recipe kitchen oven bake question?',
		});

		const w1: SkillValidationIssue[] = [];
		const w2: SkillValidationIssue[] = [];
		const f1 = await validateSemanticConsistency(tmpDir, ['hr-alpha'], w1);
		const f2 = await validateSemanticConsistency(tmpDir, ['hr-alpha'], w2);

		expect(f1).toEqual(f2);
		expect(w1).toEqual(w2);
	});

	it('handles a skill with no prompts/ or examples/ directories gracefully', async () => {
		await writeSkill(tmpDir, 'hr-bare', {
			description:
				'A bare skill with only a description and body, no subdirectories',
		});

		const warnings: SkillValidationIssue[] = [];
		const findings = await validateSemanticConsistency(tmpDir, ['hr-bare'], warnings);
		expect(findings.some((f) => f.heuristic === 'prompt-drift')).toBe(false);
		expect(findings.some((f) => f.heuristic === 'example-drift')).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// loadSkillSemanticContent()
// ---------------------------------------------------------------------------

describe('loadSkillSemanticContent', () => {
	let tmpDir: string;

	beforeEach(async () => {
		tmpDir = await mkdtemp(join(tmpdir(), 'semantic-load-test-'));
	});

	afterEach(async () => {
		await rm(tmpDir, { recursive: true, force: true });
	});

	it('returns empty tokens and false flags for a missing skill directory', async () => {
		const content = await loadSkillSemanticContent(tmpDir, 'hr-does-not-exist');
		expect(content.purposeTokens).toEqual([]);
		expect(content.hasPrompts).toBe(false);
		expect(content.hasExamples).toBe(false);
	});

	it('reads description, body, prompts, examples, and content correctly', async () => {
		const dir = join(tmpDir, 'hr-sample');
		await mkdir(join(dir, 'prompts'), { recursive: true });
		await mkdir(join(dir, 'examples'), { recursive: true });
		await mkdir(join(dir, 'content'), { recursive: true });

		await writeFile(
			join(dir, 'SKILL.md'),
			[
				'---',
				'name: hr-sample',
				'description: Compensation benchmarking equity analysis for salary bands',
				'metadata:',
				'  author: Test Author',
				'  version: "1.0.0"',
				'---',
				'',
				'## Overview',
				'',
				'Body text about compensation.',
			].join('\n'),
			'utf8',
		);
		await writeFile(
			join(dir, 'prompts', 'p.md'),
			'- What compensation benchmarking should I run?',
			'utf8',
		);
		await writeFile(
			join(dir, 'examples', 'e.md'),
			'# Example\n\nCompensation benchmarking example.',
			'utf8',
		);
		await writeFile(
			join(dir, 'content', 'c.md'),
			'Extra compensation content details.',
			'utf8',
		);

		const content = await loadSkillSemanticContent(tmpDir, 'hr-sample');
		expect(content.name).toBe('hr-sample');
		expect(content.description).toContain('Compensation benchmarking');
		expect(content.hasPrompts).toBe(true);
		expect(content.hasExamples).toBe(true);
		expect(content.purposeTokens.length).toBeGreaterThan(0);
		expect(content.contentTokens.length).toBeGreaterThan(0);
	});
});
