import { describe, expect, it } from 'bun:test';
import { executeWorkflow, WorkflowExecutor } from '../src/runtime.js';
import { exponentialRetryPolicy, fixedRetryPolicy } from '../src/runtime-retry.js';
import type {
	ExecutionPlan,
	ExecutionStep,
	RuntimeContext,
	RuntimeEvent,
} from '../src/types.js';

// ============================================================================
// Test fixtures
// ============================================================================

function makeStep(overrides: Partial<ExecutionStep> = {}): ExecutionStep {
	return {
		skillId: 'hr-test-skill',
		order: 0,
		reason: 'direct-capability-match',
		dependencies: [],
		...overrides,
	};
}

function makePlan(steps: ExecutionStep[], intent = 'test intent'): ExecutionPlan {
	return {
		intent,
		requestedCapabilities: [intent],
		capabilityMatches: [],
		steps,
		summary: 'test plan',
		complexity: 'simple',
	};
}

// ============================================================================
// Successful execution
// ============================================================================

describe('executeWorkflow — successful execution', () => {
	it('executes a single-step plan and returns completed status', async () => {
		const plan = makePlan([makeStep({ skillId: 'hr-onboarding', order: 0 })]);

		const result = await executeWorkflow(plan, (step) => `output-of-${step.skillId}`);

		expect(result.status).toBe('completed');
		expect(result.steps).toHaveLength(1);
		expect(result.steps[0]).toMatchObject({
			skillId: 'hr-onboarding',
			status: 'completed',
			output: 'output-of-hr-onboarding',
			attempts: 1,
		});
		expect(result.outputs['hr-onboarding']).toBe('output-of-hr-onboarding');
	});

	it('executes steps in the exact order given by the plan', async () => {
		const plan = makePlan([
			makeStep({ skillId: 'a', order: 0 }),
			makeStep({ skillId: 'b', order: 1, dependencies: ['a'] }),
			makeStep({ skillId: 'c', order: 2, dependencies: ['b'] }),
		]);

		const executionOrder: string[] = [];
		const result = await executeWorkflow(plan, (step) => {
			executionOrder.push(step.skillId);
			return step.skillId;
		});

		expect(executionOrder).toEqual(['a', 'b', 'c']);
		expect(result.status).toBe('completed');
		expect(result.steps.map((s) => s.skillId)).toEqual(['a', 'b', 'c']);
	});

	it('produces the same result across repeated runs (deterministic)', async () => {
		const plan = makePlan([
			makeStep({ skillId: 'a', order: 0 }),
			makeStep({ skillId: 'b', order: 1, dependencies: ['a'] }),
		]);

		const executor = () => 42;
		const first = await executeWorkflow(plan, executor);
		const second = await executeWorkflow(plan, executor);

		expect(first.events.map((e) => e.type)).toEqual(second.events.map((e) => e.type));
		expect(first.trace).toEqual(second.trace);
		expect(first.outputs).toEqual(second.outputs);
	});
});

// ============================================================================
// Context propagation
// ============================================================================

describe('executeWorkflow — context propagation', () => {
	it('makes earlier step outputs available to later steps', async () => {
		const plan = makePlan([
			makeStep({ skillId: 'hr-recruiting', order: 0 }),
			makeStep({
				skillId: 'hr-onboarding',
				order: 1,
				dependencies: ['hr-recruiting'],
			}),
		]);

		const seenByOnboarding: unknown[] = [];

		await executeWorkflow(plan, (step: ExecutionStep, context: RuntimeContext) => {
			if (step.skillId === 'hr-recruiting') {
				return { candidate: 'Jane Doe' };
			}
			seenByOnboarding.push(context.get('hr-recruiting'));
			return 'ok';
		});

		expect(seenByOnboarding).toEqual([{ candidate: 'Jane Doe' }]);
	});

	it('exposes all accumulated outputs via context.toObject()', async () => {
		const plan = makePlan([
			makeStep({ skillId: 'a', order: 0 }),
			makeStep({ skillId: 'b', order: 1 }),
		]);

		let snapshotAtB: Record<string, unknown> = {};
		await executeWorkflow(plan, (step, context) => {
			if (step.skillId === 'a') return 1;
			snapshotAtB = context.toObject();
			return 2;
		});

		expect(snapshotAtB).toEqual({ a: 1 });
	});

	it('exposes the original intent on the context', async () => {
		const plan = makePlan(
			[makeStep({ skillId: 'a', order: 0 })],
			'write a job description',
		);

		const intents: string[] = [];
		await executeWorkflow(plan, (_step, context) => {
			intents.push(context.intent);
			return null;
		});

		expect(intents).toEqual(['write a job description']);
	});
});

