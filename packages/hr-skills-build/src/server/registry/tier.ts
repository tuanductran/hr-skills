import type { Tier } from '../../shared/types.js';

/**
 * Compute a skill's maturity tier based on which optional subdirectories it contains.
 *
 * Tier rules:
 * - `'full'`    — all three subdirectories (`content/`, `prompts/`, `examples/`) are present.
 * - `'bare'`    — none of the subdirectories are present.
 * - `'partial'` — one or two subdirectories are present.
 *
 * This is the single source of truth for tier classification — used by both
 * `build/generate-skill-matrix.ts` and `registry/registry.ts` so the matrix
 * and the registry can never disagree about a skill's tier.
 *
 * @param hasContent - Whether the `content/` subdirectory exists and is non-empty.
 * @param hasPrompts - Whether the `prompts/` subdirectory exists and is non-empty.
 * @param hasExamples - Whether the `examples/` subdirectory exists and is non-empty.
 * @returns The computed {@link Tier} for the skill.
 */
export function computeTier(
	hasContent: boolean,
	hasPrompts: boolean,
	hasExamples: boolean,
): Tier {
	const subDirCount = [hasContent, hasPrompts, hasExamples].filter(Boolean).length;

	return subDirCount === 0 ? 'bare' : subDirCount === 3 ? 'full' : 'partial';
}

/**
 * Return the emoji icon associated with a skill maturity tier.
 *
 * - `'full'`    → `'🟢'`
 * - `'partial'` → `'🟡'`
 * - `'bare'`    → `'🔴'`
 *
 * @param tier - The skill's maturity tier.
 * @returns A single emoji string representing the tier.
 */
export function tierIcon(tier: Tier): string {
	if (tier === 'full') return '🟢';
	if (tier === 'partial') return '🟡';
	return '🔴';
}

/**
 * Return the human-readable display label for a skill maturity tier.
 *
 * @param tier - The skill's maturity tier.
 * @returns `'Full'`, `'Partial'`, or `'Bare'`.
 */
export function tierLabel(tier: Tier): string {
	if (tier === 'full') return 'Full';
	if (tier === 'partial') return 'Partial';
	return 'Bare';
}
