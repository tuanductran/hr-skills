# API Reference

> This file is generated from TSDoc-compatible comments. Do not edit it by hand; update exported declarations and run `bun run api-docs`.

## hr-skills — cli

Publishable HR Skills CLI and `hr-skills` executable.

This surface exposes a command dispatcher rather than importable declarations.

---

## hr-skills-build — server

Server-side build, registry, planner, runtime, and validation APIs.

### `humanizeIdentifier`

```ts
import { humanizeIdentifier } from 'hr-skills-build/server'
```

Converts a repository identifier into an accessible display label.

```ts
function humanizeIdentifier(identifier: string): string
```

#### Parameters

- `identifier`

---

### `buildDocumentationData`

```ts
import { buildDocumentationData } from 'hr-skills-build/server'
```

Builds a stable artifact consumed by the public documentation application.

```ts
function buildDocumentationData(): Promise<DocumentationData>
```

---

### `DocumentationSection`

```ts
import { DocumentationSection } from 'hr-skills-build/server'
```

A Markdown file associated with a skill, preserved in stable filename order.

```ts
interface DocumentationSection {
    readonly fileName: string;
    readonly markdown: string;
}
```

---

### `DocumentationSkill`

```ts
import { DocumentationSkill } from 'hr-skills-build/server'
```

A registry entry enriched with the source Markdown needed for the public site.

```ts
interface DocumentationSkill extends RegistryEntry {
    readonly displayName: string;
    readonly content: string;
    readonly prompts: readonly DocumentationSection[];
    readonly examples: readonly DocumentationSection[];
}
```

---

### `DocumentationDomain`

```ts
import { DocumentationDomain } from 'hr-skills-build/server'
```

A stable catalog grouping derived from the canonical registry domain.

```ts
interface DocumentationDomain {
    readonly id: SkillCategory;
    readonly label: string;
    readonly skillCount: number;
}
```

---

### `DocumentationData`

```ts
import { DocumentationData } from 'hr-skills-build/server'
```

The generated, app-consumable public documentation artifact.

```ts
interface DocumentationData {
    readonly schemaVersion: 1;
    readonly generatedAt: string;
    readonly skillCount: number;
    readonly domains: readonly DocumentationDomain[];
    readonly skills: readonly DocumentationSkill[];
}
```

---

### `runCase`

```ts
import { runCase } from 'hr-skills-build/server'
```

Run a single evaluation case against the given registry, deterministically.

```ts
function runCase(evalCase: EvaluationCase, registry: Registry): Promise<GoldenCaseResult>
```

#### Parameters

- `evalCase`
- `registry`

#### Returns

The same shape stored in a golden fixture, for direct comparison.

---

### `diffAgainstGolden`

```ts
import { diffAgainstGolden } from 'hr-skills-build/server'
```

Compare an actual case result against its golden fixture entry.

```ts
function diffAgainstGolden(actual: GoldenCaseResult, golden: GoldenCaseResult | undefined): string[]
```

#### Parameters

- `actual`
- `golden`

#### Returns

Field names that differ (empty when they match, or when there is no golden entry to compare against yet).

---

### `computeQualityMetrics`

```ts
import { computeQualityMetrics } from 'hr-skills-build/server'
```

Compute deterministic 0.0-1.0 quality metrics across a set of case
results. A case "passes" quality checks when it has zero regressions
against the golden fixture (or has no golden fixture yet).

```ts
function computeQualityMetrics(results: EvaluationCaseResult[]): QualityMetrics
```

#### Parameters

- `results`

#### Returns

Aggregated 0.0-1.0 accuracy/success-rate metrics.

---

### `runEvaluation`

```ts
import { runEvaluation } from 'hr-skills-build/server'
```

Run a full evaluation of one dataset and produce the aggregated report.

```ts
function runEvaluation(dataset: EvaluationDataset, registry: Registry, golden: GoldenFixture | undefined): Promise<EvaluationReport>
```

#### Parameters

- `dataset`
- `registry`
- `golden`

#### Returns

The full evaluation report, including per-case results and aggregated metrics.

---

### `toGoldenFixture`

```ts
import { toGoldenFixture } from 'hr-skills-build/server'
```

Build a golden fixture from a fresh run — used by `--update-golden`.

```ts
function toGoldenFixture(dataset: EvaluationDataset, report: EvaluationReport): GoldenFixture
```

#### Parameters

- `dataset`
- `report`

#### Returns

A fixture ready to be written with `saveGoldenFixture`.

---

### `loadDataset`

```ts
import { loadDataset } from 'hr-skills-build/server'
```

