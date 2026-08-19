import { type JdDraft, type JdDraftEnvelope, jdSchema } from 'hr-jd';
import * as v from 'valibot';
import { toRaw } from 'vue';

const DB_NAME = 'hr-skills-jd';
const DB_VERSION = 1;
const STORE_NAME = 'drafts';
const CURRENT_DRAFT_KEY = 'hr-skills-jd.current-draft';

type LocalDraft = JdDraftEnvelope;

type DraftFilters = {
	q?: string;
	status?: 'all' | JdDraftEnvelope['status'];
	includeArchived?: boolean;
};

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

async function openDatabase() {
	if (!browserStorageAvailable()) throw new Error('Browser storage is unavailable.');
	return new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);
		request.onupgradeneeded = () => {
			const database = request.result;
			if (!database.objectStoreNames.contains(STORE_NAME)) {
				const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
				store.createIndex('updatedAt', 'updatedAt');
				store.createIndex('archivedAt', 'archivedAt');
			}
		};
		request.onsuccess = () => resolve(request.result);
		request.onerror = () =>
			reject(request.error ?? new Error('Could not open browser storage.'));
	});
}

async function getDraft(id: string) {
	const database = await openDatabase();
	const transaction = database.transaction(STORE_NAME, 'readonly');
	const result = await requestResult(transaction.objectStore(STORE_NAME).get(id));
	database.close();
	return result as LocalDraft | undefined;
}

async function getAllDrafts() {
	const database = await openDatabase();
	const transaction = database.transaction(STORE_NAME, 'readonly');
	const result = await requestResult(transaction.objectStore(STORE_NAME).getAll());
	database.close();
	return result as LocalDraft[];
}

async function putDraft(draft: LocalDraft) {
	const database = await openDatabase();
	const transaction = database.transaction(STORE_NAME, 'readwrite');
	transaction.objectStore(STORE_NAME).put(draft);
	await transactionComplete(transaction);
	database.close();
}

function sortDrafts(drafts: LocalDraft[]) {
	return drafts.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function useJdPersistence() {
	const id = useState<string | null>('jd-id', () => null);
	const version = useState<number>('jd-version', () => 0);
	const saving = useState<boolean>('jd-saving', () => false);
	const persistenceError = useState<string | null>('jd-persistence-error', () => null);

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

	async function save(data: JdDraft, status: 'draft' | 'ready_for_review' = 'draft') {
		saving.value = true;
		persistenceError.value = null;
		try {
			const now = new Date().toISOString();
			const existing = id.value ? await getDraft(id.value) : undefined;
			const draft: LocalDraft = {
				id: existing?.id ?? crypto.randomUUID(),
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
		} catch {
			persistenceError.value = 'Could not save this draft in browser storage.';
			return null;
		} finally {
			saving.value = false;
		}
	}

	async function archive(targetId = id.value) {
		if (!targetId) return false;
		const existing = await getDraft(targetId);
		if (!existing) return false;
		await putDraft({
			...existing,
			archivedAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		});
		if (id.value === targetId) id.value = null;
		return true;
	}

	async function restore(targetId: string) {
		const existing = await getDraft(targetId);
		if (!existing) return null;
		const restored = {
			...existing,
			archivedAt: null,
			updatedAt: new Date().toISOString(),
		};
		await putDraft(restored);
		return restored;
	}

	async function importDrafts(input: unknown) {
		const drafts = Array.isArray(input) ? input : [input];
		const imported: LocalDraft[] = [];
		for (const candidate of drafts) {
			if (!candidate || typeof candidate !== 'object' || !('data' in candidate))
				continue;
			const record = candidate as Partial<LocalDraft>;
			const parsed = v.safeParse(jdSchema, record.data);
			if (!parsed.success) continue;
			const data = parsed.output as JdDraft;
			const now = new Date().toISOString();
			const draft: LocalDraft = {
				id: typeof record.id === 'string' ? record.id : crypto.randomUUID(),
				title: data.title,
				status:
					record.status === 'ready_for_review' || record.status === 'published'
						? record.status
						: 'draft',
				version: typeof record.version === 'number' ? record.version : 1,
				data: structuredClone(toRaw(data)),
				createdAt: typeof record.createdAt === 'string' ? record.createdAt : now,
				updatedAt: now,
				archivedAt: null,
			};
			await putDraft(draft);
			imported.push(draft);
		}
		return imported;
	}

	return {
		id,
		version,
		saving,
		persistenceError,
		resume,
		load,
		list,
		save,
		archive,
		restore,
		importDrafts,
	};
}
