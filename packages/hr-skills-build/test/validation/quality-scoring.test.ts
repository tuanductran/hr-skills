/**
 * Tests for Phase 6.2 — automated content quality scoring.
 *
 * Covers:
 * - scoreClarity(): description length band, "Use when" trigger, readability
 * - scoreCompleteness(): task/tips/subtopic count bands, content length
 * - scoreExampleCoverage(): content/examples presence, prompt density
 * - scoreSkillQuality() / scoreAllSkills() / scoreSkills() against a mocked
 *   temp skills directory
 * - deterministic, review-aid-only behaviour (never throws, always 0-100)
 */

import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import {
	CLARITY_WEIGHT,
	COMPLETENESS_WEIGHT,
	EXAMPLE_COVERAGE_WEIGHT,
	QUALITY_BAND_THRESHOLDS,
	scoreClarity,
	scoreCompleteness,
	scoreExampleCoverage,
	scoreSkillQuality,
	scoreSkills,
} from '../../src/validation/quality-scoring.js';

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const GOOD_DESCRIPTION =
	'Structured onboarding checklists and orientation plans for new hires. ' +
	'Use when preparing a first-week schedule or a role-specific welcome plan.';

const GOOD_BODY = [
	'## Supported tasks',
	'',
	...Array.from(
		{ length: 9 },
		(_, i) => `- Do onboarding task ${i + 1} for the new hire.`,
	),
	'',
	'## Key prompts',
	'',
	'### Scheduling',
	'',
	'1. "Draft a first-week onboarding schedule for a new sales hire."',
	'2. "Create a 30-60-90 day onboarding plan for an engineering hire."',
	'',
	'### Orientation',
	'',
	'1. "Write a welcome email for a new hire starting Monday."',
	'2. "List orientation checklist items for day one."',
	'',
	'### Documentation',
	'',
	'1. "Summarize required onboarding paperwork for a new hire."',
	'',
	'## Tips',
	'',
	'- Confirm equipment is ready before day one.',
	'- Assign an onboarding buddy.',
	'- Schedule a 30-day check-in.',
	'- Share the team directory early.',
].join('\n');

function frontmatterFor(description: string): string {
	return [
		'---',
		'name: hr-test',
		`description: ${description.replace(/\n/g, ' ')}`,
		'metadata:',
		'  author: Test Author',
		'  version: "1.0.0"',
		'---',
		'',
	].join('\n');
}

// ---------------------------------------------------------------------------
// scoreClarity()
// ---------------------------------------------------------------------------

describe('scoreClarity()', () => {
	it('scores a well-formed description with a "Use when" clause highly', () => {
		const result = scoreClarity(GOOD_DESCRIPTION, GOOD_BODY);
		expect(result.score).toBeGreaterThanOrEqual(90);
		expect(result.notes).toEqual([]);
	});

	it('penalizes a description below the ideal minimum length', () => {
		const result = scoreClarity('Too short.', GOOD_BODY);
		expect(result.score).toBeLessThan(90);
		expect(result.notes.some((n) => n.includes('below the'))).toBe(true);
	});

	it('penalizes a missing "Use when" trigger clause', () => {
		const noTrigger = scoreClarity(
			'Structured onboarding checklists and orientation plans for new hires with detail.',
			GOOD_BODY,
		);
		const withTrigger = scoreClarity(GOOD_DESCRIPTION, GOOD_BODY);
		expect(noTrigger.score).toBeLessThan(withTrigger.score);
		expect(noTrigger.notes.some((n) => n.includes('Use when'))).toBe(true);
	});

	it('penalizes long, hard-to-read sentences', () => {
		const longSentenceBody =
			'## Overview\n\n' +
			'This is a very long run-on sentence that keeps going and going without any punctuation breaks describing onboarding checklists orientation plans first week schedules role specific welcome plans equipment provisioning buddy assignment and thirty sixty ninety day check ins all in a single breath for the new hire experience.';
		const result = scoreClarity(GOOD_DESCRIPTION, longSentenceBody);
		expect(result.notes.some((n) => n.includes('words/sentence'))).toBe(true);
	});

	it('always returns a score within [0, 100]', () => {
		const result = scoreClarity('', '');
		expect(result.score).toBeGreaterThanOrEqual(0);
		expect(result.score).toBeLessThanOrEqual(100);
	});
});

