'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import type {
	EvaluationReport,
	ExecutionPlan,
	WorkflowResult,
} from 'hr-skills-build/client';
import Link from 'next/link';
import { useMemo, useState } from 'react';

interface GraphData {
	readonly nodes: Array<{
		readonly id: string;
		readonly name: string;
		readonly domain: string;
		readonly dependencies: number;
		readonly relatedSkills: number;
	}>;
	readonly edges: Array<{
		readonly source: string;
		readonly target: string;
		readonly kind: string;
	}>;
	readonly generatedAt: string;
}

export function SkillGraph({ data }: { readonly data: GraphData }) {
	const [query, setQuery] = useState('');
	const [domain, setDomain] = useState('');
	const domains = useMemo(
		() => [...new Set(data.nodes.map((node) => node.domain))].sort(),
		[data.nodes],
	);
	const topNodes = useMemo(
		() =>
			data.nodes
				.filter((node) => !domain || node.domain === domain)
				.filter(
					(node) =>
						!query ||
						`${node.id} ${node.name}`
							.toLowerCase()
							.includes(query.toLowerCase()),
				)
				.sort(
					(a, b) =>
						b.relatedSkills +
						b.dependencies -
						(a.relatedSkills + a.dependencies),
				)
				.slice(0, 24),
		[data.nodes, domain, query],
	);
	return (
		<section className='surface-stack'>
			<div className='surface-intro'>
				<p className='eyebrow'>Registry explorer</p>
				<h1>See how HR skills connect.</h1>
				<p>
					Explore canonical relationships derived from the registry: related
					skills and documented dependencies.
				</p>
			</div>
			<div className='graph-controls'>
				<label
					className='field'
					htmlFor='graph-search'>
					<span>Find a skill</span>
					<input
						id='graph-search'
						onChange={(event) => setQuery(event.target.value)}
						placeholder='Search by skill name or ID'
						type='search'
						value={query}
					/>
				</label>
				<label
					className='field'
					htmlFor='graph-domain'>
					<span>Practice area</span>
					<select
						id='graph-domain'
						onChange={(event) => setDomain(event.target.value)}
						value={domain}>
						<option value=''>All practice areas</option>
						{domains.map((item) => (
							<option
								key={item}
								value={item}>
								{item.replaceAll('-', ' ')}
							</option>
						))}
					</select>
				</label>
				<p className='graph-controls__hint'>
					<strong>{topNodes.length}</strong> focus results · choose a skill to
					follow its connections.
				</p>
			</div>
			<div className='surface-metrics'>
				<div>
					<strong>{data.nodes.length}</strong>
					<span>skills</span>
				</div>
				<div>
					<strong>{data.edges.length}</strong>
					<span>relationships</span>
				</div>
				<div>
					<strong>{data.generatedAt}</strong>
					<span>registry date</span>
				</div>
			</div>
			{topNodes.length ? (
				<div className='graph-grid'>
					{topNodes.map((node) => (
						<article
							className='graph-card'
							key={node.id}>
							<div className='graph-card__meta'>
								<span>{node.domain.replaceAll('-', ' ')}</span>
								<span>{node.id}</span>
							</div>
							<h2>
								<Link href={`/skills/${node.id}`}>{node.name}</Link>
							</h2>
							<p>
								{node.relatedSkills} related skills · {node.dependencies}{' '}
								dependencies
							</p>
							<div className='graph-card__links'>
								{data.edges
									.filter((edge) => edge.source === node.id)
									.slice(0, 4)
									.map((edge) => (
										<Link
											href={`/skills/${edge.target}`}
											key={`${edge.kind}-${edge.target}`}>
											{edge.target}
										</Link>
									))}
							</div>
						</article>
					))}
				</div>
			) : (
				<div className='empty-state'>
					<h2>No connected skills found</h2>
					<p>Try another name or reset the practice-area filter.</p>
					<button
						className='button'
						onClick={() => {
							setQuery('');
							setDomain('');
						}}
						type='button'>
						Reset graph
					</button>
				</div>
			)}
		</section>
	);
}

interface RuntimeData {
	readonly plan: ExecutionPlan;
	readonly result: WorkflowResult;
}

