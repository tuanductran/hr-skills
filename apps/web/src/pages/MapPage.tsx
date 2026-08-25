import { Link, useNavigate, useSearch } from '@tanstack/react-router';
import { searchSkills } from 'hr-skills-build/client';
import { ArrowUpRight, CircleAlert, Layers3, Search, X } from 'lucide-react';
import {
	useCallback,
	useDeferredValue,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { ResponsiveDisclosure } from '../components/ResponsiveDisclosure';
import { StageNavigator } from '../components/StageNavigator';
import { ErrorState, LoadingState } from '../components/States';
import { useWorklist } from '../components/WorklistProvider';
import { useHrSkills } from '../lib/data';
import { PEOPLE_SYSTEM_STAGES } from '../lib/peopleSystem';
import { toRegistry } from '../lib/types';

export function MapPage() {
	const { data, isLoading, error, refetch, isFetching } = useHrSkills();
	const navigate = useNavigate({ from: '/map' });
	const routeSearch = useSearch({ from: '/map' });
	const { recordRecent } = useWorklist();
	const [inventoryQuery, setInventoryQuery] = useState(routeSearch.q ?? '');
	const inventoryQueryTimer = useRef<number | null>(null);
	const deferredInventoryQuery = useDeferredValue(inventoryQuery.trim());
	const activeStage =
		PEOPLE_SYSTEM_STAGES.find((stage) => stage.id === routeSearch.stage) ??
		PEOPLE_SYSTEM_STAGES[0];
	const registry = useMemo(() => (data ? toRegistry(data) : null), [data]);
	const skillById = useMemo(
		() => new Map(data?.skills.map((skill) => [skill.id, skill]) ?? []),
		[data],
	);

	useEffect(() => {
		setInventoryQuery(routeSearch.q ?? '');
	}, [routeSearch.q]);
	useEffect(
		() => () => {
			if (inventoryQueryTimer.current)
				window.clearTimeout(inventoryQueryTimer.current);
		},
		[],
	);
	const inventoryResults = useMemo(() => {
		if (!data || !registry || !deferredInventoryQuery) return [];
		const response = searchSkills(
			{ text: deferredInventoryQuery, limit: 12 },
			registry,
		);
		return response.results
			.map((result) => ({ skill: skillById.get(result.skillId), result }))
			.filter(
				(
					entry,
				): entry is {
					skill: NonNullable<typeof entry.skill>;
					result: (typeof response.results)[number];
				} => Boolean(entry.skill),
			);
	}, [data, deferredInventoryQuery, registry, skillById]);

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

	const setStage = (stageId: string) =>
		void navigate({ search: (previous) => ({ ...previous, stage: stageId }) });
	const setInventorySearch = useCallback(
		(value: string) => {
			setInventoryQuery(value);
			if (inventoryQueryTimer.current)
				window.clearTimeout(inventoryQueryTimer.current);
			inventoryQueryTimer.current = window.setTimeout(() => {
				void navigate({
					search: (previous) => ({ ...previous, q: value.trim() || undefined }),
					replace: true,
				});
			}, 180);
		},
		[navigate],
	);

	return (
		<div className='mx-auto box-border w-full max-w-[1540px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7'>
			<div className='mb-6 flex flex-col gap-5 border-b border-slate-200 pb-5 lg:flex-row lg:items-end lg:justify-between'>
				<div>
					<p className='m-0 mb-1.5 font-mono text-[.66rem] font-600 uppercase tracking-[.14em] text-blue-700'>
						People system canvas
					</p>
					<h1 className='m-0 font-heading text-[clamp(1.85rem,3vw,2.55rem)] font-800 tracking-[-.045em] text-slate-950'>
						Navigate the work. Keep decisions human-owned.
					</h1>
					<p className='m-0 mt-2 max-w-[760px] text-[.95rem] leading-[1.55] text-slate-600'>
						Use the canvas to orient a people-work problem, choose a stage,
						and open only the skills needed for the next accountable decision.
					</p>
				</div>
				<div className='rounded-xl border border-blue-100 bg-blue-50 px-3.5 py-3 text-[.78rem] leading-[1.45] text-blue-900 lg:max-w-[320px]'>
					<div className='flex items-center gap-2 font-700'>
						<CircleAlert
							size={15}
							aria-hidden='true'
						/>
						High-impact people decisions need a named owner and appropriate
						HR, policy, or legal review.
					</div>
				</div>
			</div>

			<div className='grid gap-6 xl:grid-cols-[268px_minmax(0,1fr)]'>
				<aside className='xl:sticky xl:top-21 xl:h-fit'>
					<ResponsiveDisclosure label={`Decision stage: ${activeStage.title}`}>
						<StageNavigator
							stages={PEOPLE_SYSTEM_STAGES}
							activeStageId={activeStage.id}
							onSelect={setStage}
						/>
					</ResponsiveDisclosure>
				</aside>

				<section className='min-w-0'>
					<article className='overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/45'>
						<div className='grid gap-7 bg-slate-950 px-5 py-6 text-white md:grid-cols-[1.3fr_.7fr] md:px-7 md:py-8'>
							<div>
								<p className='m-0 font-mono text-[.67rem] font-600 uppercase tracking-[.14em] text-blue-300'>
									{activeStage.eyebrow}
								</p>
								<h2 className='m-0 mt-3 font-heading text-[clamp(1.55rem,3vw,2.3rem)] font-800 leading-[1.05] tracking-[-.04em]'>
									{activeStage.title}
								</h2>
								<p className='m-0 mt-3 max-w-[680px] text-[.97rem] leading-[1.6] text-slate-300'>
									{activeStage.statement}
								</p>
							</div>
							<div className='rounded-xl border border-white/10 bg-white/5 p-4'>
								<p className='m-0 font-mono text-[.65rem] font-600 uppercase tracking-[.12em] text-blue-200'>
									{activeStage.gate}
								</p>
								<p className='m-0 mt-2 text-[.82rem] leading-[1.55] text-slate-200'>
									{activeStage.gateText}
								</p>
							</div>
						</div>

						<div className='grid gap-7 p-5 md:grid-cols-[1fr_.85fr] md:p-7'>
							<section>
								<div className='mb-3 flex items-center gap-2'>
									<Layers3
										size={16}
										className='text-blue-700'
										aria-hidden='true'
									/>
									<h3 className='m-0 font-heading text-[1rem] font-800 text-slate-900'>
										Focused skills
									</h3>
								</div>
								<div className='grid gap-2'>
									{activeStage.skills.map((id, index) => {
										const skill = skillById.get(id);
										if (!skill) return null;
										return (
											<Link
												className='group flex items-start gap-3 rounded-xl border border-slate-200 p-3 text-slate-700 no-underline transition hover:border-blue-300 hover:bg-blue-50/50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
												key={id}
												to='/skills/$skillId'
												params={{ skillId: id }}
												onClick={() => recordRecent(id)}>
												<span className='mt-.5 grid size-6 shrink-0 place-items-center rounded-md bg-blue-50 font-mono text-[.62rem] font-700 text-blue-700'>
													{index + 1}
												</span>
												<span className='min-w-0 flex-1'>
													<span className='block truncate font-mono text-[.78rem] font-600 text-slate-900 group-hover:text-blue-700'>
														{skill.id}
													</span>
													<span className='mt-1 block text-[.75rem] leading-[1.45] text-slate-500'>
														{skill.description}
													</span>
												</span>
												<ArrowUpRight
													size={15}
													className='shrink-0 text-slate-300 transition group-hover:text-blue-700'
													aria-hidden='true'
												/>
											</Link>
										);
									})}
								</div>
							</section>
							<section className='rounded-xl bg-slate-50 p-4'>
								<h3 className='m-0 font-heading text-[1rem] font-800 text-slate-900'>
									Expected outputs
								</h3>
								<ul className='m-0 mt-3 grid list-none gap-2 p-0'>
									{activeStage.outcomes.map((outcome) => (
										<li
											className='flex items-center gap-2 text-[.82rem] text-slate-600'
											key={outcome}>
											<span className='size-1.5 rounded-full bg-blue-600' />
											{outcome}
										</li>
									))}
								</ul>
								<div className='mt-5 border-t border-slate-200 pt-4'>
									<p className='m-0 text-[.72rem] leading-[1.45] text-slate-500'>
										This canvas supports orientation and
										implementation planning. It does not replace
										accountable HR, employment, or legal review.
									</p>
								</div>
							</section>
						</div>
					</article>

					<section className='mt-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40 sm:p-5'>
						<div className='flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-center md:justify-between'>
							<div>
								<p className='m-0 font-mono text-[.65rem] font-600 uppercase tracking-[.12em] text-blue-700'>
									Inventory workspace
								</p>
								<h2 className='m-0 mt-1 font-heading text-[1.2rem] font-800 text-slate-950'>
									Find a supporting skill
								</h2>
							</div>
							<div className='flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-3 focus-within:ring-blue-100 md:w-[360px]'>
								<Search
									className='mr-2 shrink-0 text-blue-700'
									size={16}
									aria-hidden='true'
								/>
								<label
									className='sr-only'
									htmlFor='canvas-inventory-search'>
									Search supporting skills
								</label>
								<input
									id='canvas-inventory-search'
									className='min-w-0 flex-1 border-0 bg-transparent py-2.5 text-[.86rem] text-slate-900 outline-none placeholder:text-slate-400'
									type='search'
									value={inventoryQuery}
									onChange={(event) =>
										setInventorySearch(event.target.value)
									}
									placeholder='Capability, tag, alias, or trigger…'
								/>
								{inventoryQuery && (
									<button
										className='grid size-7 place-items-center rounded text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
										type='button'
										onClick={() => setInventorySearch('')}>
										<X
											size={14}
											aria-hidden='true'
										/>
									</button>
								)}
							</div>
						</div>
						{deferredInventoryQuery ? (
							<div className='mt-4 grid gap-2 md:grid-cols-2'>
								{inventoryResults.length ? (
									inventoryResults.map(({ skill, result }) => (
										<Link
											className='rounded-lg border border-slate-200 p-3 text-slate-700 no-underline transition hover:border-blue-300 hover:bg-blue-50/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
											key={skill.id}
											to='/skills/$skillId'
											params={{ skillId: skill.id }}
											onClick={() => recordRecent(skill.id)}>
											<span className='block font-mono text-[.78rem] font-600 text-slate-900'>
												{skill.id}
											</span>
											<span className='mt-1 block text-[.75rem] leading-[1.45] text-slate-600'>
												{skill.description}
											</span>
											<span className='mt-2 block font-mono text-[.63rem] text-slate-400'>
												Matched{' '}
												{result.matches[0]?.field ?? 'metadata'}
											</span>
										</Link>
									))
								) : (
									<p className='m-0 rounded-lg bg-slate-50 p-4 text-[.83rem] text-slate-600 md:col-span-2'>
										No skill matched. Broaden the phrase or return to
										the explorer for all facets.
									</p>
								)}
							</div>
						) : (
							<div className='mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
								{data.domains.map((domain) => (
									<Link
										className='flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2.5 text-[.8rem] text-slate-600 no-underline transition hover:border-blue-300 hover:bg-blue-50/40 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
										key={domain.id}
										to='/'
										search={{ domain: domain.id }}>
										<span>{domain.label}</span>
										<span className='font-mono text-[.65rem] text-slate-400'>
											{domain.skillCount}
										</span>
									</Link>
								))}
							</div>
						)}
					</section>
				</section>
			</div>
		</div>
	);
}
