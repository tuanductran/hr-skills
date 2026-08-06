# API Reference

Public functions and types exported from `hr-skills-build`.

```ts
import { buildRegistry, searchSkills, executeWorkflow } from 'hr-skills-build'
```

CLI scripts (`src/cli/*`) and build entry points (`src/build/*`) are process-entry scripts — they are not importable and are not covered here.

---

## Registry

### `buildRegistry`

```ts
import { buildRegistry } from 'hr-skills-build'
```

Scans all `skills/hr-*/SKILL.md` files on disk and produces the complete Skill Registry.

```ts
async function buildRegistry(signalTable?: RelevanceSignalTable): Promise<Registry>
```

#### Parameters

- `signalTable` — optional pre-loaded relevance signal table (from `loadRelevanceSignalTable`). When supplied, `relatedSkills` ranking blends observed co-selection rates with tag overlap. When omitted, ranking is tag overlap only.

#### Returns

- `schemaVersion` — schema version number; bump when `RegistryEntry` shape changes in a breaking way
- `generatedAt` — ISO date string (`YYYY-MM-DD`)
- `skillCount` — total number of skills indexed
- `skills` — array of `RegistryEntry`

---

### `loadRelevanceSignalTable`

```ts
import { loadRelevanceSignalTable } from 'hr-skills-build'
```

Loads a relevance signal table JSON file from disk. Pass the result to `buildRegistry` to enable usage-informed ranking.

```ts
async function loadRelevanceSignalTable(
  path?: string,
): Promise<RelevanceSignalTable | undefined>
```

#### Parameters

- `path` — absolute path to the signal table JSON file. Defaults to `RELEVANCE_SIGNALS_PATH` (`registry/relevance-signals.json`).

#### Returns

`RelevanceSignalTable` when the file exists, is valid JSON, and has a recognized `schemaVersion`. Returns `undefined` — rather than throwing — when the file is missing, unparsable, or has an unrecognized schema version. This allows callers to fall back to static tag-overlap ranking gracefully.

Run `bun run signals` to generate `registry/relevance-signals.json`.

---

## Discovery

### `getHrSkills`

```ts
import { getHrSkills } from 'hr-skills-build'
```

Lists skill directory names under `skills/` matching the `hr-` prefix. Only includes directories that contain a `SKILL.md` file.

```ts
async function getHrSkills(options?: SkillDirectoryOptions): Promise<string[]>
```

#### Parameters

- `options.prefix` — directory-name prefix filter. Default: `'hr-'`
- `options.sort` — sort results alphabetically. Default: `true`

#### Returns

Array of skill IDs, e.g. `['hr-analytics', 'hr-compliance', 'hr-onboarding', ...]`.

---

### `classifySkill`

```ts
import { classifySkill } from 'hr-skills-build'
```

Classifies a skill into its routing category and derives tags from its name.

```ts
function classifySkill(skillName: string): SkillClassification
```

#### Returns `SkillClassification`

- `category` — one of the `SkillCategory` values (e.g. `'talent-acquisition'`, `'hr-technology-ai'`)
- `tags` — string array of classification tags (e.g. `['ai']`, `['engineering']`)

Resolution order: explicit override map → keyword rules → `'uncategorized'` fallback.

> Note: `SkillClassification` does not include `aliases` or `dependencies` — those are derived separately during registry construction in `buildRegistry`.

---

## Search

### `searchSkills`

```ts
import { searchSkills } from 'hr-skills-build'
```

Ranks skills from the registry against a free-text query using exact and optional fuzzy matching across structured fields.

```ts
function searchSkills(query: SkillSearchQuery, registry: Registry): SkillSearchResponse
```

#### Parameters

- `query.text` — free-text query matched against `fields`
- `query.fields` — which registry fields to search. Default: all fields (`capabilities`, `aliases`, `tags`, `triggerPhrases`, `domain`)
- `query.domain` — restrict results to one domain before scoring
- `query.fuzzy` — enable fuzzy matching alongside exact matching. Default: `true`
- `query.limit` — maximum results to return. Default: `10`

At least one of `text` (non-empty) or `domain` must be present.

#### Returns

- `query` — the `text` query echoed back verbatim
- `resultCount` — number of results returned
- `results` — `SkillSearchResult[]` ranked by `score` descending; each result carries `skillId`, `name`, `description`, `domain`, `score`, `matches` (`SkillFieldMatch[]`), and `explanation`

#### Throws

- `InvalidSearchQueryError` — if both `text` and `domain` are absent, or `limit` is not a positive integer

---

### `InvalidSearchQueryError`

```ts
import { InvalidSearchQueryError } from 'hr-skills-build'
```

Thrown by `searchSkills` when the query is structurally invalid.

```ts
class InvalidSearchQueryError extends Error {}
```

---

### `FIELD_WEIGHTS`

```ts
import { FIELD_WEIGHTS } from 'hr-skills-build'
```

```ts
const FIELD_WEIGHTS: Record<SearchableField, number>
```

Per-field scoring weights used by `searchSkills`.

---

### `ALL_SEARCHABLE_FIELDS`

```ts
import { ALL_SEARCHABLE_FIELDS } from 'hr-skills-build'
```

```ts
const ALL_SEARCHABLE_FIELDS: SearchableField[]
```

The ordered list of all fields that `searchSkills` can search against.

---

## Recommendations

### `getRecommendations`

```ts
import { getRecommendations } from 'hr-skills-build'
```

