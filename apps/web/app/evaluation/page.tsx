import { EvaluationDashboard } from '../components/product-surfaces';
import { getEvaluationDashboard } from '../lib/docs';

export default async function EvaluationPage() {
	return (
		<main className='site-shell page-content'>
			<EvaluationDashboard data={await getEvaluationDashboard()} />
		</main>
	);
}
