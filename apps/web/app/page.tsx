import Link from 'next/link';
import { getDocumentationData } from './lib/docs';

export default async function Page() {
	const data = await getDocumentationData();
	const featuredSkills = data.skills.slice(0, 6);

	return (
		<main>
			<section className='border-b border-line bg-surface py-16 sm:py-24 lg:py-28'>
				<div className='mx-auto grid w-[min(1180px,calc(100%-2rem))] items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(19rem,0.85fr)] lg:gap-20'>
					<div>
						<p className='mb-3 text-xs font-black uppercase tracking-[0.17em] text-brand'>
							A practical HR knowledge library
						</p>
						<h1 className='max-w-4xl text-balance text-[clamp(3rem,8vw,6.8rem)] font-medium leading-[0.91] tracking-[-0.085em] text-ink'>
							Move from HR question to confident next step.
						</h1>
						<p className='mt-6 max-w-2xl text-pretty text-[clamp(1.08rem,2vw,1.3rem)] leading-8 text-muted'>
							Use a canonical library of {data.skillCount} HR Skills to
							research, plan, govern, and improve people work.
						</p>
						<div className='mt-9 flex flex-wrap gap-3'>
							<Link
								className='inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-brand-strong hover:shadow-card'
								href='/skills'>
								Find a skill <span aria-hidden='true'>→</span>
							</Link>
							<Link
								className='inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-surface px-5 py-3 text-sm font-black text-ink transition hover:border-brand hover:bg-brand-soft hover:text-brand-strong'
								href='/planner'>
								Build a plan
							</Link>
						</div>
						<div className='mt-8 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted'>
							<span>
								<strong className='mr-1 text-base font-black text-ink'>
									{data.skillCount}
								</strong>{' '}
								skills
							</span>
							<span>
								<strong className='mr-1 text-base font-black text-ink'>
									{data.domains.length}
								</strong>{' '}
								practice areas
							</span>
							<span>
								<strong className='mr-1 text-base font-black text-ink'>
									100%
								</strong>{' '}
								repository-backed
							</span>
						</div>
					</div>
					<section
						aria-labelledby='hero-path-heading'
						className='grid gap-2 rounded-3xl border border-line bg-canvas p-3 shadow-card'>
						<p
							className='px-3 pb-2 pt-2 text-xs font-black uppercase tracking-[0.17em] text-brand'
							id='hero-path-heading'>
							Choose your starting point
						</p>
						<Link
							className='grid grid-cols-[1fr_auto] gap-x-4 rounded-2xl p-4 transition-colors hover:bg-surface'
							href='/skills'>
							<strong className='text-base font-black'>
								I need a practical guide
							</strong>
							<span className='col-start-1 text-sm leading-6 text-muted'>
								Browse skills by HR task, practice area or maturity.
							</span>
							<span
								aria-hidden='true'
								className='col-start-2 row-span-2 row-start-1 self-center text-xl text-brand'>
								→
							</span>
						</Link>
						<Link
							className='grid grid-cols-[1fr_auto] gap-x-4 rounded-2xl p-4 transition-colors hover:bg-surface'
							href='/planner'>
							<strong className='text-base font-black'>
								I have a complex HR task
							</strong>
							<span className='col-start-1 text-sm leading-6 text-muted'>
								Turn an intent into an explainable skill plan.
							</span>
							<span
								aria-hidden='true'
								className='col-start-2 row-span-2 row-start-1 self-center text-xl text-brand'>
								→
							</span>
						</Link>
					</section>
				</div>
			</section>

			<section
				aria-labelledby='domains-heading'
				className='mx-auto w-[min(1180px,calc(100%-2rem))] py-16 sm:py-24'>
				<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end'>
					<div>
						<p className='mb-3 text-xs font-black uppercase tracking-[0.17em] text-brand'>
							Browse by practice area
						</p>
						<h2
							className='text-balance text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.065em]'
							id='domains-heading'>
							Start with the part of HR you own.
						</h2>
					</div>
					<Link
						className='whitespace-nowrap text-sm font-black text-brand hover:text-brand-strong'
						href='/skills'>
						View full catalog <span aria-hidden='true'>→</span>
					</Link>
				</div>
				<ul className='m-0 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2 lg:grid-cols-4'>
					{data.domains.slice(0, 8).map((domain) => (
						<li key={domain.id}>
							<Link
								className='group relative grid min-h-36 content-between overflow-hidden rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-card'
								href={`/skills?domain=${domain.id}`}>
								<strong className='max-w-[13rem] text-base leading-6'>
									{domain.label}
								</strong>
								<span className='text-sm font-bold text-muted'>
									{domain.skillCount} skills
								</span>
								<span
									aria-hidden='true'
									className='absolute bottom-5 right-5 text-xl text-brand transition-transform group-hover:translate-x-1 group-hover:-translate-y-1'>
									→
								</span>
							</Link>
						</li>
					))}
				</ul>
			</section>

			<section
				aria-labelledby='featured-heading'
				className='border-y border-line bg-surface py-16 sm:py-24'>
				<div className='mx-auto w-[min(1180px,calc(100%-2rem))]'>
					<div className='mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end'>
						<div>
							<p className='mb-3 text-xs font-black uppercase tracking-[0.17em] text-brand'>
								Start here
							</p>
							<h2
								className='text-balance text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.065em]'
								id='featured-heading'>
								Guides people teams return to.
							</h2>
							<p className='mt-3 max-w-xl text-pretty leading-7 text-muted'>
								A small selection from the canonical registry, ready to
								explore.
							</p>
						</div>
						<Link
							className='whitespace-nowrap text-sm font-black text-brand hover:text-brand-strong'
							href='/skills'>
							Browse all {data.skillCount} skills{' '}
							<span aria-hidden='true'>→</span>
						</Link>
					</div>
					<ul className='m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3'>
						{featuredSkills.map((skill) => (
							<li key={skill.id}>
								<Link
									className='group flex min-h-72 flex-col rounded-2xl border border-line bg-canvas p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-card'
									href={`/skills/${skill.id}`}>
									<div className='flex items-center justify-between gap-3'>
										<span className='max-w-[72%] truncate text-[0.67rem] font-black uppercase tracking-[0.11em] text-muted'>
											{skill.domain.replaceAll('-', ' ')}
										</span>
										<span
											className={`rounded-full px-2.5 py-1 text-[0.64rem] font-black uppercase tracking-[0.08em] ${skill.tier === 'full' ? 'bg-emerald-50 text-success' : skill.tier === 'partial' ? 'bg-amber-50 text-warning' : 'bg-red-50 text-danger'}`}>
											{skill.tier}
										</span>
									</div>
									<h3 className='mb-3 mt-6 text-[1.35rem] font-medium leading-tight tracking-[-0.035em]'>
										{skill.displayName}
									</h3>
									<p className='mb-6 line-clamp-4 flex-1 text-[0.94rem] leading-7 text-muted'>
										{skill.description}
									</p>
									<span className='flex items-center justify-between border-t border-line/80 pt-4 text-sm font-black text-brand'>
										Read guide{' '}
										<span
											aria-hidden='true'
											className='transition-transform group-hover:translate-x-1'>
											→
										</span>
									</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</section>
		</main>
	);
}
