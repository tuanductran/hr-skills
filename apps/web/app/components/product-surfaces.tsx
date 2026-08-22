'use client';

import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import type {
	EvaluationReport,
	ExecutionPlan,
	WorkflowResult,
} from 'hr-skills-build/client';
import Link from 'next/link';
import { useMemo, useState } from 'react';

const inputClass =
	'min-h-12 w-full rounded-xl border border-line bg-canvas px-4 py-3 text-sm font-medium text-ink outline-none transition focus:border-brand focus:bg-surface';
const metricClass = 'grid gap-1 rounded-2xl border border-line bg-surface p-5 shadow-sm';
const cardClass =
	'rounded-2xl border border-line bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-card';
const disclosureButtonClass =
	'grid w-full grid-cols-[auto_1fr_auto_auto] items-center gap-3 border-0 bg-transparent p-4 text-left text-ink transition hover:bg-brand-soft';

function SurfaceIntro({
	eyebrow,
	title,
	children,
}: {
	eyebrow: string;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className='max-w-3xl'>
			<p className='mb-3 text-xs font-black uppercase tracking-[0.17em] text-brand'>
				{eyebrow}
			</p>
			<h1 className='text-balance text-[clamp(2.25rem,5vw,4.4rem)] font-medium leading-[0.98] tracking-[-0.075em]'>
				{title}
			</h1>
			<p className='mt-4 max-w-2xl text-pretty text-lg leading-8 text-muted'>
				{children}
			</p>
		</div>
	);
}

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
				.toSorted(
					(a, b) =>
						b.relatedSkills +
						b.dependencies -
						(a.relatedSkills + a.dependencies),
				)
				.slice(0, 24),
		[data.nodes, domain, query],
	);
	return (
		<section className='grid gap-7'>
			<SurfaceIntro
				eyebrow='Registry explorer'
				title='See how HR skills connect.'>
				Explore canonical relationships derived from the registry: related skills
				and documented dependencies.
			</SurfaceIntro>
			<div className='grid items-end gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card sm:grid-cols-2'>
				<label
					className='grid gap-2 text-sm font-black'
					htmlFor='graph-search'>
					<span>Find a skill</span>
					<input
						className={inputClass}
						id='graph-search'
						onChange={(event) => setQuery(event.target.value)}
						placeholder='Search by skill name or ID'
						type='search'
						value={query}
					/>
				</label>
				<label
					className='grid gap-2 text-sm font-black'
					htmlFor='graph-domain'>
					<span>Practice area</span>
					<select
						className={inputClass}
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
				<p className='m-0 text-sm leading-6 text-muted sm:col-span-2'>
					<strong className='text-ink'>{topNodes.length}</strong> focus results
					· choose a skill to follow its connections.
				</p>
			</div>
			<div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
				{[
					[data.nodes.length, 'skills'],
					[data.edges.length, 'relationships'],
					[data.generatedAt, 'registry date'],
				].map(([value, label]) => (
					<div
						className={metricClass}
						key={label}>
						<strong className='text-2xl font-medium tracking-[-0.04em]'>
							{value}
						</strong>
						<span className='text-xs font-semibold text-muted'>{label}</span>
					</div>
				))}
			</div>
			{topNodes.length ? (
				<div className='graph-grid grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
					{topNodes.map((node) => (
						<article
							className={`graph-card ${cardClass}`}
							key={node.id}>
							<div className='flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-muted'>
								<span>{node.domain.replaceAll('-', ' ')}</span>
								<span>{node.id}</span>
							</div>
							<h2 className='mb-2 mt-4 text-xl font-medium tracking-[-0.035em]'>
								<Link
									className='hover:text-brand-strong'
									href={`/skills/${node.id}`}>
									{node.name}
								</Link>
							</h2>
							<p className='m-0 leading-6 text-muted'>
								{node.relatedSkills} related skills · {node.dependencies}{' '}
								dependencies
							</p>
							<div className='graph-card__links mt-5 flex flex-wrap gap-2'>
								{data.edges
									.filter((edge) => edge.source === node.id)
									.slice(0, 4)
									.map((edge) => (
										<Link
											className='rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand-strong'
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
				<EmptyState
					title='No connected skills found'
					action='Reset graph'
					onAction={() => {
						setQuery('');
						setDomain('');
					}}>
					Try another name or reset the practice-area filter.
				</EmptyState>
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
		<section className='grid gap-7'>
			<SurfaceIntro
				eyebrow='Runtime observability'
				title='Replay a deterministic workflow trace.'>
				This preview uses the canonical planner and runtime with a simulated
				executor. No model or external tool is invoked.
			</SurfaceIntro>
			<div className='flex flex-wrap items-center gap-4 rounded-2xl bg-ink p-5 text-surface'>
				<strong className='text-lg font-black'>{data.result.status}</strong>
				<span className='text-sm text-surface/70'>
					{data.plan.steps.length} planned steps
				</span>
				<span className='text-sm text-surface/70'>
					{data.result.trace.length} trace entries
				</span>
			</div>
			<div className='grid gap-3'>
				{data.result.trace.map((entry) => (
					<Disclosure
						key={`${entry.order}-${entry.type}`}
						as='article'
						className='trace-entry overflow-hidden rounded-2xl border border-line bg-surface shadow-sm'>
						<DisclosureButton className={disclosureButtonClass}>
							<span className='font-mono text-xs text-muted'>
								{entry.order}
							</span>
							<strong>{entry.type}</strong>
							<span className='text-xs font-semibold text-muted'>
								{entry.skillId ?? 'workflow'}
							</span>
							<span className='text-xs font-semibold text-muted'>
								View state
							</span>
						</DisclosureButton>
						<DisclosurePanel className='trace-entry__panel border-t border-line bg-canvas p-4'>
							<pre className='m-0 max-w-full overflow-x-auto rounded-xl bg-ink p-4 font-mono text-xs leading-6 text-surface'>
								{JSON.stringify(entry, null, 2)}
							</pre>
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
		<section className='grid gap-7'>
			<SurfaceIntro
				eyebrow='Quality intelligence'
				title='Evaluate planner behavior against golden cases.'>
				Metrics are computed by the package evaluation API from the committed
				planning dataset and golden fixture.
			</SurfaceIntro>
			<div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
				{[
					[`${data.passedCases}/${data.totalCases}`, 'cases passing'],
					[
						`${Math.round(data.metrics.skillSelectionAccuracy * 100)}%`,
						'skill selection',
					],
					[
						`${Math.round(data.metrics.capabilityMatchingAccuracy * 100)}%`,
						'capability matching',
					],
					[data.generatedAt, 'generated'],
				].map(([value, label]) => (
					<div
						className={metricClass}
						key={label}>
						<strong className='text-2xl font-medium tracking-[-0.04em]'>
							{value}
						</strong>
						<span className='text-xs font-semibold text-muted'>{label}</span>
					</div>
				))}
			</div>
			<div className='grid gap-3'>
				{data.results.map((result) => (
					<Disclosure
						key={result.caseId}
						as='article'
						className='evaluation-card overflow-hidden rounded-2xl border border-line bg-surface shadow-sm'>
						<DisclosureButton className={disclosureButtonClass}>
							<span
								className={`rounded-full px-2.5 py-1 text-xs font-black uppercase ${result.regressions.length ? 'bg-red-50 text-danger' : 'bg-emerald-50 text-success'}`}>
								{result.regressions.length ? 'regressed' : 'pass'}
							</span>
							<strong>{result.caseId}</strong>
							<span className='text-xs font-semibold text-muted'>
								{result.category}
							</span>
							<span className='text-xs font-semibold text-muted'>
								Details
							</span>
						</DisclosureButton>
						<DisclosurePanel className='evaluation-card__panel grid gap-2 border-t border-line bg-canvas p-4 text-sm leading-6 text-muted'>
							<p className='m-0'>{result.intent}</p>
							{result.regressions.length > 0 && (
								<p className='m-0 text-danger'>
									Regressions: {result.regressions.join(', ')}
								</p>
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
		<section className='grid gap-7'>
			<SurfaceIntro
				eyebrow='Release intelligence'
				title='Follow what changed in the platform.'>
				Pending Changesets are rendered directly from the repository release
				metadata.
			</SurfaceIntro>
			{entries.length ? (
				<div className='grid gap-3'>
					{entries.map((entry) => (
						<article
							className={`release-card ${cardClass}`}
							key={entry.id}>
							<div className='flex flex-wrap items-center justify-between gap-3'>
								<strong>{entry.id}</strong>
								<div className='flex flex-wrap gap-2'>
									{entry.packages.map((pkg) => (
										<span
											className='badge rounded-full bg-brand-soft px-2.5 py-1 text-xs font-bold text-brand-strong'
											key={pkg.name}>
											{pkg.name} · {pkg.bump}
										</span>
									))}
								</div>
							</div>
							<p className='m-0 mt-4 leading-6 text-muted'>
								{entry.summary}
							</p>
						</article>
					))}
				</div>
			) : (
				<EmptyState title='No pending changesets'>
					The release queue is clear. New release notes will appear here when a
					changeset is added.
				</EmptyState>
			)}
		</section>
	);
}

function EmptyState({
	title,
	action,
	onAction,
	children,
}: {
	title: string;
	action?: string;
	onAction?: () => void;
	children: React.ReactNode;
}) {
	return (
		<div className='rounded-3xl border border-dashed border-line bg-surface p-10 text-center text-muted shadow-sm'>
			<h2 className='mb-2 text-2xl font-medium text-ink'>{title}</h2>
			<p className='mx-auto max-w-md leading-7'>{children}</p>
			{action && onAction && (
				<button
					className='mt-4 inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-black text-white hover:bg-brand-strong'
					onClick={onAction}
					type='button'>
					{action}
				</button>
			)}
		</div>
	);
}
