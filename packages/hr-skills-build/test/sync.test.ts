import { describe, expect, it } from 'bun:test';

import { AGENTS_TABLE_REGEX } from '../src/constants.js';
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
				AGENTS_TABLE_REGEX,
				'AGENTS.md',
				'AGENTS_TABLE_REGEX',
			),
		).not.toThrow();
	});

	it('throws actionable error when AGENTS marker drifts', () => {
		const content = [
			'# AGENTS',
			'',
			'| Skill name | Scope |', // header bị lệch
			'|------------|-------|',
			'| **hr-ai** | Scope. |',
			'',
			'## Next section',
		].join('\n');

		expect(() =>
			assertTemplateMarkerExists(
				content,
				AGENTS_TABLE_REGEX,
				'AGENTS.md',
				'AGENTS_TABLE_REGEX',
			),
		).toThrow(
			'Template drift detected in AGENTS.md: missing AGENTS_TABLE_REGEX marker table. Restore the expected table header in AGENTS.md before running bun run sync.',
		);
	});
});
