import type { KnipConfig } from 'knip';

const config = {
	ignoreDependencies: ['unrun', 'tailwindcss', '@tailwindcss/typography'],
	treatConfigHintsAsErrors: false,
	workspaces: {
		'apps/jd': {
			entry: [
				'app/app.vue',
				'app/app.config.ts',
				'app/pages/**/*.vue',
				'app/composables/**/*.ts',
				'tests/**/*.ts',
				'nuxt.config.ts',
				'playwright.config.ts',
				'sentry.*.ts',
			],
			project: ['app/**/*.{ts,vue}', 'tests/**/*.ts', '*.config.ts'],
			ignoreFiles: ['.nuxt/**'],
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
		'apps/cv': {
			entry: [
				'app/app.vue',
				'app/app.config.ts',
				'app/pages/**/*.vue',
				'app/composables/**/*.ts',
				'tests/**/*.ts',
				'nuxt.config.ts',
				'playwright.config.ts',
				'sentry.*.ts',
			],
			project: ['app/**/*.{ts,vue}', 'tests/**/*.ts', '*.config.ts'],
			ignoreFiles: ['.nuxt/**'],
			paths: {
				'~/*': ['app/*'],
				'@/*': ['app/*'],
			},
			ignoreDependencies: ['@iconify-json/lucide', '@nuxt/ui', 'vue-tsc'],
			ignoreIssues: {
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