Returns a ranked list of related skills for a given skill, sourced from `RegistryEntry.relatedSkills`.

```ts
function getRecommendations(
  skillId: string,
  registry: Registry,
  limit?: number,
): RecommendationResult
```

#### Parameters

- `skillId` — the skill to get recommendations for, e.g. `'hr-onboarding'`
- `registry` — a `Registry` object
- `limit` — maximum recommendations to return. Default: `5`

#### Returns

- `skillId` — the source skill's ID
- `recommendations` — `SkillRecommendation[]` ordered by rank (best first); each carries `id`, `name`, `description`, `domain`, and `rank` (1-based)

#### Throws

- `UnknownSkillError` — if `skillId` is not in the registry

---

### `UnknownSkillError`

```ts
import { UnknownSkillError } from 'hr-skills-build'
```

Thrown by `getRecommendations` when the requested skill ID is absent from the registry.

```ts
class UnknownSkillError extends Error {}
```

---

## Relevance Signals

### `buildRelevanceSignalTable`

```ts
import { buildRelevanceSignalTable } from 'hr-skills-build'
```

Builds a `RelevanceSignalTable` from a set of golden fixtures.

```ts
function buildRelevanceSignalTable(
  fixtures: ReadonlyArray<GoldenFixture>,
  generatedAt: string,
): RelevanceSignalTable
```

---

### `extractCoSelectionCounts`

```ts
import { extractCoSelectionCounts } from 'hr-skills-build'
```

Counts how many times each pair of skills was co-selected across all golden fixtures.

```ts
function extractCoSelectionCounts(
  fixtures: ReadonlyArray<GoldenFixture>,
): Map<string, Map<string, number>>
```

---

### `extractSkillObservationCounts`

```ts
import { extractSkillObservationCounts } from 'hr-skills-build'
```

Counts how many times each skill appeared (was selected) across all golden fixtures.

```ts
function extractSkillObservationCounts(
  fixtures: ReadonlyArray<GoldenFixture>,
): Map<string, number>
```

---

### `computeSignals`

```ts
import { computeSignals } from 'hr-skills-build'
```

Converts raw co-selection and observation count maps into `RelevanceSignal[]`.

```ts
function computeSignals(
  coSelectionCounts: ReadonlyMap<string, ReadonlyMap<string, number>>,
  observationCounts: ReadonlyMap<string, number>,
): RelevanceSignal[]
```

---

### `indexSignalsBySource`

```ts
import { indexSignalsBySource } from 'hr-skills-build'
```

Builds a nested `Map<sourceId, Map<targetId, score>>` index from a `RelevanceSignalTable` for O(1) per-skill look-ups.

```ts
function indexSignalsBySource(
  table: RelevanceSignalTable,
): Map<string, Map<string, number>>
```

---

### `reRankRelatedSkills`

```ts
import { reRankRelatedSkills } from 'hr-skills-build'
```

Blends a static tag-overlap `relatedSkills` ranking with observed co-selection evidence from a signal index.

```ts
function reRankRelatedSkills(
  skillId: string,
  staticRelated: ReadonlyArray<string>,
  signalIndex: ReadonlyMap<string, ReadonlyMap<string, number>>,
  limit?: number,
): string[]
```

- `limit` — maximum IDs to return. Default: `5`

---

### `RELEVANCE_SIGNAL_SCHEMA_VERSION`

```ts
import { RELEVANCE_SIGNAL_SCHEMA_VERSION } from 'hr-skills-build'
```

```ts
const RELEVANCE_SIGNAL_SCHEMA_VERSION = 1
```

Schema version for `RelevanceSignalTable`. `loadRelevanceSignalTable` rejects tables with a different value.

---

### `OBSERVED_WEIGHT`

```ts
import { OBSERVED_WEIGHT } from 'hr-skills-build'
```

```ts
const OBSERVED_WEIGHT = 0.3
```

Fraction of the blended `relatedSkills` score that comes from observed co-selection evidence. The remaining `1 - OBSERVED_WEIGHT` comes from static tag-overlap ranking.

---

## Planner

### `generateExecutionPlan`

```ts
import { generateExecutionPlan } from 'hr-skills-build'
```

Transforms a natural-language user intent into an ordered execution plan. Pure function — deterministic for a given intent and registry state, no side effects.

```ts
function generateExecutionPlan(intent: string, registry: Registry): ExecutionPlan
```

#### Parameters

- `intent` — natural-language description of what the user wants to do
- `registry` — a `Registry` object to match capabilities against

#### Returns

- `intent` — the user's normalized intent string
- `requestedCapabilities` — capabilities extracted from the intent
- `capabilityMatches` — how each extracted capability matched against registry skills
- `steps` — `ExecutionStep[]` in execution order (topologically sorted by the planner)
- `summary` — human-readable plan summary
- `complexity` — `'simple' | 'moderate' | 'complex'`
- `notes` — optional warnings or considerations

---

### `analyzeIntent`

```ts
import { analyzeIntent } from 'hr-skills-build'
```

Extracts capability phrases from a natural-language intent string. Called internally by `generateExecutionPlan`; exported for diagnostic use.

```ts
function analyzeIntent(intent: string): string[]
```

#### Returns

Array of normalized capability strings extracted from the intent.

---

## Runtime

### `executeWorkflow`

```ts
import { executeWorkflow } from 'hr-skills-build'
```

