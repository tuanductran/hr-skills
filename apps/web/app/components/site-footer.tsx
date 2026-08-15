import Link from 'next/link';

export function SiteFooter() {
	return (
		<footer className='site-footer'>
			<div className='site-shell site-footer__inner'>
				<p>Documentation generated from the HR Skills repository source.</p>
				<div>
					<Link href='/skills'>Skill catalog</Link>
					<a href='https://github.com/tuanductran/hr-skills'>View source</a>
				</div>
			</div>
		</footer>
	);
}