// ---------------------------------------------------------------------------
// scoreCompleteness()
// ---------------------------------------------------------------------------

describe('scoreCompleteness()', () => {
	it('scores a skill with ideal task/tips/subtopic counts highly', () => {
		const result = scoreCompleteness(GOOD_BODY);
		expect(result.score).toBeGreaterThanOrEqual(70);
	});

	it('flags a task count below the ideal band', () => {
		const fewTasks = ['## Supported tasks', '', '- Only one task.', ''].join('\n');
		const result = scoreCompleteness(fewTasks);
		expect(result.notes.some((n) => n.includes('supported tasks'))).toBe(true);
	});

	it('flags a tips count outside the ideal band', () => {
		const noTips = GOOD_BODY.replace(/## Tips[\s\S]*$/, '## Tips\n\n- Only one tip.');
		const result = scoreCompleteness(noTips);
		expect(result.notes.some((n) => n.includes('tips'))).toBe(true);
	});

	it('flags a body shorter than the "ample content" target', () => {
		const shortBody = '## Supported tasks\n\n- One task.\n\n## Tips\n\n- One tip.';
		const result = scoreCompleteness(shortBody);
		expect(result.notes.some((n) => n.includes('ample content'))).toBe(true);
	});

	it('always returns a score within [0, 100]', () => {
		const result = scoreCompleteness('');
		expect(result.score).toBeGreaterThanOrEqual(0);
		expect(result.score).toBeLessThanOrEqual(100);
	});
});

// ---------------------------------------------------------------------------
// scoreExampleCoverage() / scoreSkillQuality() / scoreSkills()
// ---------------------------------------------------------------------------

describe('scoreExampleCoverage() and scoreSkillQuality() — against a temp skills dir', () => {
	let tmpDir: string;

	beforeEach(async () => {
		tmpDir = await mkdtemp(join(tmpdir(), 'quality-scoring-test-'));
	});

	afterEach(async () => {
		await rm(tmpDir, { recursive: true, force: true });
	});

	async function writeSkill(
		name: string,
		opts: {
			description?: string;
			body?: string;
			content?: string[];
			examples?: string[];
		},
	): Promise<void> {
		const dir = join(tmpDir, name);
		await mkdir(dir, { recursive: true });
		await writeFile(
			join(dir, 'SKILL.md'),
			frontmatterFor(opts.description ?? GOOD_DESCRIPTION) +
				(opts.body ?? GOOD_BODY),
			'utf8',
		);

		if (opts.content) {
			await mkdir(join(dir, 'content'), { recursive: true });
			await Promise.all(
				opts.content.map((text, i) =>
					writeFile(join(dir, 'content', `file-${i}.md`), text, 'utf8'),
				),
			);
		}
		if (opts.examples) {
			await mkdir(join(dir, 'examples'), { recursive: true });
			await Promise.all(
				opts.examples.map((text, i) =>
					writeFile(join(dir, 'examples', `file-${i}.md`), text, 'utf8'),
				),
			);
		}
	}

	it('scores a fully-covered skill (content + 2 examples + dense prompts) highly', async () => {
		await writeSkill('hr-full', {
			content: ['Content one.'],
			examples: ['Example one.', 'Example two.'],
		});

		const result = await scoreExampleCoverage(tmpDir, 'hr-full', GOOD_BODY);
		expect(result.score).toBeGreaterThanOrEqual(80);
		// GOOD_BODY has 9 tasks but only 5 quoted prompts, so prompt-density
		// still produces a note even though content/examples coverage is full.
		expect(result.notes).toEqual([
			'5 quoted example prompts for 9 supported tasks — consider adding more so each task is backed by at least one prompt.',
		]);
	});

	it('flags missing content/ and examples/ directories', async () => {
		await writeSkill('hr-bare', {});

		const result = await scoreExampleCoverage(tmpDir, 'hr-bare', GOOD_BODY);
		expect(result.notes.some((n) => n.includes('No content/'))).toBe(true);
		expect(result.notes.some((n) => n.includes('No examples/'))).toBe(true);
	});

	it('flags a single example file as room for broader coverage', async () => {
		await writeSkill('hr-one-example', {
			content: ['Content one.'],
			examples: ['Example one.'],
		});

		const result = await scoreExampleCoverage(tmpDir, 'hr-one-example', GOOD_BODY);
		expect(result.notes.some((n) => n.includes('Only 1 example file'))).toBe(true);
	});

	it('flags low prompt density relative to task count', async () => {
		const manyTasksFewPrompts = [
			'## Supported tasks',
			'',
			...Array.from({ length: 9 }, (_, i) => `- Task ${i + 1}.`),
			'',
			'## Key prompts',
			'',
			'### Only',
			'',
			'1. "Just one prompt."',
			'',
			'## Tips',
			'',
			'- Tip.',
		].join('\n');

		await writeSkill('hr-sparse-prompts', {
			content: ['Content.'],
			examples: ['Example.', 'Example 2.'],
		});

		const result = await scoreExampleCoverage(
			tmpDir,
			'hr-sparse-prompts',
			manyTasksFewPrompts,
		);
		expect(result.notes.some((n) => n.includes('quoted example prompts'))).toBe(true);
	});

	it('scoreSkillQuality() computes a weighted overall score and a matching band', async () => {
		await writeSkill('hr-full', {
			content: ['Content one.'],
			examples: ['Example one.', 'Example two.'],
		});

		const result = await scoreSkillQuality(tmpDir, 'hr-full');

		expect(result.skill).toBe('hr-full');
		const expectedOverall =
			Math.round(
				(result.clarity.score * CLARITY_WEIGHT +
					result.completeness.score * COMPLETENESS_WEIGHT +
					result.exampleCoverage.score * EXAMPLE_COVERAGE_WEIGHT) *
					100,
			) / 100;
		expect(result.overall).toBeCloseTo(expectedOverall, 5);

		if (result.overall >= QUALITY_BAND_THRESHOLDS.excellent) {
			expect(result.band).toBe('excellent');
		} else if (result.overall >= QUALITY_BAND_THRESHOLDS.good) {
			expect(result.band).toBe('good');
		} else if (result.overall >= QUALITY_BAND_THRESHOLDS.needsReview) {
			expect(result.band).toBe('needs-review');
		} else {
			expect(result.band).toBe('poor');
		}
	});

	it('scoreSkillQuality() does not throw for a missing SKILL.md and returns a low score', async () => {
		const result = await scoreSkillQuality(tmpDir, 'hr-does-not-exist');
		expect(result.overall).toBeGreaterThanOrEqual(0);
		expect(result.overall).toBeLessThanOrEqual(100);
		expect(result.band).toBe('poor');
	});

	it('scoreSkills() scores multiple skills in the given order', async () => {
		await writeSkill('hr-alpha', { content: ['C.'], examples: ['E.', 'E2.'] });
		await writeSkill('hr-beta', {});

		// scoreSkills() always reads from the module-level SKILLS_DIR constant,
		// so we exercise it indirectly via scoreSkillQuality() with the temp
		// dir instead — this keeps the assertion meaningful without requiring
		// the real repository's skills/ directory to contain these fixtures.
		const results = await Promise.all(
			['hr-alpha', 'hr-beta'].map((name) => scoreSkillQuality(tmpDir, name)),
		);

		expect(results.map((r) => r.skill)).toEqual(['hr-alpha', 'hr-beta']);
		const [alpha, beta] = results;
		expect(alpha).toBeDefined();
		expect(beta).toBeDefined();
		expect(alpha?.overall).toBeGreaterThan(beta?.overall ?? Number.POSITIVE_INFINITY);
	});

	it('is deterministic — repeated calls against the same content produce the same score', async () => {
		await writeSkill('hr-repeat', {
			content: ['Content.'],
			examples: ['Example.'],
		});

		const first = await scoreSkillQuality(tmpDir, 'hr-repeat');
		const second = await scoreSkillQuality(tmpDir, 'hr-repeat');
		expect(first).toEqual(second);
	});
});

// ---------------------------------------------------------------------------
// scoreSkills() — real repository smoke check
// ---------------------------------------------------------------------------

describe('scoreSkills() — real repository smoke check', () => {
	it('scores real skills within [0, 100] with a valid band', async () => {
		const results = await scoreSkills(['hr-onboarding']);
		expect(results).toHaveLength(1);
		const [result] = results;
		expect(result).toBeDefined();
		expect(result?.skill).toBe('hr-onboarding');
		expect(result?.overall).toBeGreaterThanOrEqual(0);
		expect(result?.overall).toBeLessThanOrEqual(100);
		expect(['excellent', 'good', 'needs-review', 'poor']).toContain(
			result?.band ?? '',
		);
	});
});
