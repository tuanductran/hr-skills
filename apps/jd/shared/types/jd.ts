export type Seniority =
	| 'entry'
	| 'mid'
	| 'senior'
	| 'lead'
	| 'manager'
	| 'director'
	| 'executive'
	| 'custom';

export type EmploymentType =
	| 'full-time'
	| 'part-time'
	| 'contract'
	| 'temporary'
	| 'internship'
	| 'custom';

export type WorkArrangement = 'remote' | 'hybrid' | 'on-site' | 'flexible';

export interface RoleContext {
	presetId: string;
	title: string;
	department: string;
	reportsTo: string;
	seniority: Seniority;
	employmentType: EmploymentType;
	workArrangement: WorkArrangement;
	countryCode: string;
	languageTag: string;
	currencyCode: string;
}

export interface ListItem {
	id: string;
	text: string;
	kind: 'must-have' | 'nice-to-have' | 'responsibility';
}

export interface JobDescriptionSections {
	opportunitySummary: string;
	roleOverview: string;
	responsibilities: ListItem[];
	mustHaveQualifications: ListItem[];
	niceToHaveQualifications: ListItem[];
	successMeasures: string[];
	teamAndEnvironment: string;
	compensationAndBenefits: string;
	interviewProcess: string;
	employerBrand: string;
}

export interface ValidationFinding {
	id: string;
	section: keyof JobDescriptionSections | 'role';
	severity: 'error' | 'warning' | 'suggestion';
	message: string;
	action: string;
}

export interface JobDescriptionDocument {
	schemaVersion: '1.0';
	documentId: string;
	revisionId: string;
	templateId: string;
	templateVersion: string;
	status: 'draft' | 'review' | 'ready';
	role: RoleContext;
	sections: JobDescriptionSections;
	validation: ValidationFinding[];
	createdAt: string;
	updatedAt: string;
}

export interface RolePreset {
	id: string;
	label: string;
	department: string;
	description: string;
	suggestedResponsibilities: string[];
	suggestedMustHaves: string[];
}

export const rolePresets: RolePreset[] = [
	{
		id: 'recruiter',
		label: 'Recruiter',
		department: 'Talent Acquisition',
		description:
			'Own sourcing, structured hiring processes, and candidate experience.',
		suggestedResponsibilities: [
			'Lead full-cycle recruiting for assigned roles.',
			'Partner with hiring managers on structured intake and interview plans.',
			'Maintain a clear, inclusive candidate experience from outreach to offer.',
		],
		suggestedMustHaves: [
			'Experience managing end-to-end recruitment processes.',
			'Strong stakeholder communication and structured interviewing skills.',
		],
	},
	{
		id: 'talent-acquisition-specialist',
		label: 'Talent Acquisition Specialist',
		department: 'Talent Acquisition',
		description:
			'Build a qualified pipeline and improve hiring operations with evidence.',
		suggestedResponsibilities: [
			'Build diverse candidate pipelines through targeted sourcing strategies.',
			'Coordinate interviews and keep candidates informed at every stage.',
		],
		suggestedMustHaves: [
			'Experience with sourcing, screening, and applicant tracking systems.',
			'Clear written communication and strong operational follow-through.',
		],
	},
	{
		id: 'hr-business-partner',
		label: 'HR Business Partner',
		department: 'People',
		description:
			'Connect people strategy, manager effectiveness, and business outcomes.',
		suggestedResponsibilities: [
			'Advise leaders on people priorities aligned with business goals.',
			'Use people insights to improve manager and employee outcomes.',
		],
		suggestedMustHaves: [
			'Experience advising leaders on people programs and organizational change.',
			'Ability to turn qualitative and quantitative signals into action.',
		],
	},
];

export function createEmptyDocument(presetId = 'recruiter'): JobDescriptionDocument {
	const now = new Date().toISOString();
	const preset = rolePresets.find((item) => item.id === presetId) ?? rolePresets[0]!;
	const responsibilities = preset.suggestedResponsibilities.map((text, index) => ({
		id: `responsibility-${index + 1}`,
		text,
		kind: 'responsibility' as const,
	}));
	const mustHaveQualifications = preset.suggestedMustHaves.map((text, index) => ({
		id: `must-have-${index + 1}`,
		text,
		kind: 'must-have' as const,
	}));

	return {
		schemaVersion: '1.0',
		documentId: `jd-${Date.now()}`,
		revisionId: `revision-${Date.now()}`,
		templateId: 'inclusive-modern-jd',
		templateVersion: '1.0.0',
		status: 'draft',
		role: {
			presetId: preset.id,
			title: preset.label,
			department: preset.department,
			reportsTo: '',
			seniority: 'senior',
			employmentType: 'full-time',
			workArrangement: 'hybrid',
			countryCode: 'US',
			languageTag: 'en-US',
			currencyCode: 'USD',
		},
		sections: {
			opportunitySummary: '',
			roleOverview: '',
			responsibilities,
			mustHaveQualifications,
			niceToHaveQualifications: [],
			successMeasures: [],
			teamAndEnvironment: '',
			compensationAndBenefits: '',
			interviewProcess: '',
			employerBrand: '',
		},
		validation: [],
		createdAt: now,
		updatedAt: now,
	};
}
