#!/usr/bin/env bun
/**
 * CLI for skills-ref library.
 *
 * Commands:
 *   validate <path>
 *   read-properties <path>
 *   to-prompt <paths...>
 *   version
 */

import { basename, dirname, resolve } from 'node:path';
import process from 'node:process';
import { SkillError } from './errors.js';
import { toDict } from './models.js';
import { readProperties } from './parser.js';
import { toPrompt } from './prompt.js';
import { validate } from './validator.js';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const VERSION = '0.1.0';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function isSkillMdFile(path: string): boolean {
	return basename(path).toLowerCase() === 'skill.md';
}

function resolveSkillPath(path: string): string {
	return isSkillMdFile(path) ? dirname(path) : path;
}

function printUsage(): void {
	console.log(
		`
skills-ref v${VERSION}

Reference library for Agent Skills.

Usage:
  skills-ref <command> [options]

Commands:
  validate <path>              Validate a skill directory
  read-properties <path>       Read skill properties as JSON
  to-prompt <paths...>         Generate <available_skills> XML
  version                      Print CLI version

Examples:
  skills-ref validate ./skills/hr-recruiting
  skills-ref read-properties ./skills/hr-recruiting
  skills-ref to-prompt ./skills/hr-*

Exit codes:
  0  Success
  1  Validation or parsing error
`.trim(),
	);
}

function printError(message: string): void {
	console.error(`Error: ${message}`);
}

function exitWithError(message: string): never {
	printError(message);

	process.exitCode = 1;

	process.exit();
}

/**
 * Execute a command safely with SkillError handling.
 */
function runCommand(handler: () => number): never {
	try {
		process.exit(handler());
	} catch (error) {
		if (error instanceof SkillError) {
			printError(error.message);

			process.exit(1);
		}

		throw error;
	}
}

// -----------------------------------------------------------------------------
// Commands
// -----------------------------------------------------------------------------

function cmdValidate(args: string[]): number {
	const input = args[0];

	if (!input) {
		exitWithError('validate requires a path argument');
	}

	const skillPath = resolveSkillPath(resolve(input));

	const errors = validate(skillPath);

	if (errors.length > 0) {
		console.error(`Validation failed for ${skillPath}:`);

		for (const error of errors) {
			console.error(`  - ${error}`);
		}

		return 1;
	}

	console.log(`Valid skill: ${skillPath}`);

	return 0;
}

function cmdReadProperties(args: string[]): number {
	const input = args[0];

	if (!input) {
		exitWithError('read-properties requires a path argument');
	}

	const skillPath = resolveSkillPath(resolve(input));

	const properties = readProperties(skillPath);

	console.log(JSON.stringify(toDict(properties), null, 2));

	return 0;
}

function cmdToPrompt(args: string[]): number {
	if (args.length === 0) {
		exitWithError('to-prompt requires at least one path argument');
	}

	const resolvedPaths = args.map((path) => resolveSkillPath(resolve(path)));

	const output = toPrompt(resolvedPaths);

	console.log(output);

	return 0;
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

function main(): void {
	const [, , command, ...args] = process.argv;

	if (command == null || command === '--help' || command === '-h') {
		printUsage();

		process.exit(0);
	}

	if (command === 'version' || command === '--version' || command === '-v') {
		console.log(`skills-ref v${VERSION}`);

		process.exit(0);
	}

	switch (command) {
		case 'validate':
			runCommand(() => cmdValidate(args));
			break;

		case 'read-properties':
			runCommand(() => cmdReadProperties(args));
			break;

		case 'to-prompt':
			runCommand(() => cmdToPrompt(args));
			break;

		default:
			console.error(`Unknown command: ${command}`);

			console.log('');

			printUsage();

			process.exit(1);
	}
}

main();
