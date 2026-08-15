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
		<main className='site-shell page-content skill-page'>
			<nav
				aria-label='Breadcrumb'
				className='breadcrumb'>
				<Link href='/'>Home</Link>
				<span aria-hidden='true'>/</span>
				<Link href='/skills'>Skill catalog</Link>
				<span aria-hidden='true'>/</span>
				<span>{skill.displayName}</span>
			</nav>
			<header className='skill-hero'>
				<p className='eyebrow'>{skill.domain.replaceAll('-', ' ')}</p>
				<h1>{skill.displayName}</h1>
				<p>{skill.description}</p>
				<div className='skill-hero__badges'>
					<span className={`tier tier--${skill.tier}`}>{skill.tier} skill</span>
					<span>Version {skill.version}</span>
				</div>
			</header>
			<div className='skill-layout'>
				<article className='skill-article'>
					<section aria-labelledby='skill-content-heading'>
						<h2 id='skill-content-heading'>Skill guide</h2>
						<MarkdownContent content={skill.content} />
					</section>
					{skill.prompts.length > 0 && (
						<section
							aria-labelledby='skill-prompts-heading'
							className='skill-content-section'>
							<h2 id='skill-prompts-heading'>Prompts</h2>
							{skill.prompts.map((section) => (
								<details
									key={section.fileName}
									open={skill.prompts.length === 1}>
									<summary>{sourceLabel(section.fileName)}</summary>
									<MarkdownContent content={section.markdown} />
								</details>
							))}
						</section>
					)}
					{skill.examples.length > 0 && (
						<section
							aria-labelledby='skill-examples-heading'
							className='skill-content-section'>
							<h2 id='skill-examples-heading'>Examples</h2>
							{skill.examples.map((section) => (
								<details
									key={section.fileName}
									open={skill.examples.length === 1}>
									<summary>{sourceLabel(section.fileName)}</summary>
									<MarkdownContent content={section.markdown} />
								</details>
							))}
						</section>
					)}
				</article>
				<aside
					aria-label='Skill metadata'
					className='skill-aside'>
					<section>
						<h2>Metadata</h2>
						<dl className='metadata-list'>
							<div>
								<dt>Domain</dt>
								<dd>{skill.domain.replaceAll('-', ' ')}</dd>
							</div>
							<div>
								<dt>Tier</dt>
								<dd>{skill.tier}</dd>
							</div>
							<div>
								<dt>Tags</dt>
								<dd>{skill.tags.join(', ') || 'None'}</dd>
							</div>
						</dl>
					</section>
					{recommendations.length > 0 && (
						<section>
							<h2>Related skills</h2>
							<ul className='related-list'>
								{recommendations.map((related) => (
									<li key={related.id}>
										<Link href={`/skills/${related.id}`}>
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
