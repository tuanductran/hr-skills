import { describe, expect, it } from 'bun:test';
import { CATEGORY_META, classifySkill } from '../src/classifier.js';

// ---------------------------------------------------------------------------
// EXPLICIT override map
// ---------------------------------------------------------------------------

describe('classifySkill() — explicit overrides', () => {
	it('classifies hr-recruiting as talent-acquisition', () => {
		const result = classifySkill('hr-recruiting');
		expect(result.category).toBe('talent-acquisition');
	});

	it('classifies hr-onboarding as onboarding-offboarding', () => {
		const result = classifySkill('hr-onboarding');
		expect(result.category).toBe('onboarding-offboarding');
	});

	it('classifies hr-offboarding as onboarding-offboarding', () => {
		const result = classifySkill('hr-offboarding');
		expect(result.category).toBe('onboarding-offboarding');
	});

	it('classifies hr-performance-management as performance-talent', () => {
		const result = classifySkill('hr-performance-management');
		expect(result.category).toBe('performance-talent');
	});

	it('classifies hr-compensation-benefits as compensation-rewards', () => {
		const result = classifySkill('hr-compensation-benefits');
		expect(result.category).toBe('compensation-rewards');
	});

	it('classifies hr-learning-strategy as learning-development', () => {
		const result = classifySkill('hr-learning-strategy');
		expect(result.category).toBe('learning-development');
	});

	it('classifies hr-organizational-design as org-design-change', () => {
		const result = classifySkill('hr-organizational-design');
		expect(result.category).toBe('org-design-change');
	});

	it('classifies hr-predictive-analytics as workforce-analytics', () => {
		const result = classifySkill('hr-predictive-analytics');
		expect(result.category).toBe('workforce-analytics');
	});

	it('classifies hr-genai as hr-technology-ai', () => {
		const result = classifySkill('hr-genai');
		expect(result.category).toBe('hr-technology-ai');
	});

	it('classifies hr-compliance as compliance-risk', () => {
		const result = classifySkill('hr-compliance');
		expect(result.category).toBe('compliance-risk');
	});

	it('classifies hr-candidate-experience as talent-acquisition', () => {
		const result = classifySkill('hr-candidate-experience');
		expect(result.category).toBe('talent-acquisition');
	});

	it('classifies hr-candidate-assessment as talent-acquisition', () => {
		const result = classifySkill('hr-candidate-assessment');
		expect(result.category).toBe('talent-acquisition');
	});

	it('classifies hr-offer-management as talent-acquisition', () => {
		const result = classifySkill('hr-offer-management');
		expect(result.category).toBe('talent-acquisition');
	});

	it('classifies hr-reference-checking as talent-acquisition', () => {
		const result = classifySkill('hr-reference-checking');
		expect(result.category).toBe('talent-acquisition');
	});

	it('classifies hr-career-development as performance-talent', () => {
		const result = classifySkill('hr-career-development');
		expect(result.category).toBe('performance-talent');
	});

	it('classifies hr-coaching-mentoring as performance-talent', () => {
		const result = classifySkill('hr-coaching-mentoring');
		expect(result.category).toBe('performance-talent');
	});

	it('classifies hr-recognition as compensation-rewards', () => {
		const result = classifySkill('hr-recognition');
		expect(result.category).toBe('compensation-rewards');
	});

	it('classifies hr-mergers-acquisitions as org-design-change', () => {
		const result = classifySkill('hr-mergers-acquisitions');
		expect(result.category).toBe('org-design-change');
	});

	it('classifies hr-post-merger-integration as org-design-change', () => {
		const result = classifySkill('hr-post-merger-integration');
		expect(result.category).toBe('org-design-change');
	});

	it('returns tags array (may be empty)', () => {
		const result = classifySkill('hr-recruiting');
		expect(Array.isArray(result.tags)).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// Keyword-based fallback rules
// ---------------------------------------------------------------------------

describe('classifySkill() — keyword fallback', () => {
	it('classifies unknown analytics skill via keyword', () => {
		const result = classifySkill('hr-unknown-analytics-tool');
		expect(result.category).toBe('workforce-analytics');
	});

	it('classifies unknown ai skill via keyword', () => {
		const result = classifySkill('hr-new-ai-assistant');
		expect(result.category).toBe('hr-technology-ai');
	});

	it('classifies unknown training skill via keyword', () => {
		const result = classifySkill('hr-custom-training-program');
		expect(result.category).toBe('learning-development');
	});

	it('classifies unknown compliance skill via keyword', () => {
		const result = classifySkill('hr-new-labor-standard');
		expect(result.category).toBe('compliance-risk');
	});

	it('classifies unknown culture skill via keyword', () => {
		const result = classifySkill('hr-team-engagement-survey');
		expect(result.category).toBe('culture-experience');
	});

	it('classifies unknown frontend hiring skill via keyword', () => {
		const result = classifySkill('hr-frontend-engineer-hiring');
		expect(result.category).toBe('technical-hiring');
	});

	it('returns uncategorized for completely unknown skill', () => {
		const result = classifySkill('hr-completely-unknown-zzz');
		expect(result.category).toBe('uncategorized');
	});

	it('returns empty tags for fallback classifications', () => {
		const result = classifySkill('hr-completely-unknown-zzz');
		expect(result.tags).toEqual([]);
	});
});

// ---------------------------------------------------------------------------
// CATEGORY_META
// ---------------------------------------------------------------------------

describe('CATEGORY_META', () => {
	it('has a heading for talent-acquisition', () => {
		expect(CATEGORY_META['talent-acquisition'].heading).toBeTruthy();
	});

	it('has a heading for org-design-change', () => {
		expect(CATEGORY_META['org-design-change'].heading).toBeTruthy();
	});

	it('has entries for all non-uncategorized categories', () => {
		const expected = [
			'talent-acquisition',
			'onboarding-offboarding',
			'performance-talent',
			'compensation-rewards',
			'learning-development',
			'org-design-change',
			'workforce-analytics',
			'hr-technology-ai',
			'compliance-risk',
			'culture-experience',
			'global-project',
			'technical-hiring',
		] as const;

		for (const cat of expected) {
			expect(CATEGORY_META[cat]).toBeDefined();
			expect(typeof CATEGORY_META[cat].heading).toBe('string');
		}
	});
});
