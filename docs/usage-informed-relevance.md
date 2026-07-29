# Usage-Informed Relevance

> Phase 6.1 of the [roadmap](ROADMAP.md) — improving `relatedSkills` quality
> by incorporating evidence from how skills are actually selected together in
> practice.

## Why this exists

Today the registry generates `relatedSkills` deterministically from static
metadata: up to five other skills in the same domain, ranked by shared-tag
overlap and tied alphabetically.

This is a strong, low-noise baseline — but it is blind to actual usage.  Two
skills that are frequently chosen together by the Planner for real user intents
may belong to different domains and carry no overlapping tags.  Structural
similarity and observed co-selection are complementary signals.

Phase 6.1 defines a deterministic pipeline for blending these two signals
without changing any existing registry behavior, introducing runtime learning,
or depending on undocumented external services.

---

## Architecture overview

```text
Evidence Sources (read-only, committed)
  eval/golden/*.golden.json
          │
          ▼
  generate-relevance-signals.ts  (CLI)
          │
          ▼
  relevance-signals.ts           (pure functions)
   ├── extractCoSelectionCounts()
   ├── extractSkillObservationCounts()
   ├── computeSignals()
   └── buildRelevanceSignalTable()
          │
          ▼
  registry/relevance-signals.json  (committed generated artifact)
          │
          ▼
  registry.ts  buildRegistry(signalTable?)
   ├── rankRelatedSkills()      ← static tag-overlap (unchanged)
   └── reRankRelatedSkills()    ← blended ranking (optional)
          │
          ▼
  registry/skills.json          (committed generated artifact)
```

---

## Separation of responsibilities

| Layer | File | Responsibility |
|---|---|---|
| **Observation** | `eval/golden/*.golden.json` | Committed golden fixtures — the only evidence source currently supported. |
| **Signal generation** | `relevance-signals.ts` | Pure functions that convert observations into a normalised weight table. |
| **Signal CLI** | `generate-relevance-signals.ts` | Reads fixtures from disk, calls `buildRelevanceSignalTable`, writes `registry/relevance-signals.json`. |
| **Registry generation** | `registry.ts` `buildRegistry(signalTable?)` | Optionally merges the signal table into `relatedSkills` at build time. |
| **Recommendation** | Registry consumers (Planner, Phase 6.1 UI) | Read the committed `registry/skills.json` — no awareness of how weights were computed. |

**No layer performs runtime learning.**  The signal table is a static,
committed file.  The Planner and any recommendation UI only read the
fully-resolved registry.

---

## Evidence sources

### Golden fixtures (`eval/golden/*.golden.json`)

Each golden fixture records the ordered `skillIds` selected by the Planner for
a set of planning scenarios.  When two skill IDs appear in the same result's
`skillIds` list, that is one **co-selection observation**.

| Property | Value |
|---|---|
| What is observed | Pairs of skill IDs that the Planner selected together for a real intent |
| Why it is useful | Direct evidence of which skills are used together — not just structurally similar |
| Deterministic? | Yes — golden fixtures are committed, immutable files |
| Privacy concerns? | None — fixtures contain only skill IDs and counts, no user data |
| Reproducibility? | Yes — same fixtures always produce the same signal table |

### Future evidence sources (not yet implemented)

The architecture is designed to accept additional fixture-like inputs in the
future.  Examples include:

- **Curated co-selection datasets** — hand-authored tables expressing known
  domain expertise ("these skills should always be recommended together").
- **Organisation-specific signal files** — optional files outside the
  repository that local deployments can supply to personalise recommendations.
- **Self-hosted telemetry** — opt-in runtime logging that can be periodically
  reduced to a golden-fixture-compatible format and committed.

None of these future sources are required by the current implementation.  The
`buildRelevanceSignalTable()` function accepts any array of `GoldenFixture`
objects — additional sources just contribute more entries to that array.

---

## Signal processing

### Collection

`loadAllGoldenFixtures()` in `evaluation-datasets.ts` discovers and loads every
committed `*.golden.json` file from `eval/golden/`, sorted by dataset name for
deterministic ordering.

### Normalisation

Each planning-scenario result's `skillIds` list contributes:

