import type { RegistryEntry } from 'hr-skills-build/server';
import { buildRegistry } from 'hr-skills-build/server';
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
