import type { KnipConfig } from 'knip';

const config = {
	// tsdown resolves this optional peer while building workspace packages.
	// Tailwind v4 is consumed by the CSS import in apps/web/app/globals.css;
	// Knip does not follow CSS imports (see its configuration hint).
	ignoreDependencies: ['unrun', 'tailwindcss'],
	workspaces: {
		'apps/web': {
			project: ['app/**/*.{ts,tsx}'],
			next: true,
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
