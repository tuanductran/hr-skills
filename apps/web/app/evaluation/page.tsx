import { EvaluationDashboard } from '../components/product-surfaces';
import { getEvaluationDashboard } from '../lib/docs';

export default async function EvaluationPage() {
	return <EvaluationDashboard data={await getEvaluationDashboard()} />;
}
