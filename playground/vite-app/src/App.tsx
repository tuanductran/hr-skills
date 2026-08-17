import {
	createRuntimeContext,
	parseSkillFrontmatter,
	searchSkills,
} from 'hr-skills-build/client';

const sample = `---\nname: candidate-experience\ndescription: Improve candidate experience\ntags: [candidate, experience]\n---\n\n# Candidate experience`;
const registry = [
	{
		id: 'candidate-experience',
		name: 'Candidate experience',
		description: 'Improve candidate experience',
		tags: ['candidate', 'experience'],
	},
];

export function App() {
	const parsed = parseSkillFrontmatter(sample);
	const results = searchSkills({ text: 'candidate', limit: 5 }, registry as never);
	const runtime = createRuntimeContext({
		cwd: '/playground',
		env: { mode: 'browser' },
	});
	return (
		<main className='min-h-dvh bg-canvas text-ink'>
			<div className='mx-auto grid w-[min(1120px,calc(100%-2rem))] gap-10 py-12 sm:py-20'>
				<header className='max-w-3xl'>
					<p className='mb-3 text-xs font-black uppercase tracking-[0.17em] text-brand'>
						Playground · Vite
					</p>
					<h1 className='text-balance text-5xl font-medium tracking-[-0.07em] sm:text-7xl'>
						Browser-safe package experiments.
					</h1>
					<p className='mt-5 text-pretty text-lg leading-8 text-muted'>
						A TailwindCSS surface for validating parser, search and runtime
						context APIs from the client entrypoint.
					</p>
				</header>
				<section
					aria-label='API outputs'
					className='grid gap-4 md:grid-cols-3'>
					<article className='rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6'>
						<p className='text-xs font-black uppercase tracking-[0.14em] text-brand'>
							Frontmatter
						</p>
						<h2 className='mt-3 text-xl font-semibold'>Parsed skill</h2>
						<pre className='mt-4 max-w-full overflow-x-auto rounded-2xl bg-ink p-4 font-mono text-xs leading-6 text-white'>
							{JSON.stringify(parsed, null, 2)}
						</pre>
					</article>
					<article className='rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6'>
						<p className='text-xs font-black uppercase tracking-[0.14em] text-brand'>
							Search
						</p>
						<h2 className='mt-3 text-xl font-semibold'>
							{results.results.length} matching result
							{results.results.length === 1 ? '' : 's'}
						</h2>
						<ul className='mt-4 grid gap-2'>
							{results.results.map((result) => (
								<li
									className='rounded-xl bg-brand-soft px-3 py-2 text-sm font-semibold text-brand-strong'
									key={result.skillId}>
									{result.skillId}
								</li>
							))}
						</ul>
					</article>
					<article className='rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-6'>
						<p className='text-xs font-black uppercase tracking-[0.14em] text-brand'>
							Runtime
						</p>
						<h2 className='mt-3 text-xl font-semibold'>Client context</h2>
						<pre className='mt-4 max-w-full overflow-x-auto rounded-2xl bg-ink p-4 font-mono text-xs leading-6 text-white'>
							{JSON.stringify(runtime, null, 2)}
						</pre>
					</article>
				</section>
			</div>
		</main>
	);
}
