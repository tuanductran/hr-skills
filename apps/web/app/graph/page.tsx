import type { Metadata } from 'next';
import { SkillGraph } from '../components/product-surfaces';
import { getSkillGraph } from '../lib/docs';

export const metadata: Metadata = {
	description: 'Explore canonical relationships between HR Skills.',
	title: 'Skill graph',
};

export default async function GraphPage() {
	return (
		<main
			className='site-shell page-content'
			id='main-content'
			tabIndex={-1}>
			<SkillGraph data={await getSkillGraph()} />
		</main>
	);
}
