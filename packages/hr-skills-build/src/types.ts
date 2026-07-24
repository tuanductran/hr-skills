import type { SkillCategory } from './classifier.js';

// ---------------------------------------------------------------------------
// Skill matrix types
// ---------------------------------------------------------------------------

export type Tier = 'full' | 'partial' | 'bare';

export interface SkillRow {
	name: string;
	displayName: string;
	tier: Tier;
	hasContent: boolean;
	hasPrompts: boolean;
	hasExamples: boolean;
	contentFiles: number;
	version: string;
	description: string;
}

// ---------------------------------------------------------------------------
// Skill directory types
// ---------------------------------------------------------------------------

export interface SkillDirectoryOptions {
	readonly prefix?: string;
	readonly sort?: boolean;
}

export interface SkillMeta {
	name: string;
	description: string;
	coverage: string;
	scopeSentence: string;
	triggerPhrases: string[];
	supportedTasks: string[];
}

/**
 * A single validation issue found in a skill.
 *
 * Named `SkillValidationIssue` (not `ValidationError`) to avoid a naming
 * collision with the `ValidationError` class exported by `skills-ref`, which
 * has a different shape and different semantics. Both names exist in the same
 * monorepo — keeping them distinct prevents IDE auto-import confusion.
 */
export interface SkillValidationIssue {
	skill: string;
	message: string;
}

// ---------------------------------------------------------------------------
// Skill registry types
// ---------------------------------------------------------------------------

/**
 * A single skill entry in the generated Skill Registry.
 *
 * This is the canonical, machine-readable record for one skill — the schema
 * that `registry/skills.json` conforms to. Runtime agents should read this
 * instead of parsing SKILL.md prose.
 */
export interface RegistryEntry {
	/** Directory / frontmatter name, e.g. "hr-onboarding". Primary key. */
	id: string;
	/** Human-readable display name (currently same as id by convention). */
	name: string;
	/** Semver-ish version string from SKILL.md frontmatter (metadata.version). */
	version: string;
	/** One-sentence description, trimmed from frontmatter. */
	description: string;
	/** Maturity tier: full, partial, or bare. */
	tier: Tier;
	/** Routing domain this skill belongs to (see classifier.ts). */
	domain: SkillCategory;
	/** Free-form tags used for cross-referencing and search (see classifier.ts). */
	tags: string[];
	/** Short slugs usable as alternate lookup keys, e.g. "onboarding" for "hr-onboarding". */
	aliases: string[];
	/** Capabilities this skill supports — sourced from its "## Supported tasks" section. */
	capabilities: string[];
	/** Sample trigger phrases — sourced from its "## Key prompts" section. */
	triggerPhrases: string[];
	/** Which optional content subdirectories exist on disk. */
	paths: {
		content: boolean;
		prompts: boolean;
		examples: boolean;
	};
	/**
	 * Other skill IDs commonly used together with this one, derived from
	 * `CATEGORY_META.preamble` cross-references in classifier.ts. Empty when
	 * no explicit pairing is documented for the skill's domain.
	 */
	dependencies: string[];
	/**
	 * Other skill IDs in the same domain, ranked by shared-tag overlap and
	 * capped — a lightweight, fully deterministic recommendation graph.
	 */
	relatedSkills: string[];
}

/**
 * The full generated Skill Registry document.
 */
export interface Registry {
	/** Bump when the shape of RegistryEntry changes in a breaking way. */
	schemaVersion: number;
	/** ISO date (YYYY-MM-DD) the registry was generated on. */
	generatedAt: string;
	/** Total number of skills indexed. */
	skillCount: number;
	skills: RegistryEntry[];
}

// ---------------------------------------------------------------------------
// Planner and validation types
// ---------------------------------------------------------------------------

export type SelectionReason =
	| 'direct-capability-match'
	| 'alias-match'
	| 'domain-expert'
	| 'dependency-requirement'
	| 'recommended-pairing'
	| 'related-skill';

export interface ExecutionStep {
	/** Skill ID (e.g. "hr-onboarding"). */
	skillId: string;
	/** Sequential position in the plan (0-indexed). */
	order: number;
	/** Why this skill was selected. */
	reason: SelectionReason;
	/** Optional explanation for complex reasoning. */
	rationale?: string;
	/** Skill IDs that must be executed before this one (if any). */
	dependencies: string[];
	/** Optional context that will be passed from previous steps. */
	contextInputs?: Record<string, unknown>;
}

export interface CapabilityMatch {
	/** The requested capability from user intent. */
	capability: string;
	/** Matched skills ranked by relevance. */
	matches: Array<{
		skillId: string;
		matchType: 'direct' | 'partial' | 'related';
		score: number; // 0.0 to 1.0
		explanation: string;
	}>;
	/** Whether this capability has at least one match. */
	isMatched: boolean;
	/** Explanation if capability could not be matched. */
	unmatchedReason?: string;
}

