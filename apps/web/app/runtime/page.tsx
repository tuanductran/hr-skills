import type { Metadata } from 'next';
import { RuntimeTraceViewer } from '../components/product-surfaces';
import { getRuntimePreview } from '../lib/docs';

export const metadata: Metadata = {
	description: 'Replay a deterministic workflow trace from the canonical runtime.',
	title: 'Runtime trace',
};

export default async function RuntimePage() {
	return (
		<main
			className='site-shell page-content'
			id='main-content'
			tabIndex={-1}>
			<RuntimeTraceViewer data={await getRuntimePreview()} />
		</main>
	);
}
