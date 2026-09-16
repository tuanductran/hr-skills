# Usage-Informed Relevance

> Phase 6.1 of the [roadmap](../ROADMAP.md) — improving `relatedSkills` quality
> by incorporating evidence from how skills are actually selected together in
> practice.

## Why this exists

The registry generates `relatedSkills` from static metadata and, when the committed relevance-signal table is available, observed co-selection evidence. Static structure provides the baseline; usage evidence can promote or surface skills that are actually selected together in planning scenarios.

Phase 6.1 defines a deterministic pipeline for blending these signals without runtime learning or undocumented external services. The signal table is generated from committed golden fixtures and consumed at registry-generation time.

## Architecture overview

```text
Evidence Sources (read-only, committed)
  eval/golden/*.golden.json
          |
          v
  generate-relevance-signals.ts
          |
          v
  relevance-signals.ts
          |
          v
  registry/relevance-signals.json
          |
          v
  registry.ts buildRegistry(signalTable?)
   |-- rankRelatedSkills()      <- static tag-overlap baseline
   `-- reRankRelatedSkills()    <- blended ranking / cross-domain surfacing
          |
          v
  registry/skills.json
```

## Separation of responsibilities

| Layer | File | Responsibility |
|---|---|---|
| **Observation** | `eval/golden/*.golden.json` | Committed golden fixtures — the current evidence source. |
| **Signal generation** | `relevance-signals.ts` | Pure functions that convert observations into a normalised weight table. |
| **Signal CLI** | `generate-relevance-signals.ts` | Reads fixtures and writes `registry/relevance-signals.json`. |
| **Registry generation** | `registry.ts` `buildRegistry(signalTable?)` | Applies the signal table to `relatedSkills` when available. |
| **Recommendation** | Registry consumers | Read the resolved registry; they do not perform runtime signal learning. |

**No layer performs runtime learning.** The signal table is a static, committed file.

## Evidence sources

### Golden fixtures (`eval/golden/*.golden.json`)

Each golden fixture records the ordered `skillIds` selected by the Planner for planning scenarios. When two skill IDs appear in the same result, that is one co-selection observation.

### Future evidence sources (not yet implemented)

The architecture can accept additional fixture-like inputs in the future, including curated co-selection tables, organisation-specific signal files, and optional self-hosted telemetry reduced to the golden-fixture format. None of these sources are required by the current implementation.

## Signal processing

`loadAllGoldenFixtures()` discovers committed `*.golden.json` files from `eval/golden/` in deterministic order. Each scenario contributes bidirectional co-selection counts and per-skill observation counts.

```text
coSelectionRate(A -> B) = coSelectionCount(A, B) / observationCount(A)
```

The aggregated table is written to `registry/relevance-signals.json` and committed as a static artifact.

Regenerate it with:

```bash
bun run signals
```

Regenerate whenever golden fixtures change and commit the updated signal artifact alongside those fixture changes.

## Registry integration

`buildRegistry(signalTable?)` accepts an optional `RelevanceSignalTable`. When present:

1. `indexSignalsBySource(table)` builds efficient per-source lookups.
2. The deterministic static tag-overlap `relatedSkills` list is computed as the baseline.
3. `reRankRelatedSkills()` blends static relevance with observed co-selection evidence.

```text
blendedScore = staticScore × (1 − OBSERVED_WEIGHT)
             + observedRate × OBSERVED_WEIGHT
```

`OBSERVED_WEIGHT` is currently `0.3`. Ties remain deterministic. The re-ranker can also surface strongly observed skills that were not present in the static list, including cross-domain co-selections. `RELATED_SKILL_OVERRIDES` can preserve maintainer-approved relationships before the final five-item cap.

### Current generation behavior

`generate-registry.ts` loads `registry/relevance-signals.json` when the file is present and valid, then passes it to `buildRegistry()`. Therefore the default registry generation path is signal-aware. If the signal file is absent or invalid, generation falls back to deterministic static ranking.

`validate-registry.ts` uses the same signal table when recomputing the expected registry, so validation matches the generation path.

The recommendation CLI also loads the relevance signal table so ad-hoc recommendations match the committed signal-aware registry.

## Determinism guarantees

| Guarantee | How it is maintained |
|---|---|
| Same fixtures -> same signal table | Pure signal functions and deterministic fixture ordering |
| Stable output ordering | Stable signal ordering and alphabetical tie-breaking |
| No runtime mutation | The signal table is a static committed artifact |
| No wall-clock non-determinism | `generatedAt` is informational and injected by the CLI |
| Schema integrity | `schemaVersion` guards the signal-table shape |

## Implementation roadmap

### Phase 6.1-A — Signal infrastructure

**Status: Delivered.** Introduced signal processing and the generated relevance artifact without changing the default registry output at that stage.

### Phase 6.1-B — Signal-augmented registry generation

**Status: Delivered.** Wired the signal table into default registry generation and added validation/test coverage for signal-aware output, including cross-domain surfacing and stale-registry detection.

### Phase 6.1-C — Recommendation surface

**Status: Delivered** — as `getRecommendations()` in `search/recommendations.ts` plus the `bun run recommend` CLI. The CLI loads `registry/relevance-signals.json` so recommendations match the signal-aware committed registry.

### Phase 6.1-D — Richer evidence sources (future)

Accept additional evidence beyond evaluation golden fixtures, such as curated co-selection tables, organisation-specific overrides, or optional self-hosted telemetry reduced to the `GoldenFixture` format.

## Future evolution

The architecture is deliberately conservative because the evaluation dataset is small. As the dataset grows, observed weighting, evidence thresholds, and per-domain tuning can be revisited. These are tuning and validation additions rather than changes to the core architecture.

## Tests

Signal tests cover extraction, aggregation, determinism, schema generation, indexing, and re-ranking. Registry tests cover signal-augmented `buildRegistry()`, signal-table loading, cross-domain surfacing, and signal-aware validation.
