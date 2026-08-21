import { safeParse } from 'valibot';
import { documentSchema } from '#shared/utils/jd-schema';

export default defineEventHandler(async (event) => {
	const body = await readBody(event);
	const parsed = safeParse(documentSchema, body);

	if (!parsed.success) {
		setResponseStatus(400);
		return {
			ok: false,
			findings: parsed.issues.map((issue, index) => ({
				id: `schema-${index + 1}`,
				section:
					issue.path?.map((item) => String(item.key)).join('.') || 'document',
				severity: 'error',
				message: issue.message,
				action: 'Complete this field before exporting.',
			})),
		};
	}

	const document = parsed.output;
	const findings = [];
	if (!document.sections.opportunitySummary.trim()) {
		findings.push({
			id: 'opportunity-summary',
			section: 'opportunitySummary',
			severity: 'warning',
			message: 'Lead with the opportunity and business impact.',
			action: 'Open section',
		});
	}
	if (!document.sections.responsibilities.length) {
		findings.push({
			id: 'responsibilities',
			section: 'responsibilities',
			severity: 'error',
			message: 'Add at least one outcome-oriented responsibility.',
			action: 'Add responsibility',
		});
	}
	if (!document.sections.compensationAndBenefits.trim()) {
		findings.push({
			id: 'compensation',
			section: 'compensationAndBenefits',
			severity: 'suggestion',
			message: 'Consider adding compensation transparency or a clear policy note.',
			action: 'Review section',
		});
	}

	return { ok: findings.every((finding) => finding.severity !== 'error'), findings };
});
