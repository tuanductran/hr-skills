import { ReleaseViewer } from '../components/product-surfaces';
import { getReleaseEntries } from '../lib/docs';

export default async function ChangelogPage() {
	return (
		<main className='site-shell page-content'>
			<ReleaseViewer entries={await getReleaseEntries()} />
		</main>
	);
}
