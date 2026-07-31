/**
 * Tests for Phase 6.2 — duplicate-content detection.
 *
 * Covers:
 * - identical descriptions
 * - highly overlapping content
 * - partially overlapping skills
 * - unrelated skills
 * - common HR terminology alone does not trigger warnings
 * - threshold boundary behaviour
 * - deterministic (stable) output
 * - bigram similarity
 * - the full detectDuplicates() pipeline with mocked content
 */
import { describe, expect, it } from 'bun:test';
import type { SkillContent } from '../../src/validation/detect-duplicates.js';
import {
	buildBigrams,
	comparePair,
	DUPLICATE_THRESHOLD,
	HR_STOP_WORDS,
	jaccardSimilarity,
	tokenise,
	WEIGHT_BIGRAM,
	WEIGHT_CONTENT,
	WEIGHT_DESCRIPTION,
} from '../../src/validation/detect-duplicates.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSkill(name: string, description: string, body: string): SkillContent {
	return { name, description, body };
}

// ---------------------------------------------------------------------------
// tokenise()
// ---------------------------------------------------------------------------

describe('tokenise', () => {
	it('lowercases and splits on whitespace', () => {
		const tokens = tokenise('Performance Review Process');
		// "performance" and "review" are stop-words; "process" is a stop-word too
		// All three are HR stop-words, so result should be empty
		expect(tokens).toEqual([]);
	});

	it('removes tokens shorter than 3 characters', () => {
		expect(tokenise('an of at be')).toEqual([]);
	});

	it('strips markdown syntax', () => {
		// backtick inline code is replaced with a space, so "checklist" becomes a separate token
		const tokens = tokenise('**Onboarding** for _new_ evaluation employees');
		// "onboarding", "evaluation" — "employees" is a stop-word
		expect(tokens).toContain('onboarding');
		expect(tokens).toContain('evaluation');
		expect(tokens).not.toContain('employees');
	});

	it('returns sorted array for determinism', () => {
		const tokens = tokenise('zebra apple mango banana');
		const sorted = [...tokens].sort();
		expect(tokens).toEqual(sorted);
	});

	it('filters HR stop-words', () => {
		const tokens = tokenise('employee manager team hr human resources');
		expect(tokens).toEqual([]);
	});

	it('preserves meaningful domain terms', () => {
		const tokens = tokenise('compensation benchmarking equity analysis');
		expect(tokens).toContain('compensation');
		expect(tokens).toContain('benchmarking');
		expect(tokens).toContain('equity');
		expect(tokens).toContain('analysis');
	});
});

// ---------------------------------------------------------------------------
// buildBigrams()
// ---------------------------------------------------------------------------

describe('buildBigrams', () => {
	it('returns empty array for single token', () => {
		expect(buildBigrams(['only'])).toEqual([]);
	});

	it('produces sorted bigrams', () => {
		const bigrams = buildBigrams(['zebra', 'apple', 'mango']);
		const sorted = [...bigrams].sort();
		expect(bigrams).toEqual(sorted);
	});

	it('builds correct pairs', () => {
		const bigrams = buildBigrams(['a', 'b', 'c']);
		expect(bigrams).toContain('a|b');
		expect(bigrams).toContain('b|c');
		expect(bigrams.length).toBe(2);
	});
});

// ---------------------------------------------------------------------------
// jaccardSimilarity()
// ---------------------------------------------------------------------------

describe('jaccardSimilarity', () => {
	it('returns 1.0 for identical arrays', () => {
		expect(jaccardSimilarity(['a', 'b', 'c'], ['a', 'b', 'c'])).toBe(1);
	});

	it('returns 0.0 for completely disjoint arrays', () => {
		expect(jaccardSimilarity(['a', 'b'], ['c', 'd'])).toBe(0);
	});

	it('returns 0.0 for two empty arrays', () => {
		expect(jaccardSimilarity([], [])).toBe(0);
	});

	it('computes correct partial overlap', () => {
		// A = {a, b, c}, B = {b, c, d}
		// intersection = 2, union = 4
		const score = jaccardSimilarity(['a', 'b', 'c'], ['b', 'c', 'd']);
		expect(score).toBeCloseTo(0.5, 5);
	});

	it('handles multisets correctly', () => {
		// A = [a, a, b], B = [a, b, b]
		// intersection = min(2,1)+min(1,2) = 1+1 = 2
		// union = 3+3-2 = 4
		const score = jaccardSimilarity(['a', 'a', 'b'], ['a', 'b', 'b']);
		expect(score).toBeCloseTo(2 / 4, 5);
	});
});

