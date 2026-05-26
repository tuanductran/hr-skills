import { describe, expect, it } from 'bun:test';

import { assertTemplateMarkerExists } from '../src/sync.js';

describe('assertTemplateMarkerExists', () => {
	it('does not throw when AGENTS table marker matches', () => {
		const content = [
			'# AGENTS',
			'',
			'| Skill | Scope |',
			'|-------|-------|',
			'| **hr-ai** | Scope. |',
			'',
			'## Next section',
		].join('\n');

		expect(() =>
			assertTemplateMarkerExists(
				content,
				/\| Skill \| Scope \|\n\|[-|]+\|\n[\s\S]*?(?=\n## )/,
				'AGENTS.md',
				'AGENTS_TABLE_REGEX',
			),
		).not.toThrow();
	});

	it('throws actionable error when AGENTS marker drifts', () => {
		const content = [
			'# AGENTS',
			'',
			'| Skill name | Scope |',
			'|------------|-------|',
			'| **hr-ai** | Scope. |',
			'',
			'## Next section',
		].join('\n');

		expect(() =>
			assertTemplateMarkerExists(
				content,
				/\| Skill \| Scope \|\n\|[-|]+\|\n[\s\S]*?(?=\n## )/,
				'AGENTS.md',
				'AGENTS_TABLE_REGEX',
			),
		).toThrow(
			'Template drift detected in AGENTS.md: missing AGENTS_TABLE_REGEX marker table. Restore the expected table header in AGENTS.md before running bun run sync.',
		);
	});

	it('throws actionable error when installation marker drifts', () => {
		const content = [
			'# Installation',
			'',
			'| Skill | Coverage |',
			'|-------|----------|',
			'| `hr-ai` | Summary |',
			'',
			'See [skills.md](./skills.md)',
		].join('\n');

		expect(() =>
			assertTemplateMarkerExists(
				content,
				/\| Skill \| What it covers \|\n\|[-|]+\|\n[\s\S]*?(?=\nSee \[skills\.md\])/,
				'docs/installation.md',
				'INSTALLATION_TABLE_REGEX',
			),
		).toThrow(
			'Template drift detected in docs/installation.md: missing INSTALLATION_TABLE_REGEX marker table. Restore the expected table header in docs/installation.md before running bun run sync.',
		);
	});
});
