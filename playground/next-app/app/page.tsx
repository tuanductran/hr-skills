import Link from 'next/link';
import { ClientWidget } from './client-widget';
import { getDocumentationData } from './lib/docs';

// Keep the browser-safe client entrypoint in the Next.js build graph. The
// component is hidden because the public catalog is the playground's visible
// interface, while this import remains a client-bundle smoke check.
export default function Page() {
	const data = getDocumentationData();
	const featuredSkills = data.skills.slice(0, 6);

	return (
		<main>
			<section className='hero'>
				<div className='site-shell hero__inner'>
					<p className='eyebrow'>A practical HR knowledge library</p>
					<h1>Skills for thoughtful, operationally excellent people work.</h1>
					<p>
						Browse {data.skillCount} content-driven HR Skills across talent
						acquisition, people operations, learning, rewards, and workforce
						strategy.
					</p>
					<div className='hero__actions'>
						<Link
							className='button'
							href='/skills'>
							Explore skill catalog
						</Link>
						<a
							className='button button--secondary'
							href='https://github.com/tuanductran/hr-skills'>
							View repository
						</a>
					</div>
				</div>
			</section>

			<section
				className='site-shell home-section'
				aria-labelledby='domains-heading'>
				<div className='section-heading'>
					<div>
						<p className='eyebrow'>Browse by practice area</p>
						<h2 id='domains-heading'>
							Built for the full HR operating system
						</h2>
					</div>
					<Link href='/skills'>View all skills</Link>
				</div>
				<ul className='domain-grid'>
					{data.domains.slice(0, 8).map((domain) => (
						<li key={domain.id}>
							<Link href={`/skills?domain=${domain.id}`}>
								<strong>{domain.label}</strong>
								<span>{domain.skillCount} skills</span>
							</Link>
						</li>
					))}
				</ul>
			</section>

			<section
				className='site-shell home-section'
				aria-labelledby='featured-heading'>
				<div className='section-heading'>
					<div>
						<p className='eyebrow'>Start here</p>
						<h2 id='featured-heading'>Featured skill guides</h2>
					</div>
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
								<span className='skill-card__action'>Read skill</span>
							</Link>
						</li>
					))}
				</ul>
			</section>
			<div hidden>
				<ClientWidget />
			</div>
		</main>
	);
}
