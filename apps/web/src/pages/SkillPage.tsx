import { Link, useParams } from '@tanstack/react-router';
import { getRecommendations } from 'hr-skills-build/client';
import {
	ArrowLeft,
	BookMarked,
	CircleAlert,
	ExternalLink,
	FileCode2,
	Pin,
	Sparkles,
} from 'lucide-react';
/* HR Skills Workspace: Slate/Blue skill surface; Claude action uses Radix focus-managed dialog with concise motion. */
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { ClaudeComposer } from '../components/ClaudeComposer';
import { MarkdownContent } from '../components/MarkdownContent';
import { ErrorState, LoadingState } from '../components/States';
import { SupportingFiles } from '../components/SupportingFiles';
import { useWorklist } from '../components/WorklistProvider';
import { getRawSkillUrl } from '../lib/claude';
import { humanize, useHrSkillDetail, useHrSkills } from '../lib/data';
import { toRegistry } from '../lib/types';

function headingOutline(content: string) {
	const seen = new Map<string, number>();
	return [...content.matchAll(/^(#{1,3})\s+(.+)$/gm)].map((match) => {
		const label = match[2].trim();
		const base = label
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '');
		const count = seen.get(base) ?? 0;
		seen.set(base, count + 1);
		return {
			id: count ? `${base}-${count + 1}` : base,
			label,
			depth: match[1].length,
		};
	});
}

