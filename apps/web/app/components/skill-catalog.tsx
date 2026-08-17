'use client';

import type { DocumentationData, Registry, SkillCategory } from 'hr-skills-build/client';
import { searchSkills } from 'hr-skills-build/client';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

interface SkillCatalogProps {
	readonly data: DocumentationData;
	readonly registry: Registry;
}

type SortMode = 'name' | 'domain' | 'tier';
const tierRank = { full: 0, partial: 1, bare: 2 } as const;

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
			.toSorted((a, b) =>
				sort === 'domain'
					? a.domain.localeCompare(b.domain) ||
						a.displayName.localeCompare(b.displayName)
					: sort === 'tier'
						? tierRank[a.tier] - tierRank[b.tier] ||
							a.displayName.localeCompare(b.displayName)
						: a.displayName.localeCompare(b.displayName),
			);
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
	const inputClass =
		'min-h-12 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm font-medium text-ink outline-none transition focus:border-brand focus:bg-surface';

	return (
		<main className='mx-auto grid w-[min(1180px,calc(100%-2rem))] gap-8 py-10 sm:py-16'>
			<section
				aria-labelledby='catalog-filters-title'
				className='grid gap-7 rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]'>
				<div>
					<p className='mb-3 text-xs font-black uppercase tracking-[0.17em] text-brand'>
						Discover
					</p>
					<h1
						className='text-balance text-[clamp(2rem,4.5vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.065em]'
						id='catalog-filters-title'>
						Find the right HR skill.
					</h1>
					<p className='mt-4 max-w-lg leading-7 text-muted'>
						Search by a people-work task, then narrow by practice area or
						maturity.
					</p>
					<p className='mt-5 border-l-4 border-brand/30 bg-brand-soft px-4 py-3 text-sm leading-6 text-muted'>
						<strong className='text-ink'>Try:</strong> onboarding, HRIS,
						candidate sourcing, AI governance
					</p>
				</div>
				<div className='grid content-start gap-5'>
					<label
						className='grid gap-2 text-sm font-black'
						htmlFor='skill-search'>
						<span>Search skills</span>
						<input
							aria-describedby='search-help'
							className={inputClass}
							id='skill-search'
							name='q'
							onChange={(event) => replaceParam('q', event.target.value)}
							placeholder='What are you trying to do?'
							type='search'
							value={query}
						/>
						<small
							className='text-xs font-medium leading-5 text-muted'
							id='search-help'>
							Searches names, descriptions, tags and capabilities.
						</small>
					</label>
					<fieldset className='grid grid-cols-1 gap-4 border-0 p-0 sm:grid-cols-3'>
						<legend className='col-span-full p-0 text-sm font-black'>
							Refine results
						</legend>
						<label
							className='grid gap-2 text-sm font-black'
							htmlFor='domain-filter'>
							<span>Practice area</span>
							<select
								className={inputClass}
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
							className='grid gap-2 text-sm font-black'
							htmlFor='tier-filter'>
							<span>Maturity</span>
							<select
								className={inputClass}
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
							className='grid gap-2 text-sm font-black'
							htmlFor='sort-filter'>
							<span>Sort by</span>
							<select
								className={inputClass}
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
				className='grid gap-5'>
				<div className='flex items-end justify-between gap-4 border-b border-line pb-4'>
					<div>
						<p className='mb-2 text-xs font-black uppercase tracking-[0.17em] text-brand'>
							Results
						</p>
						<p className='m-0 text-sm text-muted'>
							<strong className='text-ink'>{skills.length}</strong> of{' '}
							{data.skillCount} skills
							{domainLabel ? ` · ${domainLabel}` : ''}
							{query ? ` · “${query}”` : ''}
						</p>
					</div>
					{(query || domain || tier || sort !== 'name') && (
						<button
							className='text-sm font-black text-brand underline decoration-brand/40 underline-offset-4 hover:text-brand-strong'
							onClick={resetFilters}
							type='button'>
							Clear all
						</button>
					)}
				</div>
				{(query || domain || tier) && (
					<fieldset className='flex flex-wrap gap-2 border-0 p-0'>
						<legend className='sr-only'>Active filters</legend>
						{query && (
							<button
								className='rounded-full border border-brand/30 bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand-strong'
								onClick={() => replaceParam('q', '')}
								type='button'>
								Search: {query} ×
							</button>
						)}
						{domainLabel && (
							<button
								className='rounded-full border border-brand/30 bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand-strong'
								onClick={() => replaceParam('domain', '')}
								type='button'>
								Area: {domainLabel} ×
							</button>
						)}
						{tier && (
							<button
								className='rounded-full border border-brand/30 bg-brand-soft px-3 py-1.5 text-xs font-bold text-brand-strong'
								onClick={() => replaceParam('tier', '')}
								type='button'>
								Maturity: {tier} ×
							</button>
						)}
					</fieldset>
				)}
				{skills.length ? (
					<ul className='m-0 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3'>
						{skills.map((skill) => (
							<li key={skill.id}>
								<Link
									className='group flex min-h-72 flex-col rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand/40 hover:shadow-card'
									href={`/skills/${skill.id}`}>
									<div className='flex items-center justify-between gap-3'>
										<span className='max-w-[72%] truncate text-[0.67rem] font-black uppercase tracking-[0.11em] text-muted'>
											{skill.domain.replaceAll('-', ' ')}
										</span>
										<span
											className={`rounded-full px-2.5 py-1 text-[0.64rem] font-black uppercase tracking-[0.08em] ${skill.tier === 'full' ? 'bg-emerald-50 text-success' : skill.tier === 'partial' ? 'bg-amber-50 text-warning' : 'bg-red-50 text-danger'}`}>
											{skill.tier}
										</span>
									</div>
									<h2 className='mb-3 mt-6 text-[1.35rem] font-medium leading-tight tracking-[-0.035em]'>
										{skill.displayName}
									</h2>
									<p className='mb-6 line-clamp-4 flex-1 text-[0.94rem] leading-7 text-muted'>
										{skill.description}
									</p>
									<span className='flex items-center justify-between border-t border-line/80 pt-4 text-sm font-black text-brand'>
										Read guide{' '}
										<span
											aria-hidden='true'
											className='transition-transform group-hover:translate-x-1'>
											→
										</span>
									</span>
								</Link>
							</li>
						))}
					</ul>
				) : (
					<div className='rounded-3xl border border-dashed border-line bg-surface p-10 text-center text-muted shadow-sm'>
						<span
							aria-hidden='true'
							className='mb-3 block text-3xl text-brand'>
							⌕
						</span>
						<h2 className='mb-2 text-2xl font-medium text-ink'>
							No matching skills
						</h2>
						<p className='mx-auto max-w-md leading-7'>
							Try a broader task or remove one of the active filters.
						</p>
						<button
							className='mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-black text-white hover:bg-brand-strong'
							onClick={resetFilters}
							type='button'>
							Reset catalog
						</button>
					</div>
				)}
			</section>
		</main>
	);
}
