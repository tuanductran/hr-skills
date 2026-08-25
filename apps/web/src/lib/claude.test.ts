import { describe, expect, test } from 'bun:test';
import {
	buildClaudeUrl,
	CLAUDE_PROMPT_TEMPLATES,
	getClaudeTemplatePrompt,
	getRawSkillUrl,
} from './claude';

describe('Claude handoff helpers', () => {
	test('uses the canonical raw GitHub URL from the main branch', () => {
		expect(getRawSkillUrl('hr-onboarding')).toBe(
			'https://raw.githubusercontent.com/tuanductran/hr-skills/main/skills/hr-onboarding/SKILL.md',
		);
		expect(getRawSkillUrl('hr/onboarding?draft')).toContain(
			'hr%2Fonboarding%3Fdraft',
		);
	});

	test('builds an encoded Claude deep link that round-trips the custom prompt', () => {
		const prompt =
			'Read the source & draft a 30/60/90 plan. Do not include employee data.';
		const url = new URL(buildClaudeUrl(`  ${prompt}  `));
		expect(url.origin).toBe('https://claude.ai');
		expect(url.pathname).toBe('/new');
		expect(url.searchParams.get('q')).toBe(prompt);
	});

	test('keeps every template anchored to the canonical source and a safety boundary', () => {
		for (const template of CLAUDE_PROMPT_TEMPLATES) {
			const prompt = getClaudeTemplatePrompt(template.id, 'hr-onboarding');
			expect(prompt).toContain(getRawSkillUrl('hr-onboarding'));
		}
		expect(getClaudeTemplatePrompt('validate', 'hr-onboarding')).toContain(
			'Do not make employment or legal decisions',
		);
		expect(getClaudeTemplatePrompt('adapt', 'hr-onboarding')).toContain(
			'non-sensitive context only',
		);
	});
});
