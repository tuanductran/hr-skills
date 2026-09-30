/**
 * Registry access for the HTTP adapter.
 *
 * Reads the committed `registry/skills.json` artifact (the same one `apps/web` and
 * `apps/discord-bot` consume) rather than rebuilding the registry per request.
 * Failures are not cached, so a later request can recover.
 */

import { join } from 'node:path';
import type { Registry } from 'hr-skills-build/server';
import { ROOT_DIR } from 'hr-skills-ref/server';

const REGISTRY_PATH = join(ROOT_DIR, 'registry', 'skills.json');

let cachedRegistry: Registry | undefined;

export type RegistryProvider = () => Promise<Registry>;

export const loadRegistry: RegistryProvider = async () => {
	if (cachedRegistry) return cachedRegistry;

	const file = Bun.file(REGISTRY_PATH);

	if (!(await file.exists())) {
		throw new Error(
			'Registry artifact not found. Run "bun run registry" at the repo root.',
		);
	}

	cachedRegistry = (await file.json()) as Registry;
	return cachedRegistry;
};
