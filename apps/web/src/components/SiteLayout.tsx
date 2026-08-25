/* HR Skills Workspace: Slate/Blue application shell; Radix mobile sheet protects focus and uses restrained state-driven motion. */
import * as Dialog from '@radix-ui/react-dialog';
import { Link, Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import {
	BookMarked,
	Boxes,
	ChevronRight,
	Command,
	ExternalLink,
	LayoutPanelLeft,
	Menu,
	Search,
	X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useHrSkills } from '../lib/data';
import { usePinnedSkills } from './WorklistProvider';

function WorkspaceNavigation({ onNavigate }: { onNavigate?: () => void }) {
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const { data } = useHrSkills();
	const pinned = usePinnedSkills();
	const isExplorer = pathname === '/';
	const isMap = pathname.startsWith('/map');
	const domainLinks = useMemo(() => data?.domains.slice(0, 6) ?? [], [data]);

	return (
		<div className='flex h-full flex-col'>
			<div className='mb-7 flex items-center gap-2.5 px-1'>
				<span className='grid size-9 place-items-center rounded-xl bg-blue-700 text-white shadow-sm shadow-blue-900/20'>
					<Boxes
						size={19}
						aria-hidden='true'
					/>
				</span>
				<div>
					<p className='m-0 font-heading text-[1rem] font-800 leading-none tracking-[-.03em] text-slate-950'>
						HR Skills
					</p>
					<p className='m-0 mt-1 font-mono text-[.63rem] uppercase tracking-[.12em] text-slate-400'>
						Workspace
					</p>
				</div>
			</div>

			<nav aria-label='Workspace navigation'>
				<p className='mb-2 px-2 font-mono text-[.63rem] font-600 uppercase tracking-[.12em] text-slate-400'>
					Workspace
				</p>
				<div className='grid gap-1'>
					<Link
						to='/'
						onClick={onNavigate}
						className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[.88rem] no-underline transition ${isExplorer ? 'bg-blue-50 font-700 text-blue-800 shadow-sm shadow-blue-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>
						<Search
							size={16}
							aria-hidden='true'
						/>
						<span className='flex-1'>Skill explorer</span>
						<kbd className='rounded border border-current/15 bg-white/70 px-1.25 py-.25 font-mono text-[.62rem] font-500 opacity-70'>
							/
						</kbd>
					</Link>
					<Link
						to='/map'
						onClick={onNavigate}
						className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[.88rem] no-underline transition ${isMap ? 'bg-blue-50 font-700 text-blue-800 shadow-sm shadow-blue-100' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'}`}>
						<LayoutPanelLeft
							size={16}
							aria-hidden='true'
						/>
						<span className='flex-1'>People system canvas</span>
					</Link>
				</div>
			</nav>

			<div className='mt-8'>
				<p className='mb-2 px-2 font-mono text-[.63rem] font-600 uppercase tracking-[.12em] text-slate-400'>
					Your worklist
				</p>
				<Link
					to='/'
					search={{ view: 'worklist' }}
					onClick={onNavigate}
					className='flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[.88rem] text-slate-600 no-underline transition hover:bg-slate-100 hover:text-slate-950'>
					<BookMarked
						size={16}
						aria-hidden='true'
					/>
					<span className='flex-1'>Pinned skills</span>
					<span className='grid min-w-5 place-items-center rounded-full bg-slate-100 px-1.25 py-.25 font-mono text-[.65rem] text-slate-500'>
						{pinned.length}
					</span>
				</Link>
			</div>

			<div className='mt-8'>
				<p className='mb-2 px-2 font-mono text-[.63rem] font-600 uppercase tracking-[.12em] text-slate-400'>
					Practice areas
				</p>
				<div className='grid gap-.5'>
					{domainLinks.map((domain) => (
						<Link
							to='/'
							search={{ domain: domain.id }}
							onClick={onNavigate}
							className='flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[.78rem] text-slate-500 no-underline transition hover:bg-slate-100 hover:text-blue-800'
							key={domain.id}>
							<span className='flex-1 truncate'>{domain.label}</span>
							<span className='font-mono text-[.65rem] text-slate-400'>
								{domain.skillCount}
							</span>
						</Link>
					))}
					{data && data.domains.length > domainLinks.length && (
						<Link
							to='/'
							onClick={onNavigate}
							className='flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[.75rem] font-600 text-blue-700 no-underline transition hover:bg-blue-50'>
							View all areas
							<ChevronRight
								size={14}
								aria-hidden='true'
							/>
						</Link>
					)}
				</div>
			</div>

			<div className='mt-auto border-t border-slate-200 pt-5'>
				<div className='rounded-lg bg-slate-100/80 p-3'>
					<div className='flex items-center gap-2 text-[.76rem] text-slate-600'>
						<span className='size-1.5 rounded-full bg-emerald-500' />
						<span>Canonical registry</span>
					</div>
					<p className='m-0 mt-1.5 font-mono text-[.66rem] leading-[1.45] text-slate-400'>
						{data
							? `${data.skillCount} skills · ${data.generatedAt}`
							: 'Loading registry…'}
					</p>
				</div>
				<a
					href='https://github.com/tuanductran/hr-skills'
					target='_blank'
					rel='noreferrer'
					className='mt-4 flex items-center gap-1.5 px-2 text-[.75rem] text-slate-400 no-underline transition hover:text-blue-700'>
					Source repository
					<ExternalLink
						size={12}
						aria-hidden='true'
					/>
				</a>
			</div>
		</div>
	);
}

export function SiteLayout() {
	const navigate = useNavigate();
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const target = event.target as HTMLElement | null;
			if (
				event.key !== '/' ||
				event.metaKey ||
				event.ctrlKey ||
				target?.matches('input, textarea, select, [contenteditable="true"]')
			)
				return;
			event.preventDefault();
			void navigate({ to: '/' }).then(() => {
				window.setTimeout(
					() => window.dispatchEvent(new Event('hr-skills:focus-search')),
					0,
				);
			});
		};
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	}, [navigate]);

	useEffect(() => {
		const desktopBreakpoint = window.matchMedia('(min-width: 1024px)');
		const closeMobileSheetOnDesktop = () => {
			if (desktopBreakpoint.matches) setMobileOpen(false);
		};
		desktopBreakpoint.addEventListener('change', closeMobileSheetOnDesktop);
		return () =>
			desktopBreakpoint.removeEventListener('change', closeMobileSheetOnDesktop);
	}, []);

	return (
		<div className='min-h-screen bg-slate-100 font-sans text-slate-800 antialiased'>
			<a
				href='#workspace-main'
				className='fixed left-4 top-3 z-60 -translate-y-16 rounded-md bg-blue-700 px-3 py-2 text-sm font-700 text-white no-underline transition focus:translate-y-0 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'>
				Skip to main content
			</a>
			<div className='grid min-h-screen lg:grid-cols-[248px_minmax(0,1fr)]'>
				<aside className='sticky top-0 hidden h-screen border-r border-slate-200 bg-white p-4 lg:block'>
					<WorkspaceNavigation />
				</aside>
				<div className='min-w-0'>
					<header className='sticky top-0 z-30 flex h-15 items-center justify-between border-b border-slate-200 bg-white/92 px-4 backdrop-blur lg:px-8'>
						<div className='flex min-w-0 items-center gap-3'>
							<Dialog.Root
								open={mobileOpen}
								onOpenChange={setMobileOpen}>
								<Dialog.Trigger asChild>
									<button
										className='grid size-9 place-items-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 lg:hidden'
										type='button'
										aria-label='Open workspace navigation'>
										<Menu
											size={19}
											aria-hidden='true'
										/>
									</button>
								</Dialog.Trigger>
								<Dialog.Portal>
									<Dialog.Overlay className='fixed inset-0 z-50 bg-slate-950/40 data-[state=closed]:animate-workspace-overlay-out data-[state=open]:animate-workspace-overlay-in motion-reduce:animate-none lg:hidden' />
									<Dialog.Content
										aria-describedby={undefined}
										className='fixed inset-y-0 left-0 z-60 w-[min(84vw,320px)] overflow-y-auto bg-white p-4 shadow-2xl shadow-slate-950/20 data-[state=closed]:animate-workspace-sheet-out data-[state=open]:animate-workspace-sheet-in motion-reduce:animate-none lg:hidden'>
										<Dialog.Title className='sr-only'>
											Workspace navigation
										</Dialog.Title>
										<div className='mb-2 flex justify-end'>
											<Dialog.Close asChild>
												<button
													className='grid size-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
													type='button'
													aria-label='Close workspace navigation'>
													<X
														size={19}
														aria-hidden='true'
													/>
												</button>
											</Dialog.Close>
										</div>
										<WorkspaceNavigation
											onNavigate={() => setMobileOpen(false)}
										/>
									</Dialog.Content>
								</Dialog.Portal>
							</Dialog.Root>
							<div className='min-w-0'>
								<p className='m-0 truncate font-heading text-[.95rem] font-800 tracking-[-.02em] text-slate-950'>
									Operational HR knowledge
								</p>
								<p className='m-0 truncate text-[.72rem] text-slate-400 max-sm:hidden'>
									Explore canonical skills. Keep decisions human-owned.
								</p>
							</div>
						</div>
						<button
							className='hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.75 text-[.78rem] text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 sm:flex'
							type='button'
							onClick={() => {
								void navigate({ to: '/' }).then(() => {
									window.setTimeout(
										() =>
											window.dispatchEvent(
												new Event('hr-skills:focus-search'),
											),
										0,
									);
								});
							}}>
							<Command
								size={14}
								aria-hidden='true'
							/>
							<span>Search skills</span>
							<kbd className='rounded border border-slate-200 bg-white px-1.25 py-.25 font-mono text-[.62rem] text-slate-400'>
								/
							</kbd>
						</button>
					</header>
					<main
						id='workspace-main'
						className='min-h-[calc(100vh-3.75rem)]'>
						<Outlet />
					</main>
				</div>
			</div>
		</div>
	);
}
