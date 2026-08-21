import Link from 'next/link';
import MobileNav from './components/mobile-nav';

const signals = [
	['200+', 'HR skills'],
	['12', 'practice areas'],
	['1', 'canonical registry'],
];

const tracks = [
	{
		number: '01',
		title: 'Find the signal',
		text: 'Start with the question, task, or decision in front of you. Search by capability instead of guessing which document to open.',
		tone: 'blue',
	},
	{
		number: '02',
		title: 'Shape the next step',
		text: 'Turn complex people work into an explainable sequence of skills, with context you can inspect and reuse.',
		tone: 'cream',
	},
	{
		number: '03',
		title: 'Make it usable',
		text: 'Take a clear, practical artifact back to your team: a plan, a hiring brief, a policy conversation, or a better question.',
		tone: 'coral',
	},
];

const domains = [
	{ label: 'Talent acquisition', slug: 'hr-talent-acquisition' },
	{ label: 'People operations', slug: 'hr-people-operations' },
	{ label: 'HR analytics', slug: 'hr-analytics' },
	{ label: 'Learning & development', slug: 'hr-learning-development' },
	{ label: 'Compensation & benefits', slug: 'hr-compensation-benefits' },
	{ label: 'HR technology', slug: 'hr-hris' },
];

export default function HomePage() {
	return (
		<>
			<a
				className='skip-link'
				href='#main-content'>
				Skip to content
			</a>
			<main
				id='main-content'
				className='landing-shell'>
				<header className='landing-container relative flex items-center justify-between py-6 sm:py-8'>
					<Link
						href='/'
						className='flex items-center gap-3 font-bold tracking-tight text-[var(--ink)]'>
						<span className='grid size-10 place-items-center rounded-[14px] bg-[var(--ink)] text-xs font-black tracking-[0.08em] text-white'>
							HR
						</span>
						<span>HR Skills</span>
					</Link>
					<nav
						className='hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex'
						aria-label='Main navigation'>
						<Link
							href='#library'
							className='transition-colors hover:text-[var(--blue)]'>
							Library
						</Link>
						<Link
							href='#method'
							className='transition-colors hover:text-[var(--blue)]'>
							How it works
						</Link>
						<Link
							href='#products'
							className='transition-colors hover:text-[var(--blue)]'>
							Product tracks
						</Link>
					</nav>
					<a
						href='https://github.com/tuanductran/hr-skills'
						target='_blank'
						rel='noreferrer'
						className='hidden rounded-full border border-[var(--ink)] px-4 py-2 text-sm font-bold transition hover:bg-[var(--ink)] hover:text-white md:inline-flex'>
						View on GitHub <span aria-hidden='true'>&nbsp;↗</span>
					</a>
					<MobileNav />
				</header>

				<section className='landing-container grid gap-12 pb-20 pt-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-end lg:pb-32 lg:pt-24'>
					<div>
						<p className='eyebrow'>A field guide for people work</p>
						<h1 className='display-font mt-5 max-w-4xl text-[clamp(3.5rem,8vw,7.7rem)] leading-[0.87] text-[var(--ink)]'>
							Make the next people decision clearer.
						</h1>
						<p className='mt-8 max-w-xl text-lg leading-8 text-slate-600 sm:text-xl'>
							HR Skills is a practical knowledge system for the questions
							behind better teams — searchable, composable, and grounded in
							a canonical library.
						</p>
						<div className='mt-9 flex flex-wrap items-center gap-3'>
							<Link
								href='#library'
								className='inline-flex min-h-12 items-center gap-3 rounded-full bg-[var(--blue)] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgb(37_99_235_/_0.2)] transition duration-200 hover:-translate-y-1 hover:bg-[var(--blue-deep)] active:scale-[0.97]'>
								Explore the library <span aria-hidden='true'>↗</span>
							</Link>
							<Link
								href='#method'
								className='inline-flex min-h-12 items-center rounded-full border border-[var(--line)] bg-[var(--white)] px-6 py-3 text-sm font-bold text-[var(--ink)] transition hover:border-[var(--blue)] hover:text-[var(--blue)]'>
								See the method
							</Link>
						</div>
					</div>
					<div className='relative min-h-[380px] rounded-[2.5rem] bg-[var(--blue)] p-5 text-white shadow-[0_26px_70px_rgb(37_99_235_/_0.2)] sm:min-h-[470px] sm:p-8'>
						<div className='absolute right-8 top-8 grid size-16 place-items-center rounded-full border border-white/30 text-2xl'>
							✦
						</div>
						<div className='absolute -bottom-5 -left-5 hidden size-28 rounded-full bg-[var(--coral)] sm:block' />
						<div className='relative flex h-full flex-col justify-between'>
							<p className='max-w-xs text-sm font-bold uppercase tracking-[0.14em] text-blue-100'>
								The useful middle ground
							</p>
							<div>
								<p className='display-font max-w-md text-4xl leading-[0.95] sm:text-6xl'>
									Not a giant handbook. Not a black box.
								</p>
								<p className='mt-6 max-w-sm text-sm leading-6 text-blue-100'>
									A durable layer between the question your team asks
									and the next action you can explain.
								</p>
							</div>
							<div className='flex items-center gap-3 border-t border-white/20 pt-5 text-sm font-semibold text-blue-100'>
								<span className='size-2 rounded-full bg-emerald-300' />
								Repository-backed by design
							</div>
						</div>
					</div>
				</section>

				<div className='border-y border-[var(--line)] bg-[var(--white)]'>
					<div className='landing-container grid grid-cols-1 divide-y divide-[var(--line)] py-1 sm:grid-cols-3 sm:divide-x sm:divide-y-0'>
						{signals.map(([value, label]) => (
							<div
								key={label}
								className='flex items-baseline gap-3 px-0 py-5 sm:px-7'>
								<strong className='display-font text-4xl text-[var(--ink)]'>
									{value}
								</strong>
								<span className='text-sm font-semibold text-slate-500'>
									{label}
								</span>
							</div>
						))}
					</div>
				</div>

				<section
					id='library'
					className='landing-container scroll-mt-8 py-24 sm:py-32'>
					<div className='grid gap-10 lg:grid-cols-[0.7fr_1.3fr]'>
						<div>
							<p className='eyebrow'>The library</p>
							<h2 className='display-font mt-4 max-w-sm text-5xl leading-[0.95] sm:text-6xl'>
								Built for the work between the lines.
							</h2>
						</div>
						<div>
							<p className='max-w-2xl text-xl leading-8 text-slate-600'>
								People work rarely arrives as a neat category. It arrives
								as a messy question with a deadline. HR Skills makes the
								useful parts easier to find, connect, and carry into a
								real conversation.
							</p>
							<div className='mt-10 grid gap-3 sm:grid-cols-2'>
								{domains.map((domain, index) => (
									<Link
										key={domain.slug}
										href={`https://github.com/tuanductran/hr-skills/tree/dev/skills/${domain.slug}`}
										target='_blank'
										rel='noreferrer'
										className='group flex items-center justify-between border-b border-[var(--line)] py-4 text-lg font-semibold transition hover:border-[var(--blue)] hover:text-[var(--blue)]'>
										<span>
											<span className='mr-3 text-xs font-black text-slate-400'>
												0{index + 1}
											</span>
											{domain.label}
										</span>
										<span className='text-xl transition-transform group-hover:translate-x-1'>
											↗
										</span>
									</Link>
								))}
							</div>
						</div>
					</div>
				</section>

				<section
					id='method'
					className='scroll-mt-8 bg-[var(--ink)] py-24 text-white sm:py-32'>
					<div className='landing-container'>
						<div className='flex flex-wrap items-end justify-between gap-8'>
							<div>
								<p className='eyebrow text-blue-300'>A simple method</p>
								<h2 className='display-font mt-4 max-w-xl text-5xl leading-[0.95] text-white sm:text-6xl'>
									From a vague question to a useful shape.
								</h2>
							</div>
							<p className='max-w-xs text-sm leading-6 text-slate-300'>
								The system stays deterministic where it matters and gives
								people room to make the judgment.
							</p>
						</div>
						<div className='mt-14 grid gap-4 lg:grid-cols-3'>
							{tracks.map((track) => (
								<article
									key={track.number}
									className={`min-h-[330px] rounded-[2rem] p-7 ${track.tone === 'blue' ? 'bg-[var(--blue)]' : track.tone === 'coral' ? 'bg-[var(--coral)]' : 'bg-[#f1ede2] text-[var(--ink)]'}`}>
									<span
										className={`text-sm font-black ${track.tone === 'cream' ? 'text-slate-500' : 'text-white/70'}`}>
										{track.number}
									</span>
									<div className='mt-28'>
										<h3 className='display-font text-4xl leading-none'>
											{track.title}
										</h3>
										<p
											className={`mt-5 text-sm leading-6 ${track.tone === 'cream' ? 'text-slate-600' : 'text-white/75'}`}>
											{track.text}
										</p>
									</div>
								</article>
							))}
						</div>
					</div>
				</section>

				<section
					id='products'
					className='landing-container scroll-mt-8 py-24 sm:py-32'>
					<div className='grid gap-8 lg:grid-cols-[1fr_1.2fr]'>
						<div className='rounded-[2rem] bg-[#dce9ff] p-8 sm:p-12'>
							<p className='eyebrow'>Coming into focus</p>
							<h2 className='display-font mt-5 max-w-md text-5xl leading-[0.94]'>
								One ecosystem. Several useful surfaces.
							</h2>
							<p className='mt-6 max-w-sm leading-7 text-slate-600'>
								The library is the foundation. Product tracks turn it into
								workflows for the moments HR teams repeat.
							</p>
						</div>
						<div className='grid gap-4 sm:grid-cols-2'>
							<Link
								href='https://github.com/tuanductran/hr-skills/tree/dev/apps/jd'
								target='_blank'
								rel='noreferrer'
								className='group rounded-[2rem] border border-[var(--line)] bg-[var(--white)] p-8 transition hover:-translate-y-1 hover:border-[var(--blue)]'>
								<span className='text-xs font-black uppercase tracking-[0.14em] text-[var(--blue)]'>
									Now shaping
								</span>
								<h3 className='display-font mt-20 text-4xl leading-none'>
									JD Builder
								</h3>
								<p className='mt-4 text-sm leading-6 text-slate-500'>
									Structured, inclusive job descriptions from role
									context to export.
								</p>
								<span className='mt-8 inline-block font-bold text-[var(--blue)] transition-transform group-hover:translate-x-1'>
									Open the track ↗
								</span>
							</Link>
							<div className='rounded-[2rem] bg-[var(--coral)] p-8 text-white'>
								<span className='text-xs font-black uppercase tracking-[0.14em] text-white/70'>
									On the horizon
								</span>
								<h3 className='display-font mt-20 text-4xl leading-none'>
									CV Builder
								</h3>
								<p className='mt-4 text-sm leading-6 text-white/75'>
									Role- and locale-aware CV structures built on the same
									shared taxonomy.
								</p>
								<span className='mt-8 inline-block font-bold text-white/90'>
									Discovery track
								</span>
							</div>
						</div>
					</div>
				</section>

				<section className='landing-container pb-24 sm:pb-32'>
					<div className='relative overflow-hidden rounded-[2.5rem] bg-[#f0d36d] px-7 py-14 sm:px-14 sm:py-20'>
						<div className='absolute -right-10 -top-20 size-64 rounded-full border-[36px] border-[#f6f4ee]/40' />
						<p className='eyebrow'>Start somewhere real</p>
						<h2 className='display-font mt-5 max-w-2xl text-5xl leading-[0.92] sm:text-7xl'>
							The next clear step is usually closer than it looks.
						</h2>
						<p className='mt-6 max-w-xl text-lg leading-8 text-slate-700'>
							Browse the source, inspect the thinking, and bring a sharper
							question back to your team.
						</p>
						<Link
							href='https://github.com/tuanductran/hr-skills'
							target='_blank'
							rel='noreferrer'
							className='mt-8 inline-flex rounded-full bg-[var(--ink)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--blue-deep)]'>
							Explore the repository ↗
						</Link>
					</div>
				</section>

				<footer className='border-t border-[var(--line)] py-8'>
					<div className='landing-container flex flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between'>
						<p>HR Skills — practical infrastructure for people work.</p>
						<div className='flex gap-5 font-semibold'>
							<Link
								href='https://github.com/tuanductran/hr-skills'
								target='_blank'
								rel='noreferrer'
								className='hover:text-[var(--blue)]'>
								GitHub
							</Link>
							<Link
								href='https://github.com/tuanductran/hr-skills/issues'
								target='_blank'
								rel='noreferrer'
								className='hover:text-[var(--blue)]'>
								Issues
							</Link>
							<span>MIT licensed</span>
						</div>
					</div>
				</footer>
			</main>
		</>
	);
}
