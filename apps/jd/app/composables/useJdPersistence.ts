import { type JdDraft, type JdDraftEnvelope, jdSchema } from 'hr-jd';
import * as v from 'valibot';
import { toRaw } from 'vue';

const DB_NAME = 'hr-skills-jd';
const DB_VERSION = 2;
const STORE_NAME = 'drafts';
const CURRENT_DRAFT_KEY = 'hr-skills-jd.current-draft';
const CHANGE_EVENT = 'hr-skills-jd.changed';

type LocalDraft = JdDraftEnvelope;

type DraftFilters = {
	q?: string;
	status?: 'all' | JdDraftEnvelope['status'];
	includeArchived?: boolean;
};

let writeQueue = Promise.resolve();
let changeChannel: BroadcastChannel | null = null;
const changeListeners = new Set<() => void>();

function browserStorageAvailable() {
	return import.meta.client && typeof indexedDB !== 'undefined';
}

function requestResult<T>(request: IDBRequest<T>) {
	return new Promise<T>((resolve, reject) => {
		request.onsuccess = () => resolve(request.result);
		request.onerror = () =>
			reject(request.error ?? new Error('IndexedDB request failed'));
	});
}

function transactionComplete(transaction: IDBTransaction) {
	return new Promise<void>((resolve, reject) => {
		transaction.oncomplete = () => resolve();
		transaction.onerror = () =>
			reject(transaction.error ?? new Error('IndexedDB transaction failed'));
		transaction.onabort = () =>
			reject(transaction.error ?? new Error('IndexedDB transaction aborted'));
	});
}

function notifyChange() {
	for (const listener of changeListeners) listener();
	if (import.meta.client && typeof BroadcastChannel !== 'undefined') {
		changeChannel ??= new BroadcastChannel(CHANGE_EVENT);
		changeChannel.postMessage({ changedAt: Date.now() });
	}
}

function ensureChannel() {
	if (!import.meta.client || typeof BroadcastChannel === 'undefined') return;
	changeChannel ??= new BroadcastChannel(CHANGE_EVENT);
	changeChannel.onmessage = () => {
		for (const listener of changeListeners) listener();
	};
}

async function openDatabase() {
	if (!browserStorageAvailable()) throw new Error('Browser storage is unavailable.');
	return new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = (event) => {
			const database = request.result;
			const oldVersion = (event as IDBVersionChangeEvent).oldVersion;
			const store = database.objectStoreNames.contains(STORE_NAME)
				? request.transaction?.objectStore(STORE_NAME)
				: database.createObjectStore(STORE_NAME, { keyPath: 'id' });
			// Version 2 adds query indexes without rewriting existing draft records.
			// Future schema changes should use the same oldVersion guard and remain additive.
			if (oldVersion < 2) {
				if (store && !store.indexNames.contains('updatedAt'))
					store.createIndex('updatedAt', 'updatedAt');
				if (store && !store.indexNames.contains('archivedAt'))
					store.createIndex('archivedAt', 'archivedAt');
			}
		};
		request.onblocked = () =>
			reject(new Error('Browser storage is blocked by another open tab.'));
		request.onsuccess = () => resolve(request.result);
		request.onerror = () =>
			reject(request.error ?? new Error('Could not open browser storage.'));
	});
}

async function getDraft(targetId: string) {
	const database = await openDatabase();
	try {
		const transaction = database.transaction(STORE_NAME, 'readonly');
		return (await requestResult(transaction.objectStore(STORE_NAME).get(targetId))) as
			| LocalDraft
			| undefined;
	} finally {
		database.close();
	}
}

async function getAllDrafts() {
	const database = await openDatabase();
	try {
		const transaction = database.transaction(STORE_NAME, 'readonly');
		return (await requestResult(
			transaction.objectStore(STORE_NAME).getAll(),
		)) as LocalDraft[];
	} finally {
		database.close();
	}
}

async function putDraft(draft: LocalDraft) {
	const database = await openDatabase();
	try {
		const transaction = database.transaction(STORE_NAME, 'readwrite');
		transaction.objectStore(STORE_NAME).put(draft);
		await transactionComplete(transaction);
	} finally {
		database.close();
	}
	notifyChange();
}

async function deleteDraft(targetId: string) {
	const database = await openDatabase();
	try {
		const transaction = database.transaction(STORE_NAME, 'readwrite');
		transaction.objectStore(STORE_NAME).delete(targetId);
		await transactionComplete(transaction);
	} finally {
		database.close();
	}
	notifyChange();
}

