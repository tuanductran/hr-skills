import { cp, mkdir, mkdtemp, readdir, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const ROOT_DIR = join(import.meta.dir, '..');
const BUNDLE_DIR = join(ROOT_DIR, 'bundle');
const SKILLS_DIR = join(ROOT_DIR, 'skills');

interface SkillBundle {
	readonly skillDir: string;
	readonly skillName: string;
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

/**
 * Build a SkillBundle for a given skill name.
 */
async function buildBundle(skillName: string): Promise<SkillBundle> {
	return {
		skillName,
		skillDir: join(SKILLS_DIR, skillName),
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
	const { skillDir, skillName } = bundle;

	const tmpBase = await mkdtemp(join(tmpdir(), `skill-${skillName}-`));

	try {
		const stageDir = join(tmpBase, skillName);

		await cp(skillDir, stageDir, {
			recursive: true,
			force: true,
		});

		const zipFileName = `${skillName}.zip`;

		const result = Bun.spawnSync({
			cmd: ['zip', '-r', '-X', join(BUNDLE_DIR, zipFileName), skillName],
			cwd: tmpBase,
			stdout: 'inherit',
			stderr: 'inherit',
		});

		if (result.exitCode !== 0) {
			throw new Error(`Failed to create zip archive: ${zipFileName}`);
		}

		console.log(`✔ ${skillName}.zip`);
	} finally {
		await rm(tmpBase, { recursive: true, force: true });
	}
}

// -----------------------------------------------------------------------------
// Cleanup
// -----------------------------------------------------------------------------

async function removeExistingZipFiles(): Promise<void> {
	const entries = await readdir(BUNDLE_DIR);

	await Promise.all(
		entries
			.filter((entry) => entry.endsWith('.zip'))
			.map((entry) => rm(join(BUNDLE_DIR, entry), { force: true })),
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
