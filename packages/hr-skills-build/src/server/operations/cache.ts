export interface VersionedCache<T> {
	get(key: string, version: string): T | undefined;
	set(key: string, version: string, value: T): void;
	invalidate(key: string): boolean;
	clear(): void;
	readonly size: number;
}

interface CacheEntry<T> {
	readonly version: string;
	readonly value: T;
}

export function createVersionedCache<T>(): VersionedCache<T> {
	const entries = new Map<string, CacheEntry<T>>();

	return {
		get(key, version) {
			const entry = entries.get(key);
			return entry?.version === version ? entry.value : undefined;
		},
		set(key, version, value) {
			entries.set(key, { version, value });
		},
		invalidate(key) {
			return entries.delete(key);
		},
		clear() {
			entries.clear();
		},
		get size() {
			return entries.size;
		},
	};
}

export function createRegistryCache<T>(): VersionedCache<T> {
	return createVersionedCache<T>();
}

export function createEvaluationCache<T>(): VersionedCache<T> {
	return createVersionedCache<T>();
}
