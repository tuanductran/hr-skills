export function scrubEvent<
	T extends {
		user?: unknown;
		request?: {
			cookies?: unknown;
			data?: unknown;
			headers?: unknown;
			query_string?: unknown;
		};
		contexts?: Record<string, unknown>;
	},
>(event: T): T {
	if (event.user) {
		delete event.user;
	}

	if (event.request) {
		delete event.request.cookies;
		delete event.request.data;
		delete event.request.headers;
		delete event.request.query_string;
	}

	if (event.contexts) {
		delete event.contexts.request;
	}

	return event;
}

export function createSentryOptions(dsn: string | undefined, environment: string) {
	return {
		dsn,
		enabled: Boolean(dsn),
		environment,
		tracesSampleRate: environment === 'production' ? 0.1 : 0,
		dataCollection: {
			userInfo: false,
			cookies: false,
			httpBodies: [],
			urlQueryParams: false,
			httpHeaders: { request: false, response: false },
			genAI: { inputs: false, outputs: false },
		},
		beforeSend: scrubEvent,
		maxValueLength: 200,
	};
}
