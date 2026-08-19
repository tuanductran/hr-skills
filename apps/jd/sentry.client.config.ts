import * as Sentry from '@sentry/nuxt';
import { createSentryOptions } from './sentry.shared';

Sentry.init(
	createSentryOptions(
		import.meta.env.NUXT_PUBLIC_SENTRY_DSN || import.meta.env.SENTRY_DSN,
		import.meta.env.NODE_ENV || 'production',
	),
);
