'use client';

import type { Registry, SkillSearchResult } from 'hr-skills-build/client';
import { searchSkills } from 'hr-skills-build/client';
import { ArrowUpRight, Search } from 'lucide-react';
import { useState } from 'react';

interface SkillSearchProps {
	registry: Registry;
}

function getSearchResults(query: string, registry: Registry): SkillSearchResult[] {
	try {
		const packageResults = searchSkills({ text: query, limit: 4 }, registry).results;
		if (packageResults.length > 0) return packageResults;
	} catch {
		// Keep the public landing page usable if an older browser cannot execute
		// one of the optional fuzzy-search branches.
	}

	const normalizedQuery = query.toLowerCase().trim();
	return registry.skills
		.filter((skill) =>
			[skill.id, skill.name, skill.description, ...skill.capabilities]
				.join(' ')
				.toLowerCase()
				.includes(normalizedQuery),
		)
		.slice(0, 4)
		.map((skill) => ({
			skillId: skill.id,
			name: skill.name,
			description: skill.description,
			domain: skill.domain,
			score: 0,
			matches: [],
			explanation: 'Matched by the browser compatibility fallback.',
		}));
}

export default function SkillSearch({ registry }: SkillSearchProps) {
	const [query, setQuery] = useState('');
	const [submittedQuery, setSubmittedQuery] = useState('');

	const activeQuery = submittedQuery || query;
	const results = activeQuery ? getSearchResults(activeQuery, registry) : [];

	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setSubmittedQuery(query.trim());
	}

	return (
		<div className='mb-10 rounded-[1.75rem] border border-[var(--line)] bg-[var(--white)] p-5 shadow-[0_18px_45px_rgb(19_34_56_/_0.06)] sm:p-7'>
			<div className='flex flex-wrap items-end justify-between gap-4'>
				<div>
					<p className='eyebrow'>Search the registry</p>
					<h3 className='display-font mt-3 text-3xl leading-none sm:text-4xl'>
						Start with a question.
					</h3>
				</div>
				<p className='max-w-xs text-sm leading-6 text-slate-500'>
					Searches capabilities, aliases, descriptions and trigger phrases using
					the canonical browser-safe search engine.
				</p>
			</div>
			<search>
				<form
					className='mt-6 flex flex-col gap-3 sm:flex-row'
					onSubmit={submit}>
					<label
						className='sr-only'
						htmlFor='skill-search'>
						Search HR skills
					</label>
					<input
						id='skill-search'
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						onInput={(event) => setQuery(event.currentTarget.value)}
						placeholder='Try “job description” or “people analytics”'
						className='min-h-12 min-w-0 flex-1 rounded-full border border-[var(--line)] bg-[var(--paper)] px-5 text-base text-[var(--ink)] outline-none transition placeholder:text-slate-400 focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100'
					/>
					<button
						type='submit'
						onClick={() => setSubmittedQuery(query.trim())}
						className='min-h-12 rounded-full bg-[var(--blue)] px-6 text-sm font-bold text-white transition hover:bg-[var(--blue-deep)] active:scale-[0.97]'>
						<Search
							aria-hidden='true'
							size={17}
							strokeWidth={2.5}
						/>
						<span>Search registry</span>
					</button>
				</form>
			</search>
			{activeQuery && (
				<div
					className='mt-6'
					aria-live='polite'>
					{results.length > 0 ? (
						<ul className='grid gap-3 sm:grid-cols-2'>
							{results.map((result) => (
								<li key={result.skillId}>
									<a
										href={`https://github.com/tuanductran/hr-skills/tree/dev/skills/${result.skillId}`}
										target='_blank'
										rel='noreferrer'
										className='group block rounded-2xl border border-[var(--line)] p-4 transition hover:border-[var(--blue)] hover:bg-blue-50'>
										<span className='text-xs font-black uppercase tracking-[0.12em] text-[var(--blue)]'>
											{result.domain}
										</span>
										<strong className='mt-2 block text-base text-[var(--ink)]'>
											{result.name}
										</strong>
										<span className='mt-1 block text-sm leading-6 text-slate-500'>
											{result.description}
										</span>
										<span className='mt-3 block text-sm font-bold text-[var(--blue)] group-hover:translate-x-1'>
											Open skill{' '}
											<ArrowUpRight
												aria-hidden='true'
												size={16}
												strokeWidth={2.5}
											/>
										</span>
									</a>
								</li>
							))}
						</ul>
					) : (
						<p className='rounded-2xl bg-[var(--paper)] p-4 text-sm text-slate-600'>
							No matching skill yet. Try a broader question or browse one of
							the practice areas below.
						</p>
					)}
				</div>
			)}
		</div>
	);
}
