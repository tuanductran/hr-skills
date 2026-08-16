#!/usr/bin/env bun

import { cp, mkdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = resolve(packageRoot, '../..');
const packagedSkills = join(packageRoot, 'skills');
const packagedRegistry = join(packageRoot, 'registry');

await rm(packagedSkills, { recursive: true, force: true });
await rm(packagedRegistry, { recursive: true, force: true });

if (process.argv.includes('--clean')) process.exit(0);

await cp(join(repositoryRoot, 'skills'), packagedSkills, { recursive: true });
await mkdir(packagedRegistry, { recursive: true });
await cp(
	join(repositoryRoot, 'registry', 'skills.json'),
	join(packagedRegistry, 'skills.json'),
);
