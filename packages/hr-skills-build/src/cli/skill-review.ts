#!/usr/bin/env bun

/**
 * CLI: Build a deterministic Markdown report — security findings (from
 * skill-vetter's checks, already enforced by `bun run validate`) plus
 * automated content quality scores (Phase 6.2, review-aid only) — for a
 * specific list of changed skills.
 *
 * This is the whole of the automated review workflow (ROADMAP.md §6.2):
 * `.github/workflows/skill-review.yml` runs this script against the
 * skills touched by a PR and posts its output directly as a PR comment —
 * no AI/LLM calls, no third-party API keys, no network access. Pure
 * regex/file-count arithmetic over `validation/security.ts` and
 * `validation/quality-scoring.ts`, same guarantee as detect-duplicates.ts
 * and semantic-validation.ts. Run standalone, it's also a normal CLI
 * report.
 *
 * Usage:
 *   bun src/cli/skill-review.ts hr-onboarding hr-recruiting
 *   bun src/cli/skill-review.ts --list-file changed-skills.txt
 */

import { readFile } from 'node:fs/promises';

import { readSkillContent } from '../shared/helpers.js';
import type { SkillValidationIssue } from '../shared/types.js';
import { type SkillQualityScore, scoreSkills } from '../validation/quality-scoring.js';
import {
	validateCredentialLeaks,
	validateHiddenUnicode,
	validateSecurityCommands,
	validateSensitivePaths,
	validateSuspiciousUrls,
} from '../validation/security.js';

async function resolveSkillNames(argv: string[]): Promise<string[]> {
	const listFileFlagIndex = argv.indexOf('--list-file');
	if (listFileFlagIndex !== -1) {
		const listFile = argv[listFileFlagIndex + 1];
		if (!listFile) throw new Error('--list-file requires a path argument');
		const raw = await readFile(listFile, 'utf8');
		return raw
			.split(/\r?\n/)
			.map((line) => line.trim())
			.filter(Boolean);
	}
	return argv.filter((arg) => !arg.startsWith('--'));
}

async function collectSecurityFindings(
	skillName: string,
): Promise<SkillValidationIssue[]> {
	const errors: SkillValidationIssue[] = [];
	const content = await readSkillContent(skillName, errors);
	if (content === null) return errors;

	validateSecurityCommands(skillName, content, errors);
	validateSensitivePaths(skillName, content, errors);
	validateSuspiciousUrls(skillName, content, errors);
	validateCredentialLeaks(skillName, content, errors);
	validateHiddenUnicode(skillName, content, errors);

	return errors;
}

function bandEmoji(band: SkillQualityScore['band']): string {
	if (band === 'excellent') return '🟢';
	if (band === 'good') return '🟡';
	if (band === 'needs-review') return '🟠';
	return '🔴';
}

function renderReport(
	skillNames: string[],
	securityFindings: Map<string, SkillValidationIssue[]>,
	qualityScores: SkillQualityScore[],
): string {
	if (skillNames.length === 0) {
		return 'No `hr-*` skills changed in this PR — nothing to review.';
	}

	const lines: string[] = [];
	lines.push('### 🔎 Deterministic skill review (skill-vetter + quality scoring)');
	lines.push('');
	lines.push(
		'This is an automated, non-blocking report — a review aid, not a merge gate. See [`docs/quality-scoring.md`](../docs/quality-scoring.md) and [`.agents/skills/skill-vetter/SKILL.md`](../.agents/skills/skill-vetter/SKILL.md).',
	);
	lines.push('');
	lines.push('| Skill | Security | Quality |');
	lines.push('|-------|----------|---------|');

	const scoreBySkill = new Map(qualityScores.map((s) => [s.skill, s]));

	for (const skillName of skillNames) {
		const findings = securityFindings.get(skillName) ?? [];
		const score = scoreBySkill.get(skillName);

		const securityCell =
			findings.length === 0 ? '✅ clean' : `⚠️ ${findings.length} finding(s)`;
		const qualityCell = score
			? `${bandEmoji(score.band)} ${score.overall}/100 (${score.band})`
			: '—';

		lines.push(`| \`${skillName}\` | ${securityCell} | ${qualityCell} |`);
	}

	lines.push('');

	for (const skillName of skillNames) {
		const findings = securityFindings.get(skillName) ?? [];
		const score = scoreBySkill.get(skillName);
		const allNotes = score
			? [
					...score.clarity.notes,
					...score.completeness.notes,
					...score.exampleCoverage.notes,
				]
			: [];

		if (findings.length === 0 && allNotes.length === 0) continue;

		lines.push(`<details><summary><code>${skillName}</code> — details</summary>`);
		lines.push('');

		if (findings.length > 0) {
			lines.push('**Security findings:**');
			for (const f of findings) lines.push(`- ${f.message}`);
			lines.push('');
		}

		if (allNotes.length > 0) {
			lines.push('**Quality notes:**');
			for (const n of allNotes) lines.push(`- ${n}`);
			lines.push('');
		}

		lines.push('</details>');
		lines.push('');
	}

	return lines.join('\n').trimEnd();
}

async function main(): Promise<void> {
	const skillNames = await resolveSkillNames(process.argv.slice(2));

	const [securityEntries, qualityScores] = await Promise.all([
		Promise.all(
			skillNames.map(
				async (name) => [name, await collectSecurityFindings(name)] as const,
			),
		),
		scoreSkills(skillNames),
	]);

	const securityFindings = new Map(securityEntries);
	const report = renderReport(skillNames, securityFindings, qualityScores);

	console.log(report);
}

main().catch((err) => {
	console.error(
		`❌ skill-review failed: ${err instanceof Error ? err.message : String(err)}`,
	);
	process.exit(1);
});
