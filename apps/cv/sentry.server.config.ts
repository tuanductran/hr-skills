import * as Sentry from '@sentry/nuxt';
import { createSentryOptions } from './sentry.shared';

Sentry.init(
	createSentryOptions(
		process.env.SENTRY_DSN || process.env.NUXT_PUBLIC_SENTRY_DSN,
		process.env.NODE_ENV || 'production',
	),
);
