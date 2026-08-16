#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const COMMANDS: Record<string, string> = {
	discover: '../discover.mjs',
	find: '../discover.mjs',
	list: '../list.mjs',
	init: '../init.mjs',
	recommend: '../recommend.mjs',
	plan: '../plan.mjs',
	execute: '../execute.mjs',
	evaluate: '../evaluate.mjs',
	'skill-review': '../skill-review.mjs',
	registry: '../registry.mjs',
	signals: '../signals.mjs',
};

function printHelp(): void {
	console.log(
		`HR Skills CLI\n\nUsage:\n  hr-skills <command> [options]\n\nCommands:\n  find, discover   Search the local HR Skills registry\n  list             List indexed HR skills\n  init <name>      Create a new SKILL.md template\n  recommend <id>   Recommend related skills\n  plan <intent>    Generate an execution plan\n  execute <intent> Execute a plan with the default executor\n  evaluate         Run the evaluation suite\n  skill-review     Review selected skills\n  registry         Generate registry/skills.json\n  signals          Generate relevance signals\n\nRun hr-skills <command> --help for command-specific usage.`,
	);
}

const [command, ...args] = process.argv.slice(2);
if (!command || command === '--help' || command === '-h') {
	printHelp();
	process.exit(0);
}

const entry = COMMANDS[command];
if (!entry) {
	console.error(`Unknown command: ${command}`);
	printHelp();
	process.exit(1);
}

if (args[0] === '--help' || args[0] === '-h') {
	console.log(
		`HR Skills: ${command}\n\nRun hr-skills --help for the complete command list.`,
	);
	process.exit(0);
}

if (command !== 'init' && !existsSync(join(process.cwd(), 'skills'))) {
	const packageRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
	if (existsSync(join(packageRoot, 'skills'))) process.chdir(packageRoot);
}

process.argv = [process.argv[0] ?? 'node', entry, ...args];
await import(entry);
