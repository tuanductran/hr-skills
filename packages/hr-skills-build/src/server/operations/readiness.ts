import { failureResponse, successResponse } from '../service/service.js';
import type { ServiceResponse } from '../service/types.js';

export interface ReadinessCheck {
	readonly name: string;
	readonly status: 'ready' | 'not_ready';
	readonly message?: string;
}

export interface ReadinessStatus {
	readonly status: 'ready' | 'not_ready';
	readonly checks: readonly ReadinessCheck[];
}

export interface ReadinessDependency {
	readonly name: string;
	readonly check: () => boolean | Promise<boolean>;
}

export async function getReadinessService(
	dependencies: readonly ReadinessDependency[],
): Promise<ServiceResponse<ReadinessStatus>> {
	const checks: ReadinessCheck[] = [];

	for (const dependency of dependencies) {
		try {
			const ready = await dependency.check();
			checks.push({
				name: dependency.name,
				status: ready ? 'ready' : 'not_ready',
				...(ready ? {} : { message: 'Dependency is not ready' }),
			});
		} catch (error) {
			checks.push({
				name: dependency.name,
				status: 'not_ready',
				message: error instanceof Error ? error.message : String(error),
			});
		}
	}

	const ready = checks.every((check) => check.status === 'ready');
	const status: ReadinessStatus = {
		status: ready ? 'ready' : 'not_ready',
		checks,
	};

	return ready
		? successResponse(status)
		: failureResponse('SERVICE_UNAVAILABLE', 'Service is not ready', {
				checks,
			});
}
