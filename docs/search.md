# Skill Discovery (Search)

> Phase 6.1 of the [roadmap](ROADMAP.md) — deterministic skill discovery over
> [Skill Registry](registry.md) metadata, by structured fields instead of
> exact trigger-phrase matching only.

## What it is

`packages/hr-skills-build/src/search.ts` exports one function,
`searchSkills(query, registry)`, that ranks skills against a free-text query
matched across structured registry fields — capabilities, aliases, tags,
domain, and trigger phrases.

This is a **retrieval** feature, not a planning one:

- It answers "which skills relate to X?" — a ranked list with explanations.
- The [Planner](planner.md) answers "which skills, in what order, satisfy
  this request?" — a full execution plan.

`searchSkills()` is read-only and pure. It consumes only a `Registry` object
(as produced from `registry/skills.json`) and never parses `SKILL.md` files
or scans the filesystem. It does not select, order, or execute skills, and
it does not change how the Planner works — the two are independent
consumers of the same registry data.

## Searchable fields

| Field | Source | Example values |
|---|---|---|
| `aliases` | `RegistryEntry.aliases` | `"onboarding"`, `"new-hire-onboarding"` |
| `capabilities` | `RegistryEntry.capabilities` | `"Design onboarding plans"` |
| `tags` | `RegistryEntry.tags` | `"lifecycle"`, `"new-hire"` |
| `triggerPhrases` | `RegistryEntry.triggerPhrases` | `"onboard a new hire"` |
| `domain` | `RegistryEntry.domain` | `"onboarding-offboarding"` |

By default a query searches all five fields (`ALL_SEARCHABLE_FIELDS`
in search.ts). Callers can restrict this with `query.fields`.

## Supported query types

- **Free-text search** — `{ text: "onboard new hires" }` searches the
  chosen fields with both exact and fuzzy matching.
- **Domain-filtered search** — `{ text: "...", domain: "onboarding-offboarding" }`
  restricts candidates to one domain before scoring.
- **Domain-only browse** — `{ text: "", domain: "..." }` lists every skill
  in a domain (a valid query on its own; `text` and `domain` aren't both
  required, but at least one must be present).
- **Field-restricted search** — `{ text: "...", fields: ["tags"] }` searches
  only the given fields.
- **Exact-only search** — `{ text: "...", fuzzy: false }` disables fuzzy
  matching, so only exact/substring hits are returned.

## Matching: exact vs. fuzzy

