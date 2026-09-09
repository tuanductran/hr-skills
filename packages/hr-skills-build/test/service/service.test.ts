import { describe, expect, it } from 'bun:test';
import type {
	EvaluationDataset,
	ExecutionPlan,
	Registry,
	RegistryEntry,
} from '../../src/client/shared/types.js';
import {
	executeWorkflowService,
	generatePlanService,
	getHealthService,
	getVersionService,
	runEvaluationService,
	searchRegistryService,
} from '../../src/server/service/index.js';

const mockSkill: RegistryEntry = {
	id: 'hr-onboarding-workflow',
	name: 'hr-onboarding-workflow',
	version: '1.0.0',
	description: 'Onboarding new hires workflow',
	tier: 'full',
	domain: 'onboarding-offboarding',
	tags: ['onboarding', 'new-hire'],
	aliases: ['onboarding-guide'],
	capabilities: ['Create onboarding plan for new employee'],
	triggerPhrases: ['create onboarding plan'],
	paths: { content: true, prompts: true, examples: true },
	dependencies: [],
	relatedSkills: [],
};

const mockRegistry: Registry = {
	schemaVersion: 1,
	generatedAt: '2026-09-09',
	skillCount: 1,
	skills: [mockSkill],
};

describe('Service Layer — Phase 8.1', () => {
	describe('getHealthService', () => {
		it('returns ok health status and uptime without registry', () => {
			const res = getHealthService();
			expect(res.success).toBe(true);
			if (res.success) {
				expect(res.data.status).toBe('ok');
				expect(res.data.version).toBe('1.0.0');
				expect(typeof res.data.uptime).toBe('number');
				expect(res.data.registryStats).toBeUndefined();
			}
		});

		it('returns health status with registry stats when registry is provided', () => {
			const res = getHealthService(mockRegistry);
			expect(res.success).toBe(true);
			if (res.success) {
				expect(res.data.registryStats).toBeDefined();
				expect(res.data.registryStats?.totalSkills).toBe(1);
				expect(res.data.registryStats?.domains).toBe(1);
			}
		});
	});

	describe('getVersionService', () => {
		it('returns API versioning and phase metadata', () => {
			const res = getVersionService();
			expect(res.success).toBe(true);
			if (res.success) {
				expect(res.data.name).toBe('hr-skills-service');
				expect(res.data.phase).toContain('Phase 8.1');
				expect(res.data.apiVersions.health).toBe('v1');
			}
		});
	});

	describe('searchRegistryService', () => {
		it('fails when registry is missing', () => {
			const res = searchRegistryService({}, undefined as unknown as Registry);
			expect(res.success).toBe(false);
			if (!res.success) {
				expect(res.error.code).toBe('BAD_REQUEST');
			}
		});

		it('validates request input and performs search', () => {
			const res = searchRegistryService({ query: 'onboarding' }, mockRegistry);
			expect(res.success).toBe(true);
			if (res.success) {
				expect(res.data.query).toBe('onboarding');
				expect(res.data.resultCount).toBeGreaterThanOrEqual(1);
				expect(res.data.results[0]?.skillId).toBe('hr-onboarding-workflow');
			}
		});

		it('rejects invalid maxResults schema input', () => {
			const res = searchRegistryService(
				{ maxResults: 'invalid' as unknown as number },
				mockRegistry,
			);
			expect(res.success).toBe(false);
			if (!res.success) {
				expect(res.error.code).toBe('VALIDATION_ERROR');
			}
		});

		it('rejects invalid domain values', () => {
			const res = searchRegistryService({ domain: 'not-a-domain' }, mockRegistry);
			expect(res.success).toBe(false);
			if (!res.success) {
				expect(res.error.code).toBe('VALIDATION_ERROR');
			}
		});
	});

	describe('generatePlanService', () => {
		it('fails when intent is empty or invalid', () => {
			const res = generatePlanService({ intent: '' }, mockRegistry);
			expect(res.success).toBe(false);
			if (!res.success) {
				expect(res.error.code).toBe('VALIDATION_ERROR');
			}
		});

		it('generates plan and returns validation result for valid intent', () => {
			const res = generatePlanService(
				{ intent: 'create onboarding plan' },
				mockRegistry,
			);
			expect(res.success).toBe(true);
			if (res.success) {
				expect(res.data.plan.intent).toBe('create onboarding plan');
				expect(res.data.validation.isValid).toBe(true);
				expect(res.data.plan.steps.length).toBe(1);
			}
		});
	});

	describe('executeWorkflowService', () => {
		it('fails on null or invalid plan structure', () => {
			executeWorkflowService(null as unknown as ExecutionPlan).then((res) => {
				expect(res.success).toBe(false);
				if (!res.success) {
					expect(res.error.code).toBe('BAD_REQUEST');
				}
			});
		});

		it('executes workflow plan successfully', async () => {
			const planRes = generatePlanService(
				{ intent: 'create onboarding plan' },
				mockRegistry,
			);
			expect(planRes.success).toBe(true);
			if (planRes.success) {
				const execRes = await executeWorkflowService(planRes.data.plan);
				expect(execRes.success).toBe(true);
				if (execRes.success) {
					expect(execRes.data.status).toBe('completed');
				}
			}
		});
	});

	describe('runEvaluationService', () => {
		it('fails on missing dataset or registry', async () => {
			const res = await runEvaluationService(
				null as unknown as EvaluationDataset,
				mockRegistry,
			);
			expect(res.success).toBe(false);
			if (!res.success) {
				expect(res.error.code).toBe('BAD_REQUEST');
			}
		});

		it('executes evaluation dataset cleanly', async () => {
			const dataset: EvaluationDataset = {
				name: 'service-test-dataset',
				description: 'Test evaluation dataset',
				cases: [
					{
						id: 'case-1',
						description: 'Onboarding plan scenario',
						intent: 'create onboarding plan',
						category: 'onboarding',
					},
				],
			};

			const res = await runEvaluationService(dataset, mockRegistry);
			expect(res.success).toBe(true);
			if (res.success) {
				expect(res.data.datasetName).toBe('service-test-dataset');
				expect(res.data.totalCases).toBe(1);
				expect(res.data.passedCases).toBe(1);
			}
		});
	});
});
