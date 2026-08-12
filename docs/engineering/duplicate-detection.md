# Duplicate-content detection (Phase 6.2)

The repository validates structural correctness and metadata on every run.
Phase 6.2 adds a second quality layer: **deterministic duplicate-content detection** that identifies pairs of skills whose descriptions or body content substantially overlap.

---

## Purpose

HR skills naturally share vocabulary — words like *employee*, *manager*, *process*, and *hiring* appear throughout the repository.  Duplicate detection does **not** flag this.

It flags cases where two skills appear to be describing **the same knowledge** — for example, two skills that both explain how to run a structured behavioural interview, using nearly the same phrasing across both their descriptions and their content files.

The goal is to help maintainers spot accidental duplication early, **before** it accumulates into maintenance debt.  Reviewers can then decide whether to merge, refactor, or leave the skills as-is (some overlap is intentional).

---

## What is analysed

For each skill the detector reads:

| Source | Used for |
|--------|----------|
| Frontmatter `description` field | Description-level Jaccard signal |
| Body of `SKILL.md` (after stripping frontmatter) | Content-level token and bigram signals |
| All `.md` files under `content/` (if the directory exists) | Content-level token and bigram signals |

Content from `prompts/` and `examples/` subdirectories is intentionally excluded — example prompts and worked examples are expected to reuse common phrasing.

---

## Similarity heuristic

The detector computes a **weighted composite score** for every pair of skills:

```text
composite = 0.35 × descriptionJaccard
          + 0.40 × contentJaccard
          + 0.25 × bigramJaccard
```

### Step 1 — Normalise

Each text source is normalised before comparison:

1. Strip YAML frontmatter.
2. Remove fenced code blocks, inline code, URLs, markdown formatting characters, and punctuation.
3. Lower-case everything.
4. Split on whitespace.
5. Remove tokens shorter than 3 characters.
6. Remove HR domain stop-words (see below).

The result is a list of meaningful content tokens.

### Step 2 — Description Jaccard (weight 0.35)

The normalised token sets of both `description` fields are compared with Jaccard similarity:

```text
|A ∩ B| / |A ∪ B|
```

A score of 1.0 means both descriptions use exactly the same vocabulary (after stop-word removal).

### Step 3 — Content Jaccard (weight 0.40)

The same Jaccard formula is applied to the full normalised token multisets of both skills' combined markdown bodies (SKILL.md body + `content/` files).

Multiset semantics are used: a token appearing twice in skill A and once in skill B contributes 1 to the intersection, not 2.

### Step 4 — Bigram Jaccard (weight 0.25)

Consecutive token pairs (*bigrams*) are extracted from the normalised content before sorting.  These are compared with Jaccard similarity, catching **phrase-level** duplication that single-token overlap misses.

For example, two skills that both repeatedly use the phrase "salary benchmarking" will produce many shared bigrams even if their individual token counts are similar but not identical.

### Step 5 — Composite and threshold

The three signals are combined with the weights above.  A pair is reported when:

```text
composite ≥ 0.55   (default DUPLICATE_THRESHOLD)
```

---

## HR domain stop-words

Approximately 150 common HR terms and English function words are filtered out before similarity is measured.  This prevents high vocabulary overlap caused by domain terminology alone from triggering false-positive warnings.

Examples of filtered terms:

> `employee`, `employees`, `manager`, `team`, `process`, `policy`, `hiring`, `training`, `system`, `the`, `and`, `for`, `with`, …

The full list is defined in `detect-duplicates.ts` (`HR_STOP_WORDS`).

---

## Configurable thresholds

All weights and the threshold are exported named constants in `detect-duplicates.ts`:

| Constant | Default | Description |
|----------|---------|-------------|
| `WEIGHT_DESCRIPTION` | `0.35` | Weight for description Jaccard |
| `WEIGHT_CONTENT` | `0.40` | Weight for content Jaccard |
| `WEIGHT_BIGRAM` | `0.25` | Weight for bigram Jaccard |
| `DUPLICATE_THRESHOLD` | `0.55` | Minimum composite score to report |

To tighten detection (fewer warnings, higher precision), increase `DUPLICATE_THRESHOLD`.  To loosen it, decrease it.

---

## Interpreting warnings

A warning looks like this in the validator output:

```text
WARN  hr-interview-structured ↔ hr-interview-behavioral:
  [duplicate-warning] Similarity score 67% (description: 72%, content: 63%, bigrams: 61%).
  Composite score 67% exceeds threshold 55%: high description overlap (72%);
  high content token overlap (63%); significant phrase overlap (61%).
  Review both skills to determine if they cover genuinely distinct knowledge
  or should be merged/refactored.
```

### Suggested actions

| Score range | Interpretation | Suggested action |
|-------------|----------------|------------------|
| 55–65% | Moderate overlap | Review; overlap may be intentional |
| 65–80% | High overlap | Strong candidate for refactoring |
| 80–100% | Very high overlap | Skills likely describe the same knowledge — merge or differentiate |

---

## Why warnings are informational, not blocking

Duplicate detection is a **quality signal**, not a correctness check.

- Some overlap is intentional.  A skill for *performance reviews* and a skill for *performance improvement plans* will share terminology.
- The heuristic has false-positive potential for closely related topics.
- Merging or deleting skills is a human judgment call that should go through the normal review process.

Warnings are emitted after all structural validations and **do not affect the exit code**.  CI passes regardless of the number of duplicate warnings.

Maintainers may choose to make warnings blocking in the future by changing the `validate` script to exit non-zero when `allWarnings.length > 0`.

---

## Limitations

- **No semantic understanding.**  The heuristic is purely lexical.  Two skills covering the same concept but written with very different vocabulary will not be flagged, even if they are functionally identical.
- **No ML or embeddings.**  Semantic similarity (e.g. "role" vs "position") is not detected.
- **Stop-word list is static.**  Domain vocabulary evolves; the stop-word list may need periodic updates.
- **Short skills produce noisy scores.**  A skill with very little unique content after stop-word removal may match many others at a low base rate.
- **Content-only comparison.**  The detector does not analyse `prompts/` or `examples/` subdirectories.

---

## Running duplicate detection

Duplicate detection runs automatically as part of the standard validation command:

```bash
bun run validate          # from repo root
# or
bun run validate       # from packages/hr-skills-build/
```

Warnings are printed after per-skill validation results and before the final pass/fail summary.

---

## Determinism guarantee

The detector is fully deterministic:

- Skills are loaded and compared in alphabetical order.
- All set and map operations iterate over sorted keys.
- Pair keys are canonicalised (`skillA < skillB` lexicographically).
- No timestamps, random values, or external services are used.

Running the validator twice against the same repository state produces byte-for-byte identical warnings.