export interface ExecutionPlan {
	/** User's original intent (normalized). */
	intent: string;
	/** Extracted capabilities from the intent. */
	requestedCapabilities: string[];
	/** How each capability matched against available skills. */
	capabilityMatches: CapabilityMatch[];
	/** Ordered list of skills to execute. */
	steps: ExecutionStep[];
	/** Summary of the plan for human review. */
	summary: string;
	/** Total estimated complexity (simple/moderate/complex). */
	complexity: 'simple' | 'moderate' | 'complex';
	/** Optional warnings or considerations. */
	notes?: string[];
}

export interface PlanValidationIssue {
	code: string;
	severity: 'error' | 'warning' | 'info';
	message: string;
	context?: Record<string, unknown>;
}

export interface PlanValidationResult {
	isValid: boolean;
	issues: PlanValidationIssue[];
}

// ---------------------------------------------------------------------------
// Workflow runtime types
// ---------------------------------------------------------------------------

/**
 * Lifecycle status of a single execution step within the runtime.
 *
 * `pending` -> `running` -> (`completed` | `failed` | `skipped`)
 */
export type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped';

/**
 * A snapshot of the runtime's execution state at a point in time.
 *
 * Skill IDs move between these buckets as execution proceeds. A skill ID
 * appears in exactly one bucket at any given moment.
 */
export interface RuntimeStateSnapshot {
	pending: string[];
	running: string[];
	completed: string[];
	failed: string[];
	skipped: string[];
}

/**
 * A step's result after it finishes running (successfully or not).
 */
export interface StepResult {
	skillId: string;
	status: 'completed' | 'failed' | 'skipped';
	/** Output produced by the step, available to later steps via RuntimeContext. */
	output?: unknown;
	/** Populated when status is 'failed'. */
	error?: RuntimeErrorInfo;
	/** Number of attempts made (1 = succeeded/failed on first try). */
	attempts: number;
}

/**
 * Plain, serializable description of a runtime failure — used in traces and
 * results so failures survive JSON serialization (unlike Error instances).
 */
export interface RuntimeErrorInfo {
	code: string;
	message: string;
	skillId?: string;
	attempt?: number;
	cause?: string;
}

/**
 * A function that performs the actual work for a single execution step.
 *
 * The Runtime is deliberately agnostic about *what* a step does — invoking a
 * skill, calling a model, running a tool, and so on are all the caller's
 * responsibility. The Runtime only sequences calls to this function,
 * threads context between them, and manages state/retries/events/tracing.
 *
 * Throw (or reject) to signal step failure; the Runtime will apply the
 * configured RetryPolicy before giving up.
 */
export type StepExecutorFn = (
	step: ExecutionStep,
	context: RuntimeContext,
) => unknown | Promise<unknown>;

/**
 * Explicit, mutable context object threaded through workflow execution.
 *
 * Each completed step's output is recorded here and made available to every
 * subsequent step — this is how "context propagation" is implemented, rather
 * than relying on module-level globals or closures.
 */
export interface RuntimeContext {
	/** The original user intent the plan was generated for. */
	readonly intent: string;
	/** Read a previous step's output by skill ID. Returns undefined if absent. */
	get(skillId: string): unknown;
	/** Record a step's output, making it visible to later steps. */
	set(skillId: string, value: unknown): void;
	/** True if the given skill ID has already produced output. */
	has(skillId: string): boolean;
	/** A plain-object snapshot of all outputs recorded so far, keyed by skill ID. */
	toObject(): Record<string, unknown>;
}

/**
 * Deterministic retry policy consulted by the runtime after a step fails.
 *
 * `delayForAttempt` returns a logical delay in milliseconds; the runtime
 * never actually sleeps for it (that would break determinism and slow down
 * tests) — the value is recorded on retry events/traces for callers that
 * want to honor it in their own step executor or a wrapping scheduler.
 */
export interface RetryPolicy {
	/** Maximum number of retry attempts after the initial try (0 = no retries). */
	readonly maxRetries: number;
	/** Logical delay (ms) to record before retry attempt `attempt` (1-indexed). */
	delayForAttempt(attempt: number): number;
	/** Whether this error should be retried at all. Defaults to "always" when omitted. */
	shouldRetry?(error: unknown, attempt: number): boolean;
}

export type RuntimeEventType =
	| 'workflow-started'
	| 'step-started'
	| 'step-retry'
	| 'step-completed'
	| 'step-failed'
	| 'step-skipped'
	| 'workflow-completed'
	| 'workflow-failed';

/**
 * A single runtime event. `order` is a logical clock (a monotonically
 * increasing integer assigned by the EventDispatcher) rather than a wall
 * clock timestamp, which keeps execution fully deterministic and makes
 * traces reproducible in tests.
 */
export interface RuntimeEvent {
	order: number;
	type: RuntimeEventType;
	skillId?: string;
	attempt?: number;
	data?: Record<string, unknown>;
}

/**
 * One entry in the execution trace — an event paired with the runtime state
 * snapshot immediately after that event was applied. Traces are the primary
 * debugging artifact: replaying them reconstructs exactly what happened and
 * in what order, without needing wall-clock timestamps.
 */