// ============================================================================
// Retry handling
// ============================================================================

describe('executeWorkflow — retries', () => {
	it('retries a failing step up to maxRetries and eventually succeeds', async () => {
		const plan = makePlan([makeStep({ skillId: 'flaky', order: 0 })]);
		let attempts = 0;

		const result = await executeWorkflow(
			plan,
			() => {
				attempts++;
				if (attempts < 3) throw new Error('transient failure');
				return 'recovered';
			},
			{ retryPolicy: fixedRetryPolicy({ maxRetries: 3, delayMs: 10 }) },
		);

		expect(attempts).toBe(3);
		expect(result.status).toBe('completed');
		expect(result.steps[0]).toMatchObject({ status: 'completed', attempts: 3 });

		const retryEvents = result.events.filter((e) => e.type === 'step-retry');
		expect(retryEvents).toHaveLength(2);
	});

	it('fails after exhausting all retries', async () => {
		const plan = makePlan([makeStep({ skillId: 'always-fails', order: 0 })]);
		let attempts = 0;

		const result = await executeWorkflow(
			plan,
			() => {
				attempts++;
				throw new Error('permanent failure');
			},
			{ retryPolicy: fixedRetryPolicy({ maxRetries: 2 }) },
		);

		expect(attempts).toBe(3); // 1 initial + 2 retries
		expect(result.status).toBe('failed');
		expect(result.steps[0]?.status).toBe('failed');
		expect(result.steps[0]?.attempts).toBe(3);
	});

	it('does not retry when maxRetries is 0 (default policy)', async () => {
		const plan = makePlan([makeStep({ skillId: 'no-retry', order: 0 })]);
		let attempts = 0;

		const result = await executeWorkflow(plan, () => {
			attempts++;
			throw new Error('fails once');
		});

		expect(attempts).toBe(1);
		expect(result.status).toBe('failed');
	});

	it('produces deterministic delay values from exponentialRetryPolicy', () => {
		const policy = exponentialRetryPolicy({ maxRetries: 4, baseDelayMs: 100 });
		expect(policy.delayForAttempt(1)).toBe(100);
		expect(policy.delayForAttempt(2)).toBe(200);
		expect(policy.delayForAttempt(3)).toBe(400);
	});

	it('respects shouldRetry to skip retrying for specific errors', async () => {
		const plan = makePlan([makeStep({ skillId: 'unretryable', order: 0 })]);
		let attempts = 0;

		const result = await executeWorkflow(
			plan,
			() => {
				attempts++;
				throw new Error('fatal');
			},
			{
				retryPolicy: {
					maxRetries: 5,
					delayForAttempt: () => 0,
					shouldRetry: () => false,
				},
			},
		);

		expect(attempts).toBe(1);
		expect(result.status).toBe('failed');
	});
});

// ============================================================================
// Failure handling and dependency skipping
// ============================================================================