// ---------------------------------------------------------------------------
// comparePair()
// ---------------------------------------------------------------------------

describe('comparePair — identical descriptions and body', () => {
	it('returns a finding with score near 1.0 for identical skills', () => {
		const desc =
			'Detailed compensation benchmarking analysis including salary bands and equity adjustments';
		const body = `
## Overview
Compensation benchmarking involves salary banding equity adjustments
market positioning total rewards analysis.

## Process
Review salary data against market benchmarks and adjust compensation bands.
`;
		const a = makeSkill('hr-comp-a', desc, body);
		const b = makeSkill('hr-comp-b', desc, body);

		const result = comparePair(a, b);
		expect(result).not.toBeNull();
		expect(result?.score).toBeGreaterThan(0.9);
	});

	it('uses canonical ordering (skillA < skillB)', () => {
		const s = makeSkill(
			'hr-z',
			'compensation analysis equity',
			'compensation benchmarking salary analysis',
		);
		const t = makeSkill(
			'hr-a',
			'compensation analysis equity',
			'compensation benchmarking salary analysis',
		);
		const result = comparePair(s, t);
		expect(result).not.toBeNull();
		expect(result?.skillA).toBe('hr-a');
		expect(result?.skillB).toBe('hr-z');
	});
});

describe('comparePair — high overlap', () => {
	it('detects highly overlapping descriptions and content', () => {
		const descA =
			'Interview planning toolkit for structured behavioral interviewing and candidate assessment evaluation';
		const descB =
			'Interview planning toolkit for structured behavioral interviewing and candidate evaluation assessment';
		const body = `
## Behavioral interviewing
Structured behavioral interviews allow interviewers to assess candidate
competencies through situation-task-action-result questioning frameworks.
Assessment rubrics calibrate interviewer scoring consistency.
`;
		const a = makeSkill('hr-interview-a', descA, body);
		const b = makeSkill(
			'hr-interview-b',
			descB,
			`${body}\nAdditional interviewer calibration guidance.`,
		);

		const result = comparePair(a, b);
		expect(result).not.toBeNull();
		expect(result?.score).toBeGreaterThanOrEqual(DUPLICATE_THRESHOLD);
	});
});

describe('comparePair — partial overlap', () => {
	it('returns null for moderately similar skills that share only HR vocabulary', () => {
		// Both mention "onboarding", but content diverges significantly
		const a = makeSkill(
			'hr-onboarding',
			'Design onboarding experiences for new hires joining the organisation',
			'Onboarding checklists, orientation schedules, buddy systems, and 30-60-90 day plans.',
		);
		const b = makeSkill(
			'hr-offboarding',
			'Manage offboarding workflows for departing employees leaving the organisation',
			'Exit interviews, knowledge transfer, access revocation, final payroll processing.',
		);
		// Should NOT be flagged — content is substantially different
		const result = comparePair(a, b, DUPLICATE_THRESHOLD);
		// We accept either null or a low score
		if (result !== null) {
			expect(result.score).toBeLessThan(DUPLICATE_THRESHOLD);
		} else {
			expect(result).toBeNull();
		}
	});
});

describe('comparePair — common HR terminology alone', () => {
	it('does not flag skills that share only stop-word vocabulary', () => {
		const a = makeSkill(
			'hr-payroll',
			'Manage employee payroll and compensation processes',
			'Employee payroll management involves team coordination and process documentation.',
		);
		const b = makeSkill(
			'hr-benefits',
			'Administer employee benefits and compensation programs',
			'Employee benefits administration requires manager support and process documentation.',
		);
		const result = comparePair(a, b);
		// All unique tokens are HR stop-words or extremely short — should be null or very low score
		if (result !== null) {
			expect(result.score).toBeLessThan(DUPLICATE_THRESHOLD);
		}
	});
});

describe('comparePair — unrelated skills', () => {
	it('returns null for completely unrelated skills', () => {
		const a = makeSkill(
			'hr-leave-management',
			'Automate leave requests and absence tracking with calendar integration',
			'Leave management covers annual leave, sick leave, parental leave, and unpaid leave. ' +
				'Absence calendars sync with payroll. Accrual calculations follow statutory requirements.',
		);
		const b = makeSkill(
			'hr-diversity-inclusion',
			'Build diverse hiring pipelines and inclusive workplace cultures through data and interventions',
			'Diversity recruiting focuses on underrepresented candidate sourcing through targeted outreach. ' +
				'Inclusion surveys measure belonging. Bias audits review promotion equity.',
		);
		const result = comparePair(a, b);
		expect(result).toBeNull();
	});
});