**Exact match** — the normalized (lowercased, trimmed) query equals a field
value, or either one contains the other as a substring. This mirrors the
"direct match" rule the [Planner already uses](planner.md#capability-matching)
for capability matching, so the two systems stay conceptually consistent.

**Fuzzy match** — used only when a field value isn't an exact match (and
`fuzzy` isn't disabled). It's the better of two deterministic, dependency-free
measures:

- **Token Jaccard similarity** — `|intersection| / |union|` of the query's
  and value's word sets. Good for reordered or partially-overlapping
  multi-word phrases, e.g. `"new hire onboard"` vs. `"onboard a new hire"`.
- **Normalized Levenshtein similarity** — `1 - editDistance / maxLength`.
  Good for single-word typos, e.g. `"onbording"` vs. `"onboarding"`.

A fuzzy match only counts if its similarity is at least `FUZZY_THRESHOLD`
(0.34, in search.ts). Below that, it's treated as no match at all — this
keeps low-quality fuzzy noise out of results.

No ML models, embeddings, vector databases, or external search services are
used anywhere in this pipeline.

## Ranking

Every result's `score` is built from four transparent, additive rules:

1. **Field weight × match strength.** Each field has a base weight
   (`FIELD_WEIGHTS` in search.ts — currently `aliases: 100`,
   `capabilities: 80`, `tags: 60`, `triggerPhrases: 50`, `domain: 40`,
   reflecting how deliberately each field is authored as a lookup key).
   An exact match contributes the full weight; a fuzzy match contributes
   `weight × FUZZY_DAMPING × similarity` (damped by 0.6, so fuzzy hits can
   never outscore an exact hit on the same field).
2. **Multi-field bonus.** A skill matching on more than one distinct field
   gets `+5` per extra field, capped at `+20` — agreement across fields
   (e.g. both a tag and a capability) is a stronger discoverability signal
   than one strong match alone.
3. **Exact-match confidence bonus.** A skill with at least one exact match
   (on any field) gets a flat `+10` — this keeps exact matches reliably
   ahead of fuzzy-only matches even when the fuzzy skill matched more
   fields.
4. **Deterministic tie-breaking.** Ties are broken first by number of
   matched fields (descending), then by skill ID (ascending,
   `localeCompare`). Two runs against the same registry state always
   produce the same order — nothing here depends on iteration order,
   timestamps, or randomness.

Only the single **best** value per field counts toward a skill's score —
e.g. a skill with five tags that all loosely match the query still only
scores once for `tags`, not five times. This keeps scores from being
inflated by keyword-stuffed fields.

## Match explanation

Every `SkillSearchResult` carries the evidence for its score, not just the
number:

```ts
interface SkillFieldMatch {
  field: SearchableField;   // e.g. "capabilities"
  value: string;            // the exact field value that matched
  matchType: 'exact' | 'fuzzy';
  similarity: number;       // 0–1, always 1 for exact matches
  weight: number;           // that field's base weight
  contribution: number;     // weight * similarity, pre-bonus
}
```

`result.matches` lists every field match (best-contribution first), and
`result.explanation` renders them as a short, deterministic string, e.g.:

```text
aliases ~ "onboarding" (exact); capabilities ~ "Design onboarding plans" (fuzzy, 0.42)
```

## API

```ts
interface SkillSearchQuery {
  text: string;
  fields?: SearchableField[];   // default: all 5 fields
  domain?: SkillCategory;       // optional pre-filter
  fuzzy?: boolean;              // default: true
  limit?: number;               // default: 10
}

interface SkillSearchResponse {
  query: string;
  resultCount: number;
  results: SkillSearchResult[]; // ranked, best match first
}

function searchSkills(query: SkillSearchQuery, registry: Registry): SkillSearchResponse;
```

`searchSkills()` throws `InvalidSearchQueryError` for a structurally invalid
query — empty `text` with no `domain` filter (nothing to search), or a
non-positive/non-integer `limit`. A query that's valid but matches nothing
is **not** an error — it returns `{ resultCount: 0, results: [] }`.

This API is intentionally independent of Planner execution logic, so it's
reusable by any future consumer that can supply a `Registry` object:

- **CLI** — `bun run discover "<query>"` (below).
- **Web UI / Registry Explorer** — a search box over the same registry data,
  with `SkillFieldMatch[]` available to render "why this matched" per
  result.
- **Planner (future)** — could use `searchSkills()` as an additional
  capability-discovery signal, but does not today; this module makes no
  changes to `planner.ts`.

## Usage

### CLI

```bash
bun run discover "onboard new hires"
bun run discover "onboarding" --domain onboarding-offboarding
bun run discover "onbording" --limit 3 --no-fuzzy
```

The CLI reads `registry/skills.json` directly, so run `bun run registry`
first if it's out of date.

### Programmatic

```ts
import { searchSkills } from './search.js';
import { buildRegistry } from './registry.js';

const registry = await buildRegistry();
const response = searchSkills({ text: 'onboard new hires' }, registry);

for (const result of response.results) {
  console.log(`${result.skillId} (${result.score}): ${result.explanation}`);
}
```

## Determinism guarantees

- Same registry content + same query → same `results`, in the same order,
  every time.
- No randomness, no external services, no ML/embedding models, no signal
  that varies between runs (timestamps, locale-dependent sort order, object
  iteration order).
- Regenerating the registry (`bun run registry`) from unchanged skill
  content produces unchanged search results, since `searchSkills()`'s only
  input is the registry's structured fields.

## Limitations

- Search quality is bounded by how well a skill's `aliases`, `tags`,
  `capabilities`, and `triggerPhrases` are authored — this module surfaces
  registry metadata, it doesn't infer meaning beyond it.
- Fuzzy matching is intentionally simple (token overlap + edit distance) for
  determinism and explainability, not state-of-the-art recall — it won't
  catch matches that require true semantic understanding (e.g. synonyms
  never seen in shared tokens).
- `domain` is matched as a single string, so a query only benefits from
  fuzzy matching against the raw domain slug (e.g. `"onboarding-offboarding"`)
  — it isn't matched against domain display names or descriptions.
- Not real-time: results reflect whatever registry was passed in — from disk
  (`registry/skills.json`) or freshly built (`buildRegistry()`). Regenerate
  the registry to pick up new skills.

## Extension guidelines

- **New searchable field** — add it to `SearchableField` in types.ts, give
  it a weight in `FIELD_WEIGHTS`, and add it to `getFieldValues()` in
  search.ts.
- **Tuning ranking** — the constants at the top of search.ts
  (`FIELD_WEIGHTS`, `FUZZY_THRESHOLD`, `FUZZY_DAMPING`, `MULTI_FIELD_BONUS`,
  `MULTI_FIELD_BONUS_CAP`, `EXACT_MATCH_CONFIDENCE_BONUS`) are the single
  source of truth for scoring — change them there, not inline.
- **New consumer** — anything that can produce or load a `Registry` object
  can call `searchSkills()` directly; no new glue code should be needed.

## Testing

See `packages/hr-skills-build/test/search.test.ts`, which covers exact
matches per field, fuzzy matches (typos and reordered phrases), field
restriction, domain filtering and domain-only browsing, ranking and
tie-breaking, match explanations, empty results, and invalid-query errors.
