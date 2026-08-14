import Link from 'next/link';

export function SiteHeader() {
	return (
		<header className='site-header'>
			<div className='site-shell site-header__inner'>
				<Link
					className='brand'
					href='/'>
					<span
						className='brand__mark'
						aria-hidden='true'>
						HR
					</span>
					<span>HR Skills</span>
				</Link>
				<nav
					aria-label='Primary navigation'
					className='site-nav'>
					<Link href='/'>Home</Link>
					<Link href='/skills'>Skill catalog</Link>
					<Link href='/planner'>Planner</Link>
					<Link href='/graph'>Graph</Link>
					<Link href='/runtime'>Runtime</Link>
					<Link href='/evaluation'>Evaluation</Link>
					<Link href='/changelog'>Changelog</Link>
					<a href='https://github.com/tuanductran/hr-skills'>Repository</a>
				</nav>
			</div>
		</header>
	);
}