Load a single dataset by name (the JSON file's base name, without extension).

```ts
function loadDataset(name: string): Promise<EvaluationDataset>
```

#### Parameters

- `name`

#### Returns

The parsed dataset.

---

### `loadAllDatasets`

```ts
import { loadAllDatasets } from 'hr-skills-build/server'
```

Discover and load every dataset in `eval/datasets/`, sorted by file name.

```ts
function loadAllDatasets(): Promise<EvaluationDataset[]>
```

#### Returns

All datasets, sorted by file name.

---

### `loadGoldenFixture`

```ts
import { loadGoldenFixture } from 'hr-skills-build/server'
```

Load the golden fixture for a dataset, if one has been committed yet.
Returns `undefined` for a brand-new dataset that has no baseline —
callers should treat this as "no regressions possible yet" rather than
an error.

```ts
function loadGoldenFixture(datasetName: string): Promise<GoldenFixture | undefined>
```

#### Parameters

- `datasetName`

#### Returns

The parsed fixture, or `undefined` if none is committed yet.

---

### `saveGoldenFixture`

```ts
import { saveGoldenFixture } from 'hr-skills-build/server'
```

Write (or overwrite) the golden fixture for a dataset.

```ts
function saveGoldenFixture(fixture: GoldenFixture): Promise<void>
```

#### Parameters

- `fixture`

---

### `listGoldenFixtureNames`

```ts
import { listGoldenFixtureNames } from 'hr-skills-build/server'
```

Discover the names of every committed golden fixture, sorted.

```ts
function listGoldenFixtureNames(): Promise<string[]>
```

#### Returns

Dataset names (without the `.golden.json` suffix), sorted.

---

### `loadAllGoldenFixtures`

```ts
import { loadAllGoldenFixtures } from 'hr-skills-build/server'
```

Load and return every committed golden fixture, sorted by dataset name.

Used by the relevance-signal generator to collect all available evidence
without requiring the caller to enumerate dataset names manually.

```ts
function loadAllGoldenFixtures(): Promise<GoldenFixture[]>
```

#### Returns

All committed golden fixtures, sorted by dataset name.

---

### `analyzeIntent`

```ts
import { analyzeIntent } from 'hr-skills-build/server'
```

Extract capabilities and key phrases from user intent.

Uses simple heuristics to identify what the user is asking for:
- Split by commas and "and"
- Recognize patterns like "create", "write", "develop", "design", etc.
- Normalize to lowercase

This is intentionally simple and deterministic — not powered by ML.
Future extensions could replace this with semantic analysis if needed.

```ts
function analyzeIntent(intent: string): string[]
```

#### Parameters

- `intent`

#### Returns

Extracted capability phrases, normalized to lowercase.

---

### `generateExecutionPlan`

```ts
import { generateExecutionPlan } from 'hr-skills-build/server'
```

Generate a complete execution plan for user intent using the Skill Registry.

Pure function — no side effects, deterministic output for a given input
and registry state.

```ts
function generateExecutionPlan(intent: string, registry: Registry): ExecutionPlan
```

#### Parameters

- `intent`
- `registry`

#### Returns

The generated plan, including matched capabilities and ordered steps.

---

### `SkillClassification`

```ts
import { SkillClassification } from 'hr-skills-build/server'
```

Result of running a skill's name/description through classifySkill.

```ts
interface SkillClassification {
    category: SkillCategory;
    tags: string[];
}
```

---

### `classifySkill`

```ts
import { classifySkill } from 'hr-skills-build/server'
```

Classify a skill by name into a category and tag set.

Resolution order:
 1. EXPLICIT override map (exact match)
 2. KEYWORD_RULES (substring scan, first match wins)
 3. 'uncategorized' fallback

```ts
function classifySkill(skillName: string): SkillClassification
```

#### Parameters

- `skillName`

#### Returns

The resolved category and any associated tags.

---

### `CategoryMeta`

```ts
import { CategoryMeta } from 'hr-skills-build/server'
```

Display metadata for one SkillCategory, used when rendering the root `SKILL.md` routing table.

```ts
interface CategoryMeta {
    heading: string;
    description?: string;
    /** If true, adds a preamble note below the table */
    preamble?: string;
}
```

---

### `CATEGORY_META`

```ts
import { CATEGORY_META } from 'hr-skills-build/server'
```

```ts
const CATEGORY_META: Readonly<Record<"talent-acquisition" | "onboarding-offboarding" | "performance-talent" | "compensation-rewards" | "learning-development" | "org-design-change" | "workforce-analytics" | ... 4 more ... | "technical-hiring", CategoryMeta>>
```

---

### `getHrSkills`

```ts
import { getHrSkills } from 'hr-skills-build/server'
```

Discover all HR skill directory names in `skills/` that satisfy the given options.

A directory is included only if:
 1. It starts with the configured `prefix` (default: `"hr-"`).
 2. It contains a `SKILL.md` file at its root (checked via `fs.access`).

Currently used only by `build/sync.ts`, which needs that `SKILL.md`
guarantee before generating marketplace.json entries. Most other callers
use the lighter `shared/helpers.ts#discoverSkills()` instead (no
existence check, no options) since they read `SKILL.md` themselves right
after and handle a missing file there.

```ts
function getHrSkills(options?: SkillDirectoryOptions): Promise<string[]>
```

#### Parameters

- `options` (optional)

#### Returns

A promise that resolves to an array of skill directory names (not full paths).

---

### `loadRelevanceSignalTable`

```ts
import { loadRelevanceSignalTable } from 'hr-skills-build/server'
```

Load the committed usage-informed relevance signal table
(`registry/relevance-signals.json`), if present and valid — Phase 6.1-B.

Returns `undefined` — rather than throwing — when the file is missing,
unparsable, or has an unrecognized `schemaVersion`, so callers can always
fall back to the static, signal-free ranking. This is what keeps
`buildRegistry()`'s `signalTable` parameter genuinely optional: nothing
downstream needs to know whether the artifact exists yet, and a
corrupted or stale-schema file degrades gracefully instead of breaking
registry generation.

```ts
function loadRelevanceSignalTable(path?: string): Promise<RelevanceSignalTable | undefined>
```

#### Parameters

- `path` (optional)

#### Returns

The parsed signal table, or `undefined` if the file doesn't exist yet.

---

### `buildRegistry`

```ts
import { buildRegistry } from 'hr-skills-build/server'
```

Build the full Skill Registry from the current state of skills/ on disk.

```ts
function buildRegistry(signalTable?: RelevanceSignalTable | undefined): Promise<Registry>
```

#### Parameters

- `signalTable` (optional)

#### Returns

The full registry, including every skill's classification, capabilities, and related skills.

---

### `createRuntimeContext`

```ts
import { createRuntimeContext } from 'hr-skills-build/server'
```

Create a fresh, empty runtime context for the given plan intent.

```ts
function createRuntimeContext(intent: string): RuntimeContext
```

#### Parameters

- `intent`

#### Returns

A new `RuntimeContext` instance with no recorded outputs.

---

### `RuntimeErrorCode`

```ts
import { RuntimeErrorCode } from 'hr-skills-build/server'
```

Machine-readable codes for runtime failures.

- `STEP_EXECUTION_FAILED` — the step executor threw after exhausting retries.
- `STEP_DEPENDENCY_FAILED` — a required upstream step failed.
- `STEP_DEPENDENCY_SKIPPED` — a required upstream step was skipped.

```ts
type RuntimeErrorCode = | 'STEP_EXECUTION_FAILED'
    | 'STEP_DEPENDENCY_FAILED'
    | 'STEP_DEPENDENCY_SKIPPED'
```

---

### `RuntimeError`

```ts
import { RuntimeError } from 'hr-skills-build/server'
```

Structured error produced by the Workflow Runtime when a step fails.

Extends the native `Error` class with `code`, `skillId`, and `attempt`
fields so that error handlers can branch on failure type without string
parsing, and so that traces capture enough context to reconstruct what
went wrong without needing to re-run the workflow.

```ts
const RuntimeError: RuntimeError
```

---

### `describeCause`

```ts
import { describeCause } from 'hr-skills-build/server'
```

Normalize an unknown thrown value (from a step executor) into a
human-readable string, without assuming it is an `Error` instance.

Resolution order:
 1. `Error` instance → `error.message`
 2. String primitive → returned as-is
 3. Any serializable value → `JSON.stringify`
 4. Anything else → `String(cause)`

```ts
function describeCause(cause: unknown): string
```

#### Parameters

- `cause`

#### Returns

A human-readable string describing the cause.

---

### `EventDispatcher`

```ts
import { EventDispatcher } from 'hr-skills-build/server'
```

Records runtime events in emission order and assigns each a logical-clock `order`.

```ts
const EventDispatcher: EventDispatcher
```

---

### `noRetryPolicy`

```ts
import { noRetryPolicy } from 'hr-skills-build/server'
```

Create a retry policy that never retries — the step fails immediately
on the first error.

This is the default policy used by `WorkflowExecutor` when no
`retryPolicy` option is provided.

```ts
function noRetryPolicy(): RetryPolicy
```

#### Returns

A RetryPolicy with `maxRetries: 0`.

---

### `fixedRetryPolicy`

```ts
import { fixedRetryPolicy } from 'hr-skills-build/server'
```

Create a retry policy that retries a fixed number of times with a
constant logical delay between each attempt.

```ts
function fixedRetryPolicy(options: { maxRetries: number; delayMs?: number; }): RetryPolicy
```

#### Parameters

- `options`

#### Returns

A RetryPolicy with a fixed delay for all attempts.

---

### `exponentialRetryPolicy`

```ts
import { exponentialRetryPolicy } from 'hr-skills-build/server'
```

Create a retry policy that uses exponential backoff:
`delay = baseDelayMs \* 2^(attempt - 1)`, capped at `maxDelayMs`.

Example with `baseDelayMs: 100`: attempt 1 → 100 ms, attempt 2 → 200 ms,
attempt 3 → 400 ms, and so on.

```ts
function exponentialRetryPolicy(options: { maxRetries: number; baseDelayMs?: number; maxDelayMs?: number; }): RetryPolicy
```

#### Parameters

- `options`

#### Returns

A RetryPolicy with exponential backoff delays.

---

### `RuntimeStateTracker`

```ts
import { RuntimeStateTracker } from 'hr-skills-build/server'
```

Tracks which lifecycle bucket (`pending`/`running`/`completed`/`failed`/`skipped`) each skill ID is currently in.

```ts
const RuntimeStateTracker: RuntimeStateTracker
```

---

### `TraceCollector`

```ts
import { TraceCollector } from 'hr-skills-build/server'
```

Builds a replayable `TraceEntry[]` — one entry per runtime event, each with a state snapshot.

```ts
const TraceCollector: TraceCollector
```

---

### `WorkflowExecutor`

```ts
import { WorkflowExecutor } from 'hr-skills-build/server'
```

Executes a single validated `ExecutionPlan` from start to finish.

One `WorkflowExecutor` instance corresponds to one workflow run — it holds
no state that outlives a single `run()` call, so a fresh instance (or the
`executeWorkflow` convenience function) should be used for every plan.

```ts
const WorkflowExecutor: WorkflowExecutor
```

---

### `executeWorkflow`

```ts
import { executeWorkflow } from 'hr-skills-build/server'
```

Runs an ExecutionPlan step by step, in dependency order, calling
`executeStep` for each one. On a step failure, downstream steps that
depend on it (directly or transitively) are marked `skipped` rather than run.

```ts
function executeWorkflow(plan: ExecutionPlan, executeStep: StepExecutorFn, options?: RuntimeOptions | undefined): Promise<WorkflowResult>
```

#### Parameters

- `plan`
- `executeStep`
- `options` (optional)

#### Returns

The overall workflow status plus a per-step result list.

---

### `UnknownSkillError`

```ts
import { UnknownSkillError } from 'hr-skills-build/server'
```

Thrown when a recommendation is requested for a skill ID that does not
exist in the given registry.

```ts
const UnknownSkillError: UnknownSkillError
```

---

### `getRecommendations`

```ts
import { getRecommendations } from 'hr-skills-build/server'
```

Get the top related skills for a given skill ID.

Ranking rule: preserves the order already computed for
`RegistryEntry.relatedSkills` — same-domain skills ranked by shared-tag
overlap via `rankRelatedSkills()`, then (when a relevance signal table was
available at registry-build time, which is the default `bun run registry`
path) re-ranked by `reRankRelatedSkills()` to blend in observed
co-selection evidence — see registry.ts. This function does not alter
that order itself; it only looks up, caps, and formats it.

Deterministic: for a fixed registry and skill ID, the same input always
produces the same output, in the same order.

Dangling references (a related ID no longer present in the registry) are
silently skipped rather than throwing, so a stale entry never breaks the
whole result — `bun run validate` is the place that catches dangling
`relatedSkills` references as a registry-consistency error.

```ts
function getRecommendations(skillId: string, registry: Registry, limit?: number): RecommendationResult
```

#### Parameters

- `skillId`
- `registry`
- `limit` (optional)

#### Returns

Ranked related skills for `skillId`.

#### Throws

{UnknownSkillError} If `skillId` is not present in `registry`.

---

### `RelevanceSignal`

```ts
import { RelevanceSignal } from 'hr-skills-build/server'
```

A normalised relevance weight for a single (source → target) skill pair,
derived from co-selection evidence across one or more evaluation datasets.

All three numeric fields are 0.0–1.0 ratios computed from integer counts —
they are deterministic given the same input fixtures.

```ts
interface RelevanceSignal {
    /** The skill whose `relatedSkills` list this signal influences. */
    sourceSkill: string;
    /** The skill that co-appears with `sourceSkill`. */
    targetSkill: string;
    /**
     * Fraction of all plans that contained `sourceSkill` in which `targetSkill`
     * also appeared.  0.0 = never co-selected; 1.0 = always co-selected.
     */
    coSelectionRate: number;
    /** Raw count of plans containing both skills. */
    coSelectionCount: number;
    /** Total plans containing `sourceSkill` (the denominator for coSelectionRate). */
    observedCount: number;
}
```

---

### `RelevanceSignalTable`

```ts
import { RelevanceSignalTable } from 'hr-skills-build/server'
```

The committed, versioned artifact written to `registry/relevance-signals.json`.

Consumed by `buildRegistry()` to optionally augment the static
tag-overlap `relatedSkills` ranking with observed co-selection evidence.

```ts
interface RelevanceSignalTable {
    /**
     * Schema version — increment for breaking shape changes (field rename,
     * type change).  Additive optional fields do not require a bump.
     */
    schemaVersion: number;
    /**
     * ISO date (YYYY-MM-DD) the table was generated on.  Informational only —
     * it does not affect determinism of the weight lookup.
     */
    generatedAt: string;
    /**
     * Names of the golden fixture datasets that contributed observations.
     * Stored for auditability; does not affect signal values.
     */
    sourceDatasets: string[];
    /** Total number of planning-scenario outcomes observed across all datasets. */
    totalObservations: number;
    /** All (source, target) relevance signals, sorted by sourceSkill then targetSkill. */
    signals: RelevanceSignal[];
}
```

---

### `extractCoSelectionCounts`

```ts
import { extractCoSelectionCounts } from 'hr-skills-build/server'
```

Extract all co-selection observations from a set of golden fixtures.

Each fixture result whose `skillIds` list contains at least two skills
contributes one observation (all unordered pairs from the list).

Returns the raw pair counts: `Map<sourceSkill, Map<targetSkill, count>>`.
Pairs are stored bidirectionally (A→B and B→A) so that signal lookup
works for either member of the pair.

Determinism: golden fixtures are processed in the order they are supplied;
callers are expected to sort fixture arrays before passing them in.

```ts
function extractCoSelectionCounts(fixtures: readonly GoldenFixture[]): Map<string, Map<string, number>>
```

#### Parameters

- `fixtures`

#### Returns

Bidirectional pair counts: `Map<sourceSkill, Map<targetSkill, count>>`.

---

### `extractSkillObservationCounts`

```ts
import { extractSkillObservationCounts } from 'hr-skills-build/server'
```

Count the number of times each skill appears across all fixture results.

Determinism: fixture order must be stable (same as `extractCoSelectionCounts`).

```ts
function extractSkillObservationCounts(fixtures: readonly GoldenFixture[]): Map<string, number>
```

#### Parameters

- `fixtures`

#### Returns

Number of times each skill ID appeared, keyed by skill ID.

---

### `computeSignals`

```ts
import { computeSignals } from 'hr-skills-build/server'
```

Build the full list of `RelevanceSignal` entries from raw co-selection and
per-skill observation counts.

Each (source, target) pair where co-selection count > 0 becomes one signal.
`coSelectionRate` = coCount / observedCount for the source skill.

Output is sorted by `sourceSkill` (ascending), then `targetSkill`
(ascending) for a stable, human-readable artifact.

```ts
function computeSignals(coSelectionCounts: ReadonlyMap<string, ReadonlyMap<string, number>>, observationCounts: ReadonlyMap<string, number>): RelevanceSignal[]
```

#### Parameters

- `coSelectionCounts`
- `observationCounts`

#### Returns

Sorted relevance signals, one per (source, target) pair with co-selection evidence.

---

### `buildRelevanceSignalTable`

```ts
import { buildRelevanceSignalTable } from 'hr-skills-build/server'
```

Build a `RelevanceSignalTable` from one or more committed golden fixtures.

This is the top-level pure function called by the CLI generator.  It
performs no filesystem I/O — callers load fixtures and pass them in.

```ts
function buildRelevanceSignalTable(fixtures: readonly GoldenFixture[], generatedAt: string): RelevanceSignalTable
```

#### Parameters

- `fixtures`
- `generatedAt`

#### Returns

The full relevance signal table, ready to write to `registry/relevance-signals.json`.

---

### `indexSignalsBySource`

```ts
import { indexSignalsBySource } from 'hr-skills-build/server'
```

Build a lookup index: `sourceSkill → (targetSkill → coSelectionRate)`.

Used by `registry.ts` to merge observed weights into `relatedSkills`
without re-parsing the full signal list on every skill.

```ts
function indexSignalsBySource(table: RelevanceSignalTable): Map<string, Map<string, number>>
```

#### Parameters

- `table`

#### Returns

Lookup index: `sourceSkill -> (targetSkill -> coSelectionRate)`.

---

### `reRankRelatedSkills`

```ts
import { reRankRelatedSkills } from 'hr-skills-build/server'
```

Re-rank a skill's `relatedSkills` list by blending the static tag-overlap
score with an observed co-selection rate from the signal index.

Blend formula (deterministic, no floating-point non-determinism):
  blendedScore = staticScore \* (1 - OBSERVED_WEIGHT) + observedRate \* OBSERVED_WEIGHT

where `staticScore` is 1.0 for the first item in the static list, decaying
by 1/N for each subsequent position (a simple rank-to-score mapping that
preserves the original ranking's relative order in the absence of observed
evidence).

Ties are broken alphabetically (consistent with the static ranker in
`registry.ts`).

```ts
function reRankRelatedSkills(skillId: string, staticRelated: readonly string[], signalIndex: ReadonlyMap<string, ReadonlyMap<string, number>>, limit?: number): string[]
```

#### Parameters

- `skillId`
- `staticRelated`
- `signalIndex`
- `limit` (optional)

#### Returns

Re-ranked related skill IDs, blending static tag-overlap with observed co-selection.

---

### `RELEVANCE_SIGNAL_SCHEMA_VERSION`

```ts
import { RELEVANCE_SIGNAL_SCHEMA_VERSION } from 'hr-skills-build/server'
```

Schema version for `registry/relevance-signals.json`.
Increment for breaking shape changes only.

```ts
const RELEVANCE_SIGNAL_SCHEMA_VERSION: 1
```

---

### `OBSERVED_WEIGHT`

```ts
import { OBSERVED_WEIGHT } from 'hr-skills-build/server'
```

The fraction of the blended `relatedSkills` score that comes from observed
co-selection evidence.  The remaining `1 - OBSERVED_WEIGHT` fraction comes
from the static tag-overlap ranking.

Set conservatively so that sparse evidence (few evaluation cases) does not
dominate the recommendation graph.  Increase once the evaluation dataset
grows and observed counts become statistically meaningful.

```ts
const OBSERVED_WEIGHT: 0.3
```

---

### `FIELD_WEIGHTS`

```ts
import { FIELD_WEIGHTS } from 'hr-skills-build/server'
```

Base relevance weight per field, applied before match-strength scaling.

```ts
const FIELD_WEIGHTS: Record<SearchableField, number>
```

---

### `ALL_SEARCHABLE_FIELDS`

```ts
import { ALL_SEARCHABLE_FIELDS } from 'hr-skills-build/server'
```

All searchable fields, in the fixed order used when `fields` is omitted.

```ts
const ALL_SEARCHABLE_FIELDS: SearchableField[]
```

---

### `InvalidSearchQueryError`

```ts
import { InvalidSearchQueryError } from 'hr-skills-build/server'
```

Thrown for a structurally invalid query — e.g. empty search text with no
domain filter to fall back on, or a non-positive `limit`. This is a
client-input error, not a "no results" case (which returns an empty
`results` array instead).

```ts
const InvalidSearchQueryError: InvalidSearchQueryError
```

---

### `searchSkills`

```ts
import { searchSkills } from 'hr-skills-build/server'
```

Search the generated Skill Registry by structured metadata.

Ranking rule (see docs/engineering/search.md for the full explanation):
 1. Each field match contributes `weight \* similarity` to the skill's
    score (`similarity` is always 1 for exact matches).
 2. A skill matching on more than one distinct field gets a small flat
    bonus per extra field (capped), since agreement across fields is a
    stronger discoverability signal than one big match.
 3. A skill with at least one \*exact\* match gets a flat confidence bonus,
    so exact matches reliably outrank fuzzy-only matches.
 4. Ties are broken by number of distinct fields matched (more wins),
    then by skill ID ascending — so identical registry content always
    produces identical ordering, run after run.

```ts
function searchSkills(query: SkillSearchQuery, registry: Registry): SkillSearchResponse
```

#### Parameters

- `query`
- `registry`

#### Returns

Ranked, deduplicated skill matches with per-field score detail.

#### Throws

{InvalidSearchQueryError} If the query has no text and no domain
filter, or if `limit` is not a positive integer.

---

### `GITHUB_BLOB_BASE_URL`

```ts
import { GITHUB_BLOB_BASE_URL } from 'hr-skills-build/server'
```

Base URL for linking to a file in this repo on GitHub, e.g. for use in
generated Markdown that's posted somewhere with no "current file" context
(a PR comment, a Slack message) where a relative link like `../docs/x.md`
cannot resolve. Append a repo-root-relative path, e.g.
`` `${GITHUB_BLOB_BASE_URL}/docs/engineering/quality-scoring.md` ``.

```ts
const GITHUB_BLOB_BASE_URL: "https://github.com/tuanductran/hr-skills/blob/main"
```

---

### `TASK_ITEM_REGEX`

```ts
import { TASK_ITEM_REGEX } from 'hr-skills-build/server'
```

Matches a markdown task-list item line, e.g. `- some task`.

```ts
const TASK_ITEM_REGEX: RegExp
```

---

### `HR_SKILL_PREFIX`

```ts
import { HR_SKILL_PREFIX } from 'hr-skills-build/server'
```

The directory-name prefix shared by all HR skill folders, e.g. `hr-`.

```ts
const HR_SKILL_PREFIX: "hr-"
```

---

### `KEY_PROMPTS_REGEX`

```ts
import { KEY_PROMPTS_REGEX } from 'hr-skills-build/server'
```

Captures the body of a `## Key prompts` section (including sub-headings)
up to the next `##` section, a `---` divider, or end of file.
Capture group 1 contains the raw block text.

```ts
const KEY_PROMPTS_REGEX: RegExp
```

---

### `QUOTED_PROMPT_REGEX`

```ts
import { QUOTED_PROMPT_REGEX } from 'hr-skills-build/server'
```

Matches a numbered or bulleted quoted prompt line inside a Key prompts block,
e.g. `1. "Create a job description for..."` or `- "Draft an offer letter..."`.
Capture group 1 contains the quoted prompt text (without surrounding quotes).

```ts
const QUOTED_PROMPT_REGEX: RegExp
```

---

### `USE_WHEN_REGEX`

```ts
import { USE_WHEN_REGEX } from 'hr-skills-build/server'
```

Case-insensitive match for the phrase `Use when` inside a skill description,
used to split a description into its "coverage" and "trigger" clauses.

```ts
const USE_WHEN_REGEX: RegExp
```

---

### `PERIOD_REGEX`

```ts
import { PERIOD_REGEX } from 'hr-skills-build/server'
```

Matches a trailing period at the end of a string — used to strip it before appending a new one.

```ts
const PERIOD_REGEX: RegExp
```

---

### `FRONTMATTER_REGEX`

```ts
import { FRONTMATTER_REGEX } from 'hr-skills-build/server'
```

Captures YAML frontmatter delimited by `---` at the start of a markdown file.
Capture group 1 contains the raw YAML text between the delimiters.

```ts
const FRONTMATTER_REGEX: RegExp
```

---

### `TASKS_REGEX`

```ts
import { TASKS_REGEX } from 'hr-skills-build/server'
```

Captures the body of a `## Supported tasks` section up to the next `##` heading
or end of file. Capture group 1 contains the raw block text.

```ts
const TASKS_REGEX: RegExp
```

---

### `REQUIRED_SECTIONS`

```ts
import { REQUIRED_SECTIONS } from 'hr-skills-build/server'
```

The three markdown section headings that every skill SKILL.md must contain.
Validated by `validateRequiredSections` in validate.ts.

```ts
const REQUIRED_SECTIONS: string[]
```

---

### `MIN_DESCRIPTION_LENGTH`

```ts
import { MIN_DESCRIPTION_LENGTH } from 'hr-skills-build/server'
```

Minimum character length for a skill's frontmatter `description` field.

```ts
const MIN_DESCRIPTION_LENGTH: 50
```

---

### `MIN_CONTENT_LENGTH`

```ts
import { MIN_CONTENT_LENGTH } from 'hr-skills-build/server'
```

Minimum character length for the full SKILL.md content body.

```ts
const MIN_CONTENT_LENGTH: 1000
```

---

### `TIPS_REGEX`

```ts
import { TIPS_REGEX } from 'hr-skills-build/server'
```

Captures the body of a `## Tips` section up to the next `##` heading or end of file.
Capture group 1 contains the raw block text.

```ts
const TIPS_REGEX: RegExp
```

---

### `SKILL_LINK_REGEX`

```ts
import { SKILL_LINK_REGEX } from 'hr-skills-build/server'
```

Matches markdown links that reference another skill, e.g.
`[hr-recruiting](skills/hr-recruiting)`.
Capture group 1 contains the skill ID (`hr-<slug>`).

Shared by router consistency validation and registry dependency extraction
(`CATEGORY_META.preamble` in classifier.ts) so both stay in sync.

```ts
const SKILL_LINK_REGEX: RegExp
```

---

### `REGISTRY_SCHEMA_VERSION`

```ts
import { REGISTRY_SCHEMA_VERSION } from 'hr-skills-build/server'
```

Schema version for `registry/skills.json`.
Increment this when the shape of RegistryEntry  changes in a breaking way.

```ts
const REGISTRY_SCHEMA_VERSION: 1
```

---

### `discoverSkills`

```ts
import { discoverSkills } from 'hr-skills-build/server'
```

Discover all `hr-\*` skill directory names under `skills/`, sorted.

Does not verify `SKILL.md` exists in each directory — callers that need
that guarantee (e.g. filtering out incomplete/in-progress skill folders)
should use `registry/discovery.ts#getHrSkills()` instead, which checks
for `SKILL.md` via `fs.access` and supports a configurable prefix. This
function is the lighter-weight default used by most of `validation/`,
`build/`, and `search/`, which read (and error-handle) `SKILL.md`
themselves immediately after.

```ts
function discoverSkills(): Promise<string[]>
```

---

### `readSkill`

```ts
import { readSkill } from 'hr-skills-build/server'
```

Read a skill's `SKILL.md` content and parse its YAML frontmatter.

```ts
function readSkill(skillName: string): Promise<{ content: string; frontmatter: { name?: string | undefined; description?: string | undefined; metadata?: { author?: string | undefined; version?: string | undefined; } | undefined; }; }>
```

#### Parameters

- `skillName`

#### Returns

A promise that resolves to an object containing the raw `content`
string and the parsed `frontmatter` record.

#### Throws

If `SKILL.md` cannot be read from the filesystem.

---

### `parseSkillMeta`

```ts
import { parseSkillMeta } from 'hr-skills-build/server'
```

Read a skill's `SKILL.md` and derive display metadata from it: the
description split at "Use when" into `coverage`/`scopeSentence`, the
`## Supported tasks` list, and up to 5 quoted example prompts from
`## Key prompts` as `triggerPhrases`.

Lives here (not in `parser.ts`) because it calls `readSkill`, which reads
from the filesystem — `parser.ts` is part of the browser-safe `client`
surface and must stay pure. If a caller already has `SKILL.md` content in
hand (e.g. fetched over HTTP in a browser context), parse it directly with
the pure helpers in `parser.ts`/`constants.ts` instead of this function.

```ts
function parseSkillMeta(skillName: string): Promise<SkillMeta>
```

#### Parameters

- `skillName`

#### Returns

Display metadata derived from the skill's frontmatter and body.

#### Throws

If `SKILL.md` cannot be read from the filesystem (see `readSkill`).

---

### `readSkillContent`

```ts
import { readSkillContent } from 'hr-skills-build/server'
```

Read a skill's `SKILL.md` content, collecting a validation issue instead of
throwing if the file is not found.

```ts
function readSkillContent(skillName: string, errors: SkillValidationIssue[]): Promise<string | null>
```

#### Parameters

- `skillName`
- `errors`

#### Returns

A promise that resolves to the raw file content, or `null` if the
file was not found (in which case an issue has been added to `errors`).

---

### `normalizeAuthorName`

```ts
import { normalizeAuthorName } from 'hr-skills-build/server'
```

Normalize an author name to Title Case.

Each whitespace-separated word is capitalized; all other characters are
lower-cased. Leading and trailing whitespace is stripped.

```ts
function normalizeAuthorName(name: string): string
```

#### Parameters

- `name`

#### Returns

The normalized Title Case author name.

---

### `first`

```ts
import { first } from 'hr-skills-build/server'
```

Return the first element of a non-empty readonly array.

```ts
function first(items: readonly T[]): T
```

#### Parameters

- `items`

#### Returns

The first element of `items`.

#### Throws

{Error} If `items` is empty.

---

### `dirExists`

```ts
import { dirExists } from 'hr-skills-build/server'
```

Check whether a filesystem path exists and is a directory.

```ts
function dirExists(path: string): Promise<boolean>
```

#### Parameters

- `path`

#### Returns

A promise that resolves to `true` if `path` is an existing directory,
or `false` if it does not exist or is not a directory.

---

### `countFiles`

```ts
import { countFiles } from 'hr-skills-build/server'
```

Count the number of `.md` files directly inside a directory.
Returns `0` if the directory does not exist or cannot be read.

```ts
function countFiles(dirPath: string): Promise<number>
```

#### Parameters

- `dirPath`

#### Returns

A promise that resolves to the count of `.md` files found.

---

### `computeTier`

```ts
import { computeTier } from 'hr-skills-build/server'
```

Compute a skill's maturity tier based on which optional subdirectories it contains.

Tier rules:
- `'full'`    — all three subdirectories (`content/`, `prompts/`, `examples/`) are present.
- `'bare'`    — none of the subdirectories are present.
- `'partial'` — one or two subdirectories are present.

This is the single source of truth for tier classification — used by both
`build/generate-skill-matrix.ts` and `registry/registry.ts` so the matrix
and the registry can never disagree about a skill's tier.

```ts
function computeTier(hasContent: boolean, hasPrompts: boolean, hasExamples: boolean): Tier
```

#### Parameters

- `hasContent`
- `hasPrompts`
- `hasExamples`

#### Returns

The computed Tier for the skill.

---

### `tierIcon`

```ts
import { tierIcon } from 'hr-skills-build/server'
```

Return the emoji icon associated with a skill maturity tier.

- `'full'`    → `'🟢'`
- `'partial'` → `'🟡'`
- `'bare'`    → `'🔴'`

```ts
function tierIcon(tier: Tier): string
```

#### Parameters

- `tier`

#### Returns

A single emoji string representing the tier.

---

### `tierLabel`

```ts
import { tierLabel } from 'hr-skills-build/server'
```

Return the human-readable display label for a skill maturity tier.

```ts
function tierLabel(tier: Tier): string
```

#### Parameters

- `tier`

#### Returns

`'Full'`, `'Partial'`, or `'Bare'`.

---

### `makeKeyPromptsContent`

```ts
import { makeKeyPromptsContent } from 'hr-skills-build/server'
```

Build a SKILL.md content string with a `## Key prompts` section containing
`subtopics` H3 sub-headings, each with `promptsEach` numbered quoted prompts.

Used in unit tests to generate fixture content of a specific size without
manually crafting strings.

```ts
function makeKeyPromptsContent(subtopics: number, promptsEach: number): string
```

#### Parameters

- `subtopics`
- `promptsEach`

#### Returns

A full SKILL.md string with valid frontmatter and the generated prompts section.

---

### `stubStepExecutor`

```ts
import { stubStepExecutor } from 'hr-skills-build/server'
```

A stub `StepExecutorFn` that returns a deterministic placeholder output
instead of actually invoking a skill. Shared by `cli/execute-plan.ts` (CLI
demonstration) and `evaluation/evaluate.ts` (so evaluation results
characterize the Planner/Runtime's sequencing and validation behavior, not
a divergent stand-in) — previously duplicated independently in both files.

Real integrations should supply their own `StepExecutorFn` that actually
invokes the skill (for example, loading its SKILL.md and prompting a model).

```ts
function stubStepExecutor(step: ExecutionStep, context: RuntimeContext): unknown
```

#### Parameters

- `step`
- `context`

#### Returns

A placeholder output object, never a rejected promise.

---

### `extractMatch`

```ts
import { extractMatch } from 'hr-skills-build/server'
```

Extract and trim the first capture group from a regex match against `content`.

Duplicated (not imported) from `helpers.ts` on purpose: this file is part
of the browser-safe `client` surface and must not import `helpers.ts`,
which pulls in `node:fs/promises` and `node:path`.

```ts
function extractMatch(regex: RegExp, content: string): string | null
```

#### Parameters

- `regex`
- `content`

#### Returns

The trimmed contents of capture group 1, or `null` if the regex did not match.

---

### `parseSkillFrontmatter`

```ts
import { parseSkillFrontmatter } from 'hr-skills-build/server'
```

Parse and validate a markdown document's YAML frontmatter against
SkillFrontmatterSchema.

Never throws: missing frontmatter, invalid YAML, and schema validation
failures all resolve to `{}` rather than raising an error, so callers can
treat every field as optional.

```ts
function parseSkillFrontmatter(content: string): { name?: string | undefined; description?: string | undefined; metadata?: { author?: string | undefined; version?: string | undefined; } | undefined; }
```

#### Parameters

- `content`

#### Returns

Parsed frontmatter fields, or `{}` if none/invalid.

---

### `EVAL_DATASETS_DIR`

```ts
import { EVAL_DATASETS_DIR } from 'hr-skills-build/server'
```

Absolute path to the `eval/datasets/` directory containing hand-authored evaluation cases.

```ts
const EVAL_DATASETS_DIR: string
```

---

### `EVAL_GOLDEN_DIR`

```ts
import { EVAL_GOLDEN_DIR } from 'hr-skills-build/server'
```

Absolute path to the `eval/golden/` directory containing committed golden fixtures.

```ts
const EVAL_GOLDEN_DIR: string
```

---

### `RELEVANCE_SIGNALS_PATH`

```ts
import { RELEVANCE_SIGNALS_PATH } from 'hr-skills-build/server'
```

Absolute path to the generated relevance-signals artifact at the repo root.

```ts
const RELEVANCE_SIGNALS_PATH: string
```

---

### `MarketplaceJsonSchema`

```ts
import { MarketplaceJsonSchema } from 'hr-skills-build/server'
```

Schema for `.claude-plugin/marketplace.json`.

```ts
const MarketplaceJsonSchema: StrictObjectSchema<{ readonly $schema: LiteralSchema<"https://json.schemastore.org/claude-code-marketplace.json", undefined>; readonly name: SchemaWithPipe<readonly [SchemaWithPipe<readonly [StringSchema<undefined>, TrimAction]>, MinLengthAction<...>]>; readonly description: SchemaWithPipe<...>; readonly owner: Stri...
```

---

### `SkillFrontmatterSchema`

```ts
import { SkillFrontmatterSchema } from 'hr-skills-build/server'
```

Schema for `SKILL.md` frontmatter.

```ts
const SkillFrontmatterSchema: StrictObjectSchema<{ readonly name: OptionalSchema<SchemaWithPipe<readonly [SchemaWithPipe<readonly [StringSchema<undefined>, TrimAction]>, MinLengthAction<string, 1, undefined>]>, undefined>; readonly description: OptionalSchema<...>; readonly metadata: OptionalSchema<...>; }, undefined>
```

---

### `SkillFrontmatter`

```ts
import { SkillFrontmatter } from 'hr-skills-build/server'
```

TypeScript type inferred from SkillFrontmatterSchema.

```ts
type SkillFrontmatter = v.InferOutput<typeof SkillFrontmatterSchema>
```

---

### `RegistrySchema`

```ts
import { RegistrySchema } from 'hr-skills-build/server'
```

Schema for `registry/skills.json`.

```ts
const RegistrySchema: StrictObjectSchema<{ readonly schemaVersion: SchemaWithPipe<readonly [NumberSchema<undefined>, MinValueAction<number, 1, undefined>]>; readonly generatedAt: SchemaWithPipe<...>; readonly skillCount: SchemaWithPipe<...>; readonly skills: ArraySchema<...>; }, undefined>
```

---

### `SkillCategory`

```ts
import { SkillCategory } from 'hr-skills-build/server'
```

The routing-table section a skill belongs to in the generated root
`SKILL.md`. Assigned by `registry/classifier.ts#classifySkill()`.

Lives here (not in `classifier.ts`) because it's a foundational domain
type referenced by `SkillMetadata`/`Registry` below, `search/`, and
`build/router.ts` — `classifier.ts` imports it back from here rather than
the other way around, so `shared/` stays the dependency-free base layer.

```ts
type SkillCategory = | 'talent-acquisition'
    | 'onboarding-offboarding'
    | 'performance-talent'
    | 'compensation-rewards'
    | 'learning-development'
    | 'org-design-change'
    | 'workforce-analytics'
    | 'hr-technology-ai'
    | 'compliance-risk'
    | 'culture-experience'
    | 'global-project'
    | 'technical-hiring'
    | 'uncategorized'
```

---

### `Tier`

```ts
import { Tier } from 'hr-skills-build/server'
```

How complete a skill's directory is: `full` has content+prompts+examples, `partial` has some, `bare` has only SKILL.md.

```ts
type Tier = 'full' | 'partial' | 'bare'
```

---

### `SkillRow`

```ts
import { SkillRow } from 'hr-skills-build/server'
```

One row of the skill matrix table generated by `generate-skill-matrix.ts`.

```ts
interface SkillRow {
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
```

---

### `SkillDirectoryOptions`

```ts
import { SkillDirectoryOptions } from 'hr-skills-build/server'
```

Options controlling how a skill's directory listing is rendered.

```ts
interface SkillDirectoryOptions {
    readonly prefix?: string;
    readonly sort?: boolean;
}
```

---

### `SkillMeta`

```ts
import { SkillMeta } from 'hr-skills-build/server'
```

Frontmatter and prompt metadata read from a skill's `SKILL.md`.

```ts
interface SkillMeta {
    name: string;
    description: string;
    coverage: string;
    scopeSentence: string;
    triggerPhrases: string[];
    supportedTasks: string[];
}
```

---

### `SkillValidationIssue`

```ts
import { SkillValidationIssue } from 'hr-skills-build/server'
```

A single validation issue found in a skill.

Named `SkillValidationIssue` (not `ValidationError`) to avoid a naming
collision with the `ValidationError` class exported by `hr-skills-ref`, which
has a different shape and different semantics. Both names exist in the same
monorepo — keeping them distinct prevents IDE auto-import confusion.

```ts
interface SkillValidationIssue {
    skill: string;
    message: string;
}
```

---

### `RegistryEntry`

```ts
import { RegistryEntry } from 'hr-skills-build/server'
```

A single skill entry in the generated Skill Registry.

This is the canonical, machine-readable record for one skill — the schema
that `registry/skills.json` conforms to. Runtime agents should read this
instead of parsing SKILL.md prose.

```ts
interface RegistryEntry {
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
     * Other skill IDs in the same domain, ranked by shared-tag overlap. When
     * `bun run registry` (the default path) finds a committed relevance
     * signal table, this static ranking is then blended with observed
     * co-selection rates via `reRankRelatedSkills` — which can also surface
     * cross-domain pairs the tag overlap alone missed. Still fully
     * deterministic (no randomness), just not purely tag-based in practice.
     */
    relatedSkills: string[];
}
```

---

### `SkillRecommendation`

```ts
import { SkillRecommendation } from 'hr-skills-build/server'
```

A single "you might also need" suggestion, derived from a `RegistryEntry`'s
`relatedSkills` list. `rank` is the suggestion's 1-based position within
that list, preserved as-is — recommendations never re-sort or re-score.

```ts
interface SkillRecommendation {
    /** Recommended skill's ID, e.g. "hr-onboarding". */
    id: string;
    /** Recommended skill's display name. */
    name: string;
    /** Recommended skill's one-sentence description. */
    description: string;
    /** Recommended skill's routing domain. */
    domain: SkillCategory;
    /** 1-based position in the source skill's `relatedSkills` order. */
    rank: number;
}
```

---

### `RecommendationResult`

```ts
import { RecommendationResult } from 'hr-skills-build/server'
```

The recommendation output for one source skill: its ID plus the ranked
list of related skills, capped at the requested limit.

```ts
interface RecommendationResult {
    /** The skill the recommendations are for. */
    skillId: string;
    /** Related skills, ordered by rank (best match first). */
    recommendations: SkillRecommendation[];
}
```

---

### `SearchableField`

```ts
import { SearchableField } from 'hr-skills-build/server'
```

Registry fields that `searchSkills()` can match against. Kept in sync
with the field list in the Phase 6.1 issue: capabilities, aliases, tags,
domain, trigger phrases.

```ts
type SearchableField = | 'capabilities'
    | 'aliases'
    | 'tags'
    | 'domain'
    | 'triggerPhrases'
```

---

### `MatchType`

```ts
import { MatchType } from 'hr-skills-build/server'
```

How a single field value matched the query text.

```ts
type MatchType = 'exact' | 'fuzzy'
```

---

### `SkillFieldMatch`

```ts
import { SkillFieldMatch } from 'hr-skills-build/server'
```

One matched field value for one skill, with enough detail to explain
why\* the skill matched — the raw ingredients of the result's score.

```ts
interface SkillFieldMatch {
    /** Which registry field matched, e.g. "capabilities". */
    field: SearchableField;
    /** The exact field value that matched, e.g. "employee onboarding". */
    value: string;
    /** Whether this was an exact or fuzzy match. */
    matchType: MatchType;
    /** Match strength, 0–1. Always 1 for exact matches. */
    similarity: number;
    /** The field's base weight (see `FIELD_WEIGHTS` in search.ts). */
    weight: number;
    /** `weight * similarity`, before any cross-field bonuses. */
    contribution: number;
}
```

---

### `SkillSearchResult`

```ts
import { SkillSearchResult } from 'hr-skills-build/server'
```

One skill's search result: its identity, final score, every field match
that contributed to that score, and a human-readable explanation.

```ts
interface SkillSearchResult {
    /** Matched skill's ID, e.g. "hr-onboarding". */
    skillId: string;
    /** Matched skill's display name. */
    name: string;
    /** Matched skill's one-sentence description. */
    description: string;
    /** Matched skill's routing domain. */
    domain: SkillCategory;
    /** Final composite relevance score (see search.ts for the formula). */
    score: number;
    /** Every field match that contributed to `score`, most relevant first. */
    matches: SkillFieldMatch[];
    /** Deterministic, human-readable summary of why this skill matched. */
    explanation: string;
}
```

---

### `SkillSearchQuery`

```ts
import { SkillSearchQuery } from 'hr-skills-build/server'
```

A search query against the generated Skill Registry.

```ts
interface SkillSearchQuery {
    /** Free-text query, matched (exact and/or fuzzy) against `fields`. */
    text: string;
    /** Fields to search. Defaults to all `SearchableField`s. */
    fields?: SearchableField[];
    /** Restrict results to a single domain before scoring. */
    domain?: SkillCategory;
    /** Enable fuzzy matching in addition to exact matching. Defaults to true. */
    fuzzy?: boolean;
    /** Maximum number of results to return. Defaults to 10. */
    limit?: number;
}
```

---

### `SkillSearchResponse`

```ts
import { SkillSearchResponse } from 'hr-skills-build/server'
```

The full output of `searchSkills()`: the query that was run plus its
ranked results.

```ts
interface SkillSearchResponse {
    /** The `text` query that was run, echoed back verbatim. */
    query: string;
    /** Number of results returned (i.e. `results.length`). */
    resultCount: number;
    /** Matching skills, ranked by `score` descending. */
    results: SkillSearchResult[];
}
```

---

### `Registry`

```ts
import { Registry } from 'hr-skills-build/server'
```

The full generated Skill Registry document.

```ts
interface Registry {
    /** Bump when the shape of RegistryEntry changes in a breaking way. */
    schemaVersion: number;
    /** ISO date (YYYY-MM-DD) the registry was generated on. */
    generatedAt: string;
    /** Total number of skills indexed. */
    skillCount: number;
    skills: RegistryEntry[];
}
```

---

### `SelectionReason`

```ts
import { SelectionReason } from 'hr-skills-build/server'
```

Why a skill was included in an execution plan. Read together with
`ExecutionStep.rationale` for a human-readable explanation.

Note the two that are easy to conflate: `'related-skill'` is a \*capability\*
match (the skill's declared capabilities partially/fuzzily overlap the
requested one — see `matchCapabilityAgainstRegistry()` in planner.ts),
while `'recommended-pairing'` comes from the \*registry\* `relatedSkills`
graph (a different skill was already selected, and this one is commonly
used alongside it). Despite the name, `'related-skill'` has nothing to do
with `RegistryEntry.relatedSkills`.

```ts
type SelectionReason = | 'direct-capability-match'
    /**
     * Reserved — not currently assigned anywhere in `planner.ts`. Intended
     * for a future alias/alternate-name match, distinct from a capability
     * match, but no such matcher exists yet.
     */
    | 'alias-match'
    /**
     * Reserved — not currently assigned anywhere in `planner.ts`. Intended
     * for a future "best single skill for this whole domain" selection, but
     * no such matcher exists yet.
     */
    | 'domain-expert'
    /** Pulled in because a selected skill declares it as a dependency. */
    | 'dependency-requirement'
    /** Pulled in via `RegistryEntry.relatedSkills` of an already-selected skill. */
    | 'recommended-pairing'
    /** Partial/fuzzy capability-overlap match (see the note above). */
    | 'related-skill'
```

---

### `ExecutionStep`

```ts
import { ExecutionStep } from 'hr-skills-build/server'
```

One skill invocation within an ExecutionPlan.

```ts
interface ExecutionStep {
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
```

---

### `CapabilityMatch`

```ts
import { CapabilityMatch } from 'hr-skills-build/server'
```

How one requested capability from a user's intent matched against the registry.

```ts
interface CapabilityMatch {
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
```

---

### `ExecutionPlan`

```ts
import { ExecutionPlan } from 'hr-skills-build/server'
```

Output of generateExecutionPlan  — an ordered set of skills to run for a given intent.

```ts
interface ExecutionPlan {
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
```

---

### `PlanValidationIssue`

```ts
import { PlanValidationIssue } from 'hr-skills-build/server'
```

One problem found by validateExecutionPlan  or suggestPlanImprovements .

```ts
interface PlanValidationIssue {
    /** Machine-readable identifier for this issue type. */
    code: string;
    severity: 'error' | 'warning' | 'info';
    /** Human-readable explanation of the issue. */
    message: string;
    /** Additional structured detail, if any. */
    context?: Record<string, unknown>;
}
```

---

### `PlanValidationResult`

```ts
import { PlanValidationResult } from 'hr-skills-build/server'
```

Result of validating an ExecutionPlan.

```ts
interface PlanValidationResult {
    /** `true` when there are no `error`-severity issues. */
    isValid: boolean;
    issues: PlanValidationIssue[];
}
```

---

### `StepStatus`

```ts
import { StepStatus } from 'hr-skills-build/server'
```

Lifecycle status of a single execution step within the runtime.

`pending` -> `running` -> (`completed` | `failed` | `skipped`)

```ts
type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
```

---

### `RuntimeStateSnapshot`

```ts
import { RuntimeStateSnapshot } from 'hr-skills-build/server'
```

A snapshot of the runtime's execution state at a point in time.

Skill IDs move between these buckets as execution proceeds. A skill ID
appears in exactly one bucket at any given moment.

```ts
interface RuntimeStateSnapshot {
    pending: string[];
    running: string[];
    completed: string[];
    failed: string[];
    skipped: string[];
}
```

---

### `StepResult`

```ts
import { StepResult } from 'hr-skills-build/server'
```

A step's result after it finishes running (successfully or not).

```ts
interface StepResult {
    skillId: string;
    status: 'completed' | 'failed' | 'skipped';
    /** Output produced by the step, available to later steps via RuntimeContext. */
    output?: unknown;
    /** Populated when status is 'failed'. */
    error?: RuntimeErrorInfo;
    /** Number of attempts made (1 = succeeded/failed on first try). */
    attempts: number;
}
```

---

### `RuntimeErrorInfo`

```ts
import { RuntimeErrorInfo } from 'hr-skills-build/server'
```

Plain, serializable description of a runtime failure — used in traces and
results so failures survive JSON serialization (unlike Error instances).

```ts
interface RuntimeErrorInfo {
    code: string;
    message: string;
    skillId?: string;
    attempt?: number;
    cause?: string;
}
```

---

### `StepExecutorFn`

```ts
import { StepExecutorFn } from 'hr-skills-build/server'
```

A function that performs the actual work for a single execution step.

The Runtime is deliberately agnostic about \*what\* a step does — invoking a
skill, calling a model, running a tool, and so on are all the caller's
responsibility. The Runtime only sequences calls to this function,
threads context between them, and manages state/retries/events/tracing.

Throw (or reject) to signal step failure; the Runtime will apply the
configured RetryPolicy before giving up.

```ts
function StepExecutorFn(step: ExecutionStep, context: RuntimeContext): unknown
```

#### Parameters

- `step`
- `context`

---

### `RuntimeContext`

```ts
import { RuntimeContext } from 'hr-skills-build/server'
```

Explicit, mutable context object threaded through workflow execution.

Each completed step's output is recorded here and made available to every
subsequent step — this is how "context propagation" is implemented, rather
than relying on module-level globals or closures.

```ts
interface RuntimeContext {
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
```

---

### `RetryPolicy`

```ts
import { RetryPolicy } from 'hr-skills-build/server'
```

Deterministic retry policy consulted by the runtime after a step fails.

`delayForAttempt` returns a logical delay in milliseconds; the runtime
never actually sleeps for it (that would break determinism and slow down
tests) — the value is recorded on retry events/traces for callers that
want to honor it in their own step executor or a wrapping scheduler.

```ts
interface RetryPolicy {
    /** Maximum number of retry attempts after the initial try (0 = no retries). */
    readonly maxRetries: number;
    /** Logical delay (ms) to record before retry attempt `attempt` (1-indexed). */
    delayForAttempt(attempt: number): number;
    /** Whether this error should be retried at all. Defaults to "always" when omitted. */
    shouldRetry?(error: unknown, attempt: number): boolean;
}
```

---

### `RuntimeEventType`

```ts
import { RuntimeEventType } from 'hr-skills-build/server'
```

Discriminates the lifecycle events emitted by executeWorkflow  onto its `EventDispatcher`.

```ts
type RuntimeEventType = | 'workflow-started'
    | 'step-started'
    | 'step-retry'
    | 'step-completed'
    | 'step-failed'
    | 'step-skipped'
    | 'workflow-completed'
    | 'workflow-failed'
```

---

### `RuntimeEvent`

```ts
import { RuntimeEvent } from 'hr-skills-build/server'
```

A single runtime event. `order` is a logical clock (a monotonically
increasing integer assigned by the EventDispatcher) rather than a wall
clock timestamp, which keeps execution fully deterministic and makes
traces reproducible in tests.

```ts
interface RuntimeEvent {
    order: number;
    type: RuntimeEventType;
    skillId?: string;
    attempt?: number;
    data?: Record<string, unknown>;
}
```

---

### `TraceEntry`

```ts
import { TraceEntry } from 'hr-skills-build/server'
```

One entry in the execution trace — an event paired with the runtime state
snapshot immediately after that event was applied. Traces are the primary
debugging artifact: replaying them reconstructs exactly what happened and
in what order, without needing wall-clock timestamps.

```ts
interface TraceEntry {
    order: number;
    type: RuntimeEventType;
    skillId?: string;
    attempt?: number;
    state: RuntimeStateSnapshot;
    result?: unknown;
    error?: RuntimeErrorInfo;
}
```

---

### `RuntimeOptions`

```ts
import { RuntimeOptions } from 'hr-skills-build/server'
```

Configuration accepted by `executeWorkflow` / `WorkflowExecutor`.

```ts
interface RuntimeOptions {
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
```

---

### `WorkflowResult`

```ts
import { WorkflowResult } from 'hr-skills-build/server'
```

The final outcome of running an execution plan through the Runtime.

```ts
interface WorkflowResult {
    status: 'completed' | 'failed';
    intent: string;
    outputs: Record<string, unknown>;
    steps: StepResult[];
    events: RuntimeEvent[];
    trace: TraceEntry[];
    state: RuntimeStateSnapshot;
}
```

---

### `EvaluationCase`

```ts
import { EvaluationCase } from 'hr-skills-build/server'
```

A single evaluation dataset entry — a representative planning scenario the
Planner and Runtime are expected to handle correctly.

Datasets store the \*input\* (`intent`) only. The \*expected output\* is a
golden fixture (see `GoldenCaseResult`), generated once from an actual run
against the real Skill Registry and committed to `eval/golden/`. This
keeps the dataset human-authored and small, while expected outputs stay
exactly in sync with what the Planner and Runtime actually produce —
avoiding hand-guessed expectations that drift from reality.

```ts
interface EvaluationCase {
    /** Stable identifier, e.g. "recruiting-interview-questions". */
    id: string;
    /** Short human-readable description of the scenario. */
    description: string;
    /** The user intent passed to `generateExecutionPlan`. */
    intent: string;
    /** Free-form category tag for grouping in reports (e.g. "recruiting"). */
    category: string;
}
```

---

### `EvaluationDataset`

```ts
import { EvaluationDataset } from 'hr-skills-build/server'
```

A dataset is a named, ordered collection of evaluation cases.

```ts
interface EvaluationDataset {
    name: string;
    description: string;
    cases: EvaluationCase[];
}
```

---

### `GoldenCaseResult`

```ts
import { GoldenCaseResult } from 'hr-skills-build/server'
```

The deterministic, golden-fixture shape of a single case's expected
outcome — captures only the fields that are meaningful to compare across
runs (skill selection, ordering, capability coverage, validation, and
workflow outcome), not the full `ExecutionPlan`/`WorkflowResult` objects,
which carry incidental detail (rationale strings, timestamps) that would
make the fixture noisy and prone to false-positive regressions.

```ts
interface GoldenCaseResult {
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
```

---

### `GoldenFixture`

```ts
import { GoldenFixture } from 'hr-skills-build/server'
```

A named collection of golden case results for one dataset.

```ts
interface GoldenFixture {
    dataset: string;
    /** ISO date the fixture was generated/last updated on. */
    generatedAt: string;
    results: GoldenCaseResult[];
}
```

---

### `EvaluationCaseResult`

```ts
import { EvaluationCaseResult } from 'hr-skills-build/server'
```

The actual outcome of running one evaluation case in the current code.

```ts
interface EvaluationCaseResult {
    caseId: string;
    category: string;
    intent: string;
    actual: GoldenCaseResult;
    /** Present only if a golden fixture entry exists for this case. */
    golden?: GoldenCaseResult;
    /** Fields that differ between `actual` and `golden` (empty if none, or no golden entry). */
    regressions: string[];
}
```

---

### `QualityMetrics`

```ts
import { QualityMetrics } from 'hr-skills-build/server'
```

Deterministic quality metrics aggregated across an evaluation run.
Each score is a 0.0-1.0 ratio; `NaN`-free by construction (denominators of
0 map to a score of 1 — vacuously satisfied, nothing to fail).

```ts
interface QualityMetrics {
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
```

---

### `EvaluationReport`

```ts
import { EvaluationReport } from 'hr-skills-build/server'
```

The full report produced by one benchmark run.

```ts
interface EvaluationReport {
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
```

---

### `WEIGHT_DESCRIPTION`

```ts
import { WEIGHT_DESCRIPTION } from 'hr-skills-build/server'
```

Weight applied to the description-level Jaccard score.

```ts
const WEIGHT_DESCRIPTION: 0.35
```

---

### `WEIGHT_CONTENT`

```ts
import { WEIGHT_CONTENT } from 'hr-skills-build/server'
```

Weight applied to the content-level token Jaccard score.

```ts
const WEIGHT_CONTENT: 0.4
```

---

### `WEIGHT_BIGRAM`

```ts
import { WEIGHT_BIGRAM } from 'hr-skills-build/server'
```

Weight applied to the bigram Jaccard score.

```ts
const WEIGHT_BIGRAM: 0.25
```

---

### `DUPLICATE_THRESHOLD`

```ts
import { DUPLICATE_THRESHOLD } from 'hr-skills-build/server'
```

Composite similarity score at or above which a pair is reported as a
potential duplicate.  Range: 0–1.  Default: 0.55.

```ts
const DUPLICATE_THRESHOLD: 0.55
```

---

### `HR_STOP_WORDS`

```ts
import { HR_STOP_WORDS } from 'hr-skills-build/server'
```

Common HR vocabulary that is expected to appear in many skills.
Filtering these terms out prevents domain-vocabulary overlap from
triggering false-positive duplicate warnings.

```ts
const HR_STOP_WORDS: Set<string>
```

---

### `tokenise`

```ts
import { tokenise } from 'hr-skills-build/server'
```

Tokenise a normalised string: split on whitespace, remove stop-words and
tokens shorter than 3 characters.  Returns a sorted array for determinism.

```ts
function tokenise(text: string): string[]
```

#### Parameters

- `text`

#### Returns

Sorted, filtered tokens.

---

### `buildBigrams`

```ts
import { buildBigrams } from 'hr-skills-build/server'
```

Build bigrams (consecutive token pairs) from a token list.
The list must be in its natural (unsorted) order before calling this;
the returned bigrams are sorted for determinism.

```ts
function buildBigrams(tokens: string[]): string[]
```

#### Parameters

- `tokens`

#### Returns

Sorted `"tokenA|tokenB"` bigrams.

---

### `jaccardSimilarity`

```ts
import { jaccardSimilarity } from 'hr-skills-build/server'
```

Jaccard similarity between two token arrays treated as multisets.

|A ∩ B| / |A ∪ B| — both computed from the frequency-aware intersection
so a token appearing twice in A but once in B only contributes 1 to the
intersection.  Returns 0 when both arrays are empty.

```ts
function jaccardSimilarity(a: string[], b: string[]): number
```

#### Parameters

- `a`
- `b`

#### Returns

Jaccard similarity in `[0, 1]`.

---

### `SkillContent`

```ts
import { SkillContent } from 'hr-skills-build/server'
```

Parsed representation of a single skill used by the detector.

```ts
interface SkillContent {
    /** Skill directory name, e.g. "hr-onboarding". */
    name: string;
    /** Raw frontmatter description string. */
    description: string;
    /** Concatenated body text extracted from SKILL.md + content/ files. */
    body: string;
}
```

---

### `DuplicateWarning`

```ts
import { DuplicateWarning } from 'hr-skills-build/server'
```

A single duplicate-detection finding for one pair of skills.

```ts
interface DuplicateWarning {
    /** First skill ID (lexicographically smaller). */
    skillA: string;
    /** Second skill ID. */
    skillB: string;
    /** Weighted composite similarity score (0–1). */
    score: number;
    /** Jaccard similarity of the description tokens alone. */
    descriptionSimilarity: number;
    /** Jaccard similarity of the content tokens alone. */
    contentSimilarity: number;
    /** Jaccard similarity of the content bigrams alone. */
    bigramSimilarity: number;
    /** Human-readable explanation of what drove the score. */
    explanation: string;
}
```

---

### `comparePair`

```ts
import { comparePair } from 'hr-skills-build/server'
```

Compute the composite duplicate score for a pair of pre-loaded skills.

```ts
function comparePair(a: SkillContent, b: SkillContent, threshold?: number): DuplicateWarning | null
```

#### Parameters

- `a`
- `b`
- `threshold` (optional)

#### Returns

A `DuplicateWarning` when `score >= threshold`, or `null`.

---

### `detectDuplicates`

```ts
import { detectDuplicates } from 'hr-skills-build/server'
```

Run duplicate detection across all provided skill names and emit findings
as `SkillValidationIssue` warnings (message prefix `[duplicate-warning]`).

Pairs are evaluated in a stable, alphabetically-sorted order.
The function never throws — I/O errors for individual skills are silently
skipped so that other validation can still proceed.

```ts
function detectDuplicates(skillNames: string[], warnings: SkillValidationIssue[], threshold?: number): Promise<DuplicateWarning[]>
```

#### Parameters

- `skillNames`
- `warnings`
- `threshold` (optional)

#### Returns

Resolves once every pair has been compared; findings are pushed onto `warnings`.

---

### `CLARITY_WEIGHT`

```ts
import { CLARITY_WEIGHT } from 'hr-skills-build/server'
```

Weight of the clarity dimension in the overall score.

```ts
const CLARITY_WEIGHT: 0.3
```

---

### `COMPLETENESS_WEIGHT`

```ts
import { COMPLETENESS_WEIGHT } from 'hr-skills-build/server'
```

Weight of the completeness dimension in the overall score.

```ts
const COMPLETENESS_WEIGHT: 0.4
```

---

### `EXAMPLE_COVERAGE_WEIGHT`

```ts
import { EXAMPLE_COVERAGE_WEIGHT } from 'hr-skills-build/server'
```

Weight of the example-coverage dimension in the overall score.

```ts
const EXAMPLE_COVERAGE_WEIGHT: 0.3
```

---

### `QUALITY_BAND_THRESHOLDS`

```ts
import { QUALITY_BAND_THRESHOLDS } from 'hr-skills-build/server'
```

Score thresholds for the human-readable quality band.

```ts
const QUALITY_BAND_THRESHOLDS: { readonly excellent: 85; readonly good: 70; readonly needsReview: 50; }
```

---

### `QualityBand`

```ts
import { QualityBand } from 'hr-skills-build/server'
```

Human-readable quality band derived from the overall score.

```ts
type QualityBand = 'excellent' | 'good' | 'needs-review' | 'poor'
```

---

### `QualityDimensionScore`

```ts
import { QualityDimensionScore } from 'hr-skills-build/server'
```

Score and supporting notes for a single quality dimension.

```ts
interface QualityDimensionScore {
    /** 0-100 score for this dimension. */
    score: number;
    /** Human-readable observations explaining the score (empty if perfect). */
    notes: string[];
}
```

---

### `SkillQualityScore`

```ts
import { SkillQualityScore } from 'hr-skills-build/server'
```

Full quality-score report for one skill.

```ts
interface SkillQualityScore {
    /** Affected skill's directory name. */
    skill: string;
    /** How clear and well-triggered the skill's description/body is. */
    clarity: QualityDimensionScore;
    /** How complete the skill's sections are relative to the ideal band. */
    completeness: QualityDimensionScore;
    /** How well supported tasks are backed by prompts and example material. */
    exampleCoverage: QualityDimensionScore;
    /** Weighted overall score in [0, 100]. */
    overall: number;
    /** Human-readable band derived from {@link overall}. */
    band: QualityBand;
}
```

---

### `scoreClarity`

```ts
import { scoreClarity } from 'hr-skills-build/server'
```

Score description length and "Use when" trigger presence, plus body
readability (average words per sentence).

```ts
function scoreClarity(description: string, content: string): QualityDimensionScore
```

#### Parameters

- `description`
- `content`

#### Returns

Clarity dimension score with explanatory notes.

---

### `scoreCompleteness`

```ts
import { scoreCompleteness } from 'hr-skills-build/server'
```

Score how close the skill's tasks/tips/prompt-subtopic counts and body
length are to the ideal (center-weighted) band, not just inside the hard
pass/fail range.

```ts
function scoreCompleteness(content: string): QualityDimensionScore
```

#### Parameters

- `content`

#### Returns

Completeness dimension score with explanatory notes.

---

### `scoreExampleCoverage`

```ts
import { scoreExampleCoverage } from 'hr-skills-build/server'
```

Score whether the skill has `content/`/`examples/` material and whether
supported tasks are proportionally backed by quoted example prompts.

```ts
function scoreExampleCoverage(skillsDir: string, skillName: string, content: string): Promise<QualityDimensionScore>
```

#### Parameters

- `skillsDir`
- `skillName`
- `content`

#### Returns

Example-coverage dimension score with explanatory notes.

---

### `scoreSkillQuality`

```ts
import { scoreSkillQuality } from 'hr-skills-build/server'
```

Compute a full quality-score report for one skill.

```ts
function scoreSkillQuality(skillsDir: string, skillName: string): Promise<SkillQualityScore>
```

#### Parameters

- `skillsDir`
- `skillName`

#### Returns

A promise resolving to the skill's SkillQualityScore.

---

### `scoreAllSkills`

```ts
import { scoreAllSkills } from 'hr-skills-build/server'
```

Compute quality-score reports for every HR skill in the repository,
sorted alphabetically by skill name.

```ts
function scoreAllSkills(): Promise<SkillQualityScore[]>
```

#### Returns

A promise resolving to an array of SkillQualityScore.

---

### `scoreSkills`

```ts
import { scoreSkills } from 'hr-skills-build/server'
```

Compute quality-score reports for a specific subset of skills — used by
the CI workflow to score only the skills touched by a pull request
instead of the entire corpus.

```ts
function scoreSkills(skillNames: string[]): Promise<SkillQualityScore[]>
```

#### Parameters

- `skillNames`

#### Returns

A promise resolving to an array of SkillQualityScore, in
the same order as `skillNames`.

---

### `validateSecurityCommands`

```ts
import { validateSecurityCommands } from 'hr-skills-build/server'
```

Scans fenced shell code blocks in a skill's content for destructive command
patterns (raw device writes, `mkfs`, fork bombs, piped base64 decodes).

```ts
function validateSecurityCommands(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateSensitivePaths`

```ts
import { validateSensitivePaths } from 'hr-skills-build/server'
```

Scans fenced code blocks for writes to sensitive filesystem paths
(`/etc/`, `/root/`, `~/.ssh/`, shell rc files, `/usr/local/bin/`, `/tmp/`
executables).

```ts
function validateSensitivePaths(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateSuspiciousUrls`

```ts
import { validateSuspiciousUrls } from 'hr-skills-build/server'
```

Flags URLs pointing at raw IP addresses, known suspicious hosts, or
plain-text mentions of exfiltration services (e.g. requestbin).

```ts
function validateSuspiciousUrls(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateCredentialLeaks`

```ts
import { validateCredentialLeaks } from 'hr-skills-build/server'
```

Flags content matching known credential/secret patterns (API keys,
hardcoded passwords, GitHub/OpenAI/Slack/AWS token shapes).

```ts
function validateCredentialLeaks(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateHiddenUnicode`

```ts
import { validateHiddenUnicode } from 'hr-skills-build/server'
```

Flags zero-width, directional-override, and private-use-area Unicode
characters — commonly used to hide injected instructions in text that
looks clean when rendered.

```ts
function validateHiddenUnicode(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateSecurityChecks`

```ts
import { validateSecurityChecks } from 'hr-skills-build/server'
```

Run all security validators on skill content.

```ts
function validateSecurityChecks(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `PROMPT_DRIFT_THRESHOLD`

```ts
import { PROMPT_DRIFT_THRESHOLD } from 'hr-skills-build/server'
```

Minimum Jaccard similarity between a skill's purpose tokens and its
`prompts/` tokens. Below this, prompts are considered drifted from the
skill's documented purpose. Calibrated below the lowest legitimate score
(~0.018) observed across this repository's skills.

```ts
const PROMPT_DRIFT_THRESHOLD: 0.015
```

---

### `EXAMPLE_DRIFT_THRESHOLD`

```ts
import { EXAMPLE_DRIFT_THRESHOLD } from 'hr-skills-build/server'
```

Minimum Jaccard similarity between a skill's purpose tokens and its
`examples/` tokens. Calibrated below the lowest legitimate score
(~0.041) observed across this repository's skills.

```ts
const EXAMPLE_DRIFT_THRESHOLD: 0.03
```

---

### `COPY_MARGIN`

```ts
import { COPY_MARGIN } from 'hr-skills-build/server'
```

Minimum margin by which another skill's purpose tokens must out-score a
skill's own purpose tokens (against the same prompts/examples tokens)
before the material is flagged as possibly copied. Calibrated above the
highest legitimate margin (~0.059) observed across this repository.

```ts
const COPY_MARGIN: 0.06
```

---

### `COPY_MIN_OTHER_SCORE`

```ts
import { COPY_MIN_OTHER_SCORE } from 'hr-skills-build/server'
```

Minimum absolute similarity to the \*other\* skill's purpose tokens
required before a possible-copy finding is reported, so two skills that
both score near-zero against everything don't trigger on margin alone.

```ts
const COPY_MIN_OTHER_SCORE: 0.12
```

---

### `MIN_COVERAGE_RATIO`

```ts
import { MIN_COVERAGE_RATIO } from 'hr-skills-build/server'
```

Minimum fraction of top description keywords that must appear somewhere
in `prompts/` + `examples/` + `content/` combined. Calibrated below the
lowest legitimate ratio (0.4) observed across this repository.

```ts
const MIN_COVERAGE_RATIO: 0.3
```

---

### `MIN_PURPOSE_TOKENS`

```ts
import { MIN_PURPOSE_TOKENS } from 'hr-skills-build/server'
```

Skills whose purpose token set is smaller than this are skipped for
drift/coverage checks — too little documented text to compare against
reliably, so flagging would be noise rather than signal.

```ts
const MIN_PURPOSE_TOKENS: 5
```

---

### `SkillSemanticContent`

```ts
import { SkillSemanticContent } from 'hr-skills-build/server'
```

One skill's token sets and raw description, used for semantic checks.

```ts
interface SkillSemanticContent {
    /** Skill directory name, e.g. "hr-onboarding". */
    name: string;
    /** Raw frontmatter description string (pre-tokenisation). */
    description: string;
    /** Normalised tokens from description + SKILL.md body + content/. */
    purposeTokens: string[];
    /** Normalised tokens from prompts/*.md. Empty when prompts/ is absent. */
    promptsTokens: string[];
    /** Normalised tokens from examples/*.md. Empty when examples/ is absent. */
    examplesTokens: string[];
    /** Normalised tokens from content/*.md alone. Empty when content/ is absent. */
    contentTokens: string[];
    /** Whether prompts/ exists and contains at least one .md file. */
    hasPrompts: boolean;
    /** Whether examples/ exists and contains at least one .md file. */
    hasExamples: boolean;
}
```

---

### `loadSkillSemanticContent`

```ts
import { loadSkillSemanticContent } from 'hr-skills-build/server'
```

Load one skill's semantic content: purpose/prompts/examples token sets.

```ts
function loadSkillSemanticContent(skillsDir: string, skillName: string): Promise<SkillSemanticContent>
```

#### Parameters

- `skillsDir`
- `skillName`

#### Returns

The skill's purpose/prompt/example token sets and content flags.

---

### `topKeywords`

```ts
import { topKeywords } from 'hr-skills-build/server'
```

Extract the top `count` most frequent normalised tokens from `description`.
Ties are broken alphabetically so the result is deterministic.

```ts
function topKeywords(description: string, count?: number): string[]
```

#### Parameters

- `description`
- `count` (optional)

#### Returns

Top tokens, most frequent first.

---

### `SemanticFinding`

```ts
import { SemanticFinding } from 'hr-skills-build/server'
```

A single semantic-consistency finding for one skill.

```ts
interface SemanticFinding {
    /** Affected skill's directory name. */
    skill: string;
    /** Affected subdirectory/file, e.g. "prompts/", "examples/". */
    file: string;
    /** Which heuristic triggered this finding. */
    heuristic: SemanticHeuristic;
    /** Deterministic confidence score in [0, 1] — higher means more confident. */
    confidence: number;
    /** Human-readable explanation, including the heuristic and suggested action. */
    explanation: string;
}
```

---

### `checkDrift`

```ts
import { checkDrift } from 'hr-skills-build/server'
```

Check `prompts/` and `examples/` for drift against a skill's own purpose
tokens (checks 1 and 2), skipping skills whose purpose vocabulary is too
small to compare against reliably.

```ts
function checkDrift(skill: SkillSemanticContent): SemanticFinding[]
```

#### Parameters

- `skill`

#### Returns

Drift findings, empty when nothing is flagged.

---

### `checkPossibleCopy`

```ts
import { checkPossibleCopy } from 'hr-skills-build/server'
```

Check whether `prompts/` or `examples/` match another skill's purpose
tokens meaningfully better than they match their own skill (check 3).

```ts
function checkPossibleCopy(skill: SkillSemanticContent, allSkills: SkillSemanticContent[]): SemanticFinding[]
```

#### Parameters

- `skill`
- `allSkills`

#### Returns

Possible-copy findings, empty when nothing is flagged.

---

### `checkConceptCoverage`

```ts
import { checkConceptCoverage } from 'hr-skills-build/server'
```

Check that the skill's top description keywords are actually covered
somewhere in its supporting material (check 4).

```ts
function checkConceptCoverage(skill: SkillSemanticContent): SemanticFinding[]
```

#### Parameters

- `skill`

#### Returns

Concept-coverage findings, empty when nothing is flagged.

---

### `validateSemanticConsistency`

```ts
import { validateSemanticConsistency } from 'hr-skills-build/server'
```

Run semantic consistency validation across all provided skill names and
emit findings as `SkillValidationIssue` warnings (message prefix
`[semantic-warning]`).

Skills are processed in alphabetically-sorted order and findings are
sorted by skill name, then by heuristic name, so the same repository
state always produces identical output.

The function never throws — I/O errors for individual skills simply
result in empty token sets, which cannot spuriously trigger a finding
(empty prompts/examples are skipped; empty purpose is below
MIN_PURPOSE_TOKENS and skipped too).

```ts
function validateSemanticConsistency(skillsDir: string, skillNames: string[], warnings: SkillValidationIssue[]): Promise<SemanticFinding[]>
```

#### Parameters

- `skillsDir`
- `skillNames`
- `warnings`

#### Returns

Resolves once every skill has been checked; findings are pushed onto `warnings`.

---

### `validateExecutionPlan`

```ts
import { validateExecutionPlan } from 'hr-skills-build/server'
```

Validate an execution plan against the registry and detect common issues.

```ts
function validateExecutionPlan(plan: ExecutionPlan, registry: Registry): PlanValidationResult
```

#### Parameters

- `plan`
- `registry`

#### Returns

Whether the plan is valid, plus any issues found.

---

### `suggestPlanImprovements`

```ts
import { suggestPlanImprovements } from 'hr-skills-build/server'
```

Suggest improvements to an execution plan.

Non-binding suggestions for better organization or coverage.

```ts
function suggestPlanImprovements(plan: ExecutionPlan, _registry: Registry): string[]
```

#### Parameters

- `plan`
- `_registry`

#### Returns

Human-readable suggestions, empty when the plan looks fine.

---

### `validateRegistryConsistency`

```ts
import { validateRegistryConsistency } from 'hr-skills-build/server'
```

Validate the Skill Registry: schema conformance, staleness against the
current filesystem, duplicate IDs, dangling relationship references, and
dependency cycles.

Mirrors the pattern already used for marketplace.json / router consistency
in validate.ts — recompute the expected artifact in memory and compare,
rather than trusting the committed file blindly.

```ts
function validateRegistryConsistency(errors: SkillValidationIssue[]): Promise<void>
```

#### Parameters

- `errors`

#### Returns

Resolves once every check has run; findings are pushed onto `errors`.

---

### `validateRelatedSkillsAgainstSignals`

```ts
import { validateRelatedSkillsAgainstSignals } from 'hr-skills-build/server'
```

Warn when a high-evidence usage-informed relevance signal (Phase 6.1) is
absent from a skill's `relatedSkills` list — Phase 6.1-B's second
deliverable.

This is deliberately a warning, not an error: `reRankRelatedSkills()`
already tends to surface high-evidence pairs (see relevance-signals.ts),
so a miss here usually means a skill already has `limit` (5) higher-
scored entries crowding it out — worth a maintainer's attention, not a
build failure. Follows the same `(input, warnings)` shape as
`detectDuplicates()` and `validateSemanticConsistency()` so `validate.ts`
can run all three concurrently in its warnings group.

A signal counts as "high evidence" when its `coSelectionRate` is at
least HIGH_EVIDENCE_CO_SELECTION_RATE AND it's backed by at
least HIGH_EVIDENCE_MIN_OBSERVATIONS observations — see the
constants' doc comments for the rationale.

```ts
function validateRelatedSkillsAgainstSignals(registry: { skills: readonly Pick<RegistryEntry, "relatedSkills" | "id">[]; }, signalTable: RelevanceSignalTable | undefined, warnings: SkillValidationIssue[]): void
```

#### Parameters

- `registry`
- `signalTable`
- `warnings`

---

### `validateFrontmatter`

```ts
import { validateFrontmatter } from 'hr-skills-build/server'
```

Validate the frontmatter of a skill. \*

```ts
function validateFrontmatter(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateRequiredSections`

```ts
import { validateRequiredSections } from 'hr-skills-build/server'
```

Validate the required sections of a skill. \*

```ts
function validateRequiredSections(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateContentLength`

```ts
import { validateContentLength } from 'hr-skills-build/server'
```

Validate the content length of a skill. \*

```ts
function validateContentLength(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateLineCount`

```ts
import { validateLineCount } from 'hr-skills-build/server'
```

Validate the line count of a skill. \*

```ts
function validateLineCount(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateSupportedTasks`

```ts
import { validateSupportedTasks } from 'hr-skills-build/server'
```

Validate the supported tasks of a skill. \*

```ts
function validateSupportedTasks(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateTips`

```ts
import { validateTips } from 'hr-skills-build/server'
```

Validate the tips of a skill. \*

```ts
function validateTips(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateBlankLines`

```ts
import { validateBlankLines } from 'hr-skills-build/server'
```

Validate the blank lines of a skill. \*

```ts
function validateBlankLines(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateAuthor`

```ts
import { validateAuthor } from 'hr-skills-build/server'
```

Validate the author of a skill.

```ts
function validateAuthor(skillName: string, author: string | undefined, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `author`
- `errors`

---

### `validatePromptStructure`

```ts
import { validatePromptStructure } from 'hr-skills-build/server'
```

Validate the structure of the ## Key prompts section.

Per docs/engineering/format.md: 3-6 subtopics (H3 headings) and 4-7 quoted prompts per subtopic.

```ts
function validatePromptStructure(skillName: string, content: string, errors: SkillValidationIssue[]): void
```

#### Parameters

- `skillName`
- `content`
- `errors`

---

### `validateRouterConsistency`

```ts
import { validateRouterConsistency } from 'hr-skills-build/server'
```

Validate three-way consistency: router (root SKILL.md) ↔ filesystem (skills/) ↔ marketplace.json.

All three sources must agree on which skills exist. A mismatch means either a skill
was added without syncing, or the router wasn't updated after a rename/deletion.

```ts
function validateRouterConsistency(skillNames: string[], errors: SkillValidationIssue[]): Promise<void>
```

#### Parameters

- `skillNames`
- `errors`

#### Returns

Resolves once all three sources have been compared; findings are pushed onto `errors`.

---

### `validateSubdirectoryContents`

```ts
import { validateSubdirectoryContents } from 'hr-skills-build/server'
```

Validate that optional subdirectories (content, prompts, examples), if present, are non-empty.

```ts
function validateSubdirectoryContents(skillName: string, skillDir: string, errors: SkillValidationIssue[]): Promise<void>
```

#### Parameters

- `skillName`
- `skillDir`
- `errors`

#### Returns

Resolves once every subdirectory has been checked; findings are pushed onto `errors`.

---

## hr-skills-build — client

Browser-safe planner, runtime, search, and shared APIs.

### `analyzeIntent`

```ts
import { analyzeIntent } from 'hr-skills-build/client'
```

Extract capabilities and key phrases from user intent.

Uses simple heuristics to identify what the user is asking for:
- Split by commas and "and"
- Recognize patterns like "create", "write", "develop", "design", etc.
- Normalize to lowercase

This is intentionally simple and deterministic — not powered by ML.
Future extensions could replace this with semantic analysis if needed.

```ts
function analyzeIntent(intent: string): string[]
```

#### Parameters

- `intent`

#### Returns

Extracted capability phrases, normalized to lowercase.

---

### `generateExecutionPlan`

```ts
import { generateExecutionPlan } from 'hr-skills-build/client'
```

Generate a complete execution plan for user intent using the Skill Registry.

Pure function — no side effects, deterministic output for a given input
and registry state.

```ts
function generateExecutionPlan(intent: string, registry: Registry): ExecutionPlan
```

#### Parameters

- `intent`
- `registry`

#### Returns

The generated plan, including matched capabilities and ordered steps.

---

### `createRuntimeContext`

```ts
import { createRuntimeContext } from 'hr-skills-build/client'
```

Create a fresh, empty runtime context for the given plan intent.

```ts
function createRuntimeContext(intent: string): RuntimeContext
```

#### Parameters

- `intent`

#### Returns

A new `RuntimeContext` instance with no recorded outputs.

---

### `RuntimeErrorCode`

```ts
import { RuntimeErrorCode } from 'hr-skills-build/client'
```

Machine-readable codes for runtime failures.

- `STEP_EXECUTION_FAILED` — the step executor threw after exhausting retries.
- `STEP_DEPENDENCY_FAILED` — a required upstream step failed.
- `STEP_DEPENDENCY_SKIPPED` — a required upstream step was skipped.

```ts
type RuntimeErrorCode = | 'STEP_EXECUTION_FAILED'
    | 'STEP_DEPENDENCY_FAILED'
    | 'STEP_DEPENDENCY_SKIPPED'
```

---

### `RuntimeError`

```ts
import { RuntimeError } from 'hr-skills-build/client'
```

Structured error produced by the Workflow Runtime when a step fails.

Extends the native `Error` class with `code`, `skillId`, and `attempt`
fields so that error handlers can branch on failure type without string
parsing, and so that traces capture enough context to reconstruct what
went wrong without needing to re-run the workflow.

```ts
const RuntimeError: RuntimeError
```

---

### `describeCause`

```ts
import { describeCause } from 'hr-skills-build/client'
```

Normalize an unknown thrown value (from a step executor) into a
human-readable string, without assuming it is an `Error` instance.

Resolution order:
 1. `Error` instance → `error.message`
 2. String primitive → returned as-is
 3. Any serializable value → `JSON.stringify`
 4. Anything else → `String(cause)`

```ts
function describeCause(cause: unknown): string
```

#### Parameters

- `cause`

#### Returns

A human-readable string describing the cause.

---

### `EventDispatcher`

```ts
import { EventDispatcher } from 'hr-skills-build/client'
```

Records runtime events in emission order and assigns each a logical-clock `order`.

```ts
const EventDispatcher: EventDispatcher
```

---

### `noRetryPolicy`

```ts
import { noRetryPolicy } from 'hr-skills-build/client'
```

Create a retry policy that never retries — the step fails immediately
on the first error.

This is the default policy used by `WorkflowExecutor` when no
`retryPolicy` option is provided.

```ts
function noRetryPolicy(): RetryPolicy
```

#### Returns

A RetryPolicy with `maxRetries: 0`.

---

### `fixedRetryPolicy`

```ts
import { fixedRetryPolicy } from 'hr-skills-build/client'
```

Create a retry policy that retries a fixed number of times with a
constant logical delay between each attempt.

```ts
function fixedRetryPolicy(options: { maxRetries: number; delayMs?: number; }): RetryPolicy
```

#### Parameters

- `options`

#### Returns

A RetryPolicy with a fixed delay for all attempts.

---

### `exponentialRetryPolicy`

```ts
import { exponentialRetryPolicy } from 'hr-skills-build/client'
```

Create a retry policy that uses exponential backoff:
`delay = baseDelayMs \* 2^(attempt - 1)`, capped at `maxDelayMs`.

Example with `baseDelayMs: 100`: attempt 1 → 100 ms, attempt 2 → 200 ms,
attempt 3 → 400 ms, and so on.

```ts
function exponentialRetryPolicy(options: { maxRetries: number; baseDelayMs?: number; maxDelayMs?: number; }): RetryPolicy
```

#### Parameters

- `options`

#### Returns

A RetryPolicy with exponential backoff delays.

---

### `RuntimeStateTracker`

```ts
import { RuntimeStateTracker } from 'hr-skills-build/client'
```

Tracks which lifecycle bucket (`pending`/`running`/`completed`/`failed`/`skipped`) each skill ID is currently in.

```ts
const RuntimeStateTracker: RuntimeStateTracker
```

---

### `TraceCollector`

```ts
import { TraceCollector } from 'hr-skills-build/client'
```

Builds a replayable `TraceEntry[]` — one entry per runtime event, each with a state snapshot.

```ts
const TraceCollector: TraceCollector
```

---

### `WorkflowExecutor`

```ts
import { WorkflowExecutor } from 'hr-skills-build/client'
```

Executes a single validated `ExecutionPlan` from start to finish.

One `WorkflowExecutor` instance corresponds to one workflow run — it holds
no state that outlives a single `run()` call, so a fresh instance (or the
`executeWorkflow` convenience function) should be used for every plan.

```ts
const WorkflowExecutor: WorkflowExecutor
```

---

### `executeWorkflow`

```ts
import { executeWorkflow } from 'hr-skills-build/client'
```

Runs an ExecutionPlan step by step, in dependency order, calling
`executeStep` for each one. On a step failure, downstream steps that
depend on it (directly or transitively) are marked `skipped` rather than run.

```ts
function executeWorkflow(plan: ExecutionPlan, executeStep: StepExecutorFn, options?: RuntimeOptions | undefined): Promise<WorkflowResult>
```

#### Parameters

- `plan`
- `executeStep`
- `options` (optional)

#### Returns

The overall workflow status plus a per-step result list.

---

### `UnknownSkillError`

```ts
import { UnknownSkillError } from 'hr-skills-build/client'
```

Thrown when a recommendation is requested for a skill ID that does not
exist in the given registry.

```ts
const UnknownSkillError: UnknownSkillError
```

---

### `getRecommendations`

```ts
import { getRecommendations } from 'hr-skills-build/client'
```

Get the top related skills for a given skill ID.

Ranking rule: preserves the order already computed for
`RegistryEntry.relatedSkills` — same-domain skills ranked by shared-tag
overlap via `rankRelatedSkills()`, then (when a relevance signal table was
available at registry-build time, which is the default `bun run registry`
path) re-ranked by `reRankRelatedSkills()` to blend in observed
co-selection evidence — see registry.ts. This function does not alter
that order itself; it only looks up, caps, and formats it.

Deterministic: for a fixed registry and skill ID, the same input always
produces the same output, in the same order.

Dangling references (a related ID no longer present in the registry) are
silently skipped rather than throwing, so a stale entry never breaks the
whole result — `bun run validate` is the place that catches dangling
`relatedSkills` references as a registry-consistency error.

```ts
function getRecommendations(skillId: string, registry: Registry, limit?: number): RecommendationResult
```

#### Parameters

- `skillId`
- `registry`
- `limit` (optional)

#### Returns

Ranked related skills for `skillId`.

#### Throws

{UnknownSkillError} If `skillId` is not present in `registry`.

---

### `RelevanceSignal`

```ts
import { RelevanceSignal } from 'hr-skills-build/client'
```

A normalised relevance weight for a single (source → target) skill pair,
derived from co-selection evidence across one or more evaluation datasets.

All three numeric fields are 0.0–1.0 ratios computed from integer counts —
they are deterministic given the same input fixtures.

```ts
interface RelevanceSignal {
    /** The skill whose `relatedSkills` list this signal influences. */
    sourceSkill: string;
    /** The skill that co-appears with `sourceSkill`. */
    targetSkill: string;
    /**
     * Fraction of all plans that contained `sourceSkill` in which `targetSkill`
     * also appeared.  0.0 = never co-selected; 1.0 = always co-selected.
     */
    coSelectionRate: number;
    /** Raw count of plans containing both skills. */
    coSelectionCount: number;
    /** Total plans containing `sourceSkill` (the denominator for coSelectionRate). */
    observedCount: number;
}
```

---

### `RelevanceSignalTable`

```ts
import { RelevanceSignalTable } from 'hr-skills-build/client'
```

The committed, versioned artifact written to `registry/relevance-signals.json`.

Consumed by `buildRegistry()` to optionally augment the static
tag-overlap `relatedSkills` ranking with observed co-selection evidence.

```ts
interface RelevanceSignalTable {
    /**
     * Schema version — increment for breaking shape changes (field rename,
     * type change).  Additive optional fields do not require a bump.
     */
    schemaVersion: number;
    /**
     * ISO date (YYYY-MM-DD) the table was generated on.  Informational only —
     * it does not affect determinism of the weight lookup.
     */
    generatedAt: string;
    /**
     * Names of the golden fixture datasets that contributed observations.
     * Stored for auditability; does not affect signal values.
     */
    sourceDatasets: string[];
    /** Total number of planning-scenario outcomes observed across all datasets. */
    totalObservations: number;
    /** All (source, target) relevance signals, sorted by sourceSkill then targetSkill. */
    signals: RelevanceSignal[];
}
```

---

### `extractCoSelectionCounts`

```ts
import { extractCoSelectionCounts } from 'hr-skills-build/client'
```

Extract all co-selection observations from a set of golden fixtures.

Each fixture result whose `skillIds` list contains at least two skills
contributes one observation (all unordered pairs from the list).

Returns the raw pair counts: `Map<sourceSkill, Map<targetSkill, count>>`.
Pairs are stored bidirectionally (A→B and B→A) so that signal lookup
works for either member of the pair.

Determinism: golden fixtures are processed in the order they are supplied;
callers are expected to sort fixture arrays before passing them in.

```ts
function extractCoSelectionCounts(fixtures: readonly GoldenFixture[]): Map<string, Map<string, number>>
```

#### Parameters

- `fixtures`

#### Returns

Bidirectional pair counts: `Map<sourceSkill, Map<targetSkill, count>>`.

---

### `extractSkillObservationCounts`

```ts
import { extractSkillObservationCounts } from 'hr-skills-build/client'
```

Count the number of times each skill appears across all fixture results.

Determinism: fixture order must be stable (same as `extractCoSelectionCounts`).

```ts
function extractSkillObservationCounts(fixtures: readonly GoldenFixture[]): Map<string, number>
```

#### Parameters

- `fixtures`

#### Returns

Number of times each skill ID appeared, keyed by skill ID.

---

### `computeSignals`

```ts
import { computeSignals } from 'hr-skills-build/client'
```

Build the full list of `RelevanceSignal` entries from raw co-selection and
per-skill observation counts.

Each (source, target) pair where co-selection count > 0 becomes one signal.
`coSelectionRate` = coCount / observedCount for the source skill.

Output is sorted by `sourceSkill` (ascending), then `targetSkill`
(ascending) for a stable, human-readable artifact.

```ts
function computeSignals(coSelectionCounts: ReadonlyMap<string, ReadonlyMap<string, number>>, observationCounts: ReadonlyMap<string, number>): RelevanceSignal[]
```

#### Parameters

- `coSelectionCounts`
- `observationCounts`

#### Returns

Sorted relevance signals, one per (source, target) pair with co-selection evidence.

---

### `buildRelevanceSignalTable`

```ts
import { buildRelevanceSignalTable } from 'hr-skills-build/client'
```

Build a `RelevanceSignalTable` from one or more committed golden fixtures.

This is the top-level pure function called by the CLI generator.  It
performs no filesystem I/O — callers load fixtures and pass them in.

```ts
function buildRelevanceSignalTable(fixtures: readonly GoldenFixture[], generatedAt: string): RelevanceSignalTable
```

#### Parameters

- `fixtures`
- `generatedAt`

#### Returns

The full relevance signal table, ready to write to `registry/relevance-signals.json`.

---

### `indexSignalsBySource`

```ts
import { indexSignalsBySource } from 'hr-skills-build/client'
```

Build a lookup index: `sourceSkill → (targetSkill → coSelectionRate)`.

Used by `registry.ts` to merge observed weights into `relatedSkills`
without re-parsing the full signal list on every skill.

```ts
function indexSignalsBySource(table: RelevanceSignalTable): Map<string, Map<string, number>>
```

#### Parameters

- `table`

#### Returns

Lookup index: `sourceSkill -> (targetSkill -> coSelectionRate)`.

---

### `reRankRelatedSkills`

```ts
import { reRankRelatedSkills } from 'hr-skills-build/client'
```

Re-rank a skill's `relatedSkills` list by blending the static tag-overlap
score with an observed co-selection rate from the signal index.

Blend formula (deterministic, no floating-point non-determinism):
  blendedScore = staticScore \* (1 - OBSERVED_WEIGHT) + observedRate \* OBSERVED_WEIGHT

where `staticScore` is 1.0 for the first item in the static list, decaying
by 1/N for each subsequent position (a simple rank-to-score mapping that
preserves the original ranking's relative order in the absence of observed
evidence).

Ties are broken alphabetically (consistent with the static ranker in
`registry.ts`).

```ts
function reRankRelatedSkills(skillId: string, staticRelated: readonly string[], signalIndex: ReadonlyMap<string, ReadonlyMap<string, number>>, limit?: number): string[]
```

#### Parameters

- `skillId`
- `staticRelated`
- `signalIndex`
- `limit` (optional)

#### Returns

Re-ranked related skill IDs, blending static tag-overlap with observed co-selection.

---

### `RELEVANCE_SIGNAL_SCHEMA_VERSION`

```ts
import { RELEVANCE_SIGNAL_SCHEMA_VERSION } from 'hr-skills-build/client'
```

Schema version for `registry/relevance-signals.json`.
Increment for breaking shape changes only.

```ts
const RELEVANCE_SIGNAL_SCHEMA_VERSION: 1
```

---

### `OBSERVED_WEIGHT`

```ts
import { OBSERVED_WEIGHT } from 'hr-skills-build/client'
```

The fraction of the blended `relatedSkills` score that comes from observed
co-selection evidence.  The remaining `1 - OBSERVED_WEIGHT` fraction comes
from the static tag-overlap ranking.

Set conservatively so that sparse evidence (few evaluation cases) does not
dominate the recommendation graph.  Increase once the evaluation dataset
grows and observed counts become statistically meaningful.

```ts
const OBSERVED_WEIGHT: 0.3
```

---

### `FIELD_WEIGHTS`

```ts
import { FIELD_WEIGHTS } from 'hr-skills-build/client'
```

Base relevance weight per field, applied before match-strength scaling.

```ts
const FIELD_WEIGHTS: Record<SearchableField, number>
```

---

### `ALL_SEARCHABLE_FIELDS`

```ts
import { ALL_SEARCHABLE_FIELDS } from 'hr-skills-build/client'
```

All searchable fields, in the fixed order used when `fields` is omitted.

```ts
const ALL_SEARCHABLE_FIELDS: SearchableField[]
```

---

### `InvalidSearchQueryError`

```ts
import { InvalidSearchQueryError } from 'hr-skills-build/client'
```

Thrown for a structurally invalid query — e.g. empty search text with no
domain filter to fall back on, or a non-positive `limit`. This is a
client-input error, not a "no results" case (which returns an empty
`results` array instead).

```ts
const InvalidSearchQueryError: InvalidSearchQueryError
```

---

### `searchSkills`

```ts
import { searchSkills } from 'hr-skills-build/client'
```

Search the generated Skill Registry by structured metadata.

Ranking rule (see docs/engineering/search.md for the full explanation):
 1. Each field match contributes `weight \* similarity` to the skill's
    score (`similarity` is always 1 for exact matches).
 2. A skill matching on more than one distinct field gets a small flat
    bonus per extra field (capped), since agreement across fields is a
    stronger discoverability signal than one big match.
 3. A skill with at least one \*exact\* match gets a flat confidence bonus,
    so exact matches reliably outrank fuzzy-only matches.
 4. Ties are broken by number of distinct fields matched (more wins),
    then by skill ID ascending — so identical registry content always
    produces identical ordering, run after run.

```ts
function searchSkills(query: SkillSearchQuery, registry: Registry): SkillSearchResponse
```

#### Parameters

- `query`
- `registry`

#### Returns

Ranked, deduplicated skill matches with per-field score detail.

#### Throws

{InvalidSearchQueryError} If the query has no text and no domain
filter, or if `limit` is not a positive integer.

---

### `GITHUB_BLOB_BASE_URL`

```ts
import { GITHUB_BLOB_BASE_URL } from 'hr-skills-build/client'
```

Base URL for linking to a file in this repo on GitHub, e.g. for use in
generated Markdown that's posted somewhere with no "current file" context
(a PR comment, a Slack message) where a relative link like `../docs/x.md`
cannot resolve. Append a repo-root-relative path, e.g.
`` `${GITHUB_BLOB_BASE_URL}/docs/engineering/quality-scoring.md` ``.

```ts
const GITHUB_BLOB_BASE_URL: "https://github.com/tuanductran/hr-skills/blob/main"
```

---

### `TASK_ITEM_REGEX`

```ts
import { TASK_ITEM_REGEX } from 'hr-skills-build/client'
```

Matches a markdown task-list item line, e.g. `- some task`.

```ts
const TASK_ITEM_REGEX: RegExp
```

---

### `HR_SKILL_PREFIX`

```ts
import { HR_SKILL_PREFIX } from 'hr-skills-build/client'
```

The directory-name prefix shared by all HR skill folders, e.g. `hr-`.

```ts
const HR_SKILL_PREFIX: "hr-"
```

---

### `KEY_PROMPTS_REGEX`

```ts
import { KEY_PROMPTS_REGEX } from 'hr-skills-build/client'
```

Captures the body of a `## Key prompts` section (including sub-headings)
up to the next `##` section, a `---` divider, or end of file.
Capture group 1 contains the raw block text.

```ts
const KEY_PROMPTS_REGEX: RegExp
```

---

### `QUOTED_PROMPT_REGEX`

```ts
import { QUOTED_PROMPT_REGEX } from 'hr-skills-build/client'
```

Matches a numbered or bulleted quoted prompt line inside a Key prompts block,
e.g. `1. "Create a job description for..."` or `- "Draft an offer letter..."`.
Capture group 1 contains the quoted prompt text (without surrounding quotes).

```ts
const QUOTED_PROMPT_REGEX: RegExp
```

---

### `USE_WHEN_REGEX`

```ts
import { USE_WHEN_REGEX } from 'hr-skills-build/client'
```

Case-insensitive match for the phrase `Use when` inside a skill description,
used to split a description into its "coverage" and "trigger" clauses.

```ts
const USE_WHEN_REGEX: RegExp
```

---

### `PERIOD_REGEX`

```ts
import { PERIOD_REGEX } from 'hr-skills-build/client'
```

Matches a trailing period at the end of a string — used to strip it before appending a new one.

```ts
const PERIOD_REGEX: RegExp
```

---

### `FRONTMATTER_REGEX`

```ts
import { FRONTMATTER_REGEX } from 'hr-skills-build/client'
```

Captures YAML frontmatter delimited by `---` at the start of a markdown file.
Capture group 1 contains the raw YAML text between the delimiters.

```ts
const FRONTMATTER_REGEX: RegExp
```

---

### `TASKS_REGEX`

```ts
import { TASKS_REGEX } from 'hr-skills-build/client'
```

Captures the body of a `## Supported tasks` section up to the next `##` heading
or end of file. Capture group 1 contains the raw block text.

```ts
const TASKS_REGEX: RegExp
```

---

### `REQUIRED_SECTIONS`

```ts
import { REQUIRED_SECTIONS } from 'hr-skills-build/client'
```

The three markdown section headings that every skill SKILL.md must contain.
Validated by `validateRequiredSections` in validate.ts.

```ts
const REQUIRED_SECTIONS: string[]
```

---

### `MIN_DESCRIPTION_LENGTH`

```ts
import { MIN_DESCRIPTION_LENGTH } from 'hr-skills-build/client'
```

Minimum character length for a skill's frontmatter `description` field.

```ts
const MIN_DESCRIPTION_LENGTH: 50
```

---

### `MIN_CONTENT_LENGTH`

```ts
import { MIN_CONTENT_LENGTH } from 'hr-skills-build/client'
```

Minimum character length for the full SKILL.md content body.

```ts
const MIN_CONTENT_LENGTH: 1000
```

---

### `TIPS_REGEX`

```ts
import { TIPS_REGEX } from 'hr-skills-build/client'
```

Captures the body of a `## Tips` section up to the next `##` heading or end of file.
Capture group 1 contains the raw block text.

```ts
const TIPS_REGEX: RegExp
```

---

### `SKILL_LINK_REGEX`

```ts
import { SKILL_LINK_REGEX } from 'hr-skills-build/client'
```

Matches markdown links that reference another skill, e.g.
`[hr-recruiting](skills/hr-recruiting)`.
Capture group 1 contains the skill ID (`hr-<slug>`).

Shared by router consistency validation and registry dependency extraction
(`CATEGORY_META.preamble` in classifier.ts) so both stay in sync.

```ts
const SKILL_LINK_REGEX: RegExp
```

---

### `REGISTRY_SCHEMA_VERSION`

```ts
import { REGISTRY_SCHEMA_VERSION } from 'hr-skills-build/client'
```

Schema version for `registry/skills.json`.
Increment this when the shape of RegistryEntry  changes in a breaking way.

```ts
const REGISTRY_SCHEMA_VERSION: 1
```

---

### `extractMatch`

```ts
import { extractMatch } from 'hr-skills-build/client'
```

Extract and trim the first capture group from a regex match against `content`.

Duplicated (not imported) from `helpers.ts` on purpose: this file is part
of the browser-safe `client` surface and must not import `helpers.ts`,
which pulls in `node:fs/promises` and `node:path`.

```ts
function extractMatch(regex: RegExp, content: string): string | null
```

#### Parameters

- `regex`
- `content`

#### Returns

The trimmed contents of capture group 1, or `null` if the regex did not match.

---

### `parseSkillFrontmatter`

```ts
import { parseSkillFrontmatter } from 'hr-skills-build/client'
```

Parse and validate a markdown document's YAML frontmatter against
SkillFrontmatterSchema.

Never throws: missing frontmatter, invalid YAML, and schema validation
failures all resolve to `{}` rather than raising an error, so callers can
treat every field as optional.

```ts
function parseSkillFrontmatter(content: string): { name?: string | undefined; description?: string | undefined; metadata?: { author?: string | undefined; version?: string | undefined; } | undefined; }
```

#### Parameters

- `content`

#### Returns

Parsed frontmatter fields, or `{}` if none/invalid.

---

### `MarketplaceJsonSchema`

```ts
import { MarketplaceJsonSchema } from 'hr-skills-build/client'
```

Schema for `.claude-plugin/marketplace.json`.

```ts
const MarketplaceJsonSchema: StrictObjectSchema<{ readonly $schema: LiteralSchema<"https://json.schemastore.org/claude-code-marketplace.json", undefined>; readonly name: SchemaWithPipe<readonly [SchemaWithPipe<readonly [StringSchema<undefined>, TrimAction]>, MinLengthAction<...>]>; readonly description: SchemaWithPipe<...>; readonly owner: Stri...
```

---

### `SkillFrontmatterSchema`

```ts
import { SkillFrontmatterSchema } from 'hr-skills-build/client'
```

Schema for `SKILL.md` frontmatter.

```ts
const SkillFrontmatterSchema: StrictObjectSchema<{ readonly name: OptionalSchema<SchemaWithPipe<readonly [SchemaWithPipe<readonly [StringSchema<undefined>, TrimAction]>, MinLengthAction<string, 1, undefined>]>, undefined>; readonly description: OptionalSchema<...>; readonly metadata: OptionalSchema<...>; }, undefined>
```

---

### `SkillFrontmatter`

```ts
import { SkillFrontmatter } from 'hr-skills-build/client'
```

TypeScript type inferred from SkillFrontmatterSchema.

```ts
type SkillFrontmatter = v.InferOutput<typeof SkillFrontmatterSchema>
```

---

### `RegistrySchema`

```ts
import { RegistrySchema } from 'hr-skills-build/client'
```

Schema for `registry/skills.json`.

```ts
const RegistrySchema: StrictObjectSchema<{ readonly schemaVersion: SchemaWithPipe<readonly [NumberSchema<undefined>, MinValueAction<number, 1, undefined>]>; readonly generatedAt: SchemaWithPipe<...>; readonly skillCount: SchemaWithPipe<...>; readonly skills: ArraySchema<...>; }, undefined>
```

---

### `SkillCategory`

```ts
import { SkillCategory } from 'hr-skills-build/client'
```

The routing-table section a skill belongs to in the generated root
`SKILL.md`. Assigned by `registry/classifier.ts#classifySkill()`.

Lives here (not in `classifier.ts`) because it's a foundational domain
type referenced by `SkillMetadata`/`Registry` below, `search/`, and
`build/router.ts` — `classifier.ts` imports it back from here rather than
the other way around, so `shared/` stays the dependency-free base layer.

```ts
type SkillCategory = | 'talent-acquisition'
    | 'onboarding-offboarding'
    | 'performance-talent'
    | 'compensation-rewards'
    | 'learning-development'
    | 'org-design-change'
    | 'workforce-analytics'
    | 'hr-technology-ai'
    | 'compliance-risk'
    | 'culture-experience'
    | 'global-project'
    | 'technical-hiring'
    | 'uncategorized'
```

---

### `Tier`

```ts
import { Tier } from 'hr-skills-build/client'
```

How complete a skill's directory is: `full` has content+prompts+examples, `partial` has some, `bare` has only SKILL.md.

```ts
type Tier = 'full' | 'partial' | 'bare'
```

---

### `SkillRow`

```ts
import { SkillRow } from 'hr-skills-build/client'
```

One row of the skill matrix table generated by `generate-skill-matrix.ts`.

```ts
interface SkillRow {
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
```

---

### `SkillDirectoryOptions`

```ts
import { SkillDirectoryOptions } from 'hr-skills-build/client'
```

Options controlling how a skill's directory listing is rendered.

```ts
interface SkillDirectoryOptions {
    readonly prefix?: string;
    readonly sort?: boolean;
}
```

---

### `SkillMeta`

```ts
import { SkillMeta } from 'hr-skills-build/client'
```

Frontmatter and prompt metadata read from a skill's `SKILL.md`.

```ts
interface SkillMeta {
    name: string;
    description: string;
    coverage: string;
    scopeSentence: string;
    triggerPhrases: string[];
    supportedTasks: string[];
}
```

---

### `SkillValidationIssue`

```ts
import { SkillValidationIssue } from 'hr-skills-build/client'
```

A single validation issue found in a skill.

Named `SkillValidationIssue` (not `ValidationError`) to avoid a naming
collision with the `ValidationError` class exported by `hr-skills-ref`, which
has a different shape and different semantics. Both names exist in the same
monorepo — keeping them distinct prevents IDE auto-import confusion.

```ts
interface SkillValidationIssue {
    skill: string;
    message: string;
}
```

---

### `RegistryEntry`

```ts
import { RegistryEntry } from 'hr-skills-build/client'
```

A single skill entry in the generated Skill Registry.

This is the canonical, machine-readable record for one skill — the schema
that `registry/skills.json` conforms to. Runtime agents should read this
instead of parsing SKILL.md prose.

```ts
interface RegistryEntry {
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
     * Other skill IDs in the same domain, ranked by shared-tag overlap. When
     * `bun run registry` (the default path) finds a committed relevance
     * signal table, this static ranking is then blended with observed
     * co-selection rates via `reRankRelatedSkills` — which can also surface
     * cross-domain pairs the tag overlap alone missed. Still fully
     * deterministic (no randomness), just not purely tag-based in practice.
     */
    relatedSkills: string[];
}
```

---

### `SkillRecommendation`

```ts
import { SkillRecommendation } from 'hr-skills-build/client'
```

A single "you might also need" suggestion, derived from a `RegistryEntry`'s
`relatedSkills` list. `rank` is the suggestion's 1-based position within
that list, preserved as-is — recommendations never re-sort or re-score.

```ts
interface SkillRecommendation {
    /** Recommended skill's ID, e.g. "hr-onboarding". */
    id: string;
    /** Recommended skill's display name. */
    name: string;
    /** Recommended skill's one-sentence description. */
    description: string;
    /** Recommended skill's routing domain. */
    domain: SkillCategory;
    /** 1-based position in the source skill's `relatedSkills` order. */
    rank: number;
}
```

---

### `RecommendationResult`

```ts
import { RecommendationResult } from 'hr-skills-build/client'
```

The recommendation output for one source skill: its ID plus the ranked
list of related skills, capped at the requested limit.

```ts
interface RecommendationResult {
    /** The skill the recommendations are for. */
    skillId: string;
    /** Related skills, ordered by rank (best match first). */
    recommendations: SkillRecommendation[];
}
```

---

### `SearchableField`

```ts
import { SearchableField } from 'hr-skills-build/client'
```

Registry fields that `searchSkills()` can match against. Kept in sync
with the field list in the Phase 6.1 issue: capabilities, aliases, tags,
domain, trigger phrases.

```ts
type SearchableField = | 'capabilities'
    | 'aliases'
    | 'tags'
    | 'domain'
    | 'triggerPhrases'
```

---

### `MatchType`

```ts
import { MatchType } from 'hr-skills-build/client'
```

How a single field value matched the query text.

```ts
type MatchType = 'exact' | 'fuzzy'
```

---

### `SkillFieldMatch`

```ts
import { SkillFieldMatch } from 'hr-skills-build/client'
```

One matched field value for one skill, with enough detail to explain
why\* the skill matched — the raw ingredients of the result's score.

```ts
interface SkillFieldMatch {
    /** Which registry field matched, e.g. "capabilities". */
    field: SearchableField;
    /** The exact field value that matched, e.g. "employee onboarding". */
    value: string;
    /** Whether this was an exact or fuzzy match. */
    matchType: MatchType;
    /** Match strength, 0–1. Always 1 for exact matches. */
    similarity: number;
    /** The field's base weight (see `FIELD_WEIGHTS` in search.ts). */
    weight: number;
    /** `weight * similarity`, before any cross-field bonuses. */
    contribution: number;
}
```

---

### `SkillSearchResult`

```ts
import { SkillSearchResult } from 'hr-skills-build/client'
```

One skill's search result: its identity, final score, every field match
that contributed to that score, and a human-readable explanation.

```ts
interface SkillSearchResult {
    /** Matched skill's ID, e.g. "hr-onboarding". */
    skillId: string;
    /** Matched skill's display name. */
    name: string;
    /** Matched skill's one-sentence description. */
    description: string;
    /** Matched skill's routing domain. */
    domain: SkillCategory;
    /** Final composite relevance score (see search.ts for the formula). */
    score: number;
    /** Every field match that contributed to `score`, most relevant first. */
    matches: SkillFieldMatch[];
    /** Deterministic, human-readable summary of why this skill matched. */
    explanation: string;
}
```

---

### `SkillSearchQuery`

```ts
import { SkillSearchQuery } from 'hr-skills-build/client'
```

A search query against the generated Skill Registry.

```ts
interface SkillSearchQuery {
    /** Free-text query, matched (exact and/or fuzzy) against `fields`. */
    text: string;
    /** Fields to search. Defaults to all `SearchableField`s. */
    fields?: SearchableField[];
    /** Restrict results to a single domain before scoring. */
    domain?: SkillCategory;
    /** Enable fuzzy matching in addition to exact matching. Defaults to true. */
    fuzzy?: boolean;
    /** Maximum number of results to return. Defaults to 10. */
    limit?: number;
}
```

---

### `SkillSearchResponse`

```ts
import { SkillSearchResponse } from 'hr-skills-build/client'
```

The full output of `searchSkills()`: the query that was run plus its
ranked results.

```ts
interface SkillSearchResponse {
    /** The `text` query that was run, echoed back verbatim. */
    query: string;
    /** Number of results returned (i.e. `results.length`). */
    resultCount: number;
    /** Matching skills, ranked by `score` descending. */
    results: SkillSearchResult[];
}
```

---

### `Registry`

```ts
import { Registry } from 'hr-skills-build/client'
```

The full generated Skill Registry document.

```ts
interface Registry {
    /** Bump when the shape of RegistryEntry changes in a breaking way. */
    schemaVersion: number;
    /** ISO date (YYYY-MM-DD) the registry was generated on. */
    generatedAt: string;
    /** Total number of skills indexed. */
    skillCount: number;
    skills: RegistryEntry[];
}
```

---

### `SelectionReason`

```ts
import { SelectionReason } from 'hr-skills-build/client'
```

Why a skill was included in an execution plan. Read together with
`ExecutionStep.rationale` for a human-readable explanation.

Note the two that are easy to conflate: `'related-skill'` is a \*capability\*
match (the skill's declared capabilities partially/fuzzily overlap the
requested one — see `matchCapabilityAgainstRegistry()` in planner.ts),
while `'recommended-pairing'` comes from the \*registry\* `relatedSkills`
graph (a different skill was already selected, and this one is commonly
used alongside it). Despite the name, `'related-skill'` has nothing to do
with `RegistryEntry.relatedSkills`.

```ts
type SelectionReason = | 'direct-capability-match'
    /**
     * Reserved — not currently assigned anywhere in `planner.ts`. Intended
     * for a future alias/alternate-name match, distinct from a capability
     * match, but no such matcher exists yet.
     */
    | 'alias-match'
    /**
     * Reserved — not currently assigned anywhere in `planner.ts`. Intended
     * for a future "best single skill for this whole domain" selection, but
     * no such matcher exists yet.
     */
    | 'domain-expert'
    /** Pulled in because a selected skill declares it as a dependency. */
    | 'dependency-requirement'
    /** Pulled in via `RegistryEntry.relatedSkills` of an already-selected skill. */
    | 'recommended-pairing'
    /** Partial/fuzzy capability-overlap match (see the note above). */
    | 'related-skill'
```

---

### `ExecutionStep`

```ts
import { ExecutionStep } from 'hr-skills-build/client'
```

One skill invocation within an ExecutionPlan.

```ts
interface ExecutionStep {
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
```

---

### `CapabilityMatch`

```ts
import { CapabilityMatch } from 'hr-skills-build/client'
```

How one requested capability from a user's intent matched against the registry.

```ts
interface CapabilityMatch {
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
```

---

### `ExecutionPlan`

```ts
import { ExecutionPlan } from 'hr-skills-build/client'
```

Output of generateExecutionPlan  — an ordered set of skills to run for a given intent.

```ts
interface ExecutionPlan {
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
```

---

### `PlanValidationIssue`

```ts
import { PlanValidationIssue } from 'hr-skills-build/client'
```

One problem found by validateExecutionPlan  or suggestPlanImprovements .

```ts
interface PlanValidationIssue {
    /** Machine-readable identifier for this issue type. */
    code: string;
    severity: 'error' | 'warning' | 'info';
    /** Human-readable explanation of the issue. */
    message: string;
    /** Additional structured detail, if any. */
    context?: Record<string, unknown>;
}
```

---

### `PlanValidationResult`

```ts
import { PlanValidationResult } from 'hr-skills-build/client'
```

Result of validating an ExecutionPlan.

```ts
interface PlanValidationResult {
    /** `true` when there are no `error`-severity issues. */
    isValid: boolean;
    issues: PlanValidationIssue[];
}
```

---

### `StepStatus`

```ts
import { StepStatus } from 'hr-skills-build/client'
```

Lifecycle status of a single execution step within the runtime.

`pending` -> `running` -> (`completed` | `failed` | `skipped`)

```ts
type StepStatus = 'pending' | 'running' | 'completed' | 'failed' | 'skipped'
```

---

### `RuntimeStateSnapshot`

```ts
import { RuntimeStateSnapshot } from 'hr-skills-build/client'
```

A snapshot of the runtime's execution state at a point in time.

Skill IDs move between these buckets as execution proceeds. A skill ID
appears in exactly one bucket at any given moment.

```ts
interface RuntimeStateSnapshot {
    pending: string[];
    running: string[];
    completed: string[];
    failed: string[];
    skipped: string[];
}
```

---

### `StepResult`

```ts
import { StepResult } from 'hr-skills-build/client'
```

A step's result after it finishes running (successfully or not).

```ts
interface StepResult {
    skillId: string;
    status: 'completed' | 'failed' | 'skipped';
    /** Output produced by the step, available to later steps via RuntimeContext. */
    output?: unknown;
    /** Populated when status is 'failed'. */
    error?: RuntimeErrorInfo;
    /** Number of attempts made (1 = succeeded/failed on first try). */
    attempts: number;
}
```

---

### `RuntimeErrorInfo`

```ts
import { RuntimeErrorInfo } from 'hr-skills-build/client'
```

Plain, serializable description of a runtime failure — used in traces and
results so failures survive JSON serialization (unlike Error instances).

```ts
interface RuntimeErrorInfo {
    code: string;
    message: string;
    skillId?: string;
    attempt?: number;
    cause?: string;
}
```

---

### `StepExecutorFn`

```ts
import { StepExecutorFn } from 'hr-skills-build/client'
```

A function that performs the actual work for a single execution step.

The Runtime is deliberately agnostic about \*what\* a step does — invoking a
skill, calling a model, running a tool, and so on are all the caller's
responsibility. The Runtime only sequences calls to this function,
threads context between them, and manages state/retries/events/tracing.

Throw (or reject) to signal step failure; the Runtime will apply the
configured RetryPolicy before giving up.

```ts
function StepExecutorFn(step: ExecutionStep, context: RuntimeContext): unknown
```

#### Parameters

- `step`
- `context`

---

### `RuntimeContext`

```ts
import { RuntimeContext } from 'hr-skills-build/client'
```

Explicit, mutable context object threaded through workflow execution.

Each completed step's output is recorded here and made available to every
subsequent step — this is how "context propagation" is implemented, rather
than relying on module-level globals or closures.

```ts
interface RuntimeContext {
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
```

---

### `RetryPolicy`

```ts
import { RetryPolicy } from 'hr-skills-build/client'
```

Deterministic retry policy consulted by the runtime after a step fails.

`delayForAttempt` returns a logical delay in milliseconds; the runtime
never actually sleeps for it (that would break determinism and slow down
tests) — the value is recorded on retry events/traces for callers that
want to honor it in their own step executor or a wrapping scheduler.

```ts
interface RetryPolicy {
    /** Maximum number of retry attempts after the initial try (0 = no retries). */
    readonly maxRetries: number;
    /** Logical delay (ms) to record before retry attempt `attempt` (1-indexed). */
    delayForAttempt(attempt: number): number;
    /** Whether this error should be retried at all. Defaults to "always" when omitted. */
    shouldRetry?(error: unknown, attempt: number): boolean;
}
```

---

### `RuntimeEventType`

```ts
import { RuntimeEventType } from 'hr-skills-build/client'
```

Discriminates the lifecycle events emitted by executeWorkflow  onto its `EventDispatcher`.

```ts
type RuntimeEventType = | 'workflow-started'
    | 'step-started'
    | 'step-retry'
    | 'step-completed'
    | 'step-failed'
    | 'step-skipped'
    | 'workflow-completed'
    | 'workflow-failed'
```

---

### `RuntimeEvent`

```ts
import { RuntimeEvent } from 'hr-skills-build/client'
```

A single runtime event. `order` is a logical clock (a monotonically
increasing integer assigned by the EventDispatcher) rather than a wall
clock timestamp, which keeps execution fully deterministic and makes
traces reproducible in tests.

```ts
interface RuntimeEvent {
    order: number;
    type: RuntimeEventType;
    skillId?: string;
    attempt?: number;
    data?: Record<string, unknown>;
}
```

---

### `TraceEntry`

```ts
import { TraceEntry } from 'hr-skills-build/client'
```

One entry in the execution trace — an event paired with the runtime state
snapshot immediately after that event was applied. Traces are the primary
debugging artifact: replaying them reconstructs exactly what happened and
in what order, without needing wall-clock timestamps.

```ts
interface TraceEntry {
    order: number;
    type: RuntimeEventType;
    skillId?: string;
    attempt?: number;
    state: RuntimeStateSnapshot;
    result?: unknown;
    error?: RuntimeErrorInfo;
}
```

---

### `RuntimeOptions`

```ts
import { RuntimeOptions } from 'hr-skills-build/client'
```

Configuration accepted by `executeWorkflow` / `WorkflowExecutor`.

```ts
interface RuntimeOptions {
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
```

---

### `WorkflowResult`

```ts
import { WorkflowResult } from 'hr-skills-build/client'
```

The final outcome of running an execution plan through the Runtime.

```ts
interface WorkflowResult {
    status: 'completed' | 'failed';
    intent: string;
    outputs: Record<string, unknown>;
    steps: StepResult[];
    events: RuntimeEvent[];
    trace: TraceEntry[];
    state: RuntimeStateSnapshot;
}
```

---

### `EvaluationCase`

```ts
import { EvaluationCase } from 'hr-skills-build/client'
```

A single evaluation dataset entry — a representative planning scenario the
Planner and Runtime are expected to handle correctly.

Datasets store the \*input\* (`intent`) only. The \*expected output\* is a
golden fixture (see `GoldenCaseResult`), generated once from an actual run
against the real Skill Registry and committed to `eval/golden/`. This
keeps the dataset human-authored and small, while expected outputs stay
exactly in sync with what the Planner and Runtime actually produce —
avoiding hand-guessed expectations that drift from reality.

```ts
interface EvaluationCase {
    /** Stable identifier, e.g. "recruiting-interview-questions". */
    id: string;
    /** Short human-readable description of the scenario. */
    description: string;
    /** The user intent passed to `generateExecutionPlan`. */
    intent: string;
    /** Free-form category tag for grouping in reports (e.g. "recruiting"). */
    category: string;
}
```

---

### `EvaluationDataset`

```ts
import { EvaluationDataset } from 'hr-skills-build/client'
```

A dataset is a named, ordered collection of evaluation cases.

```ts
interface EvaluationDataset {
    name: string;
    description: string;
    cases: EvaluationCase[];
}
```

---

### `GoldenCaseResult`

```ts
import { GoldenCaseResult } from 'hr-skills-build/client'
```

The deterministic, golden-fixture shape of a single case's expected
outcome — captures only the fields that are meaningful to compare across
runs (skill selection, ordering, capability coverage, validation, and
workflow outcome), not the full `ExecutionPlan`/`WorkflowResult` objects,
which carry incidental detail (rationale strings, timestamps) that would
make the fixture noisy and prone to false-positive regressions.

```ts
interface GoldenCaseResult {
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
```

---

### `GoldenFixture`

```ts
import { GoldenFixture } from 'hr-skills-build/client'
```

A named collection of golden case results for one dataset.

```ts
interface GoldenFixture {
    dataset: string;
    /** ISO date the fixture was generated/last updated on. */
    generatedAt: string;
    results: GoldenCaseResult[];
}
```

---

### `EvaluationCaseResult`

```ts
import { EvaluationCaseResult } from 'hr-skills-build/client'
```

The actual outcome of running one evaluation case in the current code.

```ts
interface EvaluationCaseResult {
    caseId: string;
    category: string;
    intent: string;
    actual: GoldenCaseResult;
    /** Present only if a golden fixture entry exists for this case. */
    golden?: GoldenCaseResult;
    /** Fields that differ between `actual` and `golden` (empty if none, or no golden entry). */
    regressions: string[];
}
```

---

### `QualityMetrics`

```ts
import { QualityMetrics } from 'hr-skills-build/client'
```

Deterministic quality metrics aggregated across an evaluation run.
Each score is a 0.0-1.0 ratio; `NaN`-free by construction (denominators of
0 map to a score of 1 — vacuously satisfied, nothing to fail).

```ts
interface QualityMetrics {
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
```

---

### `EvaluationReport`

```ts
import { EvaluationReport } from 'hr-skills-build/client'
```

The full report produced by one benchmark run.

```ts
interface EvaluationReport {
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
```

---

## hr-skills-ref — server

Server-side filesystem and skill-loading APIs.

### `ROOT_DIR`

```ts
import { ROOT_DIR } from 'hr-skills-ref/server'
```

Absolute path to the repository root.

```ts
const ROOT_DIR: string
```

---

### `SKILLS_DIR`

```ts
import { SKILLS_DIR } from 'hr-skills-ref/server'
```

Absolute path to the `skills/` directory at the repository root.

```ts
const SKILLS_DIR: string
```

---

### `ALLOWED_TOOLS_KEY`

```ts
import { ALLOWED_TOOLS_KEY } from 'hr-skills-ref/server'
```

The YAML frontmatter key used to specify which Claude tools a skill is allowed to invoke.
Maps to the `allowedTools` property in SkillProperties .

```ts
const ALLOWED_TOOLS_KEY: "allowed-tools"
```

---

### `FRONTMATTER_DELIMITER`

```ts
import { FRONTMATTER_DELIMITER } from 'hr-skills-ref/server'
```

The delimiter string that opens and closes a YAML frontmatter block in `SKILL.md`.

```ts
const FRONTMATTER_DELIMITER: "---"
```

---

### `SKILL_MD_FILENAMES`

```ts
import { SKILL_MD_FILENAMES } from 'hr-skills-ref/server'
```

Accepted filenames for a skill's primary markdown file, in priority order.
`"SKILL.md"` is the canonical name; `"skill.md"` is accepted as a fallback
for case-insensitive filesystems.

```ts
const SKILL_MD_FILENAMES: readonly ["SKILL.md", "skill.md"]
```

---

### `MAX_SKILL_NAME_LENGTH`

```ts
import { MAX_SKILL_NAME_LENGTH } from 'hr-skills-ref/server'
```

Maximum allowed character length for the `name` frontmatter field.

```ts
const MAX_SKILL_NAME_LENGTH: 64
```

---

### `MAX_DESCRIPTION_LENGTH`

```ts
import { MAX_DESCRIPTION_LENGTH } from 'hr-skills-ref/server'
```

Maximum allowed character length for the `description` frontmatter field.

```ts
const MAX_DESCRIPTION_LENGTH: 1024
```

---

### `MAX_COMPATIBILITY_LENGTH`

```ts
import { MAX_COMPATIBILITY_LENGTH } from 'hr-skills-ref/server'
```

Maximum allowed character length for the `compatibility` frontmatter field.

```ts
const MAX_COMPATIBILITY_LENGTH: 500
```

---

### `SKILL_NAME_REGEX`

```ts
import { SKILL_NAME_REGEX } from 'hr-skills-ref/server'
```

Valid skill name pattern: lowercase letters, digits, and hyphens only.
Must be tested against the normalized (trimmed, lowercased) name.

```ts
const SKILL_NAME_REGEX: RegExp
```

---

### `ALLOWED_FRONTMATTER_FIELDS`

```ts
import { ALLOWED_FRONTMATTER_FIELDS } from 'hr-skills-ref/server'
```

The set of YAML frontmatter field names recognized by the skill schema.
Any key not in this set is treated as an unexpected field during validation.

```ts
const ALLOWED_FRONTMATTER_FIELDS: Set<string>
```

---

### `XML_ESCAPES`

```ts
import { XML_ESCAPES } from 'hr-skills-ref/server'
```

Lookup map of XML special characters to their escaped entity equivalents.
Used by `escapeXml` in `helpers.ts` when building `<skill>` XML blocks.

```ts
const XML_ESCAPES: Map<string, string>
```

---

### `isPlainObject`

```ts
import { isPlainObject } from 'hr-skills-ref/server'
```

Check whether a value is a plain object (i.e. created via `{}` or `Object.create(null)`).
Returns `false` for arrays, class instances, `null`, and primitives.

```ts
function isPlainObject(value: unknown): boolean
```

#### Parameters

- `value`

#### Returns

`true` if `value` is a plain object, `false` otherwise.

---

### `toStringOrUndefined`

```ts
import { toStringOrUndefined } from 'hr-skills-ref/server'
```

Convert a nullable/undefined value to a trimmed string, or `undefined` if
the result would be empty.

```ts
function toStringOrUndefined(value: unknown): string | undefined
```

#### Parameters

- `value`

#### Returns

A non-empty trimmed string, or `undefined` if `value` is `null`,
`undefined`, or whitespace-only.

---

### `createSkillBlock`

```ts
import { createSkillBlock } from 'hr-skills-ref/server'
```

Build an XML `<skill>` block for the given skill directory.

The block includes the skill's `<name>`, `<description>`, and the absolute
`<location>` path to its `SKILL.md`. All values are XML-escaped.

```ts
function createSkillBlock(skillDir: string): string
```

#### Parameters

- `skillDir`

#### Returns

A multi-line XML string representing the skill.

---

### `discoverSkillNames`

```ts
import { discoverSkillNames } from 'hr-skills-ref/server'
```

Discover all HR skill directory names in the `skills/` folder, sorted
lexicographically. Only directories whose names begin with `"hr-"` are returned.

This is hr-skills-ref's own copy of the same "discover hr-\* directories"
logic that also exists as `hr-skills-build`'s
`shared/helpers.ts#discoverSkills()` and `registry/discovery.ts#getHrSkills()`.
Kept separate deliberately — hr-skills-ref must not depend on
hr-skills-build (it's the lower-level package the other one builds on)
— not an accidental duplication to merge.

```ts
function discoverSkillNames(): string[]
```

#### Returns

A sorted array of skill directory names (not full paths).

---

### `makeTempSkill`

```ts
import { makeTempSkill } from 'hr-skills-ref/server'
```

Create a temporary directory containing a single `SKILL.md` file with the
given content. The directory is created in the OS temp directory.

Intended for use in tests that need a real filesystem path to pass to
skill-loading functions without polluting the repository.

```ts
function makeTempSkill(content: string): string
```

#### Parameters

- `content`

#### Returns

The absolute path to the newly created temporary directory.

---

### `sanitizeYamlValue`

```ts
import { sanitizeYamlValue } from 'hr-skills-ref/server'
```

Recursively removes keys that could be used for prototype pollution from a
parsed YAML value.

Object keys named `__proto__`, `constructor`, and `prototype` are discarded.
Arrays are sanitized recursively, while primitive values are returned
unchanged.

```ts
function sanitizeYamlValue(value: unknown): unknown
```

#### Parameters

- `value`

#### Returns

A sanitized copy of the input value.

---

### `findSkillMd`

```ts
import { findSkillMd } from 'hr-skills-ref/server'
```

Find the `SKILL.md` file inside a skill directory.

Checks filenames in the order defined by `SKILL_MD_FILENAMES` and
returns the path to the first one that exists on disk.

```ts
function findSkillMd(skillDir: string): string | null
```

#### Parameters

- `skillDir`

#### Returns

The absolute path to the found file, or `null` if neither filename exists.

---

### `readProperties`

```ts
import { readProperties } from 'hr-skills-ref/server'
```

Read and parse the properties of a skill from its `SKILL.md` frontmatter.

Steps:
 1. Locate `SKILL.md` (or `skill.md`) in `skillDir`.
 2. Read the file as UTF-8.
 3. Parse the YAML frontmatter.
 4. Validate the parsed data against SkillPropertiesSchema.

```ts
function readProperties(skillDir: string): { name: string; description: string; license?: string | undefined; compatibility?: string | undefined; allowedTools?: string | undefined; metadata?: { [x: string]: string; } | undefined; }
```

#### Parameters

- `skillDir`

#### Returns

The validated SkillProperties extracted from the frontmatter.

#### Throws

{ParseError} If `SKILL.md` is not found or cannot be parsed.
{ValidationError} If the frontmatter does not satisfy the schema.

---

### `toPrompt`

```ts
import { toPrompt } from 'hr-skills-ref/server'
```

Generate an `<available_skills>` XML block for inclusion in an agent system prompt.

Each skill directory is represented as a `<skill>` element containing the
skill's `<name>`, `<description>`, and the absolute `<location>` of its
`SKILL.md` file. When `skillDirs` is empty, the function returns a valid
but empty `<available_skills>` block rather than throwing.

```ts
function toPrompt(skillDirs: string[]): string
```

#### Parameters

- `skillDirs`

#### Returns

A multi-line XML string wrapped in `<available_skills>` tags,
ready to embed in a Claude system prompt.

---

### `validate`

```ts
import { validate } from 'hr-skills-ref/server'
```

Validates a skill directory.

```ts
function validate(skillDir: string): string[]
```

#### Parameters

- `skillDir`

#### Returns

Human-readable error messages; empty when the skill is valid.

---

## hr-skills-ref — client

Browser-safe parsing, schema, model, and pure transformation APIs.

### `ALLOWED_TOOLS_KEY`

```ts
import { ALLOWED_TOOLS_KEY } from 'hr-skills-ref/client'
```

```ts
const ALLOWED_TOOLS_KEY: "allowed-tools"
```

---

### `FRONTMATTER_DELIMITER`

```ts
import { FRONTMATTER_DELIMITER } from 'hr-skills-ref/client'
```

```ts
const FRONTMATTER_DELIMITER: "---"
```

---

### `SKILL_MD_FILENAMES`

```ts
import { SKILL_MD_FILENAMES } from 'hr-skills-ref/client'
```

```ts
const SKILL_MD_FILENAMES: readonly ["SKILL.md", "skill.md"]
```

---

### `MAX_SKILL_NAME_LENGTH`

```ts
import { MAX_SKILL_NAME_LENGTH } from 'hr-skills-ref/client'
```

```ts
const MAX_SKILL_NAME_LENGTH: 64
```

---

### `MAX_DESCRIPTION_LENGTH`

```ts
import { MAX_DESCRIPTION_LENGTH } from 'hr-skills-ref/client'
```

```ts
const MAX_DESCRIPTION_LENGTH: 1024
```

---

### `MAX_COMPATIBILITY_LENGTH`

```ts
import { MAX_COMPATIBILITY_LENGTH } from 'hr-skills-ref/client'
```

```ts
const MAX_COMPATIBILITY_LENGTH: 500
```

---

### `SKILL_NAME_REGEX`

```ts
import { SKILL_NAME_REGEX } from 'hr-skills-ref/client'
```

```ts
const SKILL_NAME_REGEX: RegExp
```

---

### `ALLOWED_FRONTMATTER_FIELDS`

```ts
import { ALLOWED_FRONTMATTER_FIELDS } from 'hr-skills-ref/client'
```

```ts
const ALLOWED_FRONTMATTER_FIELDS: Set<string>
```

---

### `XML_ESCAPES`

```ts
import { XML_ESCAPES } from 'hr-skills-ref/client'
```

```ts
const XML_ESCAPES: Map<string, string>
```

---

### `isPlainObject`

```ts
import { isPlainObject } from 'hr-skills-ref/client'
```

Check whether a value is a plain object.

```ts
function isPlainObject(value: unknown): boolean
```

#### Parameters

- `value`

#### Returns

`true` for object literals and null-prototype objects.

---

### `toStringOrUndefined`

```ts
import { toStringOrUndefined } from 'hr-skills-ref/client'
```

Convert a value to a trimmed non-empty string.

```ts
function toStringOrUndefined(value: unknown): string | undefined
```

#### Parameters

- `value`

#### Returns

A trimmed string or `undefined` for empty/nullish values.

---

### `escapeXml`

```ts
import { escapeXml } from 'hr-skills-ref/client'
```

Escape XML special characters.

```ts
function escapeXml(value: string): string
```

#### Parameters

- `value`

#### Returns

An XML-safe string.

---

### `sanitizeYamlValue`

```ts
import { sanitizeYamlValue } from 'hr-skills-ref/client'
```

Remove prototype-pollution keys recursively from parsed YAML values.

```ts
function sanitizeYamlValue(value: unknown): unknown
```

#### Parameters

- `value`

#### Returns

A sanitized copy of the input value.

---

### `SkillError`

```ts
import { SkillError } from 'hr-skills-ref/client'
```

Base class for all skill-related errors.

```ts
const SkillError: SkillError
```

---

### `ParseError`

```ts
import { ParseError } from 'hr-skills-ref/client'
```

Thrown when a skill cannot be parsed.

```ts
const ParseError: ParseError
```

---

### `ValidationError`

```ts
import { ValidationError } from 'hr-skills-ref/client'
```

Thrown when skill validation fails.

```ts
const ValidationError: ValidationError
```

---

### `toDict`

```ts
import { toDict } from 'hr-skills-ref/client'
```

Converts validated skill properties to a plain object suitable for
serialization.

```ts
function toDict(props: { name: string; description: string; license?: string | undefined; compatibility?: string | undefined; allowedTools?: string | undefined; metadata?: { [x: string]: string; } | undefined; }): Record<string, unknown>
```

#### Parameters

- `props`

#### Returns

A plain object with only the fields that were present.

---

### `parseFrontmatter`

```ts
import { parseFrontmatter } from 'hr-skills-ref/client'
```

Parse the YAML frontmatter block from a `SKILL.md` file.

Expects the content to begin with a `---` delimiter, followed by YAML,
followed by a closing `---` delimiter. Everything after the closing
delimiter is returned as the markdown body.

```ts
function parseFrontmatter(content: string): [Record<string, unknown>, string]
```

#### Parameters

- `content`

#### Returns

A tuple containing the parsed frontmatter and markdown body.

#### Throws

{ParseError} If the frontmatter is missing, malformed, or contains invalid YAML.

---

### `SkillPropertiesSchema`

```ts
import { SkillPropertiesSchema } from 'hr-skills-ref/client'
```

Schema for the properties read from a skill's `SKILL.md` frontmatter.

```ts
const SkillPropertiesSchema: StrictObjectSchema<{ readonly name: SchemaWithPipe<readonly [StringSchema<undefined>, TrimAction]>; readonly description: SchemaWithPipe<readonly [StringSchema<undefined>, TrimAction]>; readonly license: OptionalSchema<...>; readonly compatibility: OptionalSchema<...>; readonly allowedTools: OptionalSchema<...>; rea...
```

---

### `SkillProperties`

```ts
import { SkillProperties } from 'hr-skills-ref/client'
```

Parsed properties extracted from a skill's `SKILL.md` frontmatter.

```ts
type SkillProperties = v.InferOutput<typeof SkillPropertiesSchema>
```

---
