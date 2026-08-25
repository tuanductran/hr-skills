import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';

const STORAGE_KEY = 'hr-skills-worklist:v1';
const RECENT_LIMIT = 8;

interface StoredWorklist {
	pinned: string[];
	recent: string[];
}

interface WorklistContextValue extends StoredWorklist {
	storageAvailable: boolean;
	isPinned: (skillId: string) => boolean;
	togglePinned: (skillId: string) => void;
	recordRecent: (skillId: string) => void;
	clearWorklist: () => void;
}

const WorklistContext = createContext<WorklistContextValue | null>(null);
const PinnedSkillsContext = createContext<readonly string[]>([]);

function normalizeStoredWorklist(value: unknown): StoredWorklist {
	if (!value || typeof value !== 'object') return { pinned: [], recent: [] };
	const candidate = value as Partial<StoredWorklist>;
	return {
		pinned: Array.isArray(candidate.pinned)
			? [
					...new Set(
						candidate.pinned.filter(
							(id): id is string => typeof id === 'string',
						),
					),
				]
			: [],
		recent: Array.isArray(candidate.recent)
			? [
					...new Set(
						candidate.recent.filter(
							(id): id is string => typeof id === 'string',
						),
					),
				].slice(0, RECENT_LIMIT)
			: [],
	};
}

export function WorklistProvider({ children }: { children: ReactNode }) {
	const [worklist, setWorklist] = useState<StoredWorklist>({ pinned: [], recent: [] });
	const [storageAvailable, setStorageAvailable] = useState(true);
	const hydrated = useRef(false);

	useEffect(() => {
		try {
			const stored = window.localStorage.getItem(STORAGE_KEY);
			if (stored) setWorklist(normalizeStoredWorklist(JSON.parse(stored)));
		} catch {
			setStorageAvailable(false);
		} finally {
			hydrated.current = true;
		}
	}, []);

	useEffect(() => {
		if (!hydrated.current || !storageAvailable) return;
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(worklist));
		} catch {
			setStorageAvailable(false);
		}
	}, [storageAvailable, worklist]);

	const togglePinned = useCallback((skillId: string) => {
		setWorklist((current) => ({
			...current,
			pinned: current.pinned.includes(skillId)
				? current.pinned.filter((id) => id !== skillId)
				: [skillId, ...current.pinned],
		}));
	}, []);

	const recordRecent = useCallback((skillId: string) => {
		setWorklist((current) => {
			if (current.recent[0] === skillId) return current;
			return {
				...current,
				recent: [skillId, ...current.recent.filter((id) => id !== skillId)].slice(
					0,
					RECENT_LIMIT,
				),
			};
		});
	}, []);

	const clearWorklist = useCallback(() => {
		setWorklist((current) =>
			current.pinned.length || current.recent.length
				? { pinned: [], recent: [] }
				: current,
		);
	}, []);

	const value = useMemo<WorklistContextValue>(
		() => ({
			...worklist,
			storageAvailable,
			isPinned: (skillId) => worklist.pinned.includes(skillId),
			togglePinned,
			recordRecent,
			clearWorklist,
		}),
		[clearWorklist, recordRecent, storageAvailable, togglePinned, worklist],
	);

	return (
		<PinnedSkillsContext.Provider value={worklist.pinned}>
			<WorklistContext.Provider value={value}>{children}</WorklistContext.Provider>
		</PinnedSkillsContext.Provider>
	);
}

export function useWorklist() {
	const context = useContext(WorklistContext);
	if (!context) throw new Error('useWorklist must be used within WorklistProvider');
	return context;
}

export function usePinnedSkills() {
	return useContext(PinnedSkillsContext);
}
