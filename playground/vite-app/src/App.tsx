// Smoke test: everything imported here comes from `hr-skills-build/client`.
// If this file ever imports the package root `hr-skills-build` instead, the
// Vite build should fail (node:fs/node:path unresolved) — that's the
// regression this playground exists to catch.
import {
	createRuntimeContext,
	parseSkillFrontmatter,
	type Registry,
	searchSkills,
} from 'hr-skills-build/client';

const SAMPLE_SKILL_MD = `---
name: hr-onboarding
description: Helps design onboarding programs. Use when planning new-hire ramp-up.
metadata:
  author: Tuan Duc Tran
  version: "1.0.0"
---

## Supported tasks

- Draft onboarding checklists
`;

const SAMPLE_REGISTRY = {
	schemaVersion: 1,
	generatedAt: '2026-08-12',
	skillCount: 2,
	skills: [
		{
			id: 'hr-onboarding',
			name: 'hr-onboarding',
			version: '1.0.0',
			description: 'New-hire onboarding programs',
			tier: 'full',
			domain: 'onboarding-offboarding',
			tags: ['onboarding'],
			aliases: ['onboarding'],
			capabilities: ['Draft onboarding checklists'],
			triggerPhrases: ['onboarding'],
			paths: {
				content: true,
				prompts: true,
				examples: true,
			},
			dependencies: [],
			relatedSkills: [],
		},
		{
			id: 'hr-offboarding',
			name: 'hr-offboarding',
			version: '1.0.0',
			description: 'Employee offboarding process',
			tier: 'full',
			domain: 'onboarding-offboarding',
			tags: ['offboarding'],
			aliases: ['offboarding'],
			capabilities: ['Employee offboarding process'],
			triggerPhrases: ['offboarding'],
			paths: {
				content: true,
				prompts: true,
				examples: true,
			},
			dependencies: [],
			relatedSkills: [],
		},
	],
} satisfies Registry;

export function App() {
	const frontmatter = parseSkillFrontmatter(SAMPLE_SKILL_MD);
	const results = searchSkills(
		{
			text: 'onboarding',
		},
		SAMPLE_REGISTRY,
	);
	const ctx = createRuntimeContext('test onboarding a new hire');

	return (
		<main style={{ fontFamily: 'monospace', padding: 24 }}>
			<h1>hr-skills-build/client playground</h1>

			<section>
				<h2>parseSkillFrontmatter()</h2>
				<pre
					style={{
						whiteSpace: 'pre-wrap',
						maxWidth: '100%',
						overflowX: 'auto',
					}}>
					{JSON.stringify(frontmatter, null, 2)}
				</pre>
			</section>

			<section>
				<h2>searchSkills()</h2>
				<pre
					style={{
						whiteSpace: 'pre-wrap',
						maxWidth: '100%',
						overflowX: 'auto',
					}}>
					{JSON.stringify(results, null, 2)}
				</pre>
			</section>

			<section>
				<h2>createRuntimeContext()</h2>
				<pre
					style={{
						whiteSpace: 'pre-wrap',
						maxWidth: '100%',
						overflowX: 'auto',
					}}>
					{JSON.stringify(ctx.toObject(), null, 2)}
				</pre>
			</section>
		</main>
	);
}
