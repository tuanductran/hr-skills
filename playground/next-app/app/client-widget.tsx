'use client';

import { parseSkillFrontmatter } from 'hr-skills-build/client';

const sample = `---\nname: candidate-experience\ndescription: Improve candidate experience\n---\n\n# Candidate experience`;

export function ClientWidget() {
	const parsed = parseSkillFrontmatter(sample);
	return (
		<section
			aria-labelledby='client-output-heading'
			className='grid gap-4 rounded-3xl border border-line bg-surface p-5 shadow-[0_18px_50px_rgb(21_35_59_/_0.08)] sm:p-8'>
			<div>
				<p className='mb-2 text-xs font-black uppercase tracking-[0.17em] text-brand'>
					Live client output
				</p>
				<h2
					className='text-2xl font-semibold tracking-tight'
					id='client-output-heading'>
					Parsed browser-safe data
				</h2>
			</div>
			<pre className='m-0 max-w-full overflow-x-auto rounded-2xl bg-ink p-5 font-mono text-xs leading-6 text-white'>
				{JSON.stringify(parsed, null, 2)}
			</pre>
		</section>
	);
}
