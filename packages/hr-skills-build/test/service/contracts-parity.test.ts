import { describe, expect, it } from 'bun:test';
import * as v from 'valibot';
import { SearchRequestSchema as ClientSearchRequestSchema } from '../../src/client/service/schemas.js';
import { SearchRequestSchema as ServerSearchRequestSchema } from '../../src/server/service/schemas.js';

/**
 * `client/service/*` and `server/service/*` intentionally maintain
 * surface-local copies of the same request/response contracts (see
 * `docs/engineering/package-architecture.md`). Nothing at the type level
 * enforces that the two copies stay identical, so this test locks the
 * externally observable behavior of both `SearchRequestSchema` copies
 * together. If a future edit updates one surface's validation rules
 * without mirroring the other, this test fails instead of the drift
 * shipping silently.
 */
describe('client/server SearchRequestSchema parity', () => {
	it('rejects a non-integer limit on both surfaces', () => {
		const input = { text: 'onboarding', limit: 1.5 };

		expect(() => v.parse(ClientSearchRequestSchema, input)).toThrow();
		expect(() => v.parse(ServerSearchRequestSchema, input)).toThrow();
	});

	it('rejects a limit below 1 on both surfaces', () => {
		const input = { text: 'onboarding', limit: 0 };

		expect(() => v.parse(ClientSearchRequestSchema, input)).toThrow();
		expect(() => v.parse(ServerSearchRequestSchema, input)).toThrow();
	});

	it('rejects a non-integer maxResults on both surfaces', () => {
		const input = { text: 'onboarding', maxResults: 2.5 };

		expect(() => v.parse(ClientSearchRequestSchema, input)).toThrow();
		expect(() => v.parse(ServerSearchRequestSchema, input)).toThrow();
	});

	it('accepts a valid request on both surfaces', () => {
		const input = { text: 'onboarding', limit: 5, maxResults: 10 };

		expect(() => v.parse(ClientSearchRequestSchema, input)).not.toThrow();
		expect(() => v.parse(ServerSearchRequestSchema, input)).not.toThrow();
	});
});
