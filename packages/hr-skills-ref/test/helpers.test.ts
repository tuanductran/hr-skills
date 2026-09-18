import { describe, expect, it } from 'bun:test';
import { sanitizeYamlValue } from '../src/shared/helpers.js';

describe('sanitizeYamlValue', () => {
	it('removes prototype-pollution keys recursively without mutating prototypes', () => {
		const input = JSON.parse(`{
			"safe": "top-level value",
			"__proto__": { "polluted": true },
			"nested": {
				"constructor": "dangerous",
				"items": [{ "prototype": "dangerous", "safe": "nested value" }]
			}
		}`) as unknown;

		const output = sanitizeYamlValue(input) as Record<string, unknown>;
		const nested = output['nested'] as Record<string, unknown>;
		const items = nested['items'] as Array<Record<string, unknown>>;

		expect(Object.getPrototypeOf(output)).toBeNull();
		expect(output).toEqual({
			safe: 'top-level value',
			nested: {
				items: [{ safe: 'nested value' }],
			},
		});
		expect(Object.getPrototypeOf({})['polluted']).toBeUndefined();
		expect(nested['constructor']).toBeUndefined();
		expect(items[0]?.['prototype']).toBeUndefined();
	});
});
