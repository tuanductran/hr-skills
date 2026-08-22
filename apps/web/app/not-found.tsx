import Link from 'next/link';

export default function NotFound() {
	return (
		<main className='site-shell page-content'>
			<section
				aria-labelledby='not-found-title'
				className='mx-auto grid min-h-[60vh] max-w-2xl place-items-center rounded-3xl border border-line bg-surface p-8 text-center shadow-card sm:p-12'>
				<div>
					<p className='mb-3 text-xs font-black uppercase tracking-[0.17em] text-brand'>
						HR Skills
					</p>
					<h1
						className='text-[clamp(4rem,14vw,8rem)] font-medium leading-none tracking-[-0.09em] text-brand-strong'
						id='not-found-title'>
						404
					</h1>
					<h2 className='mt-4 text-2xl font-semibold tracking-tight text-ink sm:text-3xl'>
						This page could not be found.
					</h2>
					<p className='mx-auto mt-4 max-w-md text-pretty text-base leading-7 text-muted'>
						The skill or route you requested is not available. Return to the
						catalog to find a supported HR guide.
					</p>
					<div className='mt-7 flex flex-wrap justify-center gap-3'>
						<Link
							className='inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-black text-white transition hover:bg-brand-strong'
							href='/skills'>
							Browse skills
						</Link>
						<Link
							className='inline-flex min-h-12 items-center justify-center rounded-full border border-line bg-surface px-5 py-3 text-sm font-black text-ink transition hover:border-brand hover:bg-brand-soft hover:text-brand-strong'
							href='/'>
							Go home
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