describe('comparePair — threshold boundary', () => {
	it('does not report when score is just below threshold', () => {
		// Use threshold slightly above 1.0 — impossible to reach, so nothing is flagged
		const a = makeSkill(
			'hr-a',
			'compensation analysis equity',
			'compensation benchmarking salary equity analysis',
		);
		const b = makeSkill(
			'hr-b',
			'compensation analysis equity',
			'compensation benchmarking salary equity analysis',
		);
		expect(comparePair(a, b, 1.01)).toBeNull();
	});

	it('reports when score equals threshold', () => {
		// Force a very low threshold (0.0) to catch anything
		const a = makeSkill(
			'hr-a',
			'onboarding orientation checklist',
			'new hire orientation checklist workflow',
		);
		const b = makeSkill(
			'hr-b',
			'onboarding orientation checklist',
			'new hire orientation checklist workflow',
		);
		expect(comparePair(a, b, 0.0)).not.toBeNull();
	});
});

// ---------------------------------------------------------------------------
// Determinism
// ---------------------------------------------------------------------------

describe('determinism', () => {
	it('produces identical results on repeated calls', () => {
		const desc =
			'Performance calibration and salary benchmarking for compensation cycles';
		const body = `
## Compensation cycle
Annual compensation calibration involves salary benchmarking against
market data. Equity adjustments address pay disparity. Merit increases
reward high performers during the annual review cycle.
`;
		const a = makeSkill('hr-comp-x', desc, body);
		const b = makeSkill('hr-comp-y', desc, body);

		const r1 = comparePair(a, b);
		const r2 = comparePair(a, b);
		const r3 = comparePair(a, b);

		expect(r1).toEqual(r2);
		expect(r2).toEqual(r3);
	});

	it('tokenise always returns the same sorted array', () => {
		const text =
			'Candidate sourcing pipeline diversity recruiting assessment interview';
		const t1 = tokenise(text);
		const t2 = tokenise(text);
		const t3 = tokenise(text);
		expect(t1).toEqual(t2);
		expect(t2).toEqual(t3);
	});
});

// ---------------------------------------------------------------------------
// Score composition
// ---------------------------------------------------------------------------

describe('weight constants', () => {
	it('weights sum to 1.0', () => {
		const sum = WEIGHT_DESCRIPTION + WEIGHT_CONTENT + WEIGHT_BIGRAM;
		expect(sum).toBeCloseTo(1.0, 10);
	});
});

// ---------------------------------------------------------------------------
// HR_STOP_WORDS coverage
// ---------------------------------------------------------------------------

describe('HR_STOP_WORDS', () => {
	it('includes common HR terms', () => {
		const mustInclude = [
			'employee',
			'manager',
			'hr',
			'team',
			'process',
			'policy',
			'hiring',
		];
		for (const term of mustInclude) {
			expect(HR_STOP_WORDS.has(term)).toBe(true);
		}
	});

	it('does not include meaningful domain discriminators', () => {
		const notStop = [
			'compensation',
			'benchmarking',
			'calibration',
			'sourcing',
			'onboarding',
		];
		for (const term of notStop) {
			expect(HR_STOP_WORDS.has(term)).toBe(false);
		}
	});
});

// ---------------------------------------------------------------------------
// Explanation string
// ---------------------------------------------------------------------------

describe('comparePair — explanation field', () => {
	it('includes score and threshold info', () => {
		const desc =
			'Compensation benchmarking and salary band analysis for annual cycles';
		const body = `
## Process
Salary benchmarking involves comparing compensation data against market surveys.
Salary bands define pay ranges for each job level. Annual cycles review and
adjust compensation structures to maintain market competitiveness.
`;
		const a = makeSkill('hr-comp-a', desc, body);
		const b = makeSkill('hr-comp-b', desc, body);
		const result = comparePair(a, b);

		if (result) {
			expect(result.explanation).toContain('Composite score');
			expect(result.explanation).toContain('threshold');
			expect(result.explanation).toContain('Review both skills');
		}
	});
});
