import { SkillGraph } from '../components/product-surfaces';
import { getSkillGraph } from '../lib/docs';

export default async function GraphPage() {
	return <SkillGraph data={await getSkillGraph()} />;
}