export interface TraceEntry {
	order: number;
	type: RuntimeEventType;
	skillId?: string;
	attempt?: number;
	state: RuntimeStateSnapshot;
	result?: unknown;
	error?: RuntimeErrorInfo;
}

/**
 * Configuration accepted by `executeWorkflow` / `WorkflowExecutor`.
 */
export interface RuntimeOptions {
	/** Retry behavior applied to every step. Defaults to zero retries. */
	retryPolicy?: RetryPolicy;
	/** Called synchronously as each event is emitted (for live progress UIs, logging, etc). */
	onEvent?: (event: RuntimeEvent) => void;
	/**
	 * Whether a step failure (after exhausting retries) halts remaining
	 * steps. Defaults to true. When false, downstream steps that depend on
	 * the failed step are skipped, but independent steps still run.
	 */
	stopOnFailure?: boolean;
}

/**
 * The final outcome of running an execution plan through the Runtime.
 */
export interface WorkflowResult {
	status: 'completed' | 'failed';
	intent: string;
	outputs: Record<string, unknown>;
	steps: StepResult[];
	events: RuntimeEvent[];
	trace: TraceEntry[];
	state: RuntimeStateSnapshot;
}

// ---------------------------------------------------------------------------
// Evaluation framework types
// ---------------------------------------------------------------------------

/**
 * A single evaluation dataset entry — a representative planning scenario the
 * Planner and Runtime are expected to handle correctly.
 *
 * Datasets store the *input* (`intent`) only. The *expected output* is a
 * golden fixture (see `GoldenCaseResult`), generated once from an actual run
 * against the real Skill Registry and committed to `eval/golden/`. This
 * keeps the dataset human-authored and small, while expected outputs stay
 * exactly in sync with what the Planner and Runtime actually produce —
 * avoiding hand-guessed expectations that drift from reality.
 */
export interface EvaluationCase {
	/** Stable identifier, e.g. "recruiting-interview-questions". */
	id: string;
	/** Short human-readable description of the scenario. */
	description: string;
	/** The user intent passed to `generateExecutionPlan`. */
	intent: string;
	/** Free-form category tag for grouping in reports (e.g. "recruiting"). */
	category: string;
}

/** A dataset is a named, ordered collection of evaluation cases. */
export interface EvaluationDataset {
	name: string;
	description: string;
	cases: EvaluationCase[];
}

/**
 * The deterministic, golden-fixture shape of a single case's expected
 * outcome — captures only the fields that are meaningful to compare across
 * runs (skill selection, ordering, capability coverage, validation, and
 * workflow outcome), not the full `ExecutionPlan`/`WorkflowResult` objects,
 * which carry incidental detail (rationale strings, timestamps) that would
 * make the fixture noisy and prone to false-positive regressions.
 */
export interface GoldenCaseResult {
	caseId: string;
	/** Skill IDs selected by the Planner, in execution order. */
	skillIds: string[];
	/** Number of requested capabilities that matched at least one skill. */
	matchedCapabilities: number;
	/** Total number of capabilities extracted from the intent. */
	totalCapabilities: number;
	/** Whether `validateExecutionPlan` reported zero errors. */
	planIsValid: boolean;
	/** Final Runtime status when the plan is executed with the stub executor. */
	workflowStatus: 'completed' | 'failed';
}

/** A named collection of golden case results for one dataset. */
export interface GoldenFixture {
	dataset: string;
	/** ISO date the fixture was generated/last updated on. */
	generatedAt: string;
	results: GoldenCaseResult[];
}

/** The actual outcome of running one evaluation case in the current code. */
export interface EvaluationCaseResult {
	caseId: string;
	category: string;
	intent: string;
	actual: GoldenCaseResult;
	/** Present only if a golden fixture entry exists for this case. */
	golden?: GoldenCaseResult;
	/** Fields that differ between `actual` and `golden` (empty if none, or no golden entry). */
	regressions: string[];
}

/**
 * Deterministic quality metrics aggregated across an evaluation run.
 * Each score is a 0.0-1.0 ratio; `NaN`-free by construction (denominators of
 * 0 map to a score of 1 — vacuously satisfied, nothing to fail).
 */
export interface QualityMetrics {
	/** Fraction of requested capabilities across all cases that matched a skill. */
	capabilityMatchingAccuracy: number;
	/** Fraction of cases whose selected skill set exactly matches the golden fixture. */
	skillSelectionAccuracy: number;
	/** Fraction of cases whose execution order exactly matches the golden fixture. */
	executionOrderingAccuracy: number;
	/** Fraction of cases with zero plan-validation errors (dependency correctness). */
	dependencyCorrectness: number;
	/** Fraction of cases whose Runtime execution completed successfully. */
	workflowSuccessRate: number;
}

/** The full report produced by one benchmark run. */
export interface EvaluationReport {
	/** ISO date the evaluation was run on. */
	generatedAt: string;
	datasetName: string;
	totalCases: number;
	passedCases: number;
	failedCases: number;
	metrics: QualityMetrics;
	results: EvaluationCaseResult[];
	/** Case IDs with at least one regression against the golden fixture. */
	regressedCaseIds: string[];
}
