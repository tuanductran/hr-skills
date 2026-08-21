import * as v from 'valibot';

export const roleContextSchema = v.object({
	presetId: v.string(),
	title: v.pipe(v.string(), v.minLength(2, 'Add a job title.')),
	department: v.string(),
	reportsTo: v.string(),
	seniority: v.string(),
	employmentType: v.string(),
	workArrangement: v.string(),
	countryCode: v.pipe(v.string(), v.length(2)),
	languageTag: v.pipe(v.string(), v.minLength(2)),
	currencyCode: v.pipe(v.string(), v.length(3)),
});

export const listItemSchema = v.object({
	id: v.string(),
	text: v.string(),
	kind: v.picklist(['must-have', 'nice-to-have', 'responsibility']),
});

export const documentSchema = v.object({
	schemaVersion: v.literal('1.0'),
	documentId: v.string(),
	revisionId: v.string(),
	templateId: v.string(),
	templateVersion: v.string(),
	status: v.picklist(['draft', 'review', 'ready']),
	role: roleContextSchema,
	sections: v.object({
		opportunitySummary: v.string(),
		roleOverview: v.string(),
		responsibilities: v.array(listItemSchema),
		mustHaveQualifications: v.array(listItemSchema),
		niceToHaveQualifications: v.array(listItemSchema),
		successMeasures: v.array(v.string()),
		teamAndEnvironment: v.string(),
		compensationAndBenefits: v.string(),
		interviewProcess: v.string(),
		employerBrand: v.string(),
	}),
	validation: v.array(
		v.object({
			id: v.string(),
			section: v.string(),
			severity: v.picklist(['error', 'warning', 'suggestion']),
			message: v.string(),
			action: v.string(),
		}),
	),
	createdAt: v.string(),
	updatedAt: v.string(),
});

export type DocumentInput = v.InferOutput<typeof documentSchema>;
