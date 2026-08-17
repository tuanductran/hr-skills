'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import {
	analyzeIntent,
	generateExecutionPlan,
	type Registry,
} from 'hr-skills-build/client';
import { useMemo, useState } from 'react';

interface PlannerPlaygroundProps {
	readonly registry: Registry;
}
const examples = [
	'Create an onboarding plan for a growing team',
	'Design a structured interview process for technical hiring',
	'Build an HR AI governance and evaluation approach',
];

export function PlannerPlayground({ registry }: PlannerPlaygroundProps) {
	const [intent, setIntent] = useState('');
	const [plan, setPlan] = useState<ReturnType<typeof generateExecutionPlan> | null>(
		null,
	);
	const capabilities = useMemo(() => analyzeIntent(intent), [intent]);
	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (intent.trim()) setPlan(generateExecutionPlan(intent, registry));
	}
	return (
		<div className='mx-auto grid w-[min(960px,calc(100%-2rem))] gap-8 py-10 sm:py-16'>
			<header className='max-w-3xl'>
				<p className='mb-3 text-xs font-black uppercase tracking-[0.17em] text-brand'>
					Planner playground
				</p>
				<h1 className='text-balance text-[clamp(2.25rem,5vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.075em]'>
					Turn an HR question into an explainable plan.
				</h1>
				<p className='mt-4 max-w-2xl text-pretty text-lg leading-8 text-muted'>
					Describe the outcome you need. The deterministic planner will suggest
					a sequence of canonical skills and explain why each belongs.
				</p>
			</header>
			<fieldset className='grid gap-3 border-0 p-0'>
				<legend className='mb-1 text-sm font-black'>Start with an example</legend>
				<div className='flex flex-wrap gap-2'>
					{examples.map((example) => (
						<button
							className='rounded-full border border-line bg-surface px-3 py-2 text-left text-sm font-semibold text-muted transition hover:border-brand hover:bg-brand-soft hover:text-brand-strong'
							key={example}
							onClick={() => {
								setIntent(example);
								setPlan(null);
							}}
							type='button'>
							{example}
						</button>
					))}
				</div>
			</fieldset>
			<form
				className='grid gap-5 rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-8'
				onSubmit={submit}>
				<label
					className='grid gap-2 text-sm font-black'
					htmlFor='planner-intent'>
					<span>Describe your HR task</span>
					<textarea
						aria-describedby='planner-help'
						className='min-h-44 w-full resize-y rounded-2xl border border-line bg-canvas p-4 leading-7 outline-none transition focus:border-brand focus:bg-surface'
						id='planner-intent'
						onChange={(event) => setIntent(event.target.value)}
						placeholder='For example: improve our candidate experience for global hiring'
						value={intent}
					/>
					<small
						className='text-xs font-medium leading-5 text-muted'
						id='planner-help'>
						Be specific about the people outcome, process or decision you want
						to improve.
					</small>
				</label>
				<div className='flex flex-wrap items-center gap-4'>
					<button
						className='inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-black text-white shadow-sm hover:bg-brand-strong disabled:cursor-not-allowed disabled:opacity-50'
						disabled={!intent.trim()}
						type='submit'>
						Generate plan <span aria-hidden='true'>→</span>
					</button>
					{plan && (
						<button
							className='text-sm font-black text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-strong'
							onClick={() => setPlan(null)}
							type='button'>
							Clear result
						</button>
					)}
				</div>
			</form>
			<div
				aria-live='polite'
				className='grid gap-1 rounded-2xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm leading-6 text-muted'>
				<strong className='text-ink'>
					{capabilities.length ? 'Detected capabilities' : 'Add more detail'}
				</strong>
				<span>
					{capabilities.join(' · ') ||
						'The planner needs a little more context to make a useful suggestion.'}
				</span>
			</div>
			{plan && (
				<section
					aria-live='polite'
					className='grid gap-6 rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-8'>
					<div className='flex flex-col items-start justify-between gap-4 border-b border-line pb-5 sm:flex-row sm:items-start'>
						<div>
							<p className='mb-3 text-xs font-black uppercase tracking-[0.17em] text-brand'>
								Explainable result
							</p>
							<h2 className='text-balance text-2xl font-semibold tracking-tight'>
								{plan.summary}
							</h2>
						</div>
						<span className='rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] text-success'>
							{plan.complexity} plan
						</span>
					</div>
					<p className='m-0 leading-7 text-muted'>
						Suggested path across {plan.steps.length} canonical skill
						{plan.steps.length === 1 ? '' : 's'}.
					</p>
					<ol className='m-0 grid list-none gap-3 p-0'>
						{plan.steps.map((step) => (
							<li key={step.skillId}>
								<Disclosure
									as='div'
									className='overflow-hidden rounded-2xl border border-line bg-canvas'>
									<DisclosureButton className='planner-step__button grid w-full grid-cols-[auto_1fr_auto] items-center gap-3 border-0 bg-transparent p-4 text-left hover:bg-brand-soft'>
										<span className='font-mono text-xs font-bold text-muted'>
											{step.order + 1}
										</span>
										<span>
											<strong className='block text-sm'>
												{step.skillId}
											</strong>
											<span className='mt-1 block text-sm leading-6 text-muted'>
												{step.reason}
											</span>
										</span>
										<span
											aria-hidden='true'
											className='text-xl text-brand'>
											+
										</span>
									</DisclosureButton>
									<DisclosurePanel className='planner-step__panel border-t border-line bg-surface p-4 text-sm leading-6 text-muted'>
										<p className='m-0'>
											{step.rationale ??
												'Selected by the deterministic planner.'}
										</p>
										{step.dependencies.length > 0 && (
											<p className='m-0 mt-2'>
												Dependencies:{' '}
												{step.dependencies.join(', ')}
											</p>
										)}
									</DisclosurePanel>
								</Disclosure>
							</li>
						))}
					</ol>
				</section>
			)}
		</div>
	);
}
