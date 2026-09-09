import * as v from 'valibot';
import { runEvaluation } from '../evaluation/evaluate.js';
import { generateExecutionPlan } from '../planner/planner.js';
import { executeWorkflow } from '../runtime/runtime.js';
import { searchSkills } from '../search/search.js';
import { PlannerRequestSchema, SearchRequestSchema } from '../service/schemas.js';
import type {
	ExecuteWorkflowServiceOptions,
	HealthStatus,
	PlannerServiceResult,
	ServiceErrorCode,
	ServiceResponse,
	ServiceResponseFailure,
	ServiceResponseSuccess,
	VersionInfo,
} from '../service/types.js';
import { stubStepExecutor } from '../shared/helpers.js';
import type {
	EvaluationDataset,
	EvaluationReport,
	ExecutionPlan,
	GoldenFixture,
	Registry,
	SkillSearchResponse,
	WorkflowResult,
} from '../shared/types.js';
import { validateExecutionPlan } from '../validation/validate-planner.js';

const START_TIME = Date.now();

export function successResponse<T>(
	data: T,
	meta?: Record<string, unknown>,
): ServiceResponseSuccess<T> {
	return {
		success: true,
		data,
		...(meta ? { meta } : {}),
	};
}

export function failureResponse(
	code: ServiceErrorCode,
	message: string,
	details?: Record<string, unknown>,
): ServiceResponseFailure {
	return {
		success: false,
		error: {
			code,
			message,
			...(details ? { details } : {}),
		},
	};
}

/**
 * Health Endpoint Service
 * Evaluates service health and optional registry stats.
 */
export function getHealthService(registry?: Registry): ServiceResponse<HealthStatus> {
	const uptime = Math.floor((Date.now() - START_TIME) / 1000);
	const timestamp = new Date().toISOString();

	// Registry is { schemaVersion, generatedAt, skillCount, skills[] } — no domains/capabilities maps.
	// Derive counts from the skills array so we stay within the defined interface.
	const registryStats = registry
		? (() => {
				const domainSet = new Set(registry.skills.map((s) => s.domain));
				const capCount = registry.skills.reduce(
					(sum, s) => sum + (s.capabilities?.length ?? 0),
					0,
				);
				return {
					totalSkills: registry.skillCount,
					domains: domainSet.size,
					capabilities: capCount,
				};
			})()
		: undefined;

	return successResponse({
		status: 'ok',
		version: '1.0.0',
		uptime,
		timestamp,
		...(registryStats ? { registryStats } : {}),
	});
}

/**
 * Version Endpoint Service
 * Exposes API versioning and phase metadata.
 */
export function getVersionService(): ServiceResponse<VersionInfo> {
	return successResponse({
		name: 'hr-skills-service',
		version: '1.0.0',
		phase: 'Phase 8.1 — Service layer',
		apiVersions: {
			health: 'v1',
			version: 'v1',
			search: 'v1',
			planner: 'v1',
			runtime: 'v1',
			evaluation: 'v1',
		},
	});
}

/**
 * Registry Search Service API
 * Validates request input and executes deterministic skill search.
 */
export function searchRegistryService(
	queryInput: unknown,
	registry: Registry,
): ServiceResponse<SkillSearchResponse> {
	if (!registry) {
		return failureResponse('BAD_REQUEST', 'Registry must be provided for search');
	}

	const parseResult = v.safeParse(SearchRequestSchema, queryInput ?? {});
	if (!parseResult.success) {
		return failureResponse('VALIDATION_ERROR', 'Invalid search query request', {
			issues: v.summarize(parseResult.issues),
		});
	}

	try {
		const query = parseResult.output;
		const searchResult = searchSkills(query, registry);
		return successResponse(searchResult);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return failureResponse('BAD_REQUEST', message);
	}
}

/**
 * Planner Service API
 * Validates intent request, generates execution plan, and validates plan correctness.
 */
export function generatePlanService(
	requestInput: unknown,
	registry: Registry,
): ServiceResponse<PlannerServiceResult> {
	if (!registry) {
		return failureResponse('BAD_REQUEST', 'Registry must be provided for planning');
	}

	const parseResult = v.safeParse(PlannerRequestSchema, requestInput);
	if (!parseResult.success) {
		return failureResponse('VALIDATION_ERROR', 'Invalid planner request', {
			issues: v.summarize(parseResult.issues),
		});
	}

	const { intent } = parseResult.output;
	const plan = generateExecutionPlan(intent, registry);
	const validation = validateExecutionPlan(plan, registry);

	return successResponse({ plan, validation });
}

/**
 * Runtime Execution Service API
 * Executes an ExecutionPlan deterministically through WorkflowExecutor.
 */
export async function executeWorkflowService(
	plan: ExecutionPlan,
	options: ExecuteWorkflowServiceOptions = {},
): Promise<ServiceResponse<WorkflowResult>> {
	if (!plan || !Array.isArray(plan.steps)) {
		return failureResponse('BAD_REQUEST', 'Valid execution plan must be provided');
	}

	try {
		const executor = options.stepExecutor ?? stubStepExecutor;
		const result = await executeWorkflow(plan, executor, options.options);
		return successResponse(result);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return failureResponse('RUNTIME_FAILED', `Execution failed: ${message}`);
	}
}

/**
 * Evaluation Service API
 * Runs evaluation datasets against the registry and compares against golden fixtures.
 */
export async function runEvaluationService(
	dataset: EvaluationDataset,
	registry: Registry,
	golden?: GoldenFixture,
): Promise<ServiceResponse<EvaluationReport>> {
	if (!dataset || !Array.isArray(dataset.cases)) {
		return failureResponse('BAD_REQUEST', 'Evaluation dataset must be provided');
	}

	if (!registry) {
		return failureResponse('BAD_REQUEST', 'Registry must be provided for evaluation');
	}

	try {
		const report = await runEvaluation(dataset, registry, golden);
		return successResponse(report);
	} catch (err) {
		const message = err instanceof Error ? err.message : String(err);
		return failureResponse(
			'INTERNAL_ERROR',
			`Evaluation execution failed: ${message}`,
		);
	}
}
