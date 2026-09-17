import { readdir, stat } from 'node:fs/promises';

/**
 * Check whether a filesystem path exists and is a directory.
 *
 * @param path - The filesystem path to check.
 * @returns A promise that resolves to `true` if `path` is an existing directory,
 *   or `false` if it does not exist or is not a directory.
 */
export async function dirExists(path: string): Promise<boolean> {
	try {
		const s = await stat(path);
		return s.isDirectory();
	} catch {
		return false;
	}
}

/**
 * Count the number of `.md` files directly inside a directory.
 * Returns `0` if the directory does not exist or cannot be read.
 *
 * @param dirPath - The absolute path to the directory to inspect.
 * @returns A promise that resolves to the count of `.md` files found.
 */
export async function countFiles(dirPath: string): Promise<number> {
	try {
		const entries = await readdir(dirPath);
		return entries.filter((f) => f.endsWith('.md')).length;
	} catch {
		return 0;
	}
}
