import { describe, expect, it } from 'bun:test';
import {
	getServiceContract,
	SERVICE_API_VERSION,
	SERVICE_CONTRACTS,
} from '../../src/client/service/contracts.js';

describe('Phase 8.2 service contracts', () => {
	it('defines every version-one operation with a stable route and policy', () => {
		expect(SERVICE_API_VERSION).toBe('v1');
		expect(SERVICE_CONTRACTS).toHaveLength(6);
		expect(SERVICE_CONTRACTS.every((contract) => contract.deterministic)).toBe(true);
		expect(SERVICE_CONTRACTS.map((contract) => contract.path)).toEqual([
			'/api/v1/health',
			'/api/v1/version',
			'/api/v1/search',
			'/api/v1/planner',
			'/api/v1/runtime',
			'/api/v1/evaluation',
		]);
	});

	it('requires API keys for bounded execution operations', () => {
		expect(getServiceContract('runtime').authentication).toBe('api-key');
		expect(getServiceContract('evaluation').authentication).toBe('api-key');
		expect(getServiceContract('search').authentication).toBe('none');
	});

	it('throws for unknown operations instead of returning a silent fallback', () => {
		expect(() => getServiceContract('unknown' as never)).toThrow(
			'Unknown service operation: unknown',
		);
	});
});
