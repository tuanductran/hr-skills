'use client';

import type { DocumentationData } from 'hr-skills-build';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface SkillCatalogProps {
	readonly data: DocumentationData;
}

function normalize(value: string): string {
	return value.toLocaleLowerCase();
}

function skillSearchText(skill: DocumentationData['skills'][number]): string {
	return normalize(
		[
			skill.displayName,
			skill.id,
			skill.description,
			skill.domain,
			...skill.aliases,
			...skill.capabilities,
			...skill.tags,
			...skill.triggerPhrases,
		].join(' '),
	);
}

/** Searchable, URL-addressable catalog over the generated documentation artifact. */
export function SkillCatalog({ data }: SkillCatalogProps) {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();
	const query = searchParams.get('q') ?? '';
	const domain = searchParams.get('domain') ?? '';
	const tier = searchParams.get('tier') ?? '';

	const skills = useMemo(() => {
		const normalizedQuery = normalize(query.trim());

		return data.skills
			.filter((skill) => !domain || skill.domain === domain)
			.filter((skill) => !tier || skill.tier === tier)
			.filter(
				(skill) =>
					!normalizedQuery || skillSearchText(skill).includes(normalizedQuery),
			)
			.toSorted((a, b) => a.displayName.localeCompare(b.displayName));
	}, [data.skills, domain, query, tier]);

	function replaceParam(name: 'q' | 'domain' | 'tier', value: string) {
		const params = new URLSearchParams(searchParams.toString());
		if (value) params.set(name, value);
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
				<div>
					<p className='eyebrow'>Discover</p>
					<h1 id='catalog-filters-title'>Skill catalog</h1>
					<p>
						Search the repository’s generated skill metadata and browse by
						domain or maturity.
					</p>
				</div>
				<div className='catalog-controls__fields'>
					<label
						className='field field--wide'
						htmlFor='skill-search'>
						<span>Search skills</span>
						<input
							id='skill-search'
							name='q'
							onChange={(event) => replaceParam('q', event.target.value)}
							placeholder='Try onboarding, ATS, compliance…'
							type='search'
							value={query}
						/>
					</label>
					<fieldset className='catalog-filters'>
						<legend>Filter the catalog</legend>
						<label
							className='field'
							htmlFor='domain-filter'>
							<span>Domain</span>
							<select
								id='domain-filter'
								onChange={(event) =>
									replaceParam('domain', event.target.value)
								}
								value={domain}>
								<option value=''>All domains</option>
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
							<span>Tier</span>
							<select
								id='tier-filter'
								onChange={(event) =>
									replaceParam('tier', event.target.value)
								}
								value={tier}>
								<option value=''>All tiers</option>
								<option value='full'>Full</option>
								<option value='partial'>Partial</option>
								<option value='bare'>Bare</option>
							</select>
						</label>
					</fieldset>
				</div>
			</section>

			<section
				aria-live='polite'
				className='catalog-results'>
				<div className='catalog-results__summary'>
					<p>
						<strong>{skills.length}</strong> of {data.skillCount} skills
					</p>
					{(query || domain || tier) && (
						<button
							className='text-button'
							onClick={resetFilters}
							type='button'>
							Clear filters
						</button>
					)}
				</div>
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
									<span className='skill-card__action'>Read skill</span>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<div className='empty-state'>
						<h2>No matching skills</h2>
						<p>
							Try a broader search term or remove one of the active filters.
						</p>
						<button
							className='button button--secondary'
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
