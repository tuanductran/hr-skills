import { copyFile, mkdir, mkdtemp, readdir, readFile, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';

const ROOT_DIR = join(import.meta.dir, '..');
const BUNDLE_DIR = join(ROOT_DIR, 'bundle');
const SKILLS_DIR = join(ROOT_DIR, 'skills');
const CONTENT_DIR = join(ROOT_DIR, 'content');
const EXAMPLES_DIR = join(ROOT_DIR, 'examples');
const OUT_DIR = BUNDLE_DIR;

interface SkillBundle {
	readonly contentFiles: readonly string[];
	readonly exampleFiles: readonly string[];
	readonly skillMdPath: string;
	readonly skillName: string;
}

// -----------------------------------------------------------------------------
// Minimal frontmatter field extractor
// -----------------------------------------------------------------------------

/**
 * Extract a single field value from YAML frontmatter.
 * Does not need a full YAML parser — just key: value lookup.
 */
function extractField(content: string, field: string): string | null {
	if (!content.startsWith('---')) {
		return null;
	}

	const closeIndex = content.indexOf('\n---', 3);

	if (closeIndex === -1) {
		return null;
	}

	const frontmatter = content.slice(3, closeIndex);

	const regex = new RegExp(`^${field}:\\s*["']?([^"'\\n]+?)["']?\\s*$`, 'm');

	const match = frontmatter.match(regex);

	const value = match?.[1];

	return value?.trim() ?? null;
}

// -----------------------------------------------------------------------------
// Directory scanners
// -----------------------------------------------------------------------------

/**
 * Collect all .md files in a directory (non-recursive).
 */
async function collectMdFiles(dir: string): Promise<string[]> {
	let entries: string[];

	try {
		entries = await readdir(dir);
	} catch {
		return [];
	}

	const mdFiles: string[] = [];

	for (const entry of entries) {
		if (!entry.endsWith('.md')) {
			continue;
		}

		const fullPath = join(dir, entry);
		const entryStat = await stat(fullPath);

		if (entryStat.isFile()) {
			mdFiles.push(fullPath);
		}
	}

	return mdFiles;
}

/**
 * Get all skill names from SKILLS_DIR subdirectories.
 */
async function getSkillNames(): Promise<string[]> {
	const entries = await readdir(SKILLS_DIR);
	const names: string[] = [];

	for (const entry of entries) {
		if (entry.endsWith('.zip')) {
			continue;
		}

		const fullPath = join(SKILLS_DIR, entry);
		const entryStat = await stat(fullPath);

		if (entryStat.isDirectory()) {
			names.push(entry);
		}
	}

	return names.sort();
}

// -----------------------------------------------------------------------------
// Bundle builder
// -----------------------------------------------------------------------------

/**
 * Find all content files whose `skill` field matches skillName.
 */
async function findContentFiles(skillName: string): Promise<string[]> {
	const skillContentDir = join(CONTENT_DIR, skillName);
	const files = await collectMdFiles(skillContentDir);
	const matched: string[] = [];

	for (const file of files) {
		const content = await readFile(file, 'utf8');
		const skill = extractField(content, 'skill');

		if (skill === skillName) {
			matched.push(file);
		}
	}

	return matched;
}

/**
 * Find all example files whose `reference` field matches skillName.
 */
async function findExampleFiles(skillName: string): Promise<string[]> {
	const skillExamplesDir = join(EXAMPLES_DIR, skillName);
	const files = await collectMdFiles(skillExamplesDir);
	const matched: string[] = [];

	for (const file of files) {
		const content = await readFile(file, 'utf8');
		const reference = extractField(content, 'reference');

		if (reference === skillName) {
			matched.push(file);
		}
	}

	return matched;
}

/**
 * Build a SkillBundle for a given skill name.
 */
async function buildBundle(skillName: string): Promise<SkillBundle> {
	const skillMdPath = join(SKILLS_DIR, skillName, 'SKILL.md');

	const [contentFiles, exampleFiles] = await Promise.all([
		findContentFiles(skillName),
		findExampleFiles(skillName),
	]);

	return {
		skillName,
		skillMdPath,
		contentFiles,
		exampleFiles,
	};
}

// -----------------------------------------------------------------------------
// Zip creation
// -----------------------------------------------------------------------------

/**
 * Builds a zip distribution bundle for a skill.
 *
 * Files are staged in a temporary directory and packaged into a
 * self-contained archive containing the skill definition, content,
 * and examples.
 */
async function zipBundle(bundle: SkillBundle): Promise<void> {
	const { skillName, skillMdPath, contentFiles, exampleFiles } = bundle;

	const tmpBase = await mkdtemp(join(tmpdir(), `skill-${skillName}-`));

	try {
		const stageDir = join(tmpBase, skillName);
		const contentStageDir = join(stageDir, 'content');
		const examplesStageDir = join(stageDir, 'examples');

		await mkdir(stageDir, { recursive: true });

		// Copy SKILL.md
		await copyFile(skillMdPath, join(stageDir, 'SKILL.md'));

		// Copy content files
		if (contentFiles.length > 0) {
			await mkdir(contentStageDir, { recursive: true });

			await Promise.all(
				contentFiles.map((file) =>
					copyFile(file, join(contentStageDir, basename(file))),
				),
			);
		}

		// Copy example files
		if (exampleFiles.length > 0) {
			await mkdir(examplesStageDir, { recursive: true });

			await Promise.all(
				exampleFiles.map((file) =>
					copyFile(file, join(examplesStageDir, basename(file))),
				),
			);
		}

		// Create zip from staged directory
		const zipFileName = `${skillName}.zip`;

		const result = Bun.spawnSync({
			cmd: ['zip', '-r', '-X', join(OUT_DIR, zipFileName), skillName],
			cwd: tmpBase,
			stdout: 'inherit',
			stderr: 'inherit',
		});

		if (result.exitCode !== 0) {
			throw new Error(`Failed to create zip archive: ${zipFileName}`);
		}

		console.log(
			`✔ ${skillName}.zip` +
				` (content: ${contentFiles.length}, examples: ${exampleFiles.length})`,
		);
	} finally {
		await rm(tmpBase, { recursive: true, force: true });
	}
}

// -----------------------------------------------------------------------------
// Cleanup
// -----------------------------------------------------------------------------

async function removeExistingZipFiles(): Promise<void> {
	const entries = await readdir(OUT_DIR);

	await Promise.all(
		entries
			.filter((entry) => entry.endsWith('.zip'))
			.map((entry) => rm(join(OUT_DIR, entry), { force: true })),
	);
}

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

function validateZipCommand(): void {
	const result = Bun.spawnSync({
		cmd: ['zip', '--version'],
		stdout: 'ignore',
		stderr: 'ignore',
	});

	if (result.exitCode !== 0) {
		throw new Error('The `zip` CLI is not installed or not available in PATH.');
	}
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main(): Promise<void> {
	console.log('◐ Generating skill zip packages...\n');

	validateZipCommand();

	await mkdir(BUNDLE_DIR, { recursive: true });

	await removeExistingZipFiles();

	const skillNames = await getSkillNames();

	const bundles = await Promise.all(skillNames.map(buildBundle));

	for (const bundle of bundles) {
		await zipBundle(bundle);
	}

	console.log(`\n✔ Generated ${bundles.length} zip packages`);
}

await main();
