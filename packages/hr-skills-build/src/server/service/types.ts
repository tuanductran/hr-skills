import type {
	ExecutionPlan,
	PlanValidationResult,
	RuntimeOptions,
	StepExecutorFn,
} from '../shared/types.js';

export type ServiceErrorCode =
	| 'BAD_REQUEST'
	| 'NOT_FOUND'
	| 'VALIDATION_ERROR'
	| 'PLANNING_FAILED'
	| 'RUNTIME_FAILED'
	| 'SERVICE_UNAVAILABLE'
	| 'INTERNAL_ERROR';

export interface ServiceError {
	code: ServiceErrorCode;
	message: string;
	details?: Record<string, unknown>;
}

export interface ServiceResponseMeta {
	apiVersion: 'v1';
	requestId?: string;
}

export interface ServiceResponseSuccess<T> {
	success: true;
	data: T;
	meta: ServiceResponseMeta;
}

export interface ServiceResponseFailure {
	success: false;
	error: ServiceError;
	meta: ServiceResponseMeta;
}

export type ServiceResponse<T> = ServiceResponseSuccess<T> | ServiceResponseFailure;

export interface HealthStatus {
	status: 'ok' | 'degraded' | 'error';
	version: string;
	uptime: number;
	timestamp: string;
	registryStats?: {
		totalSkills: number;
		domains: number;
		capabilities: number;
	};
}

export interface VersionInfo {
	name: string;
	version: string;
	phase: string;
	apiVersions: {
		health: string;
		readiness: string;
		version: string;
		search: string;
		planner: string;
		runtime: string;
		evaluation: string;
	};
}

export interface PlannerServiceResult {
	plan: ExecutionPlan;
	validation: PlanValidationResult;
}

export interface ExecuteWorkflowServiceOptions {
	options?: RuntimeOptions;
	stepExecutor?: StepExecutorFn;
}
