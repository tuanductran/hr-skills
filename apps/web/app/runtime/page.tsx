import { RuntimeTraceViewer } from '../components/product-surfaces';
import { getRuntimePreview } from '../lib/docs';

export default async function RuntimePage() {
	return <RuntimeTraceViewer data={await getRuntimePreview()} />;
}