export function RuntimeTraceViewer({ data }: { readonly data: RuntimeData }) {
	return (
		<section className='surface-stack'>
			<div className='surface-intro'>
				<p className='eyebrow'>Runtime observability</p>
				<h1>Replay a deterministic workflow trace.</h1>
				<p>
					This preview uses the canonical planner and runtime with a simulated
					executor. No model or external tool is invoked.
				</p>
			</div>
			<div className='trace-summary'>
				<strong>{data.result.status}</strong>
				<span>{data.plan.steps.length} planned steps</span>
				<span>{data.result.trace.length} trace entries</span>
			</div>
			<div className='trace-list'>
				{data.result.trace.map((entry) => (
					<Disclosure
						key={`${entry.order}-${entry.type}`}
						as='article'
						className='trace-entry'>
						<DisclosureButton className='trace-entry__button'>
							<span className='trace-entry__order'>{entry.order}</span>
							<strong>{entry.type}</strong>
							<span>{entry.skillId ?? 'workflow'}</span>
							<span>View state</span>
						</DisclosureButton>
						<DisclosurePanel className='trace-entry__panel'>
							<pre>{JSON.stringify(entry, null, 2)}</pre>
						</DisclosurePanel>
					</Disclosure>
				))}
			</div>
		</section>
	);
}

type EvaluationData = EvaluationReport;

export function EvaluationDashboard({ data }: { readonly data: EvaluationData }) {
	return (
		<section className='surface-stack'>
			<div className='surface-intro'>
				<p className='eyebrow'>Quality intelligence</p>
				<h1>Evaluate planner behavior against golden cases.</h1>
				<p>
					Metrics are computed by the package evaluation API from the committed
					planning dataset and golden fixture.
				</p>
			</div>
			<div className='surface-metrics surface-metrics--wide'>
				<div>
					<strong>
						{data.passedCases}/{data.totalCases}
					</strong>
					<span>cases passing</span>
				</div>
				<div>
					<strong>
						{Math.round(data.metrics.skillSelectionAccuracy * 100)}%
					</strong>
					<span>skill selection</span>
				</div>
				<div>
					<strong>
						{Math.round(data.metrics.capabilityMatchingAccuracy * 100)}%
					</strong>
					<span>capability matching</span>
				</div>
				<div>
					<strong>{data.generatedAt}</strong>
					<span>generated</span>
				</div>
			</div>
			<div className='evaluation-list'>
				{data.results.map((result) => (
					<Disclosure
						key={result.caseId}
						as='article'
						className='evaluation-card'>
						<DisclosureButton className='evaluation-card__button'>
							<span
								className={
									result.regressions.length
										? 'status status--fail'
										: 'status status--pass'
								}>
								{result.regressions.length ? 'regressed' : 'pass'}
							</span>
							<strong>{result.caseId}</strong>
							<span>{result.category}</span>
							<span>Details</span>
						</DisclosureButton>
						<DisclosurePanel className='evaluation-card__panel'>
							<p>{result.intent}</p>
							{result.regressions.length > 0 && (
								<p>Regressions: {result.regressions.join(', ')}</p>
							)}
						</DisclosurePanel>
					</Disclosure>
				))}
			</div>
		</section>
	);
}

interface ReleaseData {
	readonly id: string;
	readonly packages: Array<{ readonly name: string; readonly bump: string }>;
	readonly summary: string;
}
export function ReleaseViewer({ entries }: { readonly entries: ReleaseData[] }) {
	return (
		<section className='surface-stack'>
			<div className='surface-intro'>
				<p className='eyebrow'>Release intelligence</p>
				<h1>Follow what changed in the platform.</h1>
				<p>
					Pending Changesets are rendered directly from the repository release
					metadata.
				</p>
			</div>
			<div className='release-list'>
				{entries.map((entry) => (
					<article
						className='release-card'
						key={entry.id}>
						<div className='release-card__topline'>
							<strong>{entry.id}</strong>
							<div>
								{entry.packages.map((pkg) => (
									<span
										className='badge'
										key={pkg.name}>
										{pkg.name} · {pkg.bump}
									</span>
								))}
							</div>
						</div>
						<p>{entry.summary}</p>
					</article>
				))}
			</div>
		</section>
	);
}
