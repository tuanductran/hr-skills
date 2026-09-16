import { existsSync } from 'node:fs';
import { join } from 'node:path';

export * from '../shared/constants.js';

const cwd = process.cwd();
const workspaceRoot = existsSync(join(cwd, 'skills')) ? cwd : join(cwd, '../..');

/** Absolute path to the repository root. */
export const ROOT_DIR = workspaceRoot;

/** Absolute path to the `skills/` directory at the repository root. */
export const SKILLS_DIR = join(ROOT_DIR, 'skills');
