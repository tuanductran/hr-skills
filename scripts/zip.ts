import { createHash } from 'node:crypto';
import {
	cp,
	mkdir,
	mkdtemp,
	readdir,
	readFile,
	rm,
	stat,
	writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';

const ROOT_DIR = join(import.meta.dir, '..');
const BUNDLE_DIR = join(ROOT_DIR, 'bundle');
const SKILLS_DIR = join(ROOT_DIR, 'skills');

interface SkillBundle {
	readonly skillDir: string;
	readonly skillName: string;
}

/**
 * Get all skill names.
 */
async function getSkillNames(): Promise<string[]> {
	const entries = await readdir(SKILLS_DIR);
	const names: string[] = [];

	for (const entry of entries) {
		if (entry.endsWith('.zip')) continue;

		const fullPath = join(SKILLS_DIR, entry);
		const info = await stat(fullPath);

		if (info.isDirectory()) {
			names.push(entry);
		}
	}

	return names.sort();
}

async function buildBundle(skillName: string): Promise<SkillBundle> {
	return {
		skillName,
		skillDir: join(SKILLS_DIR, skillName),
	};
}

// -----------------------------------------------------------------------------
// Hash
// -----------------------------------------------------------------------------

async function hashDirectory(dir: string): Promise<string> {
	const hash = createHash('sha256');

	async function walk(current: string): Promise<void> {
		const entries = await readdir(current, {
			withFileTypes: true,
		});

		entries.sort((a, b) => a.name.localeCompare(b.name));

		for (const entry of entries) {
			const full = join(current, entry.name);

			if (entry.isDirectory()) {
				hash.update(relative(dir, full));
				await walk(full);
				continue;
			}

			hash.update(relative(dir, full));
			hash.update(await readFile(full));
		}
	}

	await walk(dir);

	return hash.digest('hex');
}

// -----------------------------------------------------------------------------
// Zip
// -----------------------------------------------------------------------------

async function zipBundle(bundle: SkillBundle): Promise<void> {
	const { skillDir, skillName } = bundle;

	const hash = await hashDirectory(skillDir);

	const hashFile = join(BUNDLE_DIR, `${skillName}.sha256`);

	let previousHash = '';

	try {
		previousHash = await readFile(hashFile, 'utf8');
	} catch {
		// first build
	}

	if (previousHash === hash) {
		console.log(`↷ ${skillName}.zip (unchanged)`);
		return;
	}

	const tmpBase = await mkdtemp(join(tmpdir(), `skill-${skillName}-`));

	try {
		const stageDir = join(tmpBase, skillName);

		await cp(skillDir, stageDir, {
			recursive: true,
			force: true,
		});

		const zipName = `${skillName}.zip`;

		const result = Bun.spawnSync({
			cmd: ['zip', '-r', '-X', join(BUNDLE_DIR, zipName), skillName],
			cwd: tmpBase,
			stdout: 'inherit',
			stderr: 'inherit',
		});

		if (result.exitCode !== 0) {
			throw new Error(`Failed to create ${zipName}`);
		}

		await writeFile(hashFile, hash);

		console.log(`✔ ${zipName}`);
	} finally {
		await rm(tmpBase, {
			recursive: true,
			force: true,
		});
	}
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
		throw new Error('The `zip` CLI is not installed.');
	}
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main(): Promise<void> {
	console.log('◐ Generating skill zip packages...\n');

	validateZipCommand();

	await mkdir(BUNDLE_DIR, {
		recursive: true,
	});

	const skillNames = await getSkillNames();

	const bundles = await Promise.all(skillNames.map(buildBundle));

	for (const bundle of bundles) {
		await zipBundle(bundle);
	}

	console.log(`\n✔ Processed ${bundles.length} skills`);
}

await main();
