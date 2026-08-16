'use client';

import {
	type DocumentationData,
	type Registry,
	type SkillCategory,
	searchSkills,
} from 'hr-skills-build/client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface SkillCatalogProps {
	readonly data: DocumentationData;
	readonly registry: Registry;
}

type SortMode = 'name' | 'domain' | 'tier';

const tierRank = { full: 0, partial: 1, bare: 2 } as const;

/** Searchable catalog delegated to canonical package APIs and docs data. */
export function SkillCatalog({ data, registry }: SkillCatalogProps) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const query = searchParams.get('q') ?? '';
	const domain = searchParams.get('domain') ?? '';
	const tier = searchParams.get('tier') ?? '';
	const sort = (searchParams.get('sort') as SortMode | null) ?? 'name';
	const domainLabel = data.domains.find((item) => item.id === domain)?.label;

	const skills = useMemo(() => {
		const matches =
			query.trim() || domain
				? searchSkills(
						{
							text: query,
							fuzzy: false,
							domain: (domain || undefined) as SkillCategory | undefined,
							limit: data.skillCount,
						},
						registry,
					)
						.results.map((result) =>
							data.skills.find((skill) => skill.id === result.skillId),
						)
						.filter((skill): skill is DocumentationData['skills'][number] =>
							Boolean(skill),
						)
				: data.skills;

		return matches
			.filter((skill) => !tier || skill.tier === tier)
			.toSorted((a, b) => {
				if (sort === 'domain')
					return (
						a.domain.localeCompare(b.domain) ||
						a.displayName.localeCompare(b.displayName)
					);
				if (sort === 'tier')
					return (
						tierRank[a.tier] - tierRank[b.tier] ||
						a.displayName.localeCompare(b.displayName)
					);
				return a.displayName.localeCompare(b.displayName);
			});
	}, [data, domain, query, registry, sort, tier]);

	function replaceParam(name: 'q' | 'domain' | 'tier' | 'sort', value: string) {
		const params = new URLSearchParams(searchParams.toString());
		if (value && !(name === 'sort' && value === 'name')) params.set(name, value);
		else params.delete(name);
		const nextSearch = params.toString();
		router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname, {
			scroll: false,
		});
	}

	function resetFilters() {
		router.replace(pathname, { scroll: false });
	}

	return (
		<div className='catalog'>
			<section
				aria-labelledby='catalog-filters-title'
				className='catalog-controls'>
				<div className='catalog-controls__intro'>
					<p className='eyebrow'>Discover</p>
					<h1 id='catalog-filters-title'>Find the right HR skill.</h1>
					<p>
						Search by a people-work task, then narrow by practice area or
						maturity.
					</p>
					<div
						className='catalog-help'
						role='note'>
						<strong>Try:</strong> onboarding, HRIS, candidate sourcing, AI
						governance
					</div>
				</div>
				<div className='catalog-controls__fields'>
					<label
						className='field field--wide'
						htmlFor='skill-search'>
						<span>Search skills</span>
						<input
							aria-describedby='search-help'
							id='skill-search'
							name='q'
							onChange={(event) => replaceParam('q', event.target.value)}
							placeholder='What are you trying to do?'
							type='search'
							value={query}
						/>
						<small id='search-help'>
							Searches names, descriptions, tags and capabilities.
						</small>
					</label>
					<fieldset className='catalog-filters'>
						<legend>Refine results</legend>
						<label
							className='field'
							htmlFor='domain-filter'>
							<span>Practice area</span>
							<select
								id='domain-filter'
								onChange={(event) =>
									replaceParam('domain', event.target.value)
								}
								value={domain}>
								<option value=''>All practice areas</option>
								{data.domains.map((item) => (
									<option
										key={item.id}
										value={item.id}>
										{item.label} ({item.skillCount})
									</option>
								))}
							</select>
						</label>
						<label
							className='field'
							htmlFor='tier-filter'>
							<span>Maturity</span>
							<select
								id='tier-filter'
								onChange={(event) =>
									replaceParam('tier', event.target.value)
								}
								value={tier}>
								<option value=''>All maturity levels</option>
								<option value='full'>Full</option>
								<option value='partial'>Partial</option>
								<option value='bare'>Bare</option>
							</select>
						</label>
						<label
							className='field'
							htmlFor='sort-filter'>
							<span>Sort by</span>
							<select
								id='sort-filter'
								onChange={(event) =>
									replaceParam('sort', event.target.value)
								}
								value={sort}>
								<option value='name'>Name A–Z</option>
								<option value='domain'>Practice area</option>
								<option value='tier'>Maturity</option>
							</select>
						</label>
					</fieldset>
				</div>
			</section>

			<section
				aria-live='polite'
				className='catalog-results'>
				<div className='catalog-results__summary'>
					<div>
						<p className='eyebrow'>Results</p>
						<p>
							<strong>{skills.length}</strong> of {data.skillCount} skills
							{domainLabel ? ` · ${domainLabel}` : ''}
							{query ? ` · “${query}”` : ''}
						</p>
					</div>
					{(query || domain || tier || sort !== 'name') && (
						<button
							className='text-button'
							onClick={resetFilters}
							type='button'>
							Clear all
						</button>
					)}
				</div>
				{(query || domain || tier) && (
					<fieldset className='active-filters'>
						<legend className='visually-hidden'>Active filters</legend>
						{query && (
							<button
								onClick={() => replaceParam('q', '')}
								type='button'>
								Search: {query} ×
							</button>
						)}
						{domainLabel && (
							<button
								onClick={() => replaceParam('domain', '')}
								type='button'>
								Area: {domainLabel} ×
							</button>
						)}
						{tier && (
							<button
								onClick={() => replaceParam('tier', '')}
								type='button'>
								Maturity: {tier} ×
							</button>
						)}
					</fieldset>
				)}
				{skills.length ? (
					<ul className='skill-grid'>
						{skills.map((skill) => (
							<li key={skill.id}>
								<Link
									className='skill-card'
									href={`/skills/${skill.id}`}>
									<div className='skill-card__topline'>
										<span>{skill.domain.replaceAll('-', ' ')}</span>
										<span className={`tier tier--${skill.tier}`}>
											{skill.tier}
										</span>
									</div>
									<h2>{skill.displayName}</h2>
									<p>{skill.description}</p>
									<span className='skill-card__action'>
										Read guide <span aria-hidden='true'>→</span>
									</span>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<div className='empty-state'>
						<span
							className='empty-state__icon'
							aria-hidden='true'>
							⌕
						</span>
						<h2>No matching skills</h2>
						<p>Try a broader task or remove one of the active filters.</p>
						<button
							className='button'
							onClick={resetFilters}
							type='button'>
							Reset catalog
						</button>
					</div>
				)}
			</section>
		</div>
	);
}