describe('executeWorkflow — failure handling', () => {
	it('stops execution and skips remaining steps by default', async () => {
		const plan = makePlan([
			makeStep({ skillId: 'a', order: 0 }),
			makeStep({ skillId: 'b', order: 1 }),
			makeStep({ skillId: 'c', order: 2 }),
		]);

		const result = await executeWorkflow(plan, (step) => {
			if (step.skillId === 'a') throw new Error('boom');
			return 'ok';
		});

		expect(result.status).toBe('failed');
		expect(result.steps.map((s) => ({ id: s.skillId, status: s.status }))).toEqual([
			{ id: 'a', status: 'failed' },
			{ id: 'b', status: 'skipped' },
			{ id: 'c', status: 'skipped' },
		]);
	});

	it('skips steps whose dependency failed, even with stopOnFailure disabled', async () => {
		const plan = makePlan([
			makeStep({ skillId: 'a', order: 0 }),
			makeStep({ skillId: 'b', order: 1, dependencies: ['a'] }),
			makeStep({ skillId: 'independent', order: 2 }),
		]);

		const executed: string[] = [];
		const result = await executeWorkflow(
			plan,
			(step) => {
				executed.push(step.skillId);
				if (step.skillId === 'a') throw new Error('boom');
				return 'ok';
			},
			{ stopOnFailure: false },
		);

		expect(result.status).toBe('failed');
		expect(executed).toEqual(['a', 'independent']);
		expect(result.steps.map((s) => ({ id: s.skillId, status: s.status }))).toEqual([
			{ id: 'a', status: 'failed' },
			{ id: 'b', status: 'skipped' },
			{ id: 'independent', status: 'completed' },
		]);
	});

	it('produces a structured, serializable error on failure', async () => {
		const plan = makePlan([makeStep({ skillId: 'a', order: 0 })]);

		const result = await executeWorkflow(plan, () => {
			throw new Error('specific failure message');
		});

		expect(result.steps[0]?.error).toMatchObject({
			code: 'STEP_EXECUTION_FAILED',
			skillId: 'a',
			attempt: 1,
		});
		expect(result.steps[0]?.error?.message).toContain('specific failure message');
		// The whole result must survive JSON round-tripping (no Error instances).
		expect(() => JSON.parse(JSON.stringify(result))).not.toThrow();
	});
});

// ============================================================================
// Execution state
// ============================================================================

describe('executeWorkflow — execution state', () => {
	it('reports a final state snapshot partitioning all skill IDs', async () => {
		const plan = makePlan([
			makeStep({ skillId: 'a', order: 0 }),
			makeStep({ skillId: 'b', order: 1 }),
		]);

		const result = await executeWorkflow(plan, () => 'ok');

		expect(result.state.completed.sort()).toEqual(['a', 'b']);
		expect(result.state.pending).toEqual([]);
		expect(result.state.running).toEqual([]);
		expect(result.state.failed).toEqual([]);
		expect(result.state.skipped).toEqual([]);
	});

	it('tracks failed and skipped buckets correctly after a failure', async () => {
		const plan = makePlan([
			makeStep({ skillId: 'a', order: 0 }),
			makeStep({ skillId: 'b', order: 1 }),
		]);

		const result = await executeWorkflow(plan, (step) => {
			if (step.skillId === 'a') throw new Error('boom');
			return 'ok';
		});

		expect(result.state.failed).toEqual(['a']);
		expect(result.state.skipped).toEqual(['b']);
		expect(result.state.completed).toEqual([]);
	});
});

// ============================================================================
// Events
// ============================================================================

