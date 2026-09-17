import type { ServiceErrorCode } from './types.js';

export const SERVICE_API_VERSION = 'v1' as const;

export type ServiceOperation =
	| 'health'
	| 'readiness'
	| 'version'
	| 'search'
	| 'planner'
	| 'runtime'
	| 'evaluation';

export type ServiceAuthentication = 'none' | 'api-key';

export interface ServiceRateLimit {
	readonly maxRequests: number;
	readonly windowSeconds: number;
}

export interface ServiceContract {
	readonly operation: ServiceOperation;
	readonly method: 'GET' | 'POST';
	readonly path: `/api/${string}`;
	readonly authentication: ServiceAuthentication;
	readonly rateLimit: ServiceRateLimit;
	readonly deterministic: true;
}

export const SERVICE_CONTRACTS: readonly ServiceContract[] = [
	{
		operation: 'health',
		method: 'GET',
		path: '/api/v1/health',
		authentication: 'none',
		rateLimit: { maxRequests: 60, windowSeconds: 60 },
		deterministic: true,
	},
	{
		operation: 'readiness',
		method: 'GET',
		path: '/api/v1/ready',
		authentication: 'none',
		rateLimit: { maxRequests: 60, windowSeconds: 60 },
		deterministic: true,
	},
	{
		operation: 'version',
		method: 'GET',
		path: '/api/v1/version',
		authentication: 'none',
		rateLimit: { maxRequests: 60, windowSeconds: 60 },
		deterministic: true,
	},
	{
		operation: 'search',
		method: 'POST',
		path: '/api/v1/search',
		authentication: 'none',
		rateLimit: { maxRequests: 30, windowSeconds: 60 },
		deterministic: true,
	},
	{
		operation: 'planner',
		method: 'POST',
		path: '/api/v1/planner',
		authentication: 'none',
		rateLimit: { maxRequests: 20, windowSeconds: 60 },
		deterministic: true,
	},
	{
		operation: 'runtime',
		method: 'POST',
		path: '/api/v1/runtime',
		authentication: 'api-key',
		rateLimit: { maxRequests: 10, windowSeconds: 60 },
		deterministic: true,
	},
	{
		operation: 'evaluation',
		method: 'POST',
		path: '/api/v1/evaluation',
		authentication: 'api-key',
		rateLimit: { maxRequests: 5, windowSeconds: 60 },
		deterministic: true,
	},
] as const;

export interface ServiceErrorContract {
	readonly code: ServiceErrorCode;
	readonly message: string;
	readonly details?: Record<string, unknown>;
}

export interface ServiceSuccessContract<T> {
	readonly success: true;
	readonly data: T;
	readonly meta: {
		readonly requestId?: string;
		readonly apiVersion: typeof SERVICE_API_VERSION;
	};
}

export interface ServiceFailureContract {
	readonly success: false;
	readonly error: ServiceErrorContract;
	readonly meta: {
		readonly requestId?: string;
		readonly apiVersion: typeof SERVICE_API_VERSION;
	};
}

export type ServiceEnvelope<T> = ServiceSuccessContract<T> | ServiceFailureContract;

export function getServiceContract(operation: ServiceOperation): ServiceContract {
	const contract = SERVICE_CONTRACTS.find(
		(candidate) => candidate.operation === operation,
	);

	if (!contract) {
		throw new Error(`Unknown service operation: ${operation}`);
	}

	return contract;
}
