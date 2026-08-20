import * as v from 'valibot';

const text = (label: string, max = 240) =>
	v.pipe(
		v.string(),
		v.trim(),
		v.maxLength(max, `${label} must be ${max} characters or fewer`),
	);
const requiredText = (label: string, max = 240) =>
	v.pipe(text(label, max), v.nonEmpty(`${label} is required`));
const list = (label: string, max = 20) =>
	v.pipe(
		v.array(requiredText(label)),
		v.maxLength(max, `Add at most ${max} ${label.toLowerCase()} items`),
	);

export const employmentTypes = [
	'Full-time',
	'Part-time',
	'Contract',
	'Internship',
	'Freelance',
] as const;
export const sectionKeys = [
	'summary',
	'experience',
	'education',
	'skills',
	'projects',
	'languages',
] as const;

export const experienceSchema = v.object({
	id: requiredText('Experience id', 80),
	role: requiredText('Role'),
	company: requiredText('Company'),
	location: text('Location'),
	employmentType: v.picklist(employmentTypes),
	startDate: requiredText('Start date', 40),
	endDate: text('End date', 40),
	current: v.boolean(),
	highlights: list('Achievement', 8),
});

export const educationSchema = v.object({
	id: requiredText('Education id', 80),
	degree: requiredText('Degree'),
	institution: requiredText('Institution'),
	location: text('Location'),
	startDate: text('Start date', 40),
	endDate: text('End date', 40),
	details: list('Education detail', 5),
});

export const projectSchema = v.object({
	id: requiredText('Project id', 80),
	name: requiredText('Project name'),
	description: text('Project description', 600),
	url: text('Project URL', 240),
	technologies: list('Technology', 10),
});

export const languageSchema = v.object({
	id: requiredText('Language id', 80),
	name: requiredText('Language'),
	level: requiredText('Level', 80),
});

export const cvSchema = v.object({
	fullName: requiredText('Full name'),
	headline: requiredText('Headline', 180),
	email: text('Email', 180),
	phone: text('Phone', 80),
	location: text('Location'),
	website: text('Website', 240),
	linkedin: text('LinkedIn', 240),
	summary: text('Summary', 1600),
	experience: v.array(experienceSchema),
	education: v.array(educationSchema),
	skills: list('Skill', 30),
	projects: v.array(projectSchema),
	languages: v.array(languageSchema),
	sectionOrder: v.pipe(
		v.array(v.picklist(sectionKeys)),
		v.minLength(1),
		v.maxLength(sectionKeys.length),
	),
});

export type CvDraft = v.InferInput<typeof cvSchema>;
export type CvDocument = v.InferOutput<typeof cvSchema>;
export type SectionKey = (typeof sectionKeys)[number];

export type ReviewFlag = {
	code: string;
	tone: 'warning' | 'info';
	title: string;
	detail: string;
	field?: string;
};

export const defaultCvDraft: CvDraft = {
	fullName: 'Alex Morgan',
	headline: 'People Operations Partner',
	email: 'alex.morgan@example.com',
	phone: '+84 90 000 0000',
	location: 'Ho Chi Minh City, Vietnam',
	website: 'https://example.com',
	linkedin: 'https://linkedin.com/in/alex-morgan',
	summary:
		'People operations partner who turns complex employee experiences into clear, inclusive and measurable programs.',
	experience: [
		{
			id: 'experience-1',
			role: 'People Operations Partner',
			company: 'Northstar Labs',
			location: 'Ho Chi Minh City',
			employmentType: 'Full-time',
			startDate: '2023',
			endDate: '',
			current: true,
			highlights: [
				'Built scalable people programs across the employee lifecycle.',
				'Partnered with leaders to improve employee experience and decision quality.',
			],
		},
	],
	education: [
		{
			id: 'education-1',
			degree: 'Bachelor of Business Administration',
			institution: 'University of Economics',
			location: 'Ho Chi Minh City',
			startDate: '2015',
			endDate: '2019',
			details: ['Focus on organizational behavior and human resources.'],
		},
	],
	skills: [
		'People operations',
		'Program management',
		'Stakeholder communication',
		'HR analytics',
	],
	projects: [],
	languages: [
		{ id: 'language-1', name: 'English', level: 'Professional working proficiency' },
	],
	sectionOrder: [...sectionKeys],
};

export type CvDraftEnvelope = {
	id: string;
	title: string;
	status: 'draft' | 'ready_for_review' | 'published';
	version: number;
	data: CvDraft;
	createdAt: string;
	updatedAt: string;
	archivedAt: string | null;
};

export function reviewFlags(draft: CvDraft): ReviewFlag[] {
	const flags: ReviewFlag[] = [];
	const allText = [
		draft.headline,
		draft.summary,
		...draft.skills,
		...draft.experience.flatMap((item) => item.highlights),
	]
		.join(' ')
		.toLowerCase();
	if (!draft.summary || draft.summary.length < 80) {
		flags.push({
			code: 'short-summary',
			tone: 'warning',
			title: 'Strengthen the summary',
			detail: 'A concise summary helps readers understand your focus before they scan the timeline.',
			field: 'summary',
		});
	}
	if (!draft.experience.length) {
		flags.push({
			code: 'no-experience',
			tone: 'warning',
			title: 'Add experience',
			detail: 'Include at least one role, project or meaningful contribution.',
			field: 'experience',
		});
	}
	if (draft.skills.length < 4) {
		flags.push({
			code: 'few-skills',
			tone: 'info',
			title: 'Add more skills',
			detail: 'Four to eight focused skills usually make the profile easier to scan.',
			field: 'skills',
		});
	}
	if (
		allText.includes('hard worker') ||
		allText.includes('rockstar') ||
		allText.includes('ninja')
	) {
		flags.push({
			code: 'generic-language',
			tone: 'warning',
			title: 'Replace generic language',
			detail: 'Prefer observable capabilities, scope and outcomes over broad labels.',
			field: 'summary',
		});
	}
	return flags;
}

export function slugify(value: string) {
	return (
		value
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/(^-|-$)/g, '') || 'curriculum-vitae'
	);
}

export function toMarkdown(draft: CvDocument) {
	const sections = [
		`# ${draft.fullName}\n\n**${draft.headline}**\n\n${[draft.email, draft.phone, draft.location, draft.website, draft.linkedin].filter(Boolean).join(' · ')}\n\n## Profile\n\n${draft.summary}`,
	];
	if (draft.experience.length)
		sections.push(
			`## Experience\n\n${draft.experience.map((item) => `### ${item.role} — ${item.company}\n\n${item.startDate} – ${item.current ? 'Present' : item.endDate}\n\n${item.highlights.map((highlight) => `- ${highlight}`).join('\n')}`).join('\n\n')}`,
		);
	if (draft.education.length)
		sections.push(
			`## Education\n\n${draft.education.map((item) => `### ${item.degree} — ${item.institution}\n\n${item.startDate} – ${item.endDate}\n\n${item.details.map((detail) => `- ${detail}`).join('\n')}`).join('\n\n')}`,
		);
	sections.push(`## Skills\n\n${draft.skills.map((skill) => `- ${skill}`).join('\n')}`);
	if (draft.projects.length)
		sections.push(
			`## Projects\n\n${draft.projects.map((item) => `### ${item.name}\n\n${item.description}\n\n${item.technologies.join(' · ')}${item.url ? `\n\n${item.url}` : ''}`).join('\n\n')}`,
		);
	if (draft.languages.length)
		sections.push(
			`## Languages\n\n${draft.languages.map((item) => `- ${item.name}: ${item.level}`).join('\n')}`,
		);
	return `${sections.join('\n\n')}\n`;
}