describe('executeWorkflow — events', () => {
	it('emits workflow-started, step events, and workflow-completed in order', async () => {
		const plan = makePlan([makeStep({ skillId: 'a', order: 0 })]);
		const result = await executeWorkflow(plan, () => 'ok');

		expect(result.events.map((e) => e.type)).toEqual([
			'workflow-started',
			'step-started',
			'step-completed',
			'workflow-completed',
		]);
	});

	it('assigns strictly increasing logical order to every event', async () => {
		const plan = makePlan([
			makeStep({ skillId: 'a', order: 0 }),
			makeStep({ skillId: 'b', order: 1 }),
		]);
		const result = await executeWorkflow(plan, () => 'ok');

		const orders = result.events.map((e) => e.order);
		expect(orders).toEqual(orders.slice().sort((x, y) => x - y));
		expect(new Set(orders).size).toBe(orders.length);
	});

	it('invokes the onEvent callback synchronously for every event', async () => {
		const plan = makePlan([makeStep({ skillId: 'a', order: 0 })]);
		const observed: RuntimeEvent[] = [];

		await executeWorkflow(plan, () => 'ok', {
			onEvent: (event) => observed.push(event),
		});

		expect(observed.map((e) => e.type)).toEqual([
			'workflow-started',
			'step-started',
			'step-completed',
			'workflow-completed',
		]);
	});

	it('emits workflow-failed instead of workflow-completed on failure', async () => {
		const plan = makePlan([makeStep({ skillId: 'a', order: 0 })]);
		const result = await executeWorkflow(plan, () => {
			throw new Error('boom');
		});

		expect(result.events.at(-1)?.type).toBe('workflow-failed');
	});
});

// ============================================================================
// Tracing
// ============================================================================

describe('executeWorkflow — tracing', () => {
	it('produces one trace entry per event, each with a state snapshot', async () => {
		const plan = makePlan([makeStep({ skillId: 'a', order: 0 })]);
		const result = await executeWorkflow(plan, () => 'ok');

		expect(result.trace).toHaveLength(result.events.length);
		for (const entry of result.trace) {
			expect(entry.state).toHaveProperty('pending');
			expect(entry.state).toHaveProperty('running');
			expect(entry.state).toHaveProperty('completed');
			expect(entry.state).toHaveProperty('failed');
			expect(entry.state).toHaveProperty('skipped');
		}
	});

	it('records the step output on the step-completed trace entry', async () => {
		const plan = makePlan([makeStep({ skillId: 'a', order: 0 })]);
		const result = await executeWorkflow(plan, () => ({ answer: 42 }));

		const completedEntry = result.trace.find((e) => e.type === 'step-completed');
		expect(completedEntry?.result).toEqual({ answer: 42 });
	});

	it('records the structured error on the step-failed trace entry', async () => {
		const plan = makePlan([makeStep({ skillId: 'a', order: 0 })]);
		const result = await executeWorkflow(plan, () => {
			throw new Error('trace this failure');
		});

		const failedEntry = result.trace.find((e) => e.type === 'step-failed');
		expect(failedEntry?.error?.message).toContain('trace this failure');
	});

	it('reflects state transitions across the trace (running before completed)', async () => {
		const plan = makePlan([makeStep({ skillId: 'a', order: 0 })]);
		const result = await executeWorkflow(plan, () => 'ok');

		const startedEntry = result.trace.find((e) => e.type === 'step-started');
		const completedEntry = result.trace.find((e) => e.type === 'step-completed');

		expect(startedEntry?.state.running).toEqual(['a']);
		expect(completedEntry?.state.completed).toEqual(['a']);
	});
});

// ============================================================================
// WorkflowExecutor class + async executors
// ============================================================================

describe('WorkflowExecutor', () => {
	it('supports async step executors', async () => {
		const plan = makePlan([makeStep({ skillId: 'a', order: 0 })]);
		const executor = new WorkflowExecutor();

		const result = await executor.run(plan, async (step) => {
			await Promise.resolve();
			return `async-${step.skillId}`;
		});

		expect(result.status).toBe('completed');
		expect(result.outputs['a']).toBe('async-a');
	});

	it('handles an empty plan gracefully', async () => {
		const plan = makePlan([]);
		const result = await executeWorkflow(plan, () => 'unused');

		expect(result.status).toBe('completed');
		expect(result.steps).toEqual([]);
		expect(result.events.map((e) => e.type)).toEqual([
			'workflow-started',
			'workflow-completed',
		]);
	});
});
