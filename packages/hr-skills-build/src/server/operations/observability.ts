export type ServiceLogLevel = 'info' | 'warn' | 'error';

export interface ServiceLogEvent {
	readonly level: ServiceLogLevel;
	readonly event: string;
	readonly timestamp: string;
	readonly operation?: string;
	readonly requestId?: string;
	readonly durationMs?: number;
	readonly details?: Record<string, unknown>;
}

export type ServiceLogSink = (event: ServiceLogEvent) => void;

export interface StructuredServiceLogger {
	log(
		level: ServiceLogLevel,
		event: string,
		context?: Omit<ServiceLogEvent, 'level' | 'event' | 'timestamp'>,
	): void;
	info(
		event: string,
		context?: Omit<ServiceLogEvent, 'level' | 'event' | 'timestamp'>,
	): void;
	warn(
		event: string,
		context?: Omit<ServiceLogEvent, 'level' | 'event' | 'timestamp'>,
	): void;
	error(
		event: string,
		context?: Omit<ServiceLogEvent, 'level' | 'event' | 'timestamp'>,
	): void;
}

export function createStructuredLogger(
	sink: ServiceLogSink,
	now: () => string = () => new Date().toISOString(),
): StructuredServiceLogger {
	function log(
		level: ServiceLogLevel,
		event: string,
		context: Omit<ServiceLogEvent, 'level' | 'event' | 'timestamp'> = {},
	): void {
		sink({ level, event, timestamp: now(), ...context });
	}

	return {
		log,
		info: (event, context) => log('info', event, context),
		warn: (event, context) => log('warn', event, context),
		error: (event, context) => log('error', event, context),
	};
}

export interface ServiceMetricSnapshot {
	readonly counters: Readonly<Record<string, number>>;
}

export interface ServiceMetrics {
	increment(name: string, value?: number): void;
	snapshot(): ServiceMetricSnapshot;
	reset(): void;
}

export function createServiceMetrics(): ServiceMetrics {
	const counters = new Map<string, number>();

	return {
		increment(name, value = 1) {
			counters.set(name, (counters.get(name) ?? 0) + value);
		},
		snapshot() {
			return { counters: Object.fromEntries(counters) };
		},
		reset() {
			counters.clear();
		},
	};
}
