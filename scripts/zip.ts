import { readdir, rm, stat } from 'node:fs/promises';
import { join } from 'node:path';

const SKILLS_DIR = join(process.cwd(), 'skills');

/**
 * Cross-platform junk files that should NEVER be included in zip archives.
 *
 * Covers:
 * - macOS metadata (.DS_Store, __MACOSX)
 * - Windows system artifacts (Thumbs.db, desktop.ini)
 * - Linux file manager metadata
 * - Git metadata
 * - General hidden/system files (dotfiles)
 * - Temporary editor/system files
 */
const EXCLUDED_PATTERNS: readonly string[] = [
	// macOS system files
	'.DS_Store',
	'__MACOSX',

	// Windows system files
	'Thumbs.db',
	'desktop.ini',
	'$RECYCLE.BIN',

	// Linux / desktop environments
	'.directory',

	// Git metadata (should never be shipped inside archives)
	'.git',
	'.gitignore',
	'.gitkeep',

	// General hidden files (dotfiles)
	// This ensures files like .env, .config, .cache are excluded if they appear
	'.*',

	// Editor / IDE junk
	'.vscode',
	'.idea',

	// Python / Node / build artifacts (optional but common noise)
	'__pycache__',
	'node_modules',
];

/**
 * Remove previously generated zip files inside the skills directory.
 */
async function removeExistingZipFiles(): Promise<void> {
	const entries = await readdir(SKILLS_DIR);

	await Promise.all(
		entries
			.filter((entry) => entry.endsWith('.zip'))
			.map((entry) =>
				rm(join(SKILLS_DIR, entry), {
					force: true,
				}),
			),
	);
}

/**
 * Get all skill directories inside SKILLS_DIR.
 */
async function getSkillDirectories(): Promise<string[]> {
	const entries = await readdir(SKILLS_DIR);

	const directories: string[] = [];

	for (const entry of entries) {
		const fullPath = join(SKILLS_DIR, entry);
		const entryStat = await stat(fullPath);

		if (entryStat.isDirectory()) {
			directories.push(entry);
		}
	}

	return directories.sort();
}

/**
 * Convert exclude patterns into zip CLI arguments.
 *
 * The zip -x option matches file paths inside the archive.
 */
function createExcludeArgs(): string[] {
	return EXCLUDED_PATTERNS.flatMap((pattern) => ['-x', `*/${pattern}`]);
}

/**
 * Create a zip archive for a single skill directory.
 *
 * Uses system `zip` command with recursive + exclude rules.
 */
async function zipSkillDirectory(skillName: string): Promise<void> {
	const zipFileName = `${skillName}.zip`;

	const result = Bun.spawnSync({
		cmd: ['zip', '-r', '-X', zipFileName, skillName, ...createExcludeArgs()],
		cwd: SKILLS_DIR,
		stdout: 'inherit',
		stderr: 'inherit',
	});

	if (result.exitCode !== 0) {
		throw new Error(`Failed to create zip archive: ${zipFileName}`);
	}

	console.log(`✔ Created ${zipFileName}`);
}

/**
 * Ensure `zip` CLI is available in system PATH.
 */
async function validateZipCommand(): Promise<void> {
	const result = Bun.spawnSync({
		cmd: ['zip', '--version'],
		stdout: 'ignore',
		stderr: 'ignore',
	});

	if (result.exitCode !== 0) {
		throw new Error('The `zip` CLI is not installed or not available in PATH.');
	}
}

/**
 * Main execution flow:
 * 1. Validate zip command exists
 * 2. Clean old zip files
 * 3. Collect all skill directories
 * 4. Generate zip archive per skill
 */
async function main(): Promise<void> {
	console.log('◐ Generating skill zip packages...');

	await validateZipCommand();

	await removeExistingZipFiles();

	const skills = await getSkillDirectories();

	for (const skill of skills) {
		await zipSkillDirectory(skill);
	}

	console.log(`✔ Generated ${skills.length} zip packages`);
}

await main();
