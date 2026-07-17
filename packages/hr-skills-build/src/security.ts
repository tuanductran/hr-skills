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
 *  5. Hidden Unicode (zero-width chars, homoglyphs used for prompt injection)
 */

import type { SkillValidationIssue } from './types.js';

// ---------------------------------------------------------------------------
// 1. Dangerous shell command patterns
// ---------------------------------------------------------------------------

const DANGEROUS_COMMANDS: ReadonlyArray<{ pattern: RegExp; label: string }> = [
	{ pattern: /rm\s+-rf?\s+[/~]/, label: 'rm -rf targeting root or home path' },
	{ pattern: /chmod\s+[0-7]*7[0-7]{2}\s/, label: 'chmod with world-write permission' },
	{
		pattern: /curl\s+.*\|\s*(bash|sh)/,
		label: 'curl piped to shell (remote code execution)',
	},
	{
		pattern: /wget\s+.*\|\s*(bash|sh)/,
		label: 'wget piped to shell (remote code execution)',
	},
	{ pattern: /eval\s*\(.*\$\(/, label: 'eval with subshell substitution' },
	{ pattern: />\s*\/dev\/sd[a-z]/, label: 'write to raw block device' },
	{ pattern: /dd\s+.*of=\/dev\//, label: 'dd targeting raw device' },
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
	// Only scan code blocks — shell commands in prose context are informational
	const codeBlockRegex = /```(?:bash|sh|shell|zsh)?\n([\s\S]*?)```/g;
	const blocks = [...content.matchAll(codeBlockRegex)].map((m) => m[1] ?? '');

	for (const block of blocks) {
		for (const { pattern, label } of DANGEROUS_COMMANDS) {
			if (pattern.test(block)) {
				errors.push({
					skill: skillName,
					message: `Security: dangerous shell pattern detected in code block — ${label}`,
				});
			}
		}
	}
}

// ---------------------------------------------------------------------------
// 2. Sensitive path write patterns
// ---------------------------------------------------------------------------

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

	for (const { pattern, label } of SENSITIVE_PATHS) {
		if (pattern.test(codeOnly)) {
			errors.push({
				skill: skillName,
				message: `Security: sensitive path write detected in code block — ${label}`,
			});
		}
	}
}

// ---------------------------------------------------------------------------
// 3. Suspicious external URLs
// ---------------------------------------------------------------------------

// Raw IP address URLs (not localhost) are suspicious in skill content
const RAW_IP_URL = /https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;

// Known data-exfil / webhook catch services that should not appear in skills
const SUSPICIOUS_HOSTS = [
	'requestbin',
	'webhook.site',
	'ngrok.io',
	'burpcollaborator',
	'pipedream.net',
	'hookbin.com',
	'canarytokens',
];

export function validateSuspiciousUrls(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	if (RAW_IP_URL.test(content)) {
		errors.push({
			skill: skillName,
			message:
				'Security: raw IP address URL found — use domain names for external references',
		});
	}

	const lowerContent = content.toLowerCase();
	for (const host of SUSPICIOUS_HOSTS) {
		if (lowerContent.includes(host)) {
			errors.push({
				skill: skillName,
				message: `Security: suspicious external host detected — "${host}"`,
			});
		}
	}
}

// ---------------------------------------------------------------------------
// 4. Credential leak patterns
// ---------------------------------------------------------------------------

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
	for (const { pattern, label } of CREDENTIAL_PATTERNS) {
		if (pattern.test(content)) {
			errors.push({
				skill: skillName,
				message: `Security: ${label} detected — remove or replace with a placeholder`,
			});
		}
	}
}

// ---------------------------------------------------------------------------
// 5. Hidden Unicode (prompt injection / homoglyph attacks)
// ---------------------------------------------------------------------------

// Zero-width and invisible characters often used to hide injected instructions
const HIDDEN_UNICODE_RANGES = [
	/\u200B/g, // zero-width space
	/\u200C/g, // zero-width non-joiner
	/\u200D/g, // zero-width joiner
	/\u200E/g, // left-to-right mark
	/\u200F/g, // right-to-left mark
	/\uFEFF/g, // byte order mark / zero-width no-break space
	/\u2060/g, // word joiner
	/[\uE000-\uF8FF]/g, // private use area (unexpected in markdown)
];

export function validateHiddenUnicode(
	skillName: string,
	content: string,
	errors: SkillValidationIssue[],
): void {
	for (const pattern of HIDDEN_UNICODE_RANGES) {
		if (pattern.test(content)) {
			errors.push({
				skill: skillName,
				message:
					'Security: hidden Unicode character detected — potential prompt injection or encoding attack',
			});
			// Report once per skill, not once per character type
			return;
		}
	}
}
