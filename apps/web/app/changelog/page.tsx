import type { Metadata } from 'next';
import { ReleaseViewer } from '../components/product-surfaces';
import { getReleaseEntries } from '../lib/docs';

export const metadata: Metadata = {
	description: 'Follow pending changesets across the HR Skills packages.',
	title: 'Changelog',
};

export default async function ChangelogPage() {
	return (
		<main
			className='site-shell page-content'
			id='main-content'
			tabIndex={-1}>
			<ReleaseViewer entries={await getReleaseEntries()} />
		</main>
	);
}
