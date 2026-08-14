# Automated content quality scoring (Phase 6.2)

The repository validates structural correctness (`bun run validate`), flags
duplicate content ([`docs/engineering/duplicate-detection.md`](duplicate-detection.md)),
and checks semantic consistency between a skill's stated purpose and its
supporting material ([`docs/engineering/semantic-validation.md`](semantic-validation.md)).

Phase 6.2 adds a fourth quality layer: a **repeatable 0-100 content quality
score** per skill, across three dimensions — clarity, completeness, and
example coverage.

---

## Purpose

Structural validation (`validate.ts`) answers a binary question: *is this
skill well-formed?* — is the task count in `[8, 12]`, are the required
sections present, is the description at least 50 characters?

Quality scoring answers a softer, graded question: *how good is this skill,
given that it's already well-formed?* A skill can pass `bun run validate`
with exactly 8 tasks and still score low on quality scoring if only 2 of
those tasks are backed by example prompts, or if its description is a wall
of run-on text with no clear trigger clause.

**This is a review aid, not a merge gate.** A low score should prompt a
maintainer to take a closer look during PR review — it never fails CI or
blocks a merge.

---

## Dimensions

| Dimension | Weight | What it measures |
|-----------|--------|-------------------|
| Clarity | 30% | Description length band, presence of a "Use when" trigger clause, and body readability (average words per sentence) |
| Completeness | 40% | How close task/tips/prompt-subtopic counts are to the *ideal center* of their accepted ranges (not just inside the min/max band), plus whether the body is substantially longer than the bare minimum |
| Example coverage | 30% | Whether `content/` and `examples/` material exists, and whether supported tasks are proportionally backed by quoted example prompts |

The overall score is the weighted sum, rounded to two decimal places, and is
always in `[0, 100]`.

### Why completeness is weighted highest

Completeness (40%) is the most actionable and most objective of the three —
task/tips/subtopic counts and content length are precise, hard to
mis-measure, and correlate directly with how much real guidance a skill
provides. Clarity and example coverage (30% each) are comparatively softer
signals: readability heuristics and prompt-density ratios are useful
directional indicators but carry more noise, so each individually
influences the overall score less.

---

## Clarity — how it's scored

```text
score = 0.4 × descriptionLengthScore
      + 0.3 × useWhenTriggerScore
      + 0.3 × readabilityScore
```

- **Description length** — full credit for 80-400 characters (the ideal
  band sits comfortably above the hard 50-character minimum enforced by
  `validate.ts`). Score falls off linearly outside the band.
- **"Use when" trigger** — full credit (100) if the description contains
  the phrase "Use when" (case-insensitive), 0 otherwise. This directly
  affects how reliably the router can match user intent to the skill.
- **Readability** — the SKILL.md body (with headings, list markers, code
  fences, and markdown formatting stripped) is split into sentences; full
  credit for an average of ≤22 words per sentence, falling off linearly
  beyond that.

## Completeness — how it's scored

```text
score = 0.3 × taskCountScore
      + 0.2 × tipsCountScore
      + 0.2 × promptSubtopicCountScore
      + 0.3 × contentLengthScore
```

Each count is scored against the *same* band `validate.ts` enforces as a
hard pass/fail range — but here, being **inside** the band scores 100, and
the score falls off linearly the further outside the band a count drifts,
rather than a flat pass/fail:

| Signal | Ideal band | Falloff distance |
|--------|-----------|-------------------|
| Supported tasks | 8-12 | 4 |
| Tips | 4-6 | 3 |
| Key-prompt subtopics | 3-6 | 3 |
| Body length | ≥ 2,500 chars (2.5× the 1,000-char hard minimum) | 1,000 chars |

## Example coverage — how it's scored

```text
score = 0.3 × hasContentScore
      + 0.3 × exampleFileCountScore
      + 0.4 × promptDensityScore
```

- **Has content** — 100 if `content/` exists and contains at least one
  `.md` file, 0 otherwise.
- **Example file count** — scales linearly up to 2 files (`min(count / 2,
  1) × 100`); a single example file still scores 50 but produces a note
  suggesting a second.
- **Prompt density** — the ratio of quoted example prompts (in `## Key
  prompts`) to supported tasks, capped at 1.0. The intuition: a
  well-covered skill has at least one worked prompt per task it claims to
  support.

---

## Bands

| Overall score | Band |
|----------------|------|
| ≥ 85 | `excellent` |
| ≥ 70 | `good` |
| ≥ 50 | `needs-review` |
| < 50 | `poor` |

As of this module's introduction, running it against the full 146-skill
corpus (already normalized to a consistent frontmatter/format standard)
produces scores ranging roughly 74-100, landing entirely in the
`excellent`/`good` bands — expected, since the corpus is mature. The
`needs-review`/`poor` bands exist to catch skills added later that skip the
polish the existing corpus already has.

---

## Public API

```ts
import {
  scoreSkillQuality,
  scoreSkills,
  scoreAllSkills,
  scoreClarity,
  scoreCompleteness,
  scoreExampleCoverage,
} from 'hr-skills-build';
```

- `scoreSkillQuality(skillsDir, skillName)` — full report for one skill.
  Accepts `skillsDir` explicitly (rather than hardcoding the repository's
  `skills/` directory) so it's testable against a temp directory, matching
  `loadSkillSemanticContent()`'s pattern in `semantic-validation.ts`.
- `scoreSkills(skillNames)` — reports for a specific subset of skills
  against the repository's real `skills/` directory. Used by CI to score
  only the skills touched by a pull request.
- `scoreAllSkills()` — reports for every skill in the repository.
- `scoreClarity()` / `scoreCompleteness()` / `scoreExampleCoverage()` — the
  three dimension scorers, exported individually for direct use or testing.

Each `SkillQualityScore` includes per-dimension `notes: string[]` explaining
*why* a dimension didn't score 100 — these notes are what CI surfaces in
its PR comment (see below).

---

## Running quality scoring

Unlike structural validation, quality scoring is not (yet) wired into
`bun run validate` — it's surfaced two ways:

1. **CI PR comment** — the automated review workflow
   (`.github/workflows/skill-review.yml`) computes quality scores for
   changed skills and includes them in its PR comment alongside
   `skill-vetter`'s security findings. See that workflow for details.
2. **Ad hoc** — call `scoreSkillQuality()` / `scoreSkills()` /
   `scoreAllSkills()` directly from a script, e.g.:

   ```ts
   import { scoreAllSkills } from 'hr-skills-build';

   const scores = await scoreAllSkills();
   const needsReview = scores.filter((s) => s.overall < 70);
   console.log(needsReview);
   ```

---

## Determinism guarantee

Like duplicate-detection and semantic-validation, quality scoring is pure
string/regex/file-count arithmetic over files already on disk:

- No network access, no AI/LLM calls, no embeddings.
- Same repository content always produces the same score.
- `scoreSkills()` and `scoreAllSkills()` process skills in a stable order.

---

## Limitations

- **Heuristic, not semantic.** Readability is measured by sentence length,
  not actual comprehensibility. Prompt density counts *quantity* of quoted
  prompts, not whether they're genuinely good examples.
- **Band centers were chosen, not derived from user research.** The
  "ideal" bands mirror `validate.ts`'s existing hard bands; the falloff
  distances are a reasonable starting calibration, not empirically tuned
  against reviewer judgments.
- **Doesn't read `prompts/`.** Prompt density counts prompts quoted
  directly inside `SKILL.md`'s `## Key prompts` section, not files under a
  separate `prompts/` subdirectory (which `semantic-validation.ts` already
  covers for drift/copy detection).
