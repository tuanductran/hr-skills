import type { Metadata } from 'next';
import { PlannerPlayground } from '../components/planner-playground';
import { getRegistry } from '../lib/docs';

export const metadata: Metadata = {
	description:
		'Explore deterministic HR skill planning from a natural-language intent.',
	title: 'Planner playground | HR Skills',
};

export default async function PlannerPage() {
	const registry = await getRegistry();
	return (
		<main className='site-shell page-content'>
			<PlannerPlayground registry={registry} />
		</main>
	);
}
