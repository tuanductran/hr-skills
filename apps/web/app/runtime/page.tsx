import { RuntimeTraceViewer } from '../components/product-surfaces';
import { getRuntimePreview } from '../lib/docs';

export default async function RuntimePage() {
	return (
		<main className='site-shell page-content'>
			<RuntimeTraceViewer data={await getRuntimePreview()} />
		</main>
	);
}
