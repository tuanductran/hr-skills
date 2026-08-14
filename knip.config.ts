import type { KnipConfig } from 'knip';

const config = {
	// tsdown resolves this optional peer while building workspace packages.
	ignoreDependencies: ['unrun'],
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
