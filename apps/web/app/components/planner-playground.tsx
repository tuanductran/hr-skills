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
		<div className='planner'>
			<header className='planner__intro'>
				<p className='eyebrow'>Planner playground</p>
				<h1>Turn an HR question into an explainable plan.</h1>
				<p>
					Describe the outcome you need. The deterministic planner will suggest
					a sequence of canonical skills and explain why each belongs.
				</p>
			</header>
			<fieldset className='planner-examples'>
				<legend>Start with an example</legend>
				{examples.map((example) => (
					<button
						key={example}
						onClick={() => {
							setIntent(example);
							setPlan(null);
						}}
						type='button'>
						{example}
					</button>
				))}
			</fieldset>
			<form
				className='planner-form'
				onSubmit={submit}>
				<label
					className='field'
					htmlFor='planner-intent'>
					<span>Describe your HR task</span>
					<textarea
						aria-describedby='planner-help'
						id='planner-intent'
						onChange={(event) => setIntent(event.target.value)}
						placeholder='For example: improve our candidate experience for global hiring'
						value={intent}
					/>
					<small id='planner-help'>
						Be specific about the people outcome, process or decision you want
						to improve.
					</small>
				</label>
				<div className='planner-form__actions'>
					<button
						className='button'
						disabled={!intent.trim()}
						type='submit'>
						Generate plan <span aria-hidden='true'>→</span>
					</button>
					{plan && (
						<button
							className='text-button'
							onClick={() => setPlan(null)}
							type='button'>
							Clear result
						</button>
					)}
				</div>
			</form>
			<div
				className='planner-capabilities'
				aria-live='polite'>
				<strong>
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
					className='planner-result'>
					<div className='planner-result__summary'>
						<div>
							<p className='eyebrow'>Explainable result</p>
							<h2>{plan.summary}</h2>
						</div>
						<span className='tier tier--full'>{plan.complexity} plan</span>
					</div>
					<p>
						Suggested path across {plan.steps.length} canonical skill
						{plan.steps.length === 1 ? '' : 's'}.
					</p>
					<ol className='planner-steps'>
						{plan.steps.map((step) => (
							<li key={step.skillId}>
								<Disclosure>
									<DisclosureButton className='planner-step__button'>
										<span>
											{step.order + 1}. {step.skillId}
										</span>
										<span>{step.reason}</span>
										<span aria-hidden='true'>+</span>
									</DisclosureButton>
									<DisclosurePanel className='planner-step__panel'>
										<p>
											{step.rationale ??
												'Selected by the deterministic planner.'}
										</p>
										{step.dependencies.length > 0 && (
											<p>
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
