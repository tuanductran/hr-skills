'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import {
	analyzeIntent,
	generateExecutionPlan,
	type Registry,
} from 'hr-skills-build/client';
import { useState } from 'react';

interface PlannerPlaygroundProps {
	readonly registry: Registry;
}

export function PlannerPlayground({ registry }: PlannerPlaygroundProps) {
	const [intent, setIntent] = useState('Create an onboarding plan for a growing team');
	const [plan, setPlan] = useState<ReturnType<typeof generateExecutionPlan> | null>(
		null,
	);

	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPlan(generateExecutionPlan(intent, registry));
	}

	return (
		<div className='planner'>
			<header className='planner__intro'>
				<p className='eyebrow'>Planner playground</p>
				<h1>Turn HR intent into an explainable skill plan.</h1>
				<p>
					Run the deterministic planner locally in the browser with the
					canonical Registry.
				</p>
			</header>
			<form
				className='planner-form'
				onSubmit={submit}>
				<label
					className='field'
					htmlFor='planner-intent'>
					<span>Describe your HR task</span>
					<textarea
						id='planner-intent'
						onChange={(event) => setIntent(event.target.value)}
						value={intent}
					/>
				</label>
				<button
					className='button'
					type='submit'>
					Generate plan
				</button>
			</form>
			{plan && (
				<section
					aria-live='polite'
					className='planner-result'>
					<div className='planner-result__summary'>
						<div>
							<p className='eyebrow'>Result</p>
							<h2>{plan.summary}</h2>
						</div>
						<span className='tier tier--full'>{plan.complexity} plan</span>
					</div>
					<p>{plan.requestedCapabilities.join(' · ')}</p>
					<ol className='planner-steps'>
						{plan.steps.map((step) => (
							<li key={step.skillId}>
								<Disclosure>
									<DisclosureButton className='planner-step__button'>
										<span>
											{step.order + 1}. {step.skillId}
										</span>
										<span>{step.reason}</span>
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
			<p className='planner-hint'>
				Detected capabilities: {analyzeIntent(intent).join(' · ') || 'none yet'}
			</p>
		</div>
	);
}
