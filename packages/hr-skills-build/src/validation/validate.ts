import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import process from 'node:process';
import * as p from '@clack/prompts';
import { ROOT_DIR, SKILLS_DIR, validate as validateRef } from 'skills-ref';
import { buildRegistry, loadRelevanceSignalTable } from '../registry/registry.js';
import {
	HR_SKILL_PREFIX,
	KEY_PROMPTS_REGEX,
	MIN_CONTENT_LENGTH,
	MIN_DESCRIPTION_LENGTH,
	QUOTED_PROMPT_REGEX,
	REQUIRED_SECTIONS,
	SKILL_LINK_REGEX,
	TASKS_REGEX,
	TIPS_REGEX,
} from '../shared/constants.js';
import {
	countFiles,
	dirExists,
	discoverSkills,
	normalizeAuthorName,
	readSkillContent,
} from '../shared/helpers.js';
import { extractMatch, parseSkillFrontmatter } from '../shared/parser.js';
import type { SkillValidationIssue } from '../shared/types.js';
import { detectDuplicates } from './detect-duplicates.js';
import { pushIssue } from './issue-helpers.js';
import { validateSecurityChecks } from './security.js';
import { validateSemanticConsistency } from './semantic-validation.js';
import {
	validateRegistryConsistency,
	validateRelatedSkillsAgainstSignals,
} from './validate-registry.js';

/**
 * Validate the core of a skill.
 */
function validateCore(
	skillName: string,
	skillDir: string,
	errors: SkillValidationIssue[],
): void {
	const refErrors = validateRef(skillDir);

	for (const error of refErrors) {
		pushIssue(errors, skillName, `Core validation error: ${error}`);
	}
}

/**
 * Validate the frontmatter of a skill. *
 * @param skillName - Skill identifier, used to attribute any issues found.
 * @param content - Raw skill markdown to check.
 * @param errors - Issue list to push findings onto (mutated in place).
 */
export function validateFrontmatter(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const frontmatter = parseSkillFrontmatter(content);

	if (!frontmatter.name) {
		pushIssue(errors, skillName, 'Missing frontmatter: name');
	} else if (frontmatter.name !== skillName) {
		pushIssue(
			errors,
			skillName,
			`Frontmatter name mismatch: expected "${skillName}", received "${frontmatter.name}"`,
		);
	}

	if (!frontmatter.description) {
		pushIssue(errors, skillName, 'Missing frontmatter: description');
	} else if (frontmatter.description.length < MIN_DESCRIPTION_LENGTH) {
		pushIssue(
			errors,
			skillName,
			`Description is too short (minimum ${MIN_DESCRIPTION_LENGTH} characters)`,
		);
	}

	validateAuthor(skillName, frontmatter.metadata?.author, errors);

	if (!frontmatter.metadata?.version) {
		pushIssue(errors, skillName, 'Missing metadata.version');
	}
}

/**
 * Validate the required sections of a skill. *
 * @param skillName - Skill identifier, used to attribute any issues found.
 * @param content - Raw skill markdown to check.
 * @param errors - Issue list to push findings onto (mutated in place).
 */
export function validateRequiredSections(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	for (const section of REQUIRED_SECTIONS) {
		if (!content.includes(section)) {
			pushIssue(errors, skillName, `Missing required section: ${section}`);
		}
	}
}

/**
 * Validate the content length of a skill. *
 * @param skillName - Skill identifier, used to attribute any issues found.
 * @param content - Raw skill markdown to check.
 * @param errors - Issue list to push findings onto (mutated in place).
 */
export function validateContentLength(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	if (content.length < MIN_CONTENT_LENGTH) {
		pushIssue(
			errors,
			skillName,
			`SKILL.md is too short (minimum ${MIN_CONTENT_LENGTH} characters)`,
		);
	}
}

/**
 * Validate the line count of a skill. *
 * @param skillName - Skill identifier, used to attribute any issues found.
 * @param content - Raw skill markdown to check.
 * @param errors - Issue list to push findings onto (mutated in place).
 */
export function validateLineCount(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const lines = content.split(/\r?\n/);

	if (lines.length > 500) {
		pushIssue(
			errors,
			skillName,
			`SKILL.md body is too long (${lines.length} lines, maximum 500 lines allowed)`,
		);
	}
}