export function SkillPage() {
	const { skillId } = useParams({ from: '/skills/$skillId' });
	const { data, isLoading, error, refetch, isFetching } = useHrSkills();
	const { isPinned, togglePinned, recordRecent } = useWorklist();
	const skillSummary = data?.skills.find((entry) => entry.id === skillId);
	const {
		data: skill,
		isLoading: isDetailLoading,
		error: detailError,
		refetch: refetchDetail,
		isFetching: isDetailFetching,
	} = useHrSkillDetail(skillId, Boolean(skillSummary));

	useEffect(() => {
		if (skillSummary) recordRecent(skillSummary.id);
	}, [recordRecent, skillSummary]);

	if (isLoading) return <LoadingState />;
	if (error || !data)
		return (
			<ErrorState
				message={
					error instanceof Error
						? error.message
						: 'Try refreshing the canonical registry snapshot.'
				}
				primaryAction={{
					label: isFetching ? 'Retrying…' : 'Retry registry',
					onClick: () => void refetch(),
				}}
			/>
		);
	if (!skillSummary)
		return (
			<section className='mx-auto max-w-[780px] px-4 py-16 sm:px-6 lg:px-8'>
				<div className='rounded-2xl border border-dashed border-slate-300 bg-white p-8 shadow-sm shadow-slate-200/50'>
					<p className='m-0 font-mono text-[.66rem] font-600 uppercase tracking-[.13em] text-blue-700'>
						404 · registry route
					</p>
					<h1 className='m-0 mt-3 font-heading text-[clamp(2rem,4vw,3rem)] font-800 tracking-[-.045em] text-slate-950'>
						That skill is not in the current registry.
					</h1>
					<p className='m-0 mt-3 max-w-[560px] text-[.95rem] leading-[1.55] text-slate-600'>
						The registry may have changed or the deep link may be incomplete.
						Return to the explorer to find a canonical skill ID.
					</p>
					<Link
						className='mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-3.5 py-2 text-[.82rem] font-800 text-white no-underline transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
						to='/'>
						<ArrowLeft
							size={15}
							aria-hidden='true'
						/>
						Open skill explorer
					</Link>
				</div>
			</section>
		);
	if (isDetailLoading) return <LoadingState />;
	if (detailError || !skill)
		return (
			<ErrorState
				message={
					detailError instanceof Error
						? detailError.message
						: 'Try refreshing this canonical skill detail.'
				}
				primaryAction={{
					label: isDetailFetching ? 'Retrying…' : 'Retry skill',
					onClick: () => void refetchDetail(),
				}}
			/>
		);

	const domain = data.domains.find((entry) => entry.id === skillSummary.domain);
	const recommendations = getRecommendations(
		skill.id,
		toRegistry(data),
	).recommendations;
	const outline = headingOutline(skill.content);
	const rawSkillUrl = getRawSkillUrl(skill.id);
	const pinned = isPinned(skill.id);
	const sensitiveDomain = [
		'compliance-risk',
		'global-project',
		'hr-technology-ai',
	].includes(skill.domain);

	return (
		<div className='mx-auto box-border w-full max-w-[1540px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7'>
			<div className='mb-5 flex flex-wrap items-center gap-1.5 text-[.76rem] text-slate-400'>
				<Link
					to='/'
					className='rounded-md text-slate-500 no-underline transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'>
					Skill explorer
				</Link>
				<span aria-hidden='true'>/</span>
				<Link
					to='/'
					search={{ domain: skill.domain }}
					className='rounded-md text-slate-500 no-underline transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'>
					{domain?.label ?? humanize(skill.domain)}
				</Link>
				<span aria-hidden='true'>/</span>
				<span className='font-mono text-slate-700'>{skill.id}</span>
			</div>

			<div className='grid gap-7 xl:grid-cols-[286px_minmax(0,760px)_minmax(220px,1fr)] xl:items-start'>
				<aside className='xl:sticky xl:top-21 xl:order-1'>
					<section className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40'>
						<p className='m-0 font-mono text-[.66rem] font-600 uppercase tracking-[.13em] text-blue-700'>
							Skill workspace
						</p>
						<h1 className='m-0 mt-2 overflow-wrap-anywhere font-mono text-[1.05rem] font-600 leading-[1.35] text-slate-950'>
							{skill.id}
						</h1>
						<p className='m-0 mt-1 text-[.74rem] text-slate-400'>
							Version {skill.version || '1'}
						</p>
						<div className='mt-4 flex flex-wrap gap-1.5'>
							{[skill.tier, ...skill.tags].slice(0, 7).map((tag) => (
								<span
									className='rounded-full bg-slate-100 px-1.75 py-.5 font-mono text-[.62rem] text-slate-600'
									key={tag}>
									{tag}
								</span>
							))}
						</div>
						<div className='mt-5 grid gap-2'>
							<ClaudeComposer
								skillId={skill.id}
								trigger={
									<button
										className='inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-3 py-2.25 text-[.8rem] font-800 text-white transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
										type='button'>
										<Sparkles
											size={15}
											aria-hidden='true'
										/>
										Prepare for Claude
									</button>
								}
							/>
							<button
								className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[.8rem] font-800 transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 ${pinned ? 'border-blue-200 bg-blue-50 text-blue-800' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700'}`}
								type='button'
								onClick={() => {
									togglePinned(skill.id);
									toast.success(
										pinned
											? `Unpinned ${skill.id}.`
											: `Pinned ${skill.id}.`,
									);
								}}>
								<Pin
									size={15}
									aria-hidden='true'
								/>
								{pinned ? 'Pinned to worklist' : 'Pin to worklist'}
							</button>
							<a
								className='inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-[.78rem] font-700 text-slate-500 no-underline transition hover:bg-slate-100 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
								href={rawSkillUrl}
								target='_blank'
								rel='noreferrer'>
								Raw source · main
								<ExternalLink
									size={13}
									aria-hidden='true'
								/>
							</a>
						</div>
						<div className='mt-5 border-t border-slate-200 pt-4'>
							<p className='m-0 font-mono text-[.62rem] font-600 uppercase tracking-[.11em] text-slate-400'>
								Source provenance
							</p>
							<p className='m-0 mt-1 break-all font-mono text-[.66rem] leading-[1.45] text-slate-500'>
								skills/{skill.id}/SKILL.md
							</p>
							<p className='m-0 mt-1 text-[.7rem] text-slate-400'>
								Registry snapshot {data.generatedAt}
							</p>
						</div>
					</section>
				</aside>

				<article className='min-w-0 xl:order-2'>
					<header className='border-b border-slate-200 pb-6'>
						<p className='m-0 font-mono text-[.66rem] font-600 uppercase tracking-[.13em] text-blue-700'>
							{domain?.label ?? humanize(skill.domain)}
						</p>
						<h2 className='m-0 mt-2 font-heading text-[clamp(1.9rem,4vw,3rem)] font-800 leading-[1.02] tracking-[-.05em] text-slate-950'>
							{skill.displayName || humanize(skill.id)}
						</h2>
						<p className='m-0 mt-4 text-[1.03rem] leading-[1.65] text-slate-600'>
							{skill.description}
						</p>
						{(sensitiveDomain ||
							skill.tags.some((tag) =>
								/ai|compliance|privacy|legal/i.test(tag),
							)) && (
							<div className='mt-5 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[.78rem] leading-[1.5] text-amber-900'>
								<CircleAlert
									size={16}
									className='mt-.25 shrink-0'
									aria-hidden='true'
								/>
								<span>
									This is reference material. Employment, privacy,
									compliance, and high-impact decisions require an
									accountable human owner and appropriate review.
								</span>
							</div>
						)}
					</header>

					<section className='mt-8'>
						<MarkdownContent content={skill.content} />
					</section>

					{(skill.prompts.length > 0 || skill.examples.length > 0) && (
						<section className='mt-11 border-t border-slate-200 pt-7'>
							<div className='mb-4 flex items-start gap-3'>
								<span className='grid size-9 place-items-center rounded-lg bg-blue-50 text-blue-700'>
									<FileCode2
										size={18}
										aria-hidden='true'
									/>
								</span>
								<div>
									<p className='m-0 font-heading text-[1.05rem] font-800 text-slate-950'>
										Supporting material
									</p>
									<p className='m-0 mt-1 text-[.8rem] leading-[1.45] text-slate-500'>
										Open, inspect, and copy canonical prompt or
										example files from this snapshot.
									</p>
								</div>
							</div>
							<div className='grid gap-3'>
								<SupportingFiles
									label='Prompt files'
									files={skill.prompts}
								/>
								<SupportingFiles
									label='Example files'
									files={skill.examples}
								/>
							</div>
						</section>
					)}
				</article>

				<aside className='xl:sticky xl:top-21 xl:order-3'>
					{outline.length > 0 && (
						<section className='rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40'>
							<p className='m-0 font-mono text-[.63rem] font-600 uppercase tracking-[.12em] text-slate-400'>
								On this skill
							</p>
							<nav
								className='mt-3 grid gap-1'
								aria-label='Skill content outline'>
								{outline.slice(0, 12).map((heading) => (
									<a
										className={`rounded-md px-2 py-1.25 text-[.75rem] leading-[1.35] text-slate-600 no-underline transition hover:bg-slate-100 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200 ${heading.depth === 3 ? 'ml-2.5' : ''}`}
										href={`#${heading.id}`}
										key={`${heading.id}-${heading.label}`}>
										{heading.label}
									</a>
								))}
							</nav>
						</section>
					)}

					{recommendations.length > 0 && (
						<section className='mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/40'>
							<div className='flex items-center gap-2'>
								<BookMarked
									size={15}
									className='text-blue-700'
									aria-hidden='true'
								/>
								<h3 className='m-0 font-heading text-[.92rem] font-800 text-slate-900'>
									Also useful
								</h3>
							</div>
							<div className='mt-3 grid gap-1.5'>
								{recommendations.map((recommendation) => (
									<Link
										className='group flex gap-2 rounded-lg p-2 text-slate-600 no-underline transition hover:bg-blue-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-blue-200'
										key={recommendation.id}
										to='/skills/$skillId'
										params={{ skillId: recommendation.id }}>
										<span className='mt-.25 grid size-5 shrink-0 place-items-center rounded bg-blue-50 font-mono text-[.6rem] text-blue-700 group-hover:bg-white'>
											{recommendation.rank}
										</span>
										<span className='min-w-0'>
											<span className='block truncate font-mono text-[.7rem] font-700 text-slate-800 group-hover:text-blue-700'>
												{recommendation.id}
											</span>
											<span className='mt-.5 block text-[.68rem] leading-[1.35] text-slate-500'>
												{recommendation.description}
											</span>
										</span>
									</Link>
								))}
							</div>
							<p className='m-0 mt-3 border-t border-slate-100 pt-3 text-[.68rem] leading-[1.4] text-slate-400'>
								Rank follows the canonical related-skills graph; this app
								does not re-rank it.
							</p>
						</section>
					)}
				</aside>
			</div>
		</div>
	);
}
