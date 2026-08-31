import Link from 'next/link';

export default function NotFound() {
	return (
		<main
			className='site-shell page-content not-found'
			id='main-content'
			tabIndex={-1}>
			<section
				aria-labelledby='not-found-title'
				className='not-found__card'>
				<p className='eyebrow'>HR Skills</p>
				<h1
					className='not-found__code'
					id='not-found-title'>
					404
				</h1>
				<h2>This page could not be found.</h2>
				<p>
					The skill or route you requested is not available. Return to the
					catalog to find a supported HR guide.
				</p>
				<div className='not-found__actions'>
					<Link
						className='button'
						href='/skills'>
						Browse skills
					</Link>
					<Link
						className='button button--secondary'
						href='/'>
						Go home
					</Link>
				</div>
			</section>
		</main>
	);
}