Executes a validated `ExecutionPlan` from start to finish. Steps run in plan order; the caller supplies a `StepExecutorFn` that performs the actual work.

```ts
async function executeWorkflow(
  plan: ExecutionPlan,
  executeStep: StepExecutorFn,
  options?: RuntimeOptions,
): Promise<WorkflowResult>
```

#### Parameters

- `plan` — an `ExecutionPlan` from `generateExecutionPlan`
- `executeStep` — `(step: ExecutionStep, context: RuntimeContext) => unknown | Promise<unknown>`. Throw to signal step failure
- `options.retryPolicy` — retry behavior applied to every step. Default: `noRetryPolicy()`
- `options.onEvent` — called synchronously as each `RuntimeEvent` is emitted (for progress UIs, logging)
- `options.stopOnFailure` — when `false`, skips only downstream dependents and continues independent steps after a failure. Default: `true`

#### Returns

- `status` — `'completed' | 'failed'`
- `intent` — the plan's original intent
- `outputs` — `Record<string, unknown>` keyed by skill ID
- `steps` — `StepResult[]` with `skillId`, `status`, `output`, `error`, and `attempts`
- `events` — `RuntimeEvent[]` in logical clock order
- `trace` — `TraceEntry[]`, one per event; each entry pairs the event with the full `RuntimeStateSnapshot` immediately after it was applied
- `state` — final `RuntimeStateSnapshot` with `pending`, `running`, `completed`, `failed`, and `skipped` arrays

---

### `WorkflowExecutor`

```ts
import { WorkflowExecutor } from 'hr-skills-build'
```

The class underlying `executeWorkflow`. Use directly when you need to reuse the same configuration across multiple runs.

```ts
class WorkflowExecutor {
  constructor(options?: RuntimeOptions)
  async run(plan: ExecutionPlan, executeStep: StepExecutorFn): Promise<WorkflowResult>
}
```

One instance corresponds to one workflow run — it holds no state that outlives a `run()` call.

---

### `noRetryPolicy`

```ts
import { noRetryPolicy } from 'hr-skills-build'
```

Returns a `RetryPolicy` with `maxRetries: 0`. Steps are attempted exactly once. This is the default when no policy is supplied.

```ts
function noRetryPolicy(): RetryPolicy
```

---

### `fixedRetryPolicy`

```ts
import { fixedRetryPolicy } from 'hr-skills-build'
```

Returns a `RetryPolicy` that retries up to `maxRetries` times with a constant logical delay.

```ts
function fixedRetryPolicy(options: {
  maxRetries: number
  delayMs?: number
}): RetryPolicy
```

---

### `exponentialRetryPolicy`

```ts
import { exponentialRetryPolicy } from 'hr-skills-build'
```

Returns a `RetryPolicy` with exponential back-off: `delay = baseDelayMs × 2^(attempt−1)`, capped at `maxDelayMs`.

```ts
function exponentialRetryPolicy(options: {
  maxRetries: number
  baseDelayMs?: number
  maxDelayMs?: number
}): RetryPolicy
```

> The Runtime never actually sleeps. `delayForAttempt` returns a logical delay recorded on the `step-retry` event and trace entry. Callers that need real backoff implement their own wait inside `StepExecutorFn`. See [runtime.md](runtime.md) for details.

---

### `createRuntimeContext`

```ts
import { createRuntimeContext } from 'hr-skills-build'
```

Creates a `RuntimeContext` bound to a workflow intent. Used internally by `WorkflowExecutor`; exported for testing and diagnostic use.

```ts
function createRuntimeContext(intent: string): RuntimeContext
```

---

### `RuntimeError`

```ts
import { RuntimeError } from 'hr-skills-build'
```

Structured error thrown by the runtime when a step fails or its dependencies fail/are skipped.

```ts
class RuntimeError extends Error {
  readonly code: RuntimeErrorCode   // 'STEP_EXECUTION_FAILED' | 'STEP_DEPENDENCY_FAILED' | 'STEP_DEPENDENCY_SKIPPED'
  readonly skillId: string
  readonly attempt: number
  readonly cause?: unknown
}
```

---

### `describeCause`

```ts
import { describeCause } from 'hr-skills-build'
```

Converts an unknown thrown value to a human-readable string. Used internally to populate `StepResult.error`.

```ts
function describeCause(cause: unknown): string
```

---

### `EventDispatcher`

```ts
import { EventDispatcher } from 'hr-skills-build'
```

Internal class that accumulates `RuntimeEvent[]` and calls `RuntimeOptions.onEvent` synchronously. Exported for advanced testing scenarios.

```ts
class EventDispatcher {
  dispatch(event: RuntimeEvent): void
  snapshot(): RuntimeEvent[]
}
```

---

### `RuntimeStateTracker`

```ts
import { RuntimeStateTracker } from 'hr-skills-build'
```

Tracks the per-step lifecycle (`pending → running → completed | failed | skipped`) and produces `RuntimeStateSnapshot`. Exported for testing.

```ts
class RuntimeStateTracker {
  snapshot(): RuntimeStateSnapshot
}
```

---

### `TraceCollector`

```ts
import { TraceCollector } from 'hr-skills-build'
```

Accumulates `TraceEntry[]`, pairing each `RuntimeEvent` with the full `RuntimeStateSnapshot` taken immediately after. Exported for testing.

```ts
class TraceCollector {
  record(event: RuntimeEvent, state: RuntimeStateSnapshot): void
  entries(): TraceEntry[]
}
```