- **Bidirectional co-selection counts** — for every unordered pair `(A, B)` in
  the list, both `(A → B)` and `(B → A)` counts are incremented.
- **Per-skill observation counts** — for every ID in the list, the skill's
  appearance count is incremented.

Results with fewer than two skill IDs are skipped (no pair to observe).

### Aggregation

```text
coSelectionRate(A → B) = coSelectionCount(A, B) / observationCount(A)
```

This is the fraction of plans that contained skill A in which skill B also
appeared.  It is bounded to [0.0, 1.0] by construction.

### Persistence

The aggregated signal table is written to `registry/relevance-signals.json`
and **committed to the repository** — the same pattern used by
`registry/skills.json` and `docs/skill-matrix.md`.  It is a static artifact,
not a database or runtime cache.

### Versioning

`RelevanceSignalTable.schemaVersion` (currently `1`) is incremented for
breaking shape changes.  The `generatedAt` field records the ISO date the
table was produced; it is informational and does not affect determinism of
signal values.

### Regeneration

```bash
bun run signals
# or, from packages/hr-skills-build:
bun src/generate-relevance-signals.ts
```

Regenerate whenever golden fixtures change (after `bun run evaluate
--update-golden`).  Commit the updated `registry/relevance-signals.json`
alongside the fixture changes.

---

## Registry integration

### How signals are applied

`buildRegistry(signalTable?)` accepts an optional `RelevanceSignalTable`.
When present:

1. `indexSignalsBySource(table)` builds a `Map<sourceSkill, Map<targetSkill, rate>>`
   for O(1) per-skill lookups.
2. For each skill, the static tag-overlap `relatedSkills` list is computed as
   before (unchanged).
3. `reRankRelatedSkills(skillId, staticRelated, signalIndex)` blends the two
   signals:

```text
blendedScore = staticScore × (1 − OBSERVED_WEIGHT)
             + observedRate × OBSERVED_WEIGHT
```

where `staticScore` decays linearly from 1.0 for the top-ranked static entry.
`OBSERVED_WEIGHT` is currently `0.3` — conservative, since the evaluation
dataset is small.  Ties are broken alphabetically, consistent with the static
ranker.

`reRankRelatedSkills` can also surface skills that were **not** in the static
list but appear strongly in observed evidence (cross-domain co-selections).

### Where the signal table lives

`registry/relevance-signals.json` sits alongside `registry/skills.json`.  Both
are generated, committed artifacts.

### Backward compatibility

When `buildRegistry()` is called without a `signalTable` argument — the
default, and the current behavior of `generate-registry.ts` and `validate.ts`
— it behaves exactly as before.  The static `relatedSkills` ranking is
unchanged.  No existing tests break.

To opt into signal-augmented registry generation, the caller loads
`registry/relevance-signals.json` and passes it:

```typescript
import { buildRegistry } from './registry.js';
import type { RelevanceSignalTable } from './types.js';
import signalData from '../../registry/relevance-signals.json' assert { type: 'json' };

const registry = await buildRegistry(signalData as RelevanceSignalTable);
```

---

## Determinism guarantees

| Guarantee | How it is maintained |
|---|---|
| Same fixtures → same signal table | `buildRelevanceSignalTable` is a pure function; fixture array is sorted by dataset name before processing |
| Stable output ordering | Signals are sorted by `sourceSkill` then `targetSkill` (string comparison); `relatedSkills` ties broken alphabetically |
| No runtime mutation | The signal table is a static committed file; the registry is never mutated at runtime |
| No wall-clock non-determinism | `generatedAt` is injected by the CLI, not by any pure function; pure functions produce identical results regardless of when they run |
| No floating-point non-determinism | `coSelectionRate` is a simple integer ratio; `blendedScore` uses only addition and multiplication of bounded floats |
| Schema integrity | `schemaVersion` guards against consuming a table with a shape the current code does not understand |

---

## Implementation roadmap

### Phase 6.1-A — Signal infrastructure (this PR)

**Objective:** Introduce the signal processing pipeline and its generated
artifact.  No change to the default registry output.

**Deliverables:**

- `src/relevance-signals.ts` — pure signal functions and `RelevanceSignalTable`
  type.
