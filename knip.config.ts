import type { KnipConfig } from 'knip';

const config = {
	// tsdown resolves this optional peer while building workspace packages.
	// Tailwind v4 is consumed by CSS imports that Knip does not follow.
	ignoreDependencies: ['unrun'],
	workspaces: {
		'apps/web': {
			project: ['src/**/*.{ts,tsx}', 'scripts/**/*.ts'],
		},
		'apps/jd': {
			ignoreDependencies: ['@iconify-json/lucide', '@nuxt/test-utils', 'vue-tsc'],
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
