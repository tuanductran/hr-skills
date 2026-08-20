const isProduction = process.env.NODE_ENV === 'production';
const sentryEnabled = Boolean(
	process.env.SENTRY_DSN || process.env.NUXT_PUBLIC_SENTRY_DSN,
);
const sentryBuildConfigured = Boolean(
	process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT,
);

export default defineNuxtConfig({
	compatibilityDate: '2026-08-19',
	devtools: { enabled: !isProduction },
	modules: ['@nuxt/ui', '@sentry/nuxt/module'],
	sentry: {
		enabled: sentryEnabled,
		autoInjectServerSentry: 'top-level-import',
		org: process.env.SENTRY_ORG,
		project: process.env.SENTRY_PROJECT,
		authToken: process.env.SENTRY_AUTH_TOKEN,
		telemetry: false,
		sourcemaps: sentryBuildConfigured
			? {
					filesToDeleteAfterUpload: ['.output/**/public/**/*.map'],
				}
			: undefined,
	},
	sourcemap: sentryBuildConfigured ? { client: 'hidden' } : undefined,
	css: ['~/assets/css/main.css'],
	typescript: {
		strict: true,
		typeCheck: true,
	},
	icon: {
		clientBundle: {
			scan: true,
		},
	},
	ui: {
		fonts: false,
		theme: {
			colors: [
				'primary',
				'secondary',
				'neutral',
				'info',
				'success',
				'warning',
				'error',
			],
			defaultVariants: {
				color: 'primary',
				size: 'md',
			},
		},
		experimental: {
			componentDetection: true,
		},
	},
	routeRules: {
		'/**': {
			headers: {
				'Content-Security-Policy':
					"default-src 'self'; base-uri 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; form-action 'self'",
				'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
				'Referrer-Policy': 'no-referrer',
				...(isProduction
					? {
							'Strict-Transport-Security':
								'max-age=31536000; includeSubDomains',
						}
					: {}),
				'X-Content-Type-Options': 'nosniff',
				'X-Frame-Options': 'DENY',
			},
		},
	},
	app: {
		head: {
			htmlAttrs: {
				lang: 'en',
			},
			title: 'CV Studio — HR Skills',
			meta: [
				{
					name: 'description',
					content:
						'Create clear, structured and reviewable curriculum vitae documents.',
				},
			],
		},
	},
});
