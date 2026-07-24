# Skill Planner

> Phase 4.2 of the [roadmap](ROADMAP.md) — deterministic workflow planning from user intent.

## What it is

The Skill Planner transforms user intent (natural language) into an execution plan (a structured list of skills to use and why).

It is responsible for:

- Understanding what the user is asking for (intent analysis)
- Matching those requests against available skills (capability matching)
- Selecting appropriate skills (skill selection)
- Ordering skills for logical execution (dependency-aware ordering)
- Producing an explainable plan (with reasoning for every decision)

The planner is **NOT** responsible for:

- Executing skills
- Invoking tools
- Generating prompts
- Calling models
- Mutating state

These belong to the Workflow Runtime (Phase 4.3).

## Architecture

The planner consists of three layers:

```text
User Intent
    ↓
Intent Analysis (analyzeIntent)
    ↓
Capability Matching (matchCapabilityAgainstRegistry)
    ↓
Skill Selection & Ordering (selectSkills, buildExecutionSteps)
    ↓
Execution Plan (ExecutionPlan struct)
```

### Intent Analysis

Converts natural language into a list of capabilities the user is requesting.

**Method:** Simple, deterministic heuristic splitting:

- Split on `,`, `;`, `and`, `or`, `then`
- Normalize to lowercase
- Remove filler words (`a`, `the`, `for`, etc.)

**Why not ML?** Determinism is more important than accuracy at this stage. The planner's decisions must be explainable and reproducible. If semantic analysis becomes necessary, it can be added as an extension without breaking existing workflows.

### Capability Matching

Matches each requested capability against the Skill Registry using similarity scoring.

**Method:** Token-based Jaccard similarity:

1. Extract words from both the requested capability and each skill's declared capabilities
2. Calculate overlap / union (Jaccard)
3. Keep matches scoring > 0.3
4. Rank by score (ties broken alphabetically)

**Match types:**

- **Direct:** Exact word overlap between requested capability and skill's stated capabilities
- **Partial:** Semantic similarity (Jaccard score) suggests the skill might help

### Skill Selection

Chooses which skills to include in the plan based on matched capabilities.

**Algorithm:**

1. For each matched capability, select the top-ranked skill
2. Add all dependencies of selected skills (recursively)
3. Add related skills if plan is under-specified (< 8 skills)
4. Limit depth to prevent bloat (max 8 skills)

### Dependency-Aware Ordering

