import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as p from '@clack/prompts';
import { ROOT_DIR } from 'skills-ref';
import { buildDocumentationData } from '../docs/loader.js';

const DATA_DIRECTORY = join(ROOT_DIR, 'apps', 'web', 'data');
const DATA_PATH = join(DATA_DIRECTORY, 'skills.json');

/** Generates the deterministic data artifact consumed by the public documentation app. */
export async function generateDocumentationData(): Promise<boolean> {
	const documentationData = await buildDocumentationData();
	const nextContent = `${JSON.stringify(documentationData, null, 2)}\n`;

	await mkdir(DATA_DIRECTORY, { recursive: true });

	let currentContent: string | undefined;
	try {
		currentContent = await readFile(DATA_PATH, 'utf8');
	} catch {
		// The artifact is absent on a new clone and must be generated below.
	}

	if (nextContent === currentContent) return false;

	await writeFile(DATA_PATH, nextContent);
	return true;
}

if (import.meta.main) {
	p.intro('Generating public documentation data...');
	const changed = await generateDocumentationData();
	p.log[changed ? 'success' : 'info'](
		changed ? 'Updated apps/web/data/skills.json' : 'Documentation data is current',
	);
	p.outro('Done');
}
