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
		// [^|\n]* instead of .* — eliminates O(n) backtracking when no pipe is present
		pattern: /curl\s+[^|\n]*\|\s*(bash|sh)/,
		label: 'curl piped to shell (remote code execution)',
	},
	{
		// [^|\n]* instead of .* — same fix as curl
		pattern: /wget\s+[^|\n]*\|\s*(bash|sh)/,
		label: 'wget piped to shell (remote code execution)',
	},
	{
		// [^$\n]* instead of .* — stops at $ so no backtracking through subshell chars
		pattern: /eval\s*\([^$\n]*\$\(/,
		label: 'eval with subshell substitution',
	},
	{ pattern: />\s*\/dev\/sd[a-z]/, label: 'write to raw block device' },
	{
		// [^\n]* instead of .* — newline-bounded, avoids cross-line backtracking
		pattern: /dd\s+[^\n]*of=\/dev\//,
		label: 'dd targeting raw device',
	},
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

const URL_REGEX = /https?:\/\/[^\s<>"')]+/gi;

/**
 * Known data-exfiltration / request-inspection hosts.
 *
 * Includes all current ngrok tunnel domains:
 *   - ngrok.io      — legacy v2 tunnels
 *   - ngrok.app     — v3 tunnels (HSTS preloaded)
 *   - ngrok.dev     — v3 dev tunnels (HSTS preloaded)
 *   - ngrok-free.app / ngrok-free.dev — v3 free-tier static domains
 *
 * The suffix-walk in isSuspiciousHost() means any subdomain of these
 * (e.g. abc123.ngrok.app, my-tunnel.eu.ngrok.io) is also caught.
 */
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

	if (RAW_IP.test(host)) {
		return 'raw IP address';
	}

	const labels = host.split('.');

	for (let i = 0; i < labels.length; i++) {
		const candidate = labels.slice(i).join('.');

		if (SUSPICIOUS_HOSTS.has(candidate)) {
			return candidate;
		}
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

			if (!suspicious) {
				continue;
			}

			errors.push({
				skill: skillName,
				message:
					suspicious === 'raw IP address'
						? 'Security: raw IP address URL found'
						: `Security: suspicious external host detected — "${suspicious}"`,
			});
		} catch {
			// Ignore malformed URLs.
		}
	}

	// requestbin is commonly referenced as plain text instead of a hostname.
	if (/\brequestbin\b/i.test(content)) {
		errors.push({
			skill: skillName,
			message: 'Security: suspicious external host detected — "requestbin"',
		});
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