---

## Validation

All validation functions accumulate issues into a `SkillValidationIssue[]` array rather than throwing. Each issue has `{ skill: string; message: string }`.

### `validateFrontmatter`

```ts
import { validateFrontmatter } from 'hr-skills-build'
```

Checks that frontmatter contains a valid `name` (matching the directory name), `description` (≥ 50 chars), `metadata.author`, and `metadata.version`.

```ts
function validateFrontmatter(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateRequiredSections`

```ts
import { validateRequiredSections } from 'hr-skills-build'
```

Checks that the SKILL.md body contains all three required sections: `## Supported tasks`, `## Key prompts`, and `## Tips`.

```ts
function validateRequiredSections(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateContentLength`

```ts
import { validateContentLength } from 'hr-skills-build'
```

Checks that the full SKILL.md content is at least 1,000 characters.

```ts
function validateContentLength(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateLineCount`

```ts
import { validateLineCount } from 'hr-skills-build'
```

Checks that the SKILL.md body is at most 500 lines.

```ts
function validateLineCount(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateSupportedTasks`

```ts
import { validateSupportedTasks } from 'hr-skills-build'
```

Checks that the `## Supported tasks` section has 8–12 bullet items.

```ts
function validateSupportedTasks(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateTips`

```ts
import { validateTips } from 'hr-skills-build'
```

Checks that the `## Tips` section has 4–6 bullet items.

```ts
function validateTips(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateBlankLines`

```ts
import { validateBlankLines } from 'hr-skills-build'
```

Checks that every heading and bold label is followed by a blank line before any list item.

```ts
function validateBlankLines(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateAuthor`

```ts
import { validateAuthor } from 'hr-skills-build'
```

Checks that `metadata.author` is present and in Title Case.

```ts
function validateAuthor(
  skillName: string,
  author: string | undefined,
  errors: SkillValidationIssue[],
): void
```

---

### `validatePromptStructure`

```ts
import { validatePromptStructure } from 'hr-skills-build'
```

Checks the `## Key prompts` section against the format spec: 3–6 H3 subtopics, 4–7 quoted prompts per subtopic.

```ts
function validatePromptStructure(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateRouterConsistency`

```ts
import { validateRouterConsistency } from 'hr-skills-build'
```

Checks three-way consistency between the root `SKILL.md` router links, the `skills/` filesystem, and `registry/marketplace.json`. All three must agree on which skills exist.

```ts
async function validateRouterConsistency(errors: SkillValidationIssue[]): Promise<void>
```

---

### `validateSubdirectoryContents`

```ts
import { validateSubdirectoryContents } from 'hr-skills-build'
```

Checks that every `content/`, `prompts/`, or `examples/` subdirectory present on disk contains at least one `.md` file. Empty subdirectories are strictly forbidden.

```ts
async function validateSubdirectoryContents(
  skillName: string,
  errors: SkillValidationIssue[],
): Promise<void>
```

---

### `validateExecutionPlan`

```ts
import { validateExecutionPlan } from 'hr-skills-build'
```

Validates a generated `ExecutionPlan` for structural soundness.

```ts
function validateExecutionPlan(plan: ExecutionPlan, registry: Registry): PlanValidationResult
```

Checks:

- No duplicate steps
- No dangling skill references (every `step.skillId` exists in the registry)
- Execution order respects dependency constraints
- No circular skill dependencies
- Capability coverage (at least one match per requested capability)
- Step `order` fields form a consistent `0..N-1` sequence

#### Returns

- `isValid` — `true` if no errors were found
- `issues` — `PlanValidationIssue[]`; each has `code`, `severity` (`'error' | 'warning' | 'info'`), `message`, and optional `context`

---

### `suggestPlanImprovements`

```ts
import { suggestPlanImprovements } from 'hr-skills-build'
```

Returns human-readable improvement suggestions for a plan that passed structural validation but may still be suboptimal (e.g. empty plan, unmatched capabilities). Used by the CLI for diagnostic output.

```ts
function suggestPlanImprovements(plan: ExecutionPlan, registry: Registry): string[]
```

---

### `validateRegistryConsistency`

```ts
import { validateRegistryConsistency } from 'hr-skills-build'
```

Validates the generated `registry/skills.json` against the live filesystem — schema, required fields, tier consistency, and skill ID presence on disk.

```ts
async function validateRegistryConsistency(errors: SkillValidationIssue[]): Promise<void>
```

---

### `validateRelatedSkillsAgainstSignals`

```ts
import { validateRelatedSkillsAgainstSignals } from 'hr-skills-build'
```

Warns when a skill's `relatedSkills` list diverges significantly from what the committed relevance signal table would suggest. No-ops when `signalTable` is `undefined`.

```ts
function validateRelatedSkillsAgainstSignals(
  registry: { skills: ReadonlyArray<Pick<RegistryEntry, 'id' | 'relatedSkills'>> },
  signalTable: RelevanceSignalTable | undefined,
  warnings: SkillValidationIssue[],
): void
```

---

## Security Validation

All security validators follow the same accumulator pattern as the content validators — they push into a `SkillValidationIssue[]` array rather than throwing.

### `validateSecurityCommands`

```ts
import { validateSecurityCommands } from 'hr-skills-build'
```

Scans fenced code blocks for dangerous shell patterns (e.g. `rm -rf`, `curl | sh`).

