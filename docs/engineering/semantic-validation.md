# Semantic validation of prompts and examples (Phase 6.2)

The repository validates structural correctness, metadata, and
[duplicate content](duplicate-detection.md) on every run. Phase 6.2 adds a
third quality layer: **deterministic semantic validation** that checks
whether a skill's `prompts/` and `examples/` material actually stays
consistent with what the skill claims to do.

---

## Purpose

`prompts/` and `examples/` are supposed to exercise the capability a skill
documents in its frontmatter `description` and `content/`. Today's
structural check only confirms those directories are non-empty — it says
nothing about whether their content is *about the right thing*.

Semantic validation catches the failure modes that slip past a structural
check:

- Prompts that exercise an unrelated HR capability (wrong file dropped
  into the wrong skill directory).
- Examples describing a completely different workflow.
- `prompts/` or `examples/` content that reads like it was copied from
  another skill and never adapted.
- A skill whose supporting material never actually touches the core
  concepts named in its own description.

As with duplicate detection, the goal is to surface a **review signal**
early, not to prove semantic drift with certainty. A maintainer still
makes the final call.

---

## What is analysed

For each skill the validator reads:

| Source | Used for |
|--------|----------|
| Frontmatter `description` field | The skill's documented purpose, and the source of its "primary concept" keywords |
| Body of `SKILL.md` (after stripping frontmatter) | Purpose vocabulary |
| All `.md` files under `content/` (if present) | Purpose vocabulary, and concept-coverage support |
| All `.md` files under `prompts/` (if present) | Compared against purpose vocabulary |
| All `.md` files under `examples/` (if present) | Compared against purpose vocabulary |

Text normalisation, tokenisation, stop-word filtering, and Jaccard
similarity are all shared with [duplicate detection](duplicate-detection.md)
— both checks call the same `tokenise()` and `jaccardSimilarity()`
functions from `detect-duplicates.ts`, so there is exactly one definition
of "how similar is this text" in the codebase.

---

## The four heuristics

Each is independent, deterministic, and reported separately so a finding
always says exactly which check triggered and why.

### 1. Prompt drift

Computes `Jaccard(purposeTokens, promptsTokens)`. If the score falls below
`PROMPT_DRIFT_THRESHOLD` (default `0.015`), the prompts share almost no
vocabulary with the skill's own description/content — a strong signal the
prompts belong to a different capability entirely.

### 2. Example drift

Same idea, applied to `examples/` against `EXAMPLE_DRIFT_THRESHOLD`
(default `0.03`).

### 3. Possible copy (prompts / examples)

For a skill's `prompts/` (or `examples/`) tokens, the validator computes:

- **own score** — Jaccard against the skill's *own* purpose tokens.
- **best-other score** — the highest Jaccard against *any other* skill's
  purpose tokens.

If `bestOtherScore - ownScore >= COPY_MARGIN` (default `0.06`) **and**
`bestOtherScore >= COPY_MIN_OTHER_SCORE` (default `0.12`), the material is
flagged as possibly copied or adapted from that other skill without being
updated for the current one.

This is checked independently for `prompts/` and `examples/`, so a finding
always names the specific subdirectory and the specific other skill it
matches better.

### 4. Missing concept coverage

The top `TOP_KEYWORD_COUNT` (default `5`) most frequent non-stop-word
tokens in the `description` are treated as the skill's primary concepts
(ties broken alphabetically for determinism). The validator checks how
many of them appear anywhere across `prompts/`, `examples/`, and
`content/` combined.

If fewer than `MIN_COVERAGE_RATIO` (default `0.3`, i.e. 30%) of the
keywords are covered, the finding lists exactly which keywords are
missing — a quick pointer to what the supporting material should
reinforce but currently doesn't.

---

## Threshold calibration

Every default threshold above was calibrated against this repository's
actual skill corpus — 146 skills, all with `examples/`, most with
`prompts/` — so that, as of calibration, **zero findings** are produced
against genuine, on-topic material:

