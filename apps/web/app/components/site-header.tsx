'use client';

import {
	Dialog,
	DialogBackdrop,
	DialogPanel,
	DialogTitle,
	Transition,
	TransitionChild,
} from '@headlessui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment, useState } from 'react';

const navigation = [
	{ href: '/', label: 'Home' },
	{ href: '/skills', label: 'Catalog' },
	{ href: '/planner', label: 'Planner' },
];

const exploreNavigation = [
	{ href: '/graph', label: 'Skill graph' },
	{ href: '/runtime', label: 'Runtime trace' },
	{ href: '/evaluation', label: 'Evaluation' },
	{ href: '/changelog', label: 'Changelog' },
];

function isActive(pathname: string, href: string) {
	return href === '/' ? pathname === href : pathname.startsWith(href);
}

function NavLink({
	href,
	label,
	onClick,
}: {
	href: string;
	label: string;
	onClick?: () => void;
}) {
	const pathname = usePathname();
	const active = isActive(pathname, href);
	return (
		<Link
			aria-current={active ? 'page' : undefined}
			className={`rounded-full px-3 py-2 text-sm font-semibold transition-colors ${
				active
					? 'bg-brand-soft text-brand-strong'
					: 'text-muted hover:bg-brand-soft hover:text-brand-strong'
			}`}
			href={href}
			onClick={onClick}>
			{label}
		</Link>
	);
}

export function SiteHeader() {
	const [mobileOpen, setMobileOpen] = useState(false);
	return (
		<header className='sticky top-0 z-40 border-b border-line/80 bg-canvas/95 backdrop-blur-xl'>
			<div className='mx-auto flex min-h-18 w-[min(1180px,calc(100%-2rem))] items-center justify-between gap-4'>
				<Link
					className='group inline-flex items-center gap-3'
					href='/'
					onClick={() => setMobileOpen(false)}>
					<span
						aria-hidden='true'
						className='grid size-10 place-items-center rounded-2xl bg-brand text-xs font-black tracking-[0.08em] text-white shadow-sm'>
						HR
					</span>
					<span className='grid gap-0.5'>
						<strong className='text-[0.98rem] font-black tracking-[-0.02em]'>
							HR Skills
						</strong>
						<span className='text-[0.68rem] font-medium text-muted'>
							Practical HR knowledge
						</span>
					</span>
				</Link>

				<nav
					aria-label='Primary navigation'
					className='hidden items-center gap-1 lg:flex'>
					{navigation.map((item) => (
						<NavLink
							key={item.href}
							{...item}
						/>
					))}
					<details className='group relative'>
						<summary className='cursor-pointer list-none rounded-full px-3 py-2 text-sm font-semibold text-muted marker:hidden hover:bg-brand-soft hover:text-brand-strong'>
							Explore{' '}
							<span
								aria-hidden='true'
								className='ml-1 text-xs'>
								⌄
							</span>
						</summary>
						<div className='absolute right-0 top-[calc(100%+0.6rem)] grid min-w-52 gap-1 rounded-2xl border border-line bg-surface p-2 shadow-soft'>
							{exploreNavigation.map((item) => (
								<NavLink
									key={item.href}
									{...item}
								/>
							))}
						</div>
					</details>
					<a
						className='rounded-full px-3 py-2 text-sm font-semibold text-muted hover:bg-brand-soft hover:text-brand-strong'
						href='https://github.com/tuanductran/hr-skills'
						rel='noreferrer'
						target='_blank'>
						GitHub <span aria-hidden='true'>↗</span>
					</a>
					<Link
						className='rounded-full bg-brand px-4 py-2 text-sm font-black text-white shadow-sm hover:bg-brand-strong'
						href='/planner'>
						Build a plan
					</Link>
				</nav>

				<button
					aria-expanded={mobileOpen}
					aria-label={
						mobileOpen ? 'Close navigation menu' : 'Open navigation menu'
					}
					className='inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-surface text-ink hover:border-brand hover:bg-brand-soft lg:hidden'
					onClick={() => setMobileOpen(true)}
					type='button'>
					<span>{mobileOpen ? 'Close' : 'Explore'}</span>
					<span
						aria-hidden='true'
						className='text-xl leading-none'>
						{mobileOpen ? '×' : '☰'}
					</span>
				</button>
			</div>

			<Transition
				as={Fragment}
				show={mobileOpen}>
				<Dialog
					className='relative z-50 lg:hidden'
					onClose={setMobileOpen}>
					<TransitionChild
						as={Fragment}
						enter='transition-opacity duration-150 ease-out'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='transition-opacity duration-100 ease-in'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'>
						<DialogBackdrop className='fixed inset-0 bg-ink/40' />
					</TransitionChild>
					<div className='fixed inset-0 flex items-start justify-end p-3 pt-20'>
						<TransitionChild
							as={Fragment}
							enter='transition duration-150 ease-out'
							enterFrom='translate-x-4 opacity-0'
							enterTo='translate-x-0 opacity-100'
							leave='transition duration-100 ease-in'
							leaveFrom='translate-x-0 opacity-100'
							leaveTo='translate-x-4 opacity-0'>
							<DialogPanel className='max-h-[calc(100dvh-5.5rem)] w-full max-w-sm overflow-y-auto rounded-3xl border border-line bg-surface p-4 shadow-soft'>
								<div className='flex items-center justify-between gap-4 border-b border-line pb-4'>
									<DialogTitle className='text-lg font-black'>
										Navigate HR Skills
									</DialogTitle>
									<button
										aria-label='Close navigation menu'
										className='grid size-10 place-items-center rounded-full border border-line text-xl hover:bg-brand-soft'
										onClick={() => setMobileOpen(false)}
										type='button'>
										×
									</button>
								</div>
								<nav
									aria-label='Mobile primary navigation'
									className='grid gap-1 py-4'>
									{navigation.map((item) => (
										<NavLink
											key={item.href}
											{...item}
											onClick={() => setMobileOpen(false)}
										/>
									))}
									<p className='px-3 pb-1 pt-4 text-xs font-black uppercase tracking-[0.14em] text-subtle'>
										Explore
									</p>
									{exploreNavigation.map((item) => (
										<NavLink
											key={item.href}
											{...item}
											onClick={() => setMobileOpen(false)}
										/>
									))}
									<a
										className='rounded-full px-3 py-2 text-sm font-semibold text-muted hover:bg-brand-soft hover:text-brand-strong'
										href='https://github.com/tuanductran/hr-skills'
										rel='noreferrer'
										target='_blank'>
										GitHub ↗
									</a>
									<Link
										className='mt-2 rounded-full bg-brand px-4 py-3 text-center text-sm font-black text-white hover:bg-brand-strong'
										href='/planner'
										onClick={() => setMobileOpen(false)}>
										Build a plan
									</Link>
								</nav>
							</DialogPanel>
						</TransitionChild>
					</div>
				</Dialog>
			</Transition>
		</header>
	);
}
