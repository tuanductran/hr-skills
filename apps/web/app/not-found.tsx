import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
	return (
		<main className='landing-shell min-h-screen px-5 py-8 sm:px-8 sm:py-12'>
			<div className='landing-container flex min-h-[80vh] flex-col justify-between'>
				<Link
					href='/'
					className='flex w-fit items-center gap-3 font-bold tracking-tight text-[var(--ink)]'>
					<span className='grid size-10 place-items-center rounded-[14px] bg-[var(--ink)] text-xs font-black tracking-[0.08em] text-white'>
						HR
					</span>
					HR Skills
				</Link>
				<section
					aria-labelledby='not-found-title'
					className='max-w-2xl py-20'>
					<p className='eyebrow'>Page not found</p>
					<p className='display-font mt-5 text-[clamp(6rem,18vw,12rem)] leading-[0.78] text-[var(--blue)]'>
						404
					</p>
					<h1
						id='not-found-title'
						className='display-font mt-10 max-w-xl text-5xl leading-[0.92] sm:text-7xl'>
						The useful path is somewhere else.
					</h1>
					<p className='mt-6 max-w-lg text-lg leading-8 text-slate-600'>
						The route you requested is not part of the current public landing
						page. Return home or browse the source repository to find the next
						clear step.
					</p>
					<div className='mt-8 flex flex-wrap gap-3'>
						<Link
							href='/'
							className='inline-flex min-h-12 items-center rounded-full bg-[var(--blue)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--blue-deep)] active:scale-[0.97]'>
							Go home
						</Link>
						<a
							href='https://github.com/tuanductran/hr-skills'
							target='_blank'
							rel='noreferrer'
							className='inline-flex min-h-12 items-center rounded-full border border-[var(--line)] bg-[var(--white)] px-6 py-3 text-sm font-bold text-[var(--ink)] transition hover:border-[var(--blue)] hover:text-[var(--blue)] active:scale-[0.97]'>
							Browse repository{' '}
							<ArrowUpRight
								aria-hidden='true'
								size={17}
								strokeWidth={2.5}
							/>
						</a>
					</div>
				</section>
				<p className='text-sm text-slate-500'>
					HR Skills — practical infrastructure for people work.
				</p>
			</div>
		</main>
	);
}