/**
 * Validate the supported tasks of a skill. *
 * @param skillName - Skill identifier, used to attribute any issues found.
 * @param content - Raw skill markdown to check.
 * @param errors - Issue list to push findings onto (mutated in place).
 */
export function validateSupportedTasks(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const tasksBlock = extractMatch(TASKS_REGEX, content) ?? '';

	const tasks = tasksBlock
		.split(/\r?\n/)
		.filter((line) => line.trim().startsWith('- '));

	if (tasks.length < 8 || tasks.length > 12) {
		pushIssue(
			errors,
			skillName,
			`Supported tasks section has ${tasks.length} tasks (expected 8-12 tasks)`,
		);
	}
}

/**
 * Validate the tips of a skill. *
 * @param skillName - Skill identifier, used to attribute any issues found.
 * @param content - Raw skill markdown to check.
 * @param errors - Issue list to push findings onto (mutated in place).
 */
export function validateTips(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const tipsBlock = extractMatch(TIPS_REGEX, content) ?? '';

	const tips = tipsBlock.split(/\r?\n/).filter((line) => line.trim().startsWith('- '));

	if (tips.length < 4 || tips.length > 6) {
		pushIssue(
			errors,
			skillName,
			`Tips section has ${tips.length} tips (expected 4-6 tips)`,
		);
	}
}

/**
 * Validate the blank lines of a skill. *
 * @param skillName - Skill identifier, used to attribute any issues found.
 * @param content - Raw skill markdown to check.
 * @param errors - Issue list to push findings onto (mutated in place).
 */
export function validateBlankLines(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const lines = content.split(/\r?\n/);

	for (let i = 0; i < lines.length - 1; i++) {
		const currentLine = lines[i];
		const nextLine = lines[i + 1];

		if (currentLine === undefined || nextLine === undefined) continue;

		const trimmedCurrentLine = currentLine.trim();
		const trimmedNextLine = nextLine.trim();

		const isHeading = trimmedCurrentLine.startsWith('#');
		const isBoldLabel =
			trimmedCurrentLine.startsWith('**') && trimmedCurrentLine.endsWith(':**');

		if (isHeading || isBoldLabel) {
			if (
				trimmedNextLine.startsWith('- ') ||
				trimmedNextLine.startsWith('* ') ||
				/^\d+\.\s/.test(trimmedNextLine)
			) {
				pushIssue(
					errors,
					skillName,
					`Missing blank line after heading/label "${trimmedCurrentLine}" on line ${i + 1} before the list on line ${i + 2}`,
				);
			}
		}
	}
}

/**
 * Validate the author of a skill.
 *
 * @param skillName - Skill identifier, used to attribute any issues found.
 * @param author - The `metadata.author` frontmatter value, if present.
 * @param errors - Issue list to push findings onto (mutated in place).
 */
export function validateAuthor(
	skillName: string,
	author: string | undefined,
	errors: SkillValidationIssue[],
): void {
	if (!author?.trim()) {
		pushIssue(errors, skillName, 'Missing metadata.author');
		return;
	}

	const normalized = normalizeAuthorName(author);

	if (author !== normalized) {
		pushIssue(
			errors,
			skillName,
			`metadata.author must use Title Case (expected "${normalized}", received "${author}")`,
		);
	}
}

/**
 * Validate the structure of the ## Key prompts section.
 *
 * Per docs/engineering/format.md: 3-6 subtopics (H3 headings) and 4-7 quoted prompts per subtopic.
 *
 * @param skillName - Skill identifier, used to attribute any issues found.
 * @param content - Raw skill markdown to check.
 * @param errors - Issue list to push findings onto (mutated in place).
 */
