import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const ROOT_DIR = join(import.meta.dir, '..');

const CLEAN_DIRECTORIES = ['dist', '.turbo'] as const;

/**
 * Recursively collect build artifact directories.
 */
async function findDirectoriesToClean(
	dir: string,
	results: string[] = [],
): Promise<string[]> {
	const entries = await readdir(dir, {
		withFileTypes: true,
	});

	for (const entry of entries) {
		if (!entry.isDirectory()) {
			continue;
		}

		const fullPath = join(dir, entry.name);

		if (
			CLEAN_DIRECTORIES.includes(entry.name as (typeof CLEAN_DIRECTORIES)[number])
		) {
			results.push(fullPath);
			continue;
		}

		// Skip heavy directories we never need to traverse.
		if (entry.name === 'node_modules' || entry.name === '.git') {
			continue;
		}

		await findDirectoriesToClean(fullPath, results);
	}

	return results;
}

/**
 * Remove all build artifacts.
 */
async function cleanBuildArtifacts(): Promise<number> {
	const directories = await findDirectoriesToClean(ROOT_DIR);

	await Promise.all(
		directories.map((directory) =>
			rm(directory, {
				recursive: true,
				force: true,
			}),
		),
	);

	return directories.length;
}

/**
 * Main execution flow.
 */
async function main(): Promise<void> {
	console.log('◐ Cleaning build artifacts...');

	const removedCount = await cleanBuildArtifacts();

	console.log(`✔ Removed ${removedCount} directories`);
}

await main();