```ts
function validateSecurityCommands(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateSensitivePaths`

```ts
import { validateSensitivePaths } from 'hr-skills-build'
```

Checks for references to sensitive filesystem paths (e.g. `/etc/passwd`, `~/.ssh`).

```ts
function validateSensitivePaths(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateSuspiciousUrls`

```ts
import { validateSuspiciousUrls } from 'hr-skills-build'
```

Flags URLs that look like data-exfiltration endpoints or non-HTTPS links in prompt code.

```ts
function validateSuspiciousUrls(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateCredentialLeaks`

```ts
import { validateCredentialLeaks } from 'hr-skills-build'
```

Detects patterns that resemble hard-coded credentials (API keys, tokens, passwords).

```ts
function validateCredentialLeaks(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

### `validateHiddenUnicode`

```ts
import { validateHiddenUnicode } from 'hr-skills-build'
```

Detects invisible or direction-override Unicode code points that could be used for prompt injection.

```ts
function validateHiddenUnicode(
  skillName: string,
  content: string,
  errors: SkillValidationIssue[],
): void
```

---

## Semantic Validation

### `validateSemanticConsistency`

```ts
import { validateSemanticConsistency } from 'hr-skills-build'
```

Runs all semantic checks (drift, possible copy, concept coverage) across a set of skills and accumulates warnings.

```ts
async function validateSemanticConsistency(
  skillsDir: string,
  skillNames: string[],
  warnings: SkillValidationIssue[],
): Promise<SemanticFinding[]>
```

---

### `loadSkillSemanticContent`

```ts
import { loadSkillSemanticContent } from 'hr-skills-build'
```

Reads a skill's SKILL.md and extracts the structured content needed for semantic analysis.

```ts
async function loadSkillSemanticContent(
  skillsDir: string,
  skillName: string,
): Promise<SkillSemanticContent>
```

---

### `checkDrift`

```ts
import { checkDrift } from 'hr-skills-build'
```

Checks whether a skill's key-prompt tokens diverge from its description tokens beyond the configured threshold.

```ts
function checkDrift(skill: SkillSemanticContent): SemanticFinding[]
```

---

### `checkPossibleCopy`

```ts
import { checkPossibleCopy } from 'hr-skills-build'
```

Detects whether a skill's description appears to be a near-copy of another skill in the same set.

```ts
function checkPossibleCopy(
  skill: SkillSemanticContent,
  others: SkillSemanticContent[],
): SemanticFinding[]
```

---

### `checkConceptCoverage`

```ts
import { checkConceptCoverage } from 'hr-skills-build'
```

Checks that the skill's supported tasks adequately cover the concepts promised by its description.

```ts
function checkConceptCoverage(skill: SkillSemanticContent): SemanticFinding[]
```

---

### `topKeywords`

```ts
import { topKeywords } from 'hr-skills-build'
```

Returns the top N most distinctive tokens from a description string (stop-words removed).

```ts
function topKeywords(description: string, count?: number): string[]
```

---

### Semantic validation constants

```ts
import {
  PROMPT_DRIFT_THRESHOLD,
  EXAMPLE_DRIFT_THRESHOLD,
  COPY_MARGIN,
  COPY_MIN_OTHER_SCORE,
  MIN_COVERAGE_RATIO,
  MIN_PURPOSE_TOKENS,
} from 'hr-skills-build'
```

| Constant | Value | Description |
|---|---|---|
| `PROMPT_DRIFT_THRESHOLD` | `0.015` | Maximum allowed drift between description and key-prompt tokens |
| `EXAMPLE_DRIFT_THRESHOLD` | `0.03` | Maximum allowed drift between description and example tokens |
| `COPY_MARGIN` | `0.06` | Minimum score margin over the next-highest skill to flag a possible copy |
| `COPY_MIN_OTHER_SCORE` | `0.12` | Minimum similarity score the possible-source skill must have |
| `MIN_COVERAGE_RATIO` | `0.3` | Minimum fraction of description concepts that must appear in supported tasks |
| `MIN_PURPOSE_TOKENS` | `5` | Minimum token count required for purpose extraction to run |

---

## Quality Scoring

See [quality-scoring.md](quality-scoring.md) for scoring methodology and dimension weights.

### `scoreSkillQuality`

```ts
import { scoreSkillQuality } from 'hr-skills-build'
```

Computes a quality score for a single skill across three dimensions: clarity, completeness, and example coverage.

```ts
async function scoreSkillQuality(skillsDir: string, skillName: string): Promise<SkillQualityScore>
```

#### Returns

- `skill` — the skill's directory name
- `clarity` — `QualityDimensionScore` (weight 30%): description length, presence of `Use when` trigger clause, body readability
- `completeness` — `QualityDimensionScore` (weight 40%): how close task/tips/subtopic counts are to the ideal band center, plus content length
- `exampleCoverage` — `QualityDimensionScore` (weight 30%): presence of `content/` and `examples/` material and prompt density
- `overall` — weighted sum in `[0, 100]`, rounded to two decimal places
- `band` — `'excellent' | 'good' | 'needs-review' | 'poor'`

Each `QualityDimensionScore` has:

- `score` — dimension score in `[0, 100]`
- `band` — quality band for this dimension
- `notes` — string array of human-readable improvement hints

---

### `scoreAllSkills`

```ts
import { scoreAllSkills } from 'hr-skills-build'
```

Scores every skill in the `skills/` directory.

```ts
async function scoreAllSkills(): Promise<SkillQualityScore[]>
```

---

### `scoreSkills`

```ts
import { scoreSkills } from 'hr-skills-build'
```

Scores a specific subset of skills — used by CI to score only skills touched by a pull request.

```ts
async function scoreSkills(skillNames: string[]): Promise<SkillQualityScore[]>
```

#### Parameters

- `skillNames` — directory names of the skills to score, e.g. `['hr-onboarding', 'hr-recruiting']`

#### Returns

`SkillQualityScore[]` in the same order as `skillNames`.

---

### `scoreClarity`

```ts
import { scoreClarity } from 'hr-skills-build'
```

```ts
function scoreClarity(description: string, content: string): QualityDimensionScore
```

---

### `scoreCompleteness`

```ts
import { scoreCompleteness } from 'hr-skills-build'
```

```ts
function scoreCompleteness(content: string): QualityDimensionScore
```

---

### `scoreExampleCoverage`

```ts
import { scoreExampleCoverage } from 'hr-skills-build'
```

```ts
async function scoreExampleCoverage(
  skillsDir: string,
  skillName: string,
  content: string,
): Promise<QualityDimensionScore>
```

---

### Quality scoring constants

```ts
import {
  CLARITY_WEIGHT,
  COMPLETENESS_WEIGHT,
  EXAMPLE_COVERAGE_WEIGHT,
  QUALITY_BAND_THRESHOLDS,
} from 'hr-skills-build'
```

| Constant | Value | Description |
|---|---|---|
| `CLARITY_WEIGHT` | `0.3` | Weight of the clarity dimension in the overall score |
| `COMPLETENESS_WEIGHT` | `0.4` | Weight of the completeness dimension in the overall score |
| `EXAMPLE_COVERAGE_WEIGHT` | `0.3` | Weight of the example-coverage dimension in the overall score |
| `QUALITY_BAND_THRESHOLDS` | `object` | Score cutoffs for `'excellent'`, `'good'`, `'needs-review'`, and `'poor'` bands |

---

## Duplicate Detection

See [duplicate-detection.md](duplicate-detection.md) for the detection algorithm.

### `detectDuplicates`

```ts
import { detectDuplicates } from 'hr-skills-build'
```

Detects skills with suspiciously similar descriptions or content using weighted Jaccard similarity on token bigrams.

```ts
async function detectDuplicates(
  skillNames: string[],
  warnings: SkillValidationIssue[],
  threshold?: number,
): Promise<DuplicateWarning[]>
```

#### Parameters

- `skillNames` — directory names of the skills to compare
- `warnings` — accumulator array; read errors during skill loading are appended here rather than thrown
- `threshold` — similarity threshold above which a pair is flagged. Default: `DUPLICATE_THRESHOLD` (`0.55`)

#### Returns

`DuplicateWarning[]` for pairs that exceed the threshold. Each warning has:

- `skillA` — first skill ID (lexicographically smaller)
- `skillB` — second skill ID
- `score` — weighted composite similarity score (0–1)
- `descriptionSimilarity` — Jaccard similarity of description tokens alone
- `contentSimilarity` — Jaccard similarity of content tokens alone

---

### `comparePair`

```ts
import { comparePair } from 'hr-skills-build'
```

Computes the `DuplicateWarning` for a single pair of `SkillContent` objects. Exported for unit testing without filesystem access.

```ts
function comparePair(a: SkillContent, b: SkillContent): DuplicateWarning
```

---

### `tokenise`

```ts
import { tokenise } from 'hr-skills-build'
```

Lowercases, strips punctuation, removes HR stop-words, and returns a token array.

```ts
function tokenise(text: string): string[]
```

---

### `buildBigrams`

```ts
import { buildBigrams } from 'hr-skills-build'
```

Returns all adjacent token pairs from a token array.

```ts
function buildBigrams(tokens: string[]): string[]
```

---

### `jaccardSimilarity`

```ts
import { jaccardSimilarity } from 'hr-skills-build'
```

Computes the Jaccard similarity (intersection / union) of two string arrays treated as sets.

```ts
function jaccardSimilarity(a: string[], b: string[]): number
```

---

### Duplicate detection constants

```ts
import {
  DUPLICATE_THRESHOLD,
  WEIGHT_DESCRIPTION,
  WEIGHT_CONTENT,
  WEIGHT_BIGRAM,
  HR_STOP_WORDS,
} from 'hr-skills-build'
```

| Constant | Value | Description |
|---|---|---|
| `DUPLICATE_THRESHOLD` | `0.55` | Default similarity threshold above which a pair is flagged as a duplicate |
| `WEIGHT_DESCRIPTION` | `0.35` | Weight of description-token similarity in the composite score |
| `WEIGHT_CONTENT` | `0.4` | Weight of full-content-token similarity in the composite score |
| `WEIGHT_BIGRAM` | `0.25` | Weight of bigram similarity in the composite score |
| `HR_STOP_WORDS` | `Set<string>` | Domain-specific stop-words removed before tokenisation |

---

## Evaluation

See [evaluation.md](evaluation.md) for dataset format and golden fixture workflow.

### `runCase`

```ts
import { runCase } from 'hr-skills-build'
```

Runs a single evaluation case through the real Planner and Runtime and captures a `GoldenCaseResult`.

```ts
async function runCase(evaluationCase: EvaluationCase, registry: Registry): Promise<GoldenCaseResult>
```

---

### `runEvaluation`

```ts
import { runEvaluation } from 'hr-skills-build'
```

Runs an entire evaluation dataset and produces a report with per-case results and aggregated quality metrics.

```ts
async function runEvaluation(
  dataset: EvaluationDataset,
  registry: Registry,
  golden: GoldenFixture | undefined,
): Promise<EvaluationReport>
```

#### Parameters

- `dataset` — evaluation dataset to run
- `registry` — registry to plan and execute against
- `golden` — committed golden fixture to compare against; pass `undefined` for a brand-new dataset (no regression detection)

#### Returns

- `generatedAt` — ISO date string
- `datasetName` — name of the dataset
- `totalCases`, `passedCases`, `failedCases`
- `metrics` — `QualityMetrics` with five 0–1 ratios: `capabilityMatchingAccuracy`, `skillSelectionAccuracy`, `executionOrderingAccuracy`, `dependencyCorrectness`, `workflowSuccessRate`
- `results` — `EvaluationCaseResult[]`
- `regressedCaseIds` — case IDs with at least one regression against the golden fixture

---

### `diffAgainstGolden`

```ts
import { diffAgainstGolden } from 'hr-skills-build'
```

Compares an actual case result against its golden fixture entry.

```ts
function diffAgainstGolden(
  actual: GoldenCaseResult,
  golden: GoldenCaseResult | undefined,
): string[]
```

#### Returns

Array of field names that differ between `actual` and `golden`. Empty when both are identical, or when no golden entry exists.

---

### `computeQualityMetrics`

```ts
import { computeQualityMetrics } from 'hr-skills-build'
```

Aggregates per-case results into the five `QualityMetrics` ratios.

```ts
function computeQualityMetrics(results: EvaluationCaseResult[]): QualityMetrics
```

All scores are 0–1. Denominators of 0 produce a score of 1 (vacuously satisfied).

---

### `toGoldenFixture`

```ts
import { toGoldenFixture } from 'hr-skills-build'
```

Converts an `EvaluationReport` into a `GoldenFixture` for committing as the new golden baseline.

```ts
function toGoldenFixture(dataset: EvaluationDataset, report: EvaluationReport): GoldenFixture
```

---

## Evaluation Datasets

### `loadDataset`

```ts
import { loadDataset } from 'hr-skills-build'
```

Loads a single dataset by name from `eval/datasets/<name>.json`.

```ts
async function loadDataset(name: string): Promise<EvaluationDataset>
```

---

### `loadAllDatasets`

```ts
import { loadAllDatasets } from 'hr-skills-build'
```

Discovers and loads every dataset in `eval/datasets/`, sorted by file name.

```ts
async function loadAllDatasets(): Promise<EvaluationDataset[]>
```

---

### `loadGoldenFixture`

```ts
import { loadGoldenFixture } from 'hr-skills-build'
```

Loads the golden fixture for a dataset from `eval/golden/<datasetName>.golden.json`. Returns `undefined` when no fixture has been committed yet.

```ts
async function loadGoldenFixture(datasetName: string): Promise<GoldenFixture | undefined>
```

---

### `saveGoldenFixture`

```ts
import { saveGoldenFixture } from 'hr-skills-build'
```

Writes (or overwrites) the golden fixture for a dataset to `eval/golden/<dataset>.golden.json`.

```ts
async function saveGoldenFixture(fixture: GoldenFixture): Promise<void>
```

---

### `listGoldenFixtureNames`

```ts
import { listGoldenFixtureNames } from 'hr-skills-build'
```

Returns the base names of every committed golden fixture, sorted alphabetically.

```ts
async function listGoldenFixtureNames(): Promise<string[]>
```

---

### `loadAllGoldenFixtures`

```ts
import { loadAllGoldenFixtures } from 'hr-skills-build'
```

Loads every committed golden fixture, sorted by dataset name. Used by the relevance-signal generator.

```ts
async function loadAllGoldenFixtures(): Promise<GoldenFixture[]>
```

---

## Shared Utilities

### `discoverSkills`

```ts
import { discoverSkills } from 'hr-skills-build'
```

Low-level discovery — reads the `skills/` directory and returns all `hr-*` directory names. Prefer `getHrSkills` when you need filtering or sort options.

```ts
async function discoverSkills(): Promise<string[]>
```

---

### `readSkill`

```ts
import { readSkill } from 'hr-skills-build'
```

Reads a skill's `SKILL.md` and parses its YAML frontmatter.

```ts
async function readSkill(skillName: string): Promise<{ content: string; frontmatter: SkillFrontmatter }>
```

---

### `readSkillContent`

```ts
import { readSkillContent } from 'hr-skills-build'
```

Reads a skill's `SKILL.md` content string, appending a `SkillValidationIssue` to `errors` and returning `null` if the file cannot be read.

```ts
async function readSkillContent(
  skillName: string,
  errors: SkillValidationIssue[],
): Promise<string | null>
```

---

### `parseSkillFrontmatter`

```ts
import { parseSkillFrontmatter } from 'hr-skills-build'
```

Parses a markdown document's YAML frontmatter block into a `SkillFrontmatter` object. Never throws — invalid or missing frontmatter resolves to `{}`.

```ts
function parseSkillFrontmatter(content: string): SkillFrontmatter
```

---

### `parseSkillMeta`

```ts
import { parseSkillMeta } from 'hr-skills-build'
```

Reads and parses a skill's SKILL.md into the `SkillMeta` shape used by `buildRegistry`.

```ts
async function parseSkillMeta(skillName: string): Promise<SkillMeta>
```

---

### `computeTier`

```ts
import { computeTier } from 'hr-skills-build'
```

Derives a skill's maturity tier from which optional subdirectories are present and non-empty.

```ts
function computeTier(
  hasContent: boolean,
  hasPrompts: boolean,
  hasExamples: boolean,
): Tier
```

#### Returns

- `'full'` — all three subdirectories present and non-empty
- `'partial'` — 1 or 2 subdirectories present
- `'bare'` — SKILL.md only, no supporting subdirectories

---

### `tierIcon`

```ts
import { tierIcon } from 'hr-skills-build'
```

```ts
function tierIcon(tier: Tier): string
// '🟢' | '🟡' | '🔴'
```

---

### `tierLabel`

```ts
import { tierLabel } from 'hr-skills-build'
```

```ts
function tierLabel(tier: Tier): string
// 'Full' | 'Partial' | 'Bare'
```

---

### `normalizeAuthorName`

```ts
import { normalizeAuthorName } from 'hr-skills-build'
```

Converts an author name string to Title Case. Used internally by `validateAuthor`.

```ts
function normalizeAuthorName(name: string): string
```

---

### `dirExists`

```ts
import { dirExists } from 'hr-skills-build'
```

```ts
async function dirExists(path: string): Promise<boolean>
```

---

### `countFiles`

```ts
import { countFiles } from 'hr-skills-build'
```

Counts files non-recursively in a directory. Returns `0` if the directory does not exist.

```ts
async function countFiles(dirPath: string): Promise<number>
```

---

### `extractMatch`

```ts
import { extractMatch } from 'hr-skills-build'
```

Returns capture group 1 of the first match of `regex` against `content`, or `null` if no match.

```ts
function extractMatch(regex: RegExp, content: string): string | null
```

---

### `makeKeyPromptsContent`

```ts
import { makeKeyPromptsContent } from 'hr-skills-build'
```

Builds a synthetic `## Key prompts` section string with the requested number of H3 subtopics and quoted prompts per subtopic. Used in test helpers and fixtures.

