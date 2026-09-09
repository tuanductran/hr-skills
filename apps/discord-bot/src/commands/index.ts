import { findCommand } from './find.ts';
import { infoCommand } from './info.ts';
import { planCommand } from './plan.ts';
import { randomCommand } from './random.ts';
import { recommendCommand } from './recommend.ts';
import { statsCommand } from './stats.ts';
import type { SkillCommand } from './types.ts';

export const commands: SkillCommand[] = [
	findCommand,
	infoCommand,
	planCommand,
	randomCommand,
	recommendCommand,
	statsCommand,
];
