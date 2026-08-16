import { constants } from 'node:fs';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { type CliUsage, printUsageAndExit, runCli } from './cli-bootstrap.js';

const USAGE: CliUsage = {
	title: 'Create an HR Skill template',
	usage: 'bun run init [skill-name]',
	example: 'bun run init hr-interviewing',
};

const TEMPLATE = (name: string) => `---
name: ${name}
description: "Describe when this HR skill should be used and what outcome it provides to the team."
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---
# ${name}

Describe the scope, audience, and intended outcome of this HR skill.

## Supported tasks

- Define the first supported HR task with a clear outcome
- Define the second supported HR task with a clear outcome
- Define the third supported HR task with a clear outcome
- Define the fourth supported HR task with a clear outcome
- Define the fifth supported HR task with a clear outcome
- Define the sixth supported HR task with a clear outcome
- Define the seventh supported HR task with a clear outcome
- Define the eighth supported HR task with a clear outcome

## Key prompts

### Primary workflow

1. "Describe the first prompt this skill should help an agent answer."
2. "Describe the second prompt this skill should help an agent answer."
3. "Describe the third prompt this skill should help an agent answer."
4. "Describe the fourth prompt this skill should help an agent answer."

## Tips

- Keep advice practical, inclusive, and appropriate for the relevant jurisdiction.
- Ask clarifying questions before making assumptions about people or policy.
- Protect personal, candidate, and employee information.
- Distinguish operational guidance from legal advice.
`;

function normalizeName(input: string): string {
	return input
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

async function main(): Promise<void> {
	const rawName = process.argv[2];
	if (!rawName || rawName.startsWith('-')) printUsageAndExit(USAGE);
	const name = normalizeName(rawName);
	if (!name) throw new Error('Skill name must contain at least one letter or number.');
	const targetDir = resolve(process.cwd(), 'skills', name);
	const targetFile = join(targetDir, 'SKILL.md');
	try {
		await access(targetFile, constants.F_OK);
		throw new Error(`Skill already exists: ${targetFile}`);
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
	}
	await mkdir(targetDir, { recursive: true });
	await writeFile(targetFile, TEMPLATE(name), 'utf8');
	console.log(`Created ${targetFile}`);
}

runCli(main, USAGE);
