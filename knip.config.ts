import type { KnipConfig } from 'knip';

const config = {
	// tsdown resolves this optional peer while building workspace packages.
	// Tailwind v4 is consumed by the CSS import in apps/web/app/globals.css;
	// Knip does not follow CSS imports (see its configuration hint).
	ignoreDependencies: ['unrun', 'tailwindcss', '@tailwindcss/typography'],
	treatConfigHintsAsErrors: false,
	workspaces: {
		'apps/jd': {
			entry: [
				'app/app.vue',
				'app/pages/**/*.vue',
				'app/composables/**/*.ts',
				'app/lib/**/*.ts',
				'server/api/**/*.ts',
				'server/db/**/*.ts',
				'server/lib/**/*.ts',
				'server/utils/**/*.ts',
				'tests/**/*.ts',
				'scripts/*.mjs',
				'sentry.*.ts',
			],
			project: ['app/**/*.{ts,vue}', 'server/**/*.ts', 'tests/**/*.ts'],
			ignoreFiles: ['.nuxt/**', '*.config.ts'],
			paths: {
				'~/*': ['app/*'],
				'@/*': ['app/*'],
			},
			ignoreDependencies: ['@iconify-json/lucide', 'vue-tsc'],
			ignoreIssues: {
				'app/utils/jd-schema.ts': ['exports', 'types'],
				'sentry.shared.ts': ['exports'],
			},
		},
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
