import Link from 'next/link';

export function SiteFooter() {
	return (
		<footer className='border-t border-line bg-surface'>
			<div className='mx-auto flex min-h-28 w-[min(1180px,calc(100%-2rem))] flex-col justify-between gap-5 py-7 sm:flex-row sm:items-center'>
				<div>
					<p className='m-0 text-sm font-bold text-ink'>HR Skills</p>
					<p className='m-0 mt-1 max-w-xl text-sm leading-6 text-muted'>
						Documentation generated from the HR Skills repository source.
					</p>
				</div>
				<nav
					aria-label='Footer navigation'
					className='flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold text-muted'>
					<Link
						className='hover:text-brand-strong'
						href='/skills'>
						Skill catalog
					</Link>
					<Link
						className='hover:text-brand-strong'
						href='/planner'>
						Planner
					</Link>
					<a
						className='hover:text-brand-strong'
						href='https://github.com/tuanductran/hr-skills'
						rel='noreferrer'
						target='_blank'>
						View source ↗
					</a>
				</nav>
			</div>
		</footer>
	);
}
