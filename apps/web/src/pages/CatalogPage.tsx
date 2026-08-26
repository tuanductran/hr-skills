import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { type SkillCategory, searchSkills } from 'hr-skills-build/client';
import {
	ArrowUpRight,
	BookMarked,
	Check,
	ChevronRight,
	Clipboard,
	Filter,
	LoaderCircle,
	Pin,
	RefreshCw,
	Search,
	SlidersHorizontal,
	Sparkles,
	X,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { ResponsiveDisclosure } from '../components/ResponsiveDisclosure';
import { ErrorState, LoadingState } from '../components/States';
import { useWorklist } from '../components/WorklistProvider';
import { copyText } from '../lib/clipboard';
import { useHrSkills } from '../lib/data';
import { type HrSkill, toRegistry } from '../lib/types';

const RESULTS_PAGE_SIZE = 6;

function sentence(value: string) {
	const match = value.match(/^(.+?[.!?])(?:\s|$)/);
	return match?.[1] ?? value;
}

export function CatalogPage() {
	const { data, isLoading, error, refetch, isFetching } = useHrSkills();
	const navigate = useNavigate({ from: '/' });
	const routeSearch = useSearch({ from: '/' });
	const {
		pinned,
		recent,
		isPinned,
		togglePinned,
		recordRecent,
		clearWorklist,
		storageAvailable,
	} = useWorklist();
	const inputRef = useRef<HTMLInputElement>(null);
	const queryTimer = useRef<number | null>(null);
	const resultTimer = useRef<number | null>(null);
	const submittedQuery = useRef<string | null>(null);
	const [inputValue, setInputValue] = useState(routeSearch.q ?? '');
	const [visibleCount, setVisibleCount] = useState(RESULTS_PAGE_SIZE);
	const [isSearchPending, setIsSearchPending] = useState(false);
	const [committedQuery, setCommittedQuery] = useState(routeSearch.q ?? '');
	const clearPendingQueryTimers = useCallback(() => {
		if (queryTimer.current) window.clearTimeout(queryTimer.current);
		if (resultTimer.current) window.clearTimeout(resultTimer.current);
		queryTimer.current = null;
		resultTimer.current = null;
	}, []);
	const cancelPendingQueryUpdate = useCallback(() => {
		clearPendingQueryTimers();
		submittedQuery.current = null;
		setIsSearchPending(false);
	}, [clearPendingQueryTimers]);

	useEffect(() => {
		const urlQuery = routeSearch.q ?? '';
		setInputValue(urlQuery);
		if (submittedQuery.current === urlQuery) {
			submittedQuery.current = null;
			return;
		}
		cancelPendingQueryUpdate();
		setCommittedQuery(urlQuery);
	}, [cancelPendingQueryUpdate, routeSearch.q]);

	useEffect(() => {
		const focusSearch = () => inputRef.current?.focus();
		window.addEventListener('hr-skills:focus-search', focusSearch);
		return () => window.removeEventListener('hr-skills:focus-search', focusSearch);
	}, []);

	const setSearch = useCallback(
		(next: Partial<typeof routeSearch>) => {
			void navigate({
				search: (previous) => ({ ...previous, ...next }),
				replace: true,
			});
		},
		[navigate],
	);
	const updateExplorerQuery = useCallback(
		(value: string) => {
			cancelPendingQueryUpdate();
			setInputValue(value);
			setIsSearchPending(true);
			queryTimer.current = window.setTimeout(() => {
				const q = value.trim() || undefined;
				submittedQuery.current = q ?? '';
				void navigate({
					search: (previous) => ({
						...previous,
						q,
						...(q ? { view: 'all' as const } : {}),
					}),
					replace: true,
				});
			}, 180);
			resultTimer.current = window.setTimeout(() => {
				setCommittedQuery(value.trim());
				setIsSearchPending(false);
			}, 260);
		},
		[cancelPendingQueryUpdate, navigate],
	);

	useEffect(
		() => () => {
			clearPendingQueryTimers();
			submittedQuery.current = null;
		},
		[clearPendingQueryTimers],
	);

	const registry = useMemo(() => (data ? toRegistry(data) : null), [data]);
	const skillById = useMemo(
		() => new Map(data?.skills.map((skill) => [skill.id, skill]) ?? []),
		[data],
	);
	const domainById = useMemo(
		() => new Map(data?.domains.map((domain) => [domain.id, domain]) ?? []),
		[data],
	);
	const selectedDomain = routeSearch.domain as SkillCategory | undefined;
	const searchResult = useMemo(() => {
		if (!data || !registry || !committedQuery) return null;
		return searchSkills(
			{
				text: committedQuery,
				limit: data.skillCount,
			},
			registry,
		);
	}, [committedQuery, data, registry, selectedDomain]);

	const resultById = useMemo(
		() =>
			new Map(
				searchResult?.results.map((result) => [result.skillId, result]) ?? [],
			),
		[searchResult],
	);
	const searchedSkills = useMemo(
		() =>
			searchResult?.results
				.map((result) => skillById.get(result.skillId))
				.filter((skill): skill is HrSkill => Boolean(skill)) ?? [],
		[searchResult, skillById],
	);
	const browseSkills = useMemo(
		() =>
			data?.skills.filter(
				(skill) => !selectedDomain || skill.domain === selectedDomain,
			) ?? [],
		[data, selectedDomain],
	);
	const worklistSkills = useMemo(() => {
		if (!data) return [];
		return [...new Set([...pinned, ...recent])]
			.map((id) => skillById.get(id))
			.filter((skill): skill is HrSkill => Boolean(skill));
	}, [data, pinned, recent, skillById]);
	const visibleSkills = useMemo(() => {
		if (!data) return [];
		if (routeSearch.view === 'worklist') return worklistSkills;
		if (searchResult) {
			return selectedDomain
				? searchedSkills.filter((skill) => skill.domain === selectedDomain)
				: searchedSkills;
		}
		return browseSkills;
	}, [
		browseSkills,
		routeSearch.view,
		searchResult,
		searchedSkills,
		selectedDomain,
		worklistSkills,
	]);
	useEffect(() => {
		setVisibleCount(RESULTS_PAGE_SIZE);
	}, [committedQuery, routeSearch.view, selectedDomain]);
	const displayedSkills = visibleSkills.slice(0, visibleCount);
	const hasMoreSkills = displayedSkills.length < visibleSkills.length;
	const loadMoreCount = Math.min(
		RESULTS_PAGE_SIZE,
		visibleSkills.length - displayedSkills.length,
	);
	const isSearching = isSearchPending;
	const domainCounts = useMemo(() => {
		if (!data || !searchResult) {
			return new Map(
				data?.domains.map((domain) => [domain.id, domain.skillCount]) ?? [],
			);
		}
		const counts = new Map(data.domains.map((domain) => [domain.id, 0]));
		for (const result of searchResult.results) {
			counts.set(result.domain, (counts.get(result.domain) ?? 0) + 1);
		}
		return counts;
	}, [data, searchResult]);

	if (isLoading) return <LoadingState />;
	if (error || !data)
		return (
			<ErrorState
				message={
					error instanceof Error
						? error.message
						: 'Try refreshing the canonical registry snapshot.'
				}
				primaryAction={{
					label: isFetching ? 'Retrying…' : 'Retry registry',
					onClick: () => void refetch(),
				}}
			/>
		);

	const hasFilters = Boolean(
		inputValue || selectedDomain || routeSearch.view === 'worklist',
	);
	const domainLabel = selectedDomain
		? domainById.get(selectedDomain)?.label
		: undefined;
	const exportWorklist = async () => {
		if (!worklistSkills.length) {
			toast.error('Pin at least one skill before exporting your worklist.');
			return;
		}
		const markdown = [
			'# HR Skills worklist',
			'',
			...worklistSkills.map(
				(skill) =>
					`- [${skill.id}](https://raw.githubusercontent.com/tuanductran/hr-skills/main/skills/${skill.id}/SKILL.md) — ${sentence(skill.description)}`,
			),
		].join('\n');
		if (await copyText(markdown)) toast.success('Worklist copied as Markdown.');
		else toast.error('Unable to copy. Your browser blocked clipboard access.');
	};

	return (
		<div className='mx-auto box-border w-full max-w-[1540px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7'>
			<div className='mb-6 flex flex-col gap-5 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between'>
				<div>
					<p className='m-0 mb-1.5 font-mono text-[.66rem] font-600 uppercase tracking-[.14em] text-blue-700'>
						Skill explorer
					</p>
					<h1 className='m-0 font-heading text-[clamp(1.85rem,3vw,2.55rem)] font-800 tracking-[-.045em] text-slate-950'>
						Find evidence for the people work in front of you.
					</h1>
					<p className='m-0 mt-2 max-w-[760px] text-[.95rem] leading-[1.55] text-slate-600'>
						Search the current HR Skills registry, see why a skill matched,
						and assemble a private worklist without storing employee data.
					</p>
				</div>
				<div className='flex items-center gap-2 text-[.76rem] text-slate-500'>
					<span className='size-2 rounded-full bg-emerald-500' />
					<span>{data.skillCount} canonical skills</span>
					<span className='text-slate-300'>·</span>
					<time className='font-mono text-[.68rem]'>{data.generatedAt}</time>
				</div>
			</div>

			<div className='grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)]'>
				<aside className='xl:sticky xl:top-21 xl:h-[calc(100vh-6.25rem)] xl:overflow-y-auto xl:pr-2'>
					<ResponsiveDisclosure label='Filters and worklist'>
						<div className='grid gap-4'>
							<section className='rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm shadow-slate-200/40'>
								<div className='mb-3 flex items-center justify-between'>
									<h2 className='m-0 flex items-center gap-2 font-heading text-[.9rem] font-800 text-slate-900'>
										<Filter
											size={15}
											className='text-blue-700'
											aria-hidden='true'
										/>
										Practice area
									</h2>
									{hasFilters && (
										<button
											className='rounded-md px-1.5 py-1 text-[.7rem] font-700 text-blue-700 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
											type='button'
											onClick={() => {
												cancelPendingQueryUpdate();
												setInputValue('');
												setCommittedQuery('');
												setSearch({
													q: undefined,
													domain: undefined,
													view: 'all',
												});
												toast.success(
													'Explorer filters cleared.',
												);
											}}>
											Clear
										</button>
									)}
								</div>
								<div className='grid gap-1'>
									<button
										className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[.8rem] transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 ${!selectedDomain && routeSearch.view === 'all' ? 'bg-slate-900 font-700 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
										type='button'
										aria-pressed={
											!selectedDomain &&
											routeSearch.view !== 'worklist'
										}
										onClick={() =>
											setSearch({ domain: undefined, view: 'all' })
										}>
										<span className='flex-1'>All practice areas</span>
										<span className='font-mono text-[.67rem] opacity-65'>
											{data.skillCount}
										</span>
									</button>
									{data.domains.map((domain) => (
										<button
											className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[.8rem] transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 ${selectedDomain === domain.id && routeSearch.view !== 'worklist' ? 'bg-blue-50 font-700 text-blue-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
											key={domain.id}
											type='button'
											aria-pressed={
												selectedDomain === domain.id &&
												routeSearch.view !== 'worklist'
											}
											onClick={() =>
												setSearch({
													domain:
														selectedDomain === domain.id
															? undefined
															: domain.id,
													view: 'all',
												})
											}>
											<span className='flex-1'>{domain.label}</span>
											<span className='font-mono text-[.67rem] text-slate-400'>
												{domainCounts.get(domain.id) ?? 0}
											</span>
										</button>
									))}
								</div>
							</section>

							<section className='mt-4 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm shadow-slate-200/40'>
								<div className='flex items-center justify-between gap-2'>
									<div className='flex items-center gap-2'>
										<BookMarked
											size={15}
											className='text-blue-700'
											aria-hidden='true'
										/>
										<h2 className='m-0 font-heading text-[.9rem] font-800 text-slate-900'>
											Worklist
										</h2>
									</div>
									<span className='font-mono text-[.68rem] text-slate-400'>
										{pinned.length} pinned
									</span>
								</div>
								<p className='m-0 mt-2 text-[.74rem] leading-[1.45] text-slate-500'>
									Saved locally as skill IDs only. No query, prompt, or
									employee information is stored.
								</p>
								<div className='mt-3 grid gap-2'>
									<button
										className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-2 text-[.78rem] font-700 transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 ${routeSearch.view === 'worklist' ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-700'}`}
										type='button'
										aria-pressed={routeSearch.view === 'worklist'}
										onClick={() =>
											setSearch({
												view:
													routeSearch.view === 'worklist'
														? 'all'
														: 'worklist',
											})
										}>
										<span>
											{routeSearch.view === 'worklist'
												? 'Return to explorer'
												: 'Open worklist'}
										</span>
										<ChevronRight
											size={14}
											aria-hidden='true'
										/>
									</button>
									{worklistSkills.length > 0 && (
										<>
											<button
												className='flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[.75rem] font-700 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
												type='button'
												onClick={() => void exportWorklist()}>
												<Clipboard
													size={14}
													aria-hidden='true'
												/>
												Copy as Markdown
											</button>
											<button
												className='rounded-lg px-2.5 py-2 text-left text-[.75rem] font-700 text-slate-400 transition hover:bg-slate-100 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
												type='button'
												onClick={() => {
													clearWorklist();
													toast.success(
														'Local worklist cleared.',
													);
												}}>
												Clear local worklist
											</button>
										</>
									)}
								</div>
								{!storageAvailable && (
									<p className='m-0 mt-3 rounded-md bg-amber-50 px-2.5 py-2 text-[.72rem] leading-[1.4] text-amber-800'>
										Browser storage is unavailable; pinned skills will
										last only for this session.
									</p>
								)}
							</section>
						</div>
					</ResponsiveDisclosure>
				</aside>

				<section className='min-w-0'>
					<div className='rounded-xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/45 sm:p-4'>
						<div className='flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-3 focus-within:ring-blue-100'>
							<Search
								className='shrink-0 text-blue-700'
								size={18}
								aria-hidden='true'
							/>
							<label
								className='sr-only'
								htmlFor='workspace-skill-search'>
								Search skills
							</label>
							<input
								id='workspace-skill-search'
								ref={inputRef}
								className='min-w-0 flex-1 border-0 bg-transparent py-3 text-[.98rem] text-slate-900 outline-none placeholder:text-slate-400'
								type='search'
								value={inputValue}
								onChange={(event) => {
									updateExplorerQuery(event.target.value);
								}}
								placeholder='Search capabilities, aliases, tags, trigger phrases, or a domain…'
								autoComplete='off'
							/>
							{inputValue && (
								<button
									className='grid size-8 place-items-center rounded-md text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
									type='button'
									aria-label='Clear skill search'
									onClick={() => {
										cancelPendingQueryUpdate();
										setInputValue('');
										setCommittedQuery('');
										setSearch({ q: undefined });
									}}>
									<X
										size={16}
										aria-hidden='true'
									/>
								</button>
							)}
						</div>
						<div className='mt-3 flex flex-wrap items-center justify-between gap-2 px-1'>
							<p
								className='m-0 flex items-center gap-1.5 font-mono text-[.7rem] text-slate-500'
								aria-live='polite'>
								<SlidersHorizontal
									size={13}
									aria-hidden='true'
								/>
								{isSearching ? (
									<span
										className='flex items-center gap-1.5 text-blue-700'
										role='status'>
										<LoaderCircle
											className='animate-spin motion-reduce:animate-none'
											size={13}
											aria-hidden='true'
										/>
										Searching registry…
									</span>
								) : routeSearch.view === 'worklist' ? (
									`${visibleSkills.length} saved skills`
								) : (
									`${visibleSkills.length} ${visibleSkills.length === 1 ? 'skill' : 'skills'}${domainLabel ? ` in ${domainLabel}` : ''}`
								)}
							</p>
							<p className='m-0 text-[.7rem] text-slate-400'>
								Exact and fuzzy registry matching
							</p>
						</div>
					</div>

					{visibleSkills.length === 0 ? (
						<section className='mt-5 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center'>
							<span className='mx-auto grid size-11 place-items-center rounded-xl bg-blue-50 text-blue-700'>
								<Sparkles
									size={20}
									aria-hidden='true'
								/>
							</span>
							<h2 className='m-0 mt-4 font-heading text-[1.25rem] font-800 text-slate-950'>
								{routeSearch.view === 'worklist'
									? 'Your worklist is empty.'
									: 'No skills matched that view.'}
							</h2>
							<p className='m-0 mx-auto mt-2 max-w-md text-[.9rem] leading-[1.55] text-slate-600'>
								{routeSearch.view === 'worklist'
									? 'Pin skills from the explorer to keep a private, local set of references for your next task.'
									: 'Broaden the phrase, remove the practice-area filter, or return to all skills.'}
							</p>
							<button
								className='mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3.5 py-2 text-[.82rem] font-700 text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
								type='button'
								onClick={() => {
									cancelPendingQueryUpdate();
									setInputValue('');
									setCommittedQuery('');
									setSearch({
										q: undefined,
										domain: undefined,
										view: 'all',
									});
								}}>
								<RefreshCw
									size={15}
									aria-hidden='true'
								/>
								Return to all skills
							</button>
						</section>
					) : (
						<div className='mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-200/40'>
							<div className='hidden grid-cols-[minmax(220px,1.1fr)_minmax(0,1.8fr)_minmax(130px,.45fr)_40px] gap-4 border-b border-slate-200 bg-slate-50 px-4 py-2 font-mono text-[.64rem] font-600 uppercase tracking-[.1em] text-slate-400 lg:grid'>
								<span>Skill</span>
								<span>Operational intent</span>
								<span>Evidence</span>
								<span className='sr-only'>Save</span>
							</div>
							<div className='divide-y divide-slate-200'>
								{displayedSkills.map((skill) => {
									const result = resultById.get(skill.id);
									const pinnedSkill = isPinned(skill.id);
									return (
										<article
											className='group grid gap-3 px-4 py-4 transition hover:bg-blue-50/35 lg:grid-cols-[minmax(220px,1.1fr)_minmax(0,1.8fr)_minmax(130px,.45fr)_40px] lg:items-start lg:gap-4'
											key={skill.id}>
											<div className='min-w-0'>
												<Link
													to='/skills/$skillId'
													params={{ skillId: skill.id }}
													onClick={() => recordRecent(skill.id)}
													className='inline-flex items-center gap-1.5 rounded-md font-mono text-[.86rem] font-600 text-slate-900 no-underline transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'>
													<span className='truncate'>
														{skill.id}
													</span>
													<ArrowUpRight
														size={14}
														aria-hidden='true'
													/>
												</Link>
												<div className='mt-2 flex flex-wrap gap-1.5'>
													<span className='rounded-full bg-slate-100 px-1.75 py-.5 font-mono text-[.63rem] font-600 text-slate-500'>
														{skill.tier}
													</span>
													<span className='rounded-full bg-blue-50 px-1.75 py-.5 font-mono text-[.63rem] text-blue-700'>
														{domainById.get(skill.domain)
															?.label ?? skill.domain}
													</span>
												</div>
											</div>
											<p className='m-0 text-[.84rem] leading-[1.55] text-slate-600'>
												{sentence(skill.description)}
											</p>
											<div className='flex min-w-0 items-start lg:block'>
												{result ? (
													<p className='m-0 font-mono text-[.65rem] leading-[1.45] text-slate-400'>
														<span className='block text-slate-500'>
															Matched{' '}
															{result.matches[0]?.field ??
																'metadata'}
														</span>
														<span className='block truncate'>
															{result.matches[0]?.value}
														</span>
													</p>
												) : (
													<p className='m-0 font-mono text-[.65rem] text-slate-400'>
														Canonical source
													</p>
												)}
											</div>
											<button
												className={`grid size-9 place-items-center rounded-lg border transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 ${pinnedSkill ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-transparent text-slate-400 hover:border-slate-200 hover:bg-white hover:text-blue-700'}`}
												type='button'
												aria-pressed={pinnedSkill}
												onClick={() => {
													togglePinned(skill.id);
													toast.success(
														pinnedSkill
															? `Unpinned ${skill.id}.`
															: `Pinned ${skill.id}.`,
													);
												}}
												aria-label={
													pinnedSkill
														? `Unpin ${skill.id}`
														: `Pin ${skill.id}`
												}>
												{pinnedSkill ? (
													<Check
														size={16}
														aria-hidden='true'
													/>
												) : (
													<Pin
														size={16}
														aria-hidden='true'
													/>
												)}
											</button>
										</article>
									);
								})}
							</div>
							<div className='flex flex-col gap-3 border-t border-slate-200 bg-slate-50/70 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between'>
								<p className='m-0 font-mono text-[.68rem] text-slate-500'>
									Showing {displayedSkills.length} of{' '}
									{visibleSkills.length} skills
								</p>
								{hasMoreSkills && (
									<button
										className='inline-flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-white px-3.5 py-2 text-[.78rem] font-800 text-blue-700 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
										type='button'
										onClick={() =>
											setVisibleCount((count) =>
												Math.min(
													count + RESULTS_PAGE_SIZE,
													visibleSkills.length,
												),
											)
										}>
										Load {loadMoreCount} more{' '}
										{loadMoreCount === 1 ? 'skill' : 'skills'}
										<ChevronRight
											size={15}
											aria-hidden='true'
										/>
									</button>
								)}
							</div>
						</div>
					)}
				</section>
			</div>
		</div>
	);
}