Sorts selected skills using topological sort (Kahn's algorithm) to ensure dependencies always execute first.

**Properties:**

- Deterministic (same input always produces same order)
- Respects all dependency constraints
- Breaks circular dependencies (defensive) by taking the first remaining skill

## Execution Plan Format

```typescript
interface ExecutionPlan {
  // User's normalized intent
  intent: string;

  // Extracted capabilities from intent
  requestedCapabilities: string[];

  // How each capability matched against registry
  capabilityMatches: CapabilityMatch[];

  // Ordered list of skills to execute
  steps: ExecutionStep[];

  // Human-readable summary
  summary: string;

  // Complexity assessment: simple, moderate, complex
  complexity: 'simple' | 'moderate' | 'complex';

  // Optional warnings or notes
  notes?: string[];
}
```

### CapabilityMatch

```typescript
interface CapabilityMatch {
  capability: string;
  matches: Array<{
    skillId: string;
    matchType: 'direct' | 'partial' | 'related';
    score: number;
    explanation: string;
  }>;
  isMatched: boolean;
  unmatchedReason?: string;
}
```

### ExecutionStep

```typescript
interface ExecutionStep {
  skillId: string;
  order: number;
  reason: 'direct-capability-match' | 'alias-match' | 'domain-expert' |
          'dependency-requirement' | 'recommended-pairing' | 'related-skill';
  rationale?: string;
  dependencies: string[];
  contextInputs?: Record<string, unknown>;
}
```

The `reason` field is crucial for explainability — it tells future developers (and the user) exactly why this skill was included.

## Usage

### CLI

Generate a plan and save to `execution-plan.json`:

```bash
bun src/generate-plan.ts "create interview questions for a senior manager"
```

Output includes:

- Matching analysis (which capabilities matched which skills)
- Execution steps (ordered with reasoning)
- Validation results (any issues detected)
- Suggestions (improvements the user might consider)

### Programmatic

```typescript
import { generateExecutionPlan } from './planner.js';
import { buildRegistry } from './registry.js';
import { validateExecutionPlan } from './validate-planner.js';

const registry = await buildRegistry();
const plan = generateExecutionPlan('create an onboarding plan', registry);
const validation = validateExecutionPlan(plan, registry);

if (!validation.isValid) {
  console.error('Plan has issues:', validation.issues);
}
```

## Validation

`validateExecutionPlan()` detects common issues:

1. **Duplicate steps** — skill appears twice in plan
2. **Dangling references** — step references skill not in registry
3. **Dependency order violations** — dependency executes after dependent
4. **Circular dependencies** — cycle in skill dependencies
5. **Unmatched capabilities** — requested capability has no match (warning)
6. **Empty plans** — no steps generated (warning)
7. **Order field inconsistency** — step order fields not sequential

### Improvement Suggestions

`suggestPlanImprovements()` offers non-binding suggestions:

- Plan is too simple or too complex for the request
- Unmatched capabilities might need refinement
- Independent skills could potentially be parallelized

## Determinism

The planner is **fully deterministic**:

- Same user intent → same execution plan
- Same registry state → same matching results
- No randomness, no external ranking signals, no ML models

This makes plans reproducible, testable, and debuggable.

## Integration Points

### Skill Registry (Phase 4.1)

The planner consumes `registry/skills.json` generated by Phase 4.1.

**Never:**

- Parse `SKILL.md` directly
- Maintain parallel metadata
- Hardcode skill information

**Always:**

- Read from the registry
- Leverage existing metadata (domain, tags, capabilities, dependencies)
- Validate against registry schema

### Workflow Runtime (Phase 4.3)

The planner produces `ExecutionPlan` — the runtime's input.

**The planner provides:**

- What skills to execute
- Why each skill was selected
- Execution order with dependencies
- Estimated complexity

**The runtime will handle:**

- Actually executing skills
- Context propagation between steps
- Retry and failure handling
- Runtime state management

## Extension Guidelines

### Adding a capability source

If you want to derive more metadata for matching (e.g. keywords in `SKILL.md` tips):

1. Add extraction logic to `buildRegistry()` in `registry.ts`
2. Store in `RegistryEntry`
3. Use in `matchCapabilityAgainstRegistry()` to improve matching

### Improving intent analysis

Replace `analyzeIntent()` with a more sophisticated approach:

- Semantic tokenization
- Synonym expansion
- Context-aware parsing

The interface (`intent: string → capabilities: string[]`) doesn't change — swapping implementations is safe.

### Custom matching algorithm

Replace `matchCapabilityAgainstRegistry()` if needed:

- BM25 scoring
- Word embeddings
- Semantic similarity
- Keyword boosting

Keep the output signature (`capability: string → CapabilityMatch`) stable.

### Adding new selection strategies

`selectSkills()` is where you'd add:

- User preference for skill tier (full > partial > bare)
- Domain expertise weighting
- Feedback from previous executions
- Manual override hints in the registry

## Testing

Run planner tests:

```bash
bun test packages/hr-skills-build/test/planner.test.ts
```

Tests cover:

- Intent analysis (basic, with filler words, empty input)
- Capability matching (direct match, partial, unmatched)
- Plan generation (simple and complex scenarios)
- Validation (correct plans, common issues)
- Suggestions (complexity warnings, coverage gaps)

## Future Improvements

Potential enhancements beyond the initial implementation:

1. **Semantic intent analysis** — move beyond token splitting to understand domain-specific language
2. **Multi-turn planning** — refine plans based on user feedback iteratively
3. **User preference modeling** — learn which skills users prefer for similar requests
4. **Capability versioning** — track how skill capabilities change over time
5. **Execution metrics** — collect success/failure data to improve matching
6. **Skill recommendations** — suggest new skills that would improve coverage
7. **Parallel execution** — identify independent steps for concurrent execution
8. **Branching plans** — support conditional execution (`if...then...else`)
9. **Fallback strategies** — suggest alternative skills if primary ones fail

---

Last updated: July 23, 2026