export function validatePromptStructure(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const keyPromptsBlock = extractMatch(KEY_PROMPTS_REGEX, content) ?? '';

	// Split on H3 headings — each segment is one subtopic
	const subtopicBlocks = keyPromptsBlock
		.split(/\n(?=### )/)
		.map((block) => block.trim())
		.filter(Boolean);

	if (subtopicBlocks.length < 3 || subtopicBlocks.length > 6) {
		pushIssue(
			errors,
			skillName,
			`Key prompts section has ${subtopicBlocks.length} subtopic(s) — expected 3-6`,
		);
	}

	for (const block of subtopicBlocks) {
		const h3 = /^### (.+)/.exec(block);
		const subtopicName = h3?.[1]?.trim() ?? '(unknown)';
		const prompts = [...block.matchAll(QUOTED_PROMPT_REGEX)];

		if (prompts.length < 4 || prompts.length > 7) {
			pushIssue(
				errors,
				skillName,
				`Key prompts subtopic "${subtopicName}" has ${prompts.length} prompt(s) — expected 4-7`,
			);
		}
	}
}

/**
 * Validate three-way consistency: router (root SKILL.md) ↔ filesystem (skills/) ↔ marketplace.json.
 *
 * All three sources must agree on which skills exist. A mismatch means either a skill
 * was added without syncing, or the router wasn't updated after a rename/deletion.
 *
 * @param skillNames - Skill directory names discovered on disk.
 * @param errors - Issue list to push findings onto (mutated in place).
 * @returns Resolves once all three sources have been compared; findings are pushed onto `errors`.
 */
export async function validateRouterConsistency(
	skillNames: string[],
	errors: SkillValidationIssue[],
): Promise<void> {
	// --- Marketplace.json ---
	const marketplacePath = join(ROOT_DIR, '.claude-plugin/marketplace.json');
	let marketplaceNames: string[] = [];

	try {
		const raw = await readFile(marketplacePath, 'utf8');
		const json = JSON.parse(raw) as { plugins?: Array<{ name?: string }> };
		marketplaceNames = (json.plugins ?? []).map((p) => p.name ?? '').filter(Boolean);
	} catch {
		pushIssue(
			errors,
			'(consistency)',
			'Could not read .claude-plugin/marketplace.json for consistency check',
		);
		return;
	}

	// --- Root SKILL.md router ---
	const routerPath = join(ROOT_DIR, 'SKILL.md');
	const routerNames: string[] = [];

	try {
		const routerContent = await readFile(routerPath, 'utf8');
		// Extract skill slugs from markdown links: [hr-skill-name](skills/hr-skill-name)
		for (const match of routerContent.matchAll(SKILL_LINK_REGEX)) {
			if (match[1]) routerNames.push(match[1]);
		}
	} catch {
		pushIssue(
			errors,
			'(consistency)',
			'Could not read root SKILL.md for consistency check',
		);
		return;
	}

	const fsSet = new Set(skillNames);
	const marketplaceSet = new Set(marketplaceNames);
	const routerSet = new Set(routerNames);

	// Filesystem → marketplace
	for (const name of fsSet) {
		if (!marketplaceSet.has(name)) {
			pushIssue(
				errors,
				name,
				`In skills/ directory but missing from marketplace.json — run "bun run sync"`,
			);
		}
	}

	// Marketplace → filesystem
	for (const name of marketplaceSet) {
		if (!fsSet.has(name)) {
			pushIssue(
				errors,
				name,
				`In marketplace.json but missing from skills/ directory`,
			);
		}
	}

	// Filesystem → router
	for (const name of fsSet) {
		if (!routerSet.has(name)) {
			pushIssue(
				errors,
				name,
				`In skills/ directory but missing from root SKILL.md router — update the router`,
			);
		}
	}

	// Router → filesystem
	for (const name of routerSet) {
		if (!fsSet.has(name)) {
			pushIssue(
				errors,
				name,
				`In root SKILL.md router but missing from skills/ directory — dead link in router`,
			);
		}
	}
}

/**
 * Validate that optional subdirectories (content, prompts, examples), if present, are non-empty.
 *
 * @param skillName - Skill identifier, used to attribute any issues found.
 * @param skillDir - Absolute path to the skill's directory.
 * @param errors - Issue list to push findings onto (mutated in place).
 * @returns Resolves once every subdirectory has been checked; findings are pushed onto `errors`.
 */
export async function validateSubdirectoryContents(
	skillName: string,
	skillDir: string,
	errors: SkillValidationIssue[],
): Promise<void> {
	for (const subDir of ['content', 'prompts', 'examples']) {
		const subPath = join(skillDir, subDir);
		if (await dirExists(subPath)) {
			const fileCount = await countFiles(subPath);
			if (fileCount === 0) {
				pushIssue(
					errors,
					skillName,
					`Empty subdirectory "${subDir}/" is not allowed — must contain at least one .md file`,
				);
			}
		}
	}
}

/**
 * Validate a single skill.
 *
 * All checks within a single skill are run sequentially — they share the same
 * content string and errors array, so no parallelism is needed here.
 */
async function validateSkill(skillName: string): Promise<SkillValidationIssue[]> {
	const errors: SkillValidationIssue[] = [];

	const skillDir = join(SKILLS_DIR, skillName);
	const content = await readSkillContent(skillName, errors);

	if (!content) return errors;

	validateCore(skillName, skillDir, errors);
	validateFrontmatter(skillName, content, errors);
	validateRequiredSections(skillName, content, errors);
	validateContentLength(skillName, content, errors);
	validateLineCount(skillName, content, errors);
	validateSupportedTasks(skillName, content, errors);
	validateTips(skillName, content, errors);
	validateBlankLines(skillName, content, errors);
	validatePromptStructure(skillName, content, errors);
	await validateSubdirectoryContents(skillName, skillDir, errors);

	// Security checks (from skill-vetter)
	validateSecurityChecks(skillName, content, errors);

	return errors;
}

/**
 * Validate all HR skills.
 *
 * Skills are validated concurrently with `Promise.all` so that I/O-bound
 * work (reading SKILL.md + subdirectory checks) overlaps across all skills
 * at once. Global consistency checks (router, registry, duplicates, semantic)
 * run in parallel with the per-skill phase via a second `Promise.all`.
 */
async function validate(): Promise<void> {
	p.intro('Validating HR skills...');

	const skillNames = await discoverSkills();

	if (skillNames.length === 0) {
		p.log.warn(`No skills found with prefix "${HR_SKILL_PREFIX}"`);
		process.exit(1);
	}

	p.log.info(`Found ${skillNames.length} skill directories`);

	const allErrors: SkillValidationIssue[] = [];
	const allWarnings: SkillValidationIssue[] = [];

	// Run per-skill validation and global consistency checks concurrently.
	const [perSkillResults] = await Promise.all([
		// Per-skill: all 146 skills validated in parallel
		Promise.all(skillNames.map((name) => validateSkill(name))),
		// Global: router + registry run concurrently alongside per-skill work
		validateRouterConsistency(skillNames, allErrors),
		validateRegistryConsistency(allErrors),
	]);

	// Collect per-skill errors and log any failing skill names
	for (let i = 0; i < perSkillResults.length; i++) {
		const errors = perSkillResults[i];
		if (!errors || errors.length === 0) continue;
		allErrors.push(...errors);
		const skillName = skillNames[i];
		if (skillName) p.log.error(skillName);
	}

	// Phase 6.1-B — warn when a high-evidence usage signal isn't reflected
	// in relatedSkills, and Phase 6.2 — duplicate-content detection and
	// semantic validation. All three run concurrently since none depends
	// on another's output.
	const signalTable = await loadRelevanceSignalTable();
	await Promise.all([
		buildRegistry(signalTable).then((registry) =>
			validateRelatedSkillsAgainstSignals(registry, signalTable, allWarnings),
		),
		detectDuplicates(skillNames, allWarnings),
		validateSemanticConsistency(SKILLS_DIR, skillNames, allWarnings),
	]);

	// Report warnings (informational — do not affect exit code)
	if (allWarnings.length > 0) {
		p.log.warn(`Quality warnings: ${allWarnings.length} potential issue(s) detected`);
		for (const w of allWarnings) p.log.warn(`  ${w.skill}: ${w.message}`);
		p.log.warn(
			'These are informational. Review the flagged skills and decide whether to merge, refactor, or update them.',
		);
	}

	// Report errors (fatal)
	if (allErrors.length > 0) {
		p.log.error('Validation failed');

		for (const error of allErrors) p.log.error(`${error.skill}: ${error.message}`);

		process.exit(1);
	}

	p.log.success(`All ${skillNames.length} HR skills are valid`);
	if (allWarnings.length === 0) p.log.info('No quality warnings.');
	p.outro('Done');
}

if (import.meta.main) await validate();
