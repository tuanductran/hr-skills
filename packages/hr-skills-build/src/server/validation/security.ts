/**
 * Security validators for SKILL.md content.
 *
 * Converts the patterns documented in `.agents/skills/skill-vetter/SKILL.md`
 * into enforceable validation rules that run as part of `bun run validate`.
 *
 * Checks:
 *  1. Dangerous shell commands (rm -rf, chmod 777, curl | bash, etc.)
 *  2. Sensitive path write patterns (/etc/, /root/, ~/.ssh/, etc.)
 *  3. Suspicious external URLs (IP addresses, known data-exfil patterns)
 *  4. Credential leak patterns (tokens, secrets, passwords in content)
 *  5. Hidden Unicode (zero-width chars, bidi controls, private-use chars)
 */

import type { SkillValidationIssue } from '../shared/types.js';
import { checkPatternList, pushIssue } from './issue-helpers.js';

const DANGEROUS_COMMANDS: ReadonlyArray<{ pattern: RegExp; label: string }> = [
	{ pattern: /rm\s+-rf?\s+[/~]/, label: 'rm -rf targeting root or home path' },
	{ pattern: /chmod\s+[0-7]*7[0-7]{2}\s/, label: 'chmod with world-write permission' },
	{
		pattern: /curl\s+[^|\n]*\|\s*(bash|sh)/,
		label: 'curl piped to shell (remote code execution)',
	},
	{
		pattern: /wget\s+[^|\n]*\|\s*(bash|sh)/,
		label: 'wget piped to shell (remote code execution)',
	},
	{
		pattern: /eval\s*\([^$\n]*\$\(/,
		label: 'eval with subshell substitution',
	},
	{ pattern: />\s*\/dev\/sd[a-z]/, label: 'write to raw block device' },
	{ pattern: /dd\s+[^\n]*of=\/dev\//, label: 'dd targeting raw device' },
	{ pattern: /mkfs\s+/, label: 'mkfs — formats a filesystem' },
	{ pattern: /:\(\)\{:\|:&\}/, label: 'fork bomb pattern' },
	{
		pattern: /base64\s+-d\s*\|\s*(bash|sh|python|node)/,
		label: 'base64 decode piped to shell',
	},
];

export function validateSecurityCommands(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const codeBlockRegex = /```(?:bash|sh|shell|zsh)?\n([\s\S]*?)```/g;
	const blocks = [...content.matchAll(codeBlockRegex)].map((m) => m[1] ?? '');

	for (const block of blocks) {
		checkPatternList(
			errors,
			skillName,
			block,
			DANGEROUS_COMMANDS,
			(label) =>
				`Security: dangerous shell pattern detected in code block — ${label}`,
		);
	}
}

const SENSITIVE_PATHS: ReadonlyArray<{ pattern: RegExp; label: string }> = [
	{ pattern: />\s*\/etc\//, label: 'write to /etc/' },
	{ pattern: />\s*\/root\//, label: 'write to /root/' },
	{ pattern: /~\/\.ssh\//, label: 'reference to ~/.ssh/' },
	{ pattern: />\s*~\/\.bashrc/, label: 'write to ~/.bashrc' },
	{ pattern: />\s*~\/\.zshrc/, label: 'write to ~/.zshrc' },
	{ pattern: />\s*~\/\.profile/, label: 'write to ~/.profile' },
	{ pattern: />\s*\/usr\/local\/bin\//, label: 'write to /usr/local/bin/' },
	{ pattern: />\s*\/tmp\/[^'"\s]*\.(sh|py|js|rb)/, label: 'write executable to /tmp/' },
];

export function validateSensitivePaths(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	const codeBlockRegex = /```[\s\S]*?```/g;
	const codeOnly = [...content.matchAll(codeBlockRegex)].map((m) => m[0]).join('\n');

	if (!codeOnly) return;

	checkPatternList(
		errors,
		skillName,
		codeOnly,
		SENSITIVE_PATHS,
		(label) => `Security: sensitive path write detected in code block — ${label}`,
	);
}

const URL_REGEX = /https?:\/\/[^\s<>"')]+/gi;

const SUSPICIOUS_HOSTS = new Set([
	'ngrok.io',
	'ngrok.app',
	'ngrok.dev',
	'ngrok-free.app',
	'ngrok-free.dev',
	'webhook.site',
	'hookbin.com',
	'pipedream.net',
	'burpcollaborator.net',
	'canarytokens.com',
]);

const RAW_IP = /^\d{1,3}(?:\.\d{1,3}){3}$/;

function normalizeHost(hostname: string): string {
	return hostname.toLowerCase().replace(/\.$/, '');
}

function isSuspiciousHost(hostname: string): string | undefined {
	const host = normalizeHost(hostname);

	if (RAW_IP.test(host)) return 'raw IP address';

	const labels = host.split('.');

	for (let i = 0; i < labels.length; i++) {
		const candidate = labels.slice(i).join('.');
		if (SUSPICIOUS_HOSTS.has(candidate)) return candidate;
	}

	return undefined;
}

export function validateSuspiciousUrls(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	for (const match of content.matchAll(URL_REGEX)) {
		try {
			const url = new URL(match[0]);
			const suspicious = isSuspiciousHost(url.hostname);

			if (!suspicious) continue;

			pushIssue(
				errors,
				skillName,
				suspicious === 'raw IP address'
					? 'Security: raw IP address URL found'
					: `Security: suspicious external host detected — "${suspicious}"`,
			);
		} catch {
			// Ignore malformed URLs.
		}
	}

	if (/\brequestbin\b/i.test(content)) {
		pushIssue(
			errors,
			skillName,
			'Security: suspicious external host detected — "requestbin"',
		);
	}
}

const CREDENTIAL_PATTERNS: ReadonlyArray<{ pattern: RegExp; label: string }> = [
	{
		pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*["']?[A-Za-z0-9_-]{20,}/i,
		label: 'potential API key value',
	},
	{
		pattern: /(?:secret|password|passwd|pwd)\s*[:=]\s*["'][^"']{8,}/i,
		label: 'potential hardcoded secret or password',
	},
	{
		pattern: /ghp_[A-Za-z0-9]{36}/,
		label: 'GitHub personal access token pattern (ghp_)',
	},
	{
		pattern: /sk-[A-Za-z0-9]{32,}/,
		label: 'OpenAI-style secret key pattern (sk-)',
	},
	{
		pattern: /xoxb-[0-9]+-[A-Za-z0-9]+/,
		label: 'Slack bot token pattern (xoxb-)',
	},
	{
		pattern: /AKIA[0-9A-Z]{16}/,
		label: 'AWS access key ID pattern (AKIA)',
	},
];

export function validateCredentialLeaks(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	checkPatternList(
		errors,
		skillName,
		content,
		CREDENTIAL_PATTERNS,
		(label) => `Security: ${label} detected — remove or replace with a placeholder`,
	);
}

// These patterns intentionally omit the global flag because RegExp.test()
// retains lastIndex for global expressions. The validators are reused across
// many skills, so stateful regexes here could otherwise miss a later match.
const HIDDEN_UNICODE_RANGES = [
	/\u200B/,
	/\u200C/,
	/\u200D/,
	/\u200E/,
	/\u200F/,
	/[\u202A-\u202E]/, // LRE, RLE, PDF, LRO, RLO
	/[\u2066-\u2069]/, // LRI, RLI, FSI, PDI
	/\uFEFF/,
	/\u2060/,
	/[\uE000-\uF8FF]/,
];

export function validateHiddenUnicode(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	for (const pattern of HIDDEN_UNICODE_RANGES) {
		if (pattern.test(content)) {
			pushIssue(
				errors,
				skillName,
				'Security: hidden Unicode character detected — potential prompt injection or encoding attack',
			);
			return;
		}
	}
}

export function validateSecurityChecks(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	validateSecurityCommands(skillName, content, errors);
	validateSensitivePaths(skillName, content, errors);
	validateSuspiciousUrls(skillName, content, errors);
	validateCredentialLeaks(skillName, content, errors);
	validateHiddenUnicode(skillName, content, errors);
}
