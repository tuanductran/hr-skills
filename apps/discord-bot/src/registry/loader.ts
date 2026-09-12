/**
 * Registry file access for the bot.
 *
 * The bot never parses `SKILL.md` files or rebuilds the registry itself —
 * it reads the committed `registry/skills.json` artifact (the same one
 * `apps/web` consumes).
 */

import { join } from 'node:path';
import type { Registry } from 'hr-skills-build/client';
import { ROOT_DIR } from 'hr-skills-ref/server';

const REGISTRY_PATH = join(ROOT_DIR, 'registry', 'skills.json');

let cachedRegistry: Registry | undefined;

/**
 * Load `registry/skills.json` once and cache it in memory for the life of
 * the process. The registry only changes on redeploy (`bun run registry`
 * runs in CI, not at bot runtime), so re-reading it per-interaction would
 * be wasted I/O.
 */
export async function loadRegistry(): Promise<Registry> {
	if (cachedRegistry) return cachedRegistry;

	const file = Bun.file(REGISTRY_PATH);

	if (!(await file.exists())) {
		throw new Error(
			`Registry not found at ${REGISTRY_PATH}. Run "bun run registry" at the repo root first.`,
		);
	}

	cachedRegistry = (await file.json()) as Registry;
	return cachedRegistry;
}
