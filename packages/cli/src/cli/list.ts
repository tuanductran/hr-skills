import { buildRegistry } from '../../../hr-skills-build/src/registry/registry.js';
import type { RegistryEntry } from '../../../hr-skills-build/src/shared/types.js';
import { runCli } from './cli-bootstrap.js';

function printSkill(entry: RegistryEntry): void {
	console.log(`${entry.id}\t${entry.version}\t${entry.description}`);
}

async function main(): Promise<void> {
	const registry = await buildRegistry();
	console.log(`HR Skills (${registry.skillCount})`);
	console.log('ID\tVERSION\tDESCRIPTION');
	for (const entry of registry.skills.toSorted((a, b) => a.id.localeCompare(b.id))) {
		printSkill(entry);
	}
}

runCli(main);
