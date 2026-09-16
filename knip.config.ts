import type { KnipConfig } from 'knip';

const config = {
	workspaces: {
		'apps/web': {
			project: ['app/**/*.{ts,tsx,css}'],
			next: true,
		},
		'apps/discord-bot': {
			entry: ['src/**/*.test.ts'],
			project: ['src/**/*.ts'],
		},
		'packages/hr-skills': {
			entry: ['src/cli/*.ts', 'scripts/prepare-package.ts'],
			project: ['src/**/*.ts', 'scripts/**/*.ts'],
		},
		'packages/hr-skills-build': {
			project: ['src/**/*.ts'],
		},
		'packages/hr-skills-ref': {
			project: ['src/**/*.ts'],
		},
		'packages/hr-skills-tsdoc': {
			entry: ['src/generate-api-docs.ts'],
			project: ['src/**/*.ts'],
		},
	},
} satisfies Partial<KnipConfig>;

export default config;