| Constant | Default | Calibration basis |
|----------|---------|--------------------|
| `PROMPT_DRIFT_THRESHOLD` | `0.015` | Below the lowest legitimate prompt-vs-purpose score observed (~0.018) |
| `EXAMPLE_DRIFT_THRESHOLD` | `0.03` | Below the lowest legitimate example-vs-purpose score observed (~0.041) |
| `COPY_MARGIN` | `0.06` | Above the highest legitimate cross-skill margin observed (~0.059) |
| `COPY_MIN_OTHER_SCORE` | `0.12` | Keeps low-score-vs-low-score pairs from triggering on margin alone |
| `MIN_COVERAGE_RATIO` | `0.3` | Below the lowest legitimate keyword-coverage ratio observed (0.4) |
| `TOP_KEYWORD_COUNT` | `5` | Small enough to stay focused on genuinely primary concepts |
| `MIN_PURPOSE_TOKENS` | `5` | Skips skills whose description/content is too small to compare against reliably |

All constants are exported from `semantic-validation.ts` so they can be
tuned by maintainers if the corpus grows or drifts.

---

## Interpreting warnings

A finding looks like this in the validator output:

```text
WARN  hr-onboarding: [semantic-warning] (possible-copy-prompts, confidence 42%) prompts/:
  prompts/ matches "hr-payroll"'s description/content (Jaccard 58%) more closely
  than it matches "hr-onboarding"'s own (Jaccard 16%). This material may have
  been copied or adapted from "hr-payroll" without updating it for this skill.
```

### Suggested maintainer action per heuristic

| Heuristic | What it means | Suggested action |
|-----------|----------------|-------------------|
| `prompt-drift` | `prompts/` is nearly unrelated to the skill's own purpose | Confirm the prompts weren't misfiled; rewrite or relocate them |
| `example-drift` | `examples/` describes an unrelated workflow | Confirm the example matches this skill's actual use case |
| `possible-copy-prompts` / `possible-copy-examples` | Content reads closer to another named skill | Compare against that skill; adapt the wording to this skill's domain, or genuinely deduplicate |
| `missing-coverage` | Core description concepts never show up in supporting material | Add a prompt or example that actually exercises the missing concept(s) |

---

## Why warnings are informational, not blocking

Semantic validation is a **quality signal**, not a correctness check, for
the same reasons given in [duplicate detection](duplicate-detection.md):

- Two closely related skills can legitimately share vocabulary.
- The heuristic is purely lexical — it cannot understand meaning, only
  measure vocabulary overlap.
- Deciding whether to rewrite, relocate, or leave content as-is is a
  human judgment call.

Findings are emitted after per-skill structural validation and
duplicate-content detection, and **do not affect the exit code**. CI
passes regardless of how many semantic warnings are reported.

---

## Limitations

- **No semantic understanding.** Like duplicate detection, this is purely
  lexical (token/Jaccard) — two skills covering the same idea with very
  different vocabulary will not be flagged, and two skills using similar
  wording for genuinely different purposes could be.
- **No ML, embeddings, or external calls.** By design (see
  [`docs/ROADMAP.md`](../ROADMAP.md#62-quality-automation)), this stays
  fully local, dependency-free, and network-free.
- **Small-sample noise.** Very short `description` or `prompts/`/`examples/`
  files produce coarse similarity scores; `MIN_PURPOSE_TOKENS` mitigates
  but does not eliminate this.
- **Static thresholds.** As the skill corpus grows, thresholds calibrated
  against today's 146 skills may need revisiting — see the constants
  table above.
- **Cross-skill copy check is O(n²).** For each skill's `prompts/` or
  `examples/`, the best-other-match search compares against every other
  skill's purpose tokens. This is cheap at the current corpus size but is
  worth revisiting if the skill count grows an order of magnitude.

---

## Running semantic validation

Semantic validation runs automatically as part of the standard validation
command, immediately after duplicate-content detection:

```bash
bun run validate          # from repo root
# or
bun run validate       # from packages/hr-skills-build/
```

Warnings from duplicate detection and semantic validation are merged into
one `Quality warnings` summary, printed after per-skill validation
results and before the final pass/fail summary.

---

## Determinism guarantee

The validator is fully deterministic:

- Skills are loaded and processed in alphabetical order.
- `content/`, `prompts/`, and `examples/` files are read in alphabetical
  filename order before being concatenated.
- The best-other-match search for possible-copy findings iterates skills
  in a fixed, pre-sorted order.
- Findings are sorted by skill name, then by heuristic name.
- No timestamps, random values, or external services are used.

Running the validator twice against the same repository state produces
byte-for-byte identical warnings.
