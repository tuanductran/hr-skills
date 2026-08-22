import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MarkdownContent } from '../../components/markdown-content';
import {
	getDocumentationData,
	getDocumentationSkill,
	getSkillRecommendations,
} from '../../lib/docs';

interface SkillPageProps {
	readonly params: Promise<{ skillId: string }>;
}

function sourceLabel(fileName: string): string {
	return fileName.replace(/\.md$/, '').replaceAll('-', ' ');
}

export async function generateStaticParams() {
	const data = await getDocumentationData();
	return data.skills.map((skill) => ({ skillId: skill.id }));
}

export async function generateMetadata({ params }: SkillPageProps): Promise<Metadata> {
	const { skillId } = await params;
	const skill = await getDocumentationSkill(skillId);
	if (!skill) return { title: 'Skill not found | HR Skills' };
	return { description: skill.description, title: `${skill.displayName} | HR Skills` };
}

export default async function SkillPage({ params }: SkillPageProps) {
	const { skillId } = await params;
	const skill = await getDocumentationSkill(skillId);
	if (!skill) notFound();
	const recommendations = await getSkillRecommendations(skill.id);

	return (
		<main className='mx-auto w-[min(1180px,calc(100%-2rem))] py-10 sm:py-16'>
			<nav
				aria-label='Breadcrumb'
				className='mb-7 flex flex-wrap items-center gap-2 text-sm text-muted'>
				<Link
					className='hover:text-brand-strong'
					href='/'>
					Home
				</Link>
				<span aria-hidden='true'>/</span>
				<Link
					className='hover:text-brand-strong'
					href='/skills'>
					Skill catalog
				</Link>
				<span aria-hidden='true'>/</span>
				<span>{skill.displayName}</span>
			</nav>
			<header className='rounded-3xl border border-line bg-surface p-6 shadow-card sm:p-10'>
				<p className='mb-3 text-xs font-black uppercase tracking-[0.17em] text-brand'>
					{skill.domain.replaceAll('-', ' ')}
				</p>
				<h1 className='max-w-4xl text-balance text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[0.98] tracking-[-0.075em]'>
					{skill.displayName}
				</h1>
				<p className='mt-5 max-w-3xl text-pretty text-lg leading-8 text-muted'>
					{skill.description}
				</p>
				<div className='mt-7 flex flex-wrap items-center gap-3 text-sm font-bold text-muted'>
					<span
						className={`rounded-full px-3 py-1.5 text-xs font-black uppercase tracking-[0.08em] ${skill.tier === 'full' ? 'bg-emerald-50 text-success' : skill.tier === 'partial' ? 'bg-amber-50 text-warning' : 'bg-red-50 text-danger'}`}>
						{skill.tier} skill
					</span>
					<span>Version {skill.version}</span>
				</div>
			</header>
			<div className='mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]'>
				<article className='min-w-0 rounded-3xl border border-line bg-surface p-5 shadow-card sm:p-9'>
					<section aria-labelledby='skill-content-heading'>
						<h2
							className='mb-5 text-2xl font-semibold tracking-tight'
							id='skill-content-heading'>
							Skill guide
						</h2>
						<MarkdownContent content={skill.content} />
					</section>
					{skill.prompts.length > 0 && (
						<section
							aria-labelledby='skill-prompts-heading'
							className='mt-12 border-t border-line pt-10'>
							<h2
								className='mb-5 text-2xl font-semibold tracking-tight'
								id='skill-prompts-heading'>
								Prompts
							</h2>
							<div className='grid gap-3'>
								{skill.prompts.map((section) => (
									<details
										className='overflow-hidden rounded-2xl border border-line bg-canvas'
										key={section.fileName}
										open={skill.prompts.length === 1}>
										<summary className='cursor-pointer px-4 py-3 font-bold text-brand-strong hover:bg-brand-soft'>
											{sourceLabel(section.fileName)}
										</summary>
										<div className='border-t border-line bg-surface px-5 py-4'>
											<MarkdownContent content={section.markdown} />
										</div>
									</details>
								))}
							</div>
						</section>
					)}
					{skill.examples.length > 0 && (
						<section
							aria-labelledby='skill-examples-heading'
							className='mt-12 border-t border-line pt-10'>
							<h2
								className='mb-5 text-2xl font-semibold tracking-tight'
								id='skill-examples-heading'>
								Examples
							</h2>
							<div className='grid gap-3'>
								{skill.examples.map((section) => (
									<details
										className='overflow-hidden rounded-2xl border border-line bg-canvas'
										key={section.fileName}
										open={skill.examples.length === 1}>
										<summary className='cursor-pointer px-4 py-3 font-bold text-brand-strong hover:bg-brand-soft'>
											{sourceLabel(section.fileName)}
										</summary>
										<div className='border-t border-line bg-surface px-5 py-4'>
											<MarkdownContent content={section.markdown} />
										</div>
									</details>
								))}
							</div>
						</section>
					)}
				</article>
				<aside
					aria-label='Skill metadata'
					className='grid content-start gap-5'>
					<section className='rounded-2xl border border-line bg-surface p-5 shadow-sm lg:sticky lg:top-24'>
						<h2 className='mb-5 text-2xl font-semibold tracking-tight'>
							Metadata
						</h2>
						<dl className='m-0 grid gap-4'>
							<div className='grid gap-1'>
								<dt className='text-[0.67rem] font-black uppercase tracking-[0.12em] text-muted'>
									Domain
								</dt>
								<dd className='m-0 break-words text-sm font-bold'>
									{skill.domain.replaceAll('-', ' ')}
								</dd>
							</div>
							<div className='grid gap-1'>
								<dt className='text-[0.67rem] font-black uppercase tracking-[0.12em] text-muted'>
									Tier
								</dt>
								<dd className='m-0 break-words text-sm font-bold'>
									{skill.tier}
								</dd>
							</div>
							<div className='grid gap-1'>
								<dt className='text-[0.67rem] font-black uppercase tracking-[0.12em] text-muted'>
									Tags
								</dt>
								<dd className='m-0 break-words text-sm font-bold'>
									{skill.tags.join(', ') || 'None'}
								</dd>
							</div>
						</dl>
					</section>
					{recommendations.length > 0 && (
						<section className='rounded-2xl border border-line bg-surface p-5 shadow-sm'>
							<h2 className='mb-5 text-2xl font-semibold tracking-tight'>
								Related skills
							</h2>
							<ul className='m-0 grid list-none gap-3 p-0'>
								{recommendations.map((related) => (
									<li key={related.id}>
										<Link
											className='text-sm font-bold leading-6 text-brand hover:text-brand-strong'
											href={`/skills/${related.id}`}>
											{related.name}
										</Link>
									</li>
								))}
							</ul>
						</section>
					)}
				</aside>
			</div>
		</main>
	);
}
