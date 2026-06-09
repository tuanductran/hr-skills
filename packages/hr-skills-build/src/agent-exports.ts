#!/usr/bin/env bun
/** Generate multi-agent exports for Claude, OpenAI Codex, Cursor, and Gemini. */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { AGENT_EXPORT_TARGETS, type AgentExportTarget } from './agent-targets.js';
import { getHrSkills, SKILLS_DIR } from './config.js';

const ROOT = join(import.meta.dir, '../../..');

interface AgentExportManifestSkill {
	name: string;
	description: string;
	category: string;
	status: string;
	tags: string[];
	recruitingWorkflow: string;
	outputs: Record<AgentExportTarget, string>;
}

interface SkillExportMetadata {
	name: string;
	description: string;
	category: string;
	status: string;
	tags: string[];
	recruitingWorkflow: string;
}

function stripFrontmatter(content: string): string {
	return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '').trim();
}

function readScalar(frontmatter: string, key: string): string | undefined {
	const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));

	return match?.[1]?.trim().replace(/^["']|["']$/g, '');
}

function readMetadataScalar(frontmatter: string, key: string): string | undefined {
	const match = frontmatter.match(new RegExp(`^  ${key}:\\s*(.+)$`, 'm'));

	return match?.[1]?.trim().replace(/^["']|["']$/g, '');
}

function readMetadataTags(frontmatter: string): string[] {
	const match = frontmatter.match(/^ {2}tags:\r?\n((?: {4}- .+\r?\n?)+)/m);

	if (!match?.[1]) {
		return [];
	}

	return match[1]
		.split(/\r?\n/)
		.map((line) => line.trim())
		.filter((line) => line.startsWith('- '))
		.map((line) => line.slice(2).trim())
		.filter(Boolean);
}

function parseSkillExportMetadata(
	content: string,
	skillName: string,
): SkillExportMetadata {
	const frontmatter = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';

	return {
		name: readScalar(frontmatter, 'name') ?? skillName,
		description: readScalar(frontmatter, 'description') ?? '',
		category: readMetadataScalar(frontmatter, 'category') ?? 'core-hr',
		status: readMetadataScalar(frontmatter, 'status') ?? 'stable',
		tags: readMetadataTags(frontmatter),
		recruitingWorkflow:
			readMetadataScalar(frontmatter, 'recruitingWorkflow') ?? 'not-applicable',
	};
}

function createAgentInstruction(
	target: AgentExportTarget,
	skillName: string,
	content: string,
): string {
	const body = target === 'claude' ? content.trim() : stripFrontmatter(content);

	if (target === 'cursor') {
		return [
			'---',
			`description: Use the ${skillName} HR skill for relevant HR and talent workflows`,
			'alwaysApply: false',
			'---',
			'',
			body,
			'',
		].join('\n');
	}

	if (target === 'codex') {
		return [
			`# ${skillName} Codex instructions`,
			'',
			'Use this HR skill when the user asks for matching HR, recruiting, or talent guidance. Keep responses concise, professional, and grounded in the skill content.',
			'',
			body,
			'',
		].join('\n');
	}

	if (target === 'gemini') {
		return [
			`# ${skillName} Gemini instructions`,
			'',
			'Apply this skill for relevant HR work. Preserve HR-specific terminology, structured prompts, and practical workflow guidance.',
			'',
			body,
			'',
		].join('\n');
	}

	return `${body}\n`;
}

async function writeSkillExports(skillName: string): Promise<AgentExportManifestSkill> {
	const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');
	const content = await readFile(skillPath, 'utf8');
	const metadata = parseSkillExportMetadata(content, skillName);
	const outputs = {} as Record<AgentExportTarget, string>;

	for (const target of AGENT_EXPORT_TARGETS) {
		const relativePath = join(target.id, skillName, target.filename);
		const outputPath = join(ROOT, '.agent-exports', relativePath);

		await mkdir(join(outputPath, '..'), { recursive: true });
		await writeFile(
			outputPath,
			createAgentInstruction(target.id, skillName, content),
		);

		outputs[target.id] = relativePath;
	}

	return {
		...metadata,
		outputs,
	};
}

export async function exportAgentSkills(): Promise<void> {
	const skills = await getHrSkills();
	const exportRoot = join(ROOT, '.agent-exports');

	await mkdir(exportRoot, { recursive: true });

	const manifestSkills = await Promise.all(skills.map(writeSkillExports));
	const manifest = {
		schemaVersion: 1,
		targets: AGENT_EXPORT_TARGETS.map((target) => ({
			...target,
			outputDirectory: basename(target.id),
		})),
		skills: manifestSkills,
	};

	await writeFile(
		join(exportRoot, 'manifest.json'),
		`${JSON.stringify(manifest, null, 2)}\n`,
	);

	console.log(
		`Generated ${skills.length} skills for ${AGENT_EXPORT_TARGETS.length} agent targets in .agent-exports/`,
	);
}

if (import.meta.main) {
	await exportAgentSkills();
}
