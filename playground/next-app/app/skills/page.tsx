import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SkillCatalog } from '../components/skill-catalog';
import { getDocumentationData } from '../lib/docs';

export const metadata: Metadata = {
	description: 'Browse the complete HR Skills catalog by domain, tier, and metadata.',
	title: 'Skill catalog | HR Skills',
};

function CatalogFallback() {
	return <p className='loading-state'>Loading the skill catalog…</p>;
}

export default function SkillsPage() {
	return (
		<main className='site-shell page-content'>
			<Suspense fallback={<CatalogFallback />}>
				<SkillCatalog data={getDocumentationData()} />
			</Suspense>
		</main>
	);
}
