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
		'packages/hr-skills-build': {
			project: ['src/**/*.ts'],
		},
		'packages/hr-skills-ref': {
			project: ['src/**/*.ts'],
		},
	},
} satisfies Partial<KnipConfig>;

export default config;
