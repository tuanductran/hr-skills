import { ReleaseViewer } from '../components/product-surfaces';
import { getReleaseEntries } from '../lib/docs';

export default async function ChangelogPage() {
	return <ReleaseViewer entries={await getReleaseEntries()} />;
}
