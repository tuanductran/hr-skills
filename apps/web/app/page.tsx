import Link from 'next/link';
import { getDocumentationData } from './lib/docs';

export default async function Page() {
	const data = await getDocumentationData();
	const featuredSkills = data.skills.slice(0, 6);

	return (
		<main
			id='main-content'
			tabIndex={-1}>
			<section className='hero'>
				<div className='site-shell hero__inner'>
					<div className='hero__copy'>
						<p className='eyebrow'>A practical HR knowledge library</p>
						<h1>Move from HR question to confident next step.</h1>
						<p>
							Use a canonical library of {data.skillCount} HR Skills to
							research, plan, govern, and improve people work.
						</p>
						<div className='hero__actions'>
							<Link
								className='button'
								href='/skills'>
								Find a skill <span aria-hidden='true'>→</span>
							</Link>
							<Link
								className='button button--secondary'
								href='/planner'>
								Build a plan
							</Link>
						</div>
						<div className='hero__trust'>
							<span>
								<strong>{data.skillCount}</strong> skills
							</span>
							<span>
								<strong>{data.domains.length}</strong> practice areas
							</span>
							<span>
								<strong>100%</strong> repository-backed
							</span>
						</div>
					</div>
					<section
						aria-labelledby='hero-path-heading'
						className='hero__path'>
						<p
							className='eyebrow'
							id='hero-path-heading'>
							Choose your starting point
						</p>
						<Link href='/skills'>
							<strong>I need a practical guide</strong>
							<span>
								Browse skills by HR task, practice area or maturity.
							</span>
							<span aria-hidden='true'>→</span>
						</Link>
						<Link href='/planner'>
							<strong>I have a complex HR task</strong>
							<span>Turn an intent into an explainable skill plan.</span>
							<span aria-hidden='true'>→</span>
						</Link>
					</section>
				</div>
			</section>

			<section
				className='site-shell home-section'
				aria-labelledby='domains-heading'>
				<div className='section-heading'>
					<div>
						<p className='eyebrow'>Browse by practice area</p>
						<h2 id='domains-heading'>Start with the part of HR you own.</h2>
					</div>
					<Link
						className='section-link'
						href='/skills'>
						View full catalog <span aria-hidden='true'>→</span>
					</Link>
				</div>
				<ul className='domain-grid'>
					{data.domains.slice(0, 8).map((domain) => (
						<li key={domain.id}>
							<Link href={`/skills?domain=${domain.id}`}>
								<strong>{domain.label}</strong>
								<span>{domain.skillCount} skills</span>
								<span
									className='domain-grid__arrow'
									aria-hidden='true'>
									→
								</span>
							</Link>
						</li>
					))}
				</ul>
			</section>

			<section
				className='site-shell home-section home-section--soft'
				aria-labelledby='featured-heading'>
				<div className='section-heading'>
					<div>
						<p className='eyebrow'>Start here</p>
						<h2 id='featured-heading'>Guides people teams return to.</h2>
						<p className='section-heading__description'>
							A small selection from the canonical registry, ready to
							explore.
						</p>
					</div>
					<Link
						className='section-link'
						href='/skills'>
						Browse all {data.skillCount} skills{' '}
						<span aria-hidden='true'>→</span>
					</Link>
				</div>
				<ul className='skill-grid'>
					{featuredSkills.map((skill) => (
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
								<h3>{skill.displayName}</h3>
								<p>{skill.description}</p>
								<span className='skill-card__action'>
									Read guide <span aria-hidden='true'>→</span>
								</span>
							</Link>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}
