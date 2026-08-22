import { SkillGraph } from '../components/product-surfaces';
import { getSkillGraph } from '../lib/docs';

export default async function GraphPage() {
	return (
		<main className='site-shell page-content'>
			<SkillGraph data={await getSkillGraph()} />
		</main>
	);
}