function sortDrafts(drafts: LocalDraft[]) {
	return drafts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function newDraftId() {
	return crypto.randomUUID();
}

export function useJdPersistence() {
	const id = useState<string | null>('jd-id', () => null);
	const version = useState<number>('jd-version', () => 0);
	const saving = useState<boolean>('jd-saving', () => false);
	const persistenceError = useState<string | null>('jd-persistence-error', () => null);

	ensureChannel();

	function resetCurrent() {
		id.value = null;
		version.value = 0;
		if (import.meta.client) localStorage.removeItem(CURRENT_DRAFT_KEY);
	}

	async function resume() {
		if (!import.meta.client) return null;
		const targetId = localStorage.getItem(CURRENT_DRAFT_KEY);
		return targetId ? load(targetId) : null;
	}

	async function load(targetId: string) {
		persistenceError.value = null;
		try {
			const response = await getDraft(targetId);
			if (!response) return null;
			id.value = response.id;
			version.value = response.version;
			if (import.meta.client) localStorage.setItem(CURRENT_DRAFT_KEY, response.id);
			return response;
		} catch {
			persistenceError.value = 'Could not load this draft from browser storage.';
			return null;
		}
	}

	async function list(filters: DraftFilters = {}) {
		persistenceError.value = null;
		try {
			let drafts = await getAllDrafts();
			if (!filters.includeArchived)
				drafts = drafts.filter((draft) => !draft.archivedAt);
			if (filters.status && filters.status !== 'all')
				drafts = drafts.filter((draft) => draft.status === filters.status);
			const query = filters.q?.trim().toLocaleLowerCase();
			if (query)
				drafts = drafts.filter((draft) =>
					draft.title.toLocaleLowerCase().includes(query),
				);
			return sortDrafts(drafts);
		} catch {
			persistenceError.value = 'Could not read drafts from browser storage.';
			return [];
		}
	}

	async function exportAll() {
		return getAllDrafts();
	}

	async function save(data: JdDraft, status: 'draft' | 'ready_for_review' = 'draft') {
		saving.value = true;
		persistenceError.value = null;
		const operation = writeQueue.then(async () => {
			const now = new Date().toISOString();
			const existing = id.value ? await getDraft(id.value) : undefined;
			const draft: LocalDraft = {
				id: existing?.id ?? newDraftId(),
				title: data.title,
				status,
				version: (existing?.version ?? 0) + 1,
				data: structuredClone(toRaw(data)),
				createdAt: existing?.createdAt ?? now,
				updatedAt: now,
				archivedAt: existing?.archivedAt ?? null,
			};
			await putDraft(draft);
			id.value = draft.id;
			version.value = draft.version;
			if (import.meta.client) localStorage.setItem(CURRENT_DRAFT_KEY, draft.id);
			return draft;
		});
		writeQueue = operation.then(
			() => undefined,
			() => undefined,
		);
		try {
			return await operation;
		} catch {
			persistenceError.value =
				'Could not save this draft in browser storage. Export a backup and check available storage.';
			return null;
		} finally {
			saving.value = false;
		}
	}

	async function archive(targetId = id.value) {
		if (!targetId) return false;
		try {
			const existing = await getDraft(targetId);
			if (!existing) return false;
			const timestamp = new Date().toISOString();
			await putDraft({
				...existing,
				archivedAt: timestamp,
				updatedAt: timestamp,
			});
			if (id.value === targetId) id.value = null;
			return true;
		} catch {
			persistenceError.value = 'Could not archive this draft.';
			return false;
		}
	}

	async function restore(targetId: string) {
		try {
			const existing = await getDraft(targetId);
			if (!existing) return null;
			const restored = {
				...existing,
				archivedAt: null,
				updatedAt: new Date().toISOString(),
			};
			await putDraft(restored);
			return restored;
		} catch {
			persistenceError.value = 'Could not restore this draft.';
			return null;
		}
	}

	async function duplicate(targetId: string) {
		try {
			const existing = await getDraft(targetId);
			if (!existing) return null;
			const now = new Date().toISOString();
			const duplicateDraft: LocalDraft = {
				...existing,
				id: newDraftId(),
				title: `${existing.title || 'Untitled role'} (copy)`,
				status: 'draft',
				version: 1,
				createdAt: now,
				updatedAt: now,
				archivedAt: null,
				data: structuredClone(existing.data),
			};
			await putDraft(duplicateDraft);
			return duplicateDraft;
		} catch {
			persistenceError.value = 'Could not duplicate this draft.';
			return null;
		}
	}

	async function remove(targetId: string) {
		try {
			const existing = await getDraft(targetId);
			if (!existing) return false;
			await deleteDraft(targetId);
			if (id.value === targetId) id.value = null;
			return true;
		} catch {
			persistenceError.value = 'Could not permanently delete this draft.';
			return false;
		}
	}

	async function importDrafts(input: unknown) {
		const candidates = Array.isArray(input) ? input : [input];
		const imported: LocalDraft[] = [];
		try {
			for (const candidate of candidates) {
				if (!candidate || typeof candidate !== 'object' || !('data' in candidate))
					continue;
				const record = candidate as Partial<LocalDraft>;
				const parsed = v.safeParse(jdSchema, record.data);
				if (!parsed.success) continue;
				const data = parsed.output as JdDraft;
				const now = new Date().toISOString();
				const draft: LocalDraft = {
					id: newDraftId(),
					title: data.title,
					status:
						record.status === 'ready_for_review' ||
						record.status === 'published'
							? record.status
							: 'draft',
					version: 1,
					data: structuredClone(toRaw(data)),
					createdAt: now,
					updatedAt: now,
					archivedAt: null,
				};
				await putDraft(draft);
				imported.push(draft);
			}
			return imported;
		} catch (error) {
			persistenceError.value =
				'Could not import the backup because browser storage is unavailable or full.';
			throw error;
		}
	}

	function subscribe(listener: () => void) {
		changeListeners.add(listener);
		return () => changeListeners.delete(listener);
	}

	return {
		id,
		version,
		saving,
		persistenceError,
		resetCurrent,
		resume,
		load,
		list,
		exportAll,
		save,
		archive,
		restore,
		duplicate,
		remove,
		importDrafts,
		subscribe,
	};
}
