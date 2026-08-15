import Link from 'next/link';

export function SiteHeader() {
	return (
		<header className='site-header'>
			<div className='site-shell site-header__inner'>
				<Link
					className='brand'
					href='/'>
					<span
						aria-hidden='true'
						className='brand__mark'>
						HR
					</span>
					<span>
						<strong>HR Skills</strong>
						<small>Practical HR knowledge</small>
					</span>
				</Link>
				<nav
					aria-label='Primary navigation'
					className='site-nav'>
					<Link href='/'>Home</Link>
					<Link href='/skills'>Catalog</Link>
					<Link
						className='site-nav__primary'
						href='/planner'>
						Planner
					</Link>
					<details className='nav-menu'>
						<summary>Explore</summary>
						<div className='nav-menu__panel'>
							<Link href='/graph'>Skill graph</Link>
							<Link href='/runtime'>Runtime trace</Link>
							<Link href='/evaluation'>Evaluation</Link>
							<Link href='/changelog'>Changelog</Link>
						</div>
					</details>
					<a href='https://github.com/tuanductran/hr-skills'>
						GitHub <span aria-hidden='true'>↗</span>
					</a>
				</nav>
			</div>
		</header>
	);
}
