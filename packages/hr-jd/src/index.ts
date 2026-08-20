import * as v from 'valibot';

export const employmentTypes = [
	'Full-time',
	'Part-time',
	'Contract',
	'Internship',
] as const;
export const workArrangements = ['On-site', 'Hybrid', 'Remote'] as const;
export const seniorities = ['Entry', 'Mid-level', 'Senior', 'Lead', 'Principal'] as const;

const nonEmptyText = (label: string) =>
	v.pipe(
		v.string(),
		v.trim(),
		v.nonEmpty(`${label} is required`),
		v.maxLength(240, `${label} must be 240 characters or fewer`),
	);

export const jdSchema = v.object({
	title: nonEmptyText('Job title'),
	department: nonEmptyText('Department'),
	location: nonEmptyText('Location'),
	employmentType: v.picklist(employmentTypes),
	workArrangement: v.picklist(workArrangements),
	seniority: v.picklist(seniorities),
	summary: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(80, 'Summary should be at least 80 characters'),
		v.maxLength(2000, 'Summary must be 2000 characters or fewer'),
	),
	responsibilities: v.pipe(
		v.array(nonEmptyText('Responsibility')),
		v.minLength(1, 'Add at least one responsibility'),
		v.maxLength(20, 'Add at most 20 responsibilities'),
	),
	requiredSkills: v.pipe(
		v.array(nonEmptyText('Required skill')),
		v.minLength(1, 'Add at least one required skill'),
		v.maxLength(20, 'Add at most 20 required skills'),
	),
	preferredSkills: v.pipe(
		v.array(nonEmptyText('Preferred skill')),
		v.maxLength(20, 'Add at most 20 preferred skills'),
	),
	successMetrics: v.pipe(
		v.array(nonEmptyText('Success metric')),
		v.minLength(1, 'Add at least one success metric'),
		v.maxLength(20, 'Add at most 20 success metrics'),
	),
});

export type JdDraft = v.InferInput<typeof jdSchema>;
export type JdDocument = v.InferOutput<typeof jdSchema>;

export const defaultJdDraft: JdDraft = {
	title: 'Senior People Operations Partner',
	department: 'People & Culture',
	location: 'Ho Chi Minh City',
	employmentType: 'Full-time',
	workArrangement: 'Hybrid',
	seniority: 'Senior',
	summary:
		'Own high-impact people operations programs that make the employee experience clearer, fairer and easier to scale across a growing organization.',
	responsibilities: [
		'Design and improve people programs across the employee lifecycle.',
		'Partner with leaders to translate business needs into practical people solutions.',
		'Use qualitative and quantitative signals to improve employee experience.',
	],
	requiredSkills: [
		'People operations strategy',
		'Stakeholder communication',
		'Program management',
	],
	preferredSkills: ['HR analytics', 'Change management'],
	successMetrics: [
		'Program adoption and employee satisfaction',
		'Time-to-resolution for people requests',
	],
};

export type ReviewFlag = {
	code: string;
	tone: 'warning' | 'info';
	title: string;
	detail: string;
	field?: string;
};

export function reviewFlags(draft: JdDraft): ReviewFlag[] {
	const flags: ReviewFlag[] = [];
	const fullText = [draft.summary, ...draft.responsibilities, ...draft.requiredSkills]
		.join(' ')
		.toLowerCase();

	if (fullText.includes('rockstar') || fullText.includes('ninja')) {
		flags.push({
			code: 'coded-language',
			tone: 'warning',
			title: 'Avoid coded language',
			detail: 'Replace informal labels with observable capabilities and outcomes.',
			field: 'summary',
		});
	}

	if (draft.requiredSkills.length > 8) {
		flags.push({
			code: 'long-must-have-list',
			tone: 'info',
			title: 'Tighten the must-have list',
			detail: 'A shorter required-skill list can make the role easier to understand and assess.',
			field: 'requiredSkills',
		});
	}

	if (!draft.summary.toLowerCase().includes('you')) {
		flags.push({
			code: 'missing-candidate-context',
			tone: 'info',
			title: 'Add candidate context',
			detail: 'Explain what the person will own and how their work will make a difference.',
			field: 'summary',
		});
	}

	return flags;
}

export type JdDraftEnvelope = {
	id: string;
	title: string;
	status: 'draft' | 'ready_for_review' | 'published';
	version: number;
	data: JdDraft;
	createdAt: string;
	updatedAt: string;
	archivedAt: string | null;
};

export function slugify(value: string) {
	return (
		value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '') || 'job-description'
	);
}

export function toMarkdown(draft: JdDocument) {
	return `# ${draft.title}\n\n**${draft.department} · ${draft.location} · ${draft.workArrangement} · ${draft.employmentType}**\n\n## Summary\n\n${draft.summary}\n\n## Responsibilities\n\n${draft.responsibilities.map((item) => `- ${item}`).join('\n')}\n\n## Required skills\n\n${draft.requiredSkills.map((item) => `- ${item}`).join('\n')}\n\n## Preferred skills\n\n${draft.preferredSkills.length ? draft.preferredSkills.map((item) => `- ${item}`).join('\n') : '- None specified'}\n\n## Success signals\n\n${draft.successMetrics.map((item) => `- ${item}`).join('\n')}\n`;
}