- `src/generate-relevance-signals.ts` — CLI entry point.
- `evaluation-datasets.ts` — `loadAllGoldenFixtures()` added.
- `constants.ts` — `RELEVANCE_SIGNALS_PATH` added.
- `registry.ts` — `buildRegistry(signalTable?)` — optional signal integration,
  backwards-compatible.
- `registry/relevance-signals.json` — initial generated artifact from the
  existing golden fixtures.
- `test/relevance-signals.test.ts` — full unit-test coverage.
- `docs/usage-informed-relevance.md` — this document.
- `package.json` / `turbo.jsonc` — `signals` script and Turborepo task.

**Dependencies:** Phase 4.4 (Evaluation framework) — golden fixtures must
exist before signals can be generated.

**Expected output:** `registry/relevance-signals.json` committed alongside
existing golden fixtures; default registry output unchanged.

### Phase 6.1-B — Signal-augmented registry generation

**Objective:** Wire the signal table into the default registry generation and
validate that the blended `relatedSkills` output is regression-free.

**Deliverables:**

- Update `generate-registry.ts` to load `registry/relevance-signals.json` when
  present and pass it to `buildRegistry()`.
- Update `validate-registry.ts` to validate `relatedSkills` against the signal
  table (warn when a high-evidence pair is absent from the list).
- Expand `test/registry.test.ts` to cover signal-augmented generation.
- Update golden fixtures after observing the blended ranking change.

**Dependencies:** Phase 6.1-A.

### Phase 6.1-C — Recommendation surface (Phase 6.1 UI)

**Objective:** Surface `relatedSkills` as user-facing "skills you might also
need" suggestions (the Recommendation engine milestone in the roadmap).

**Deliverables:**

- A `recommendRelatedSkills(skillId, registry, limit?)` helper that reads the
  committed registry (no runtime signal computation).
- Integration with the Planner or a future CLI `recommend` command.

**Dependencies:** Phase 6.1-B, Phase 4.2 (Planner).

### Phase 6.1-D — Richer evidence sources (future)

**Objective:** Accept additional evidence beyond evaluation golden fixtures.

**Candidates:**

- Curated co-selection tables (`eval/curated/*.json` with the same
  `GoldenFixture` shape).
- Organisation-specific override files supplied at build time.
- Optional self-hosted telemetry reduced to the `GoldenFixture` format.

**Dependencies:** Phase 6.1-A (all three future sources are drop-in inputs to
`buildRelevanceSignalTable` — no architectural change required).

---

## Future evolution

The architecture is deliberately conservative today because the evaluation
dataset is small (eight scenarios in one fixture file).  As the dataset grows:

- Increase `OBSERVED_WEIGHT` incrementally so observed evidence carries more
  influence relative to structural similarity.
- Add a minimum `observedCount` threshold below which a signal is not applied
  (prevents sparse evidence from dominating).
- Add per-domain weight tuning once per-domain observation counts are large
  enough to be statistically meaningful.
- Introduce `validateRelevanceSignalConsistency()` in `validate-registry.ts`
  to fail CI when the committed signal table is stale relative to the golden
  fixtures (same "recompute and diff" pattern used for `skills.json`).

None of these require changes to the core architecture — they are tuning knobs
and validation additions on top of the pipeline described here.

---

## Tests

`test/relevance-signals.test.ts` covers:

- `extractCoSelectionCounts` — bidirectional counting, solo-skill exclusion,
  multi-fixture accumulation, determinism.
- `extractSkillObservationCounts` — per-skill counts, multi-fixture totals,
  determinism.
- `computeSignals` — rate computation, stable sort, determinism, empty input.
- `buildRelevanceSignalTable` — schema version, date injection, dataset
  ordering, total observations, fixture-order invariance, empty input.
- `indexSignalsBySource` — lookup correctness, empty table.
- `reRankRelatedSkills` — promotion of high-evidence skills, limit parameter,
  determinism, graceful fallback to static order, cross-domain surfacing,
  self-reference exclusion.

Future tests (Phase 6.1-B) will validate:

- `buildRegistry(signalTable)` produces `relatedSkills` lists that differ from
  the no-signal baseline for skills with strong observed co-selection evidence.
- `validateRegistryConsistency()` catches a stale signal table.
