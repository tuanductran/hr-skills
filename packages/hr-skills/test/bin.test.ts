import { describe, expect, test } from 'bun:test';
import { join } from 'node:path';

const PACKAGE_ROOT = join(import.meta.dir, '..');
const ENTRYPOINT = join(PACKAGE_ROOT, 'src/bin/hr-skills.ts');
const textDecoder = new TextDecoder();

interface CliResult {
	readonly exitCode: number;
	readonly stdout: string;
	readonly stderr: string;
}

function runCli(...args: string[]): CliResult {
	const result = Bun.spawnSync([process.execPath, 'run', ENTRYPOINT, ...args], {
		cwd: PACKAGE_ROOT,
		stderr: 'pipe',
		stdout: 'pipe',
	});

	return {
		exitCode: result.exitCode,
		stdout: textDecoder.decode(result.stdout),
		stderr: textDecoder.decode(result.stderr),
	};
}

describe('hr-skills executable', () => {
	test('prints the complete help screen without arguments', () => {
		const result = runCli();

		expect(result.exitCode).toBe(0);
		expect(result.stderr).toBe('');
		expect(result.stdout).toContain('HR Skills CLI');
		expect(result.stdout).toContain('Usage:');
		expect(result.stdout).toContain('find, discover');
		expect(result.stdout).toContain('skill-review');
		expect(result.stdout).toContain('Run hr-skills <command> --help');
	});

	test.each(['--help', '-h'])('accepts %s as the global help flag', (flag) => {
		const result = runCli(flag);

		expect(result.exitCode).toBe(0);
		expect(result.stderr).toBe('');
		expect(result.stdout).toContain('HR Skills CLI');
	});

	test.each([
		'discover',
		'find',
		'list',
		'init',
		'recommend',
		'plan',
		'execute',
		'evaluate',
		'skill-review',
		'registry',
		'signals',
	])('prints command help for %s without importing the command handler', (command) => {
		const result = runCli(command, '--help');

		expect(result.exitCode).toBe(0);
		expect(result.stderr).toBe('');
		expect(result.stdout).toContain(`HR Skills: ${command}`);
		expect(result.stdout).toContain('Run hr-skills --help');
	});

	test('returns a useful error for an unknown command', () => {
		const result = runCli('not-a-command');

		expect(result.exitCode).toBe(1);
		expect(result.stderr).toContain('Unknown command: not-a-command');
		expect(result.stdout).toContain('HR Skills CLI');
	});
});