```ts
function makeKeyPromptsContent(subtopics: number, promptsEach: number): string
```

---

### `stubStepExecutor`

```ts
import { stubStepExecutor } from 'hr-skills-build'
```

A `StepExecutorFn` that returns a deterministic stub output without calling any real skill logic. Used by the evaluation framework and tests.

```ts
function stubStepExecutor(step: ExecutionStep, context: RuntimeContext): unknown
```

---

## Constants

```ts
import {
  HR_SKILL_PREFIX,
  REQUIRED_SECTIONS,
  MIN_DESCRIPTION_LENGTH,
  MIN_CONTENT_LENGTH,
  REGISTRY_SCHEMA_VERSION,
  GITHUB_BLOB_BASE_URL,
  KEY_PROMPTS_REGEX,
  QUOTED_PROMPT_REGEX,
  TASKS_REGEX,
  TIPS_REGEX,
  SKILL_LINK_REGEX,
  FRONTMATTER_REGEX,
  TASK_ITEM_REGEX,
  USE_WHEN_REGEX,
  PERIOD_REGEX,
  EVAL_DATASETS_DIR,
  EVAL_GOLDEN_DIR,
  RELEVANCE_SIGNALS_PATH,
} from 'hr-skills-build'
```

| Constant | Value | Description |
|---|---|---|
| `HR_SKILL_PREFIX` | `'hr-'` | Directory-name prefix shared by all skill folders |
| `REQUIRED_SECTIONS` | `string[]` | The three required Markdown section headings every SKILL.md must contain |
| `MIN_DESCRIPTION_LENGTH` | `50` | Minimum frontmatter description length in characters |
| `MIN_CONTENT_LENGTH` | `1000` | Minimum full SKILL.md content length in characters |
| `REGISTRY_SCHEMA_VERSION` | `1` | Current schema version for `registry/skills.json` |
| `GITHUB_BLOB_BASE_URL` | `string` | Base URL for GitHub blob links; append a repo-root-relative path |
| `KEY_PROMPTS_REGEX` | `RegExp` | Extracts the `## Key prompts` section body |
| `QUOTED_PROMPT_REGEX` | `RegExp` | Matches quoted prompt lines inside a Key prompts block |
| `TASKS_REGEX` | `RegExp` | Extracts the `## Supported tasks` section body |
| `TIPS_REGEX` | `RegExp` | Extracts the `## Tips` section body |
| `SKILL_LINK_REGEX` | `RegExp` | Extracts skill IDs from `[hr-x](skills/hr-x)` router links |
| `FRONTMATTER_REGEX` | `RegExp` | Matches and captures the YAML frontmatter block |
| `TASK_ITEM_REGEX` | `RegExp` | Matches a single bullet item in the Supported tasks section |
| `USE_WHEN_REGEX` | `RegExp` | Case-insensitive match for `Use when` trigger clauses |
| `PERIOD_REGEX` | `RegExp` | Matches a trailing period |
| `EVAL_DATASETS_DIR` | `string` | Absolute path to `eval/datasets/` |
| `EVAL_GOLDEN_DIR` | `string` | Absolute path to `eval/golden/` |
| `RELEVANCE_SIGNALS_PATH` | `string` | Absolute path to `registry/relevance-signals.json` |
