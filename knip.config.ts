import type { KnipConfig } from 'knip';

const config = {
	workspaces: {
		'packages/hr-skills-build': {
			project: ['src/**/*.ts'],
		},
		'packages/skills-ref': {
			project: ['src/**/*.ts'],
		},
	},
} satisfies Partial<KnipConfig>;

export default config;
