import { getReadinessService, getVersionService } from 'hr-skills-build/server';
import { ClientWidget } from './client-widget';

export default async function Page() {
	const version = getVersionService();
	const readiness = await getReadinessService([
		{ name: 'playground', check: () => true },
	]);

	return (
		<main style={{ fontFamily: 'monospace', padding: 24 }}>
			<h1>hr-skills-build playground (Next.js)</h1>

			<section>
				<h2>Client: parseSkillFrontmatter() via hr-skills-build/client</h2>
				<ClientWidget />
			</section>

			<section>
				<h2>Server: version and readiness via hr-skills-build/server</h2>
				<pre
					style={{
						whiteSpace: 'pre-wrap',
						maxWidth: '100%',
						overflowX: 'auto',
					}}>
					{JSON.stringify({ version, readiness }, null, 2)}
				</pre>
			</section>
		</main>
	);
}
