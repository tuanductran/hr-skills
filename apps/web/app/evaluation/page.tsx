import type { Metadata } from 'next';
import { EvaluationDashboard } from '../components/product-surfaces';
import { getEvaluationDashboard } from '../lib/docs';

export const metadata: Metadata = {
	description: 'Evaluate planner behavior against the committed golden dataset.',
	title: 'Evaluation',
};

export default async function EvaluationPage() {
	return (
		<main
			className='site-shell page-content'
			id='main-content'
			tabIndex={-1}>
			<EvaluationDashboard data={await getEvaluationDashboard()} />
		</main>
	);
}
