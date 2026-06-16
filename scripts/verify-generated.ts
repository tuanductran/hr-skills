const GENERATION_COMMANDS: readonly string[][] = [
	['bun', 'run', 'sync'],
	['bun', 'run', 'catalog'],
	['bun', 'run', 'zip'],
];

function run(command: readonly string[]): void {
	const result = Bun.spawnSync({
		cmd: [...command],
		stdout: 'inherit',
		stderr: 'inherit',
	});

	if (result.exitCode !== 0) {
		throw new Error(`Command failed: ${command.join(' ')}`);
	}
}

for (const command of GENERATION_COMMANDS) {
	run(command);
}

const diff = Bun.spawnSync({
	cmd: ['git', 'diff', '--exit-code', '--', 'AGENTS.md', 'docs', 'skills'],
	stdout: 'inherit',
	stderr: 'inherit',
});

if (diff.exitCode !== 0) {
	throw new Error(
		'Generated artifacts are stale. Run bun run sync, bun run catalog, and bun run zip, then commit the results.',
	);
}

console.log('Generated artifacts are up to date.');
