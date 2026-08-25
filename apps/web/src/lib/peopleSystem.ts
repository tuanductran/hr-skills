export const PEOPLE_SYSTEM_STAGES = [
	{
		id: 'diagnose',
		eyebrow: '01 · evidence before intervention',
		title: 'Diagnose the people system',
		statement:
			'Frame the decision, establish the baseline, and make the operating constraint explicit before choosing an intervention.',
		gate: 'Decision gate',
		gateText:
			'Name the decision owner, affected audience, baseline evidence, and the constraint that cannot be ignored.',
		outcomes: ['Decision brief', 'Evidence baseline', 'Risk and stakeholder map'],
		skills: [
			'hr-workforce-analytics',
			'hr-employee-listening',
			'hr-organization-network-analysis',
			'hr-consulting',
		],
	},
	{
		id: 'design',
		eyebrow: '02 · define the work',
		title: 'Design the work architecture',
		statement:
			'Translate the need into roles, capabilities, structure, and an accountable operating design.',
		gate: 'Design gate',
		gateText:
			'Agree on scope, role accountabilities, success measures, and the decision rights required to move forward.',
		outcomes: [
			'Role and capability model',
			'Workforce scenario',
			'Decision-rights map',
		],
		skills: [
			'hr-job-analysis',
			'hr-job-architecture',
			'hr-competency-management',
			'hr-workforce-planning',
		],
	},
	{
		id: 'attract',
		eyebrow: '03 · select with evidence',
		title: 'Attract and select',
		statement:
			'Build a consistent, inclusive path from role brief through sourcing, assessment, interviewing, and offer.',
		gate: 'Selection gate',
		gateText:
			'Keep criteria, candidate evidence, calibration, and ownership visible before a selection decision is made.',
		outcomes: [
			'Role brief',
			'Structured assessment plan',
			'Calibrated decision record',
		],
		skills: [
			'hr-talent-acquisition',
			'hr-candidate-sourcing',
			'hr-candidate-assessment',
			'hr-interviewing',
			'hr-offer-management',
		],
	},
	{
		id: 'activate',
		eyebrow: '04 · create a supported start',
		title: 'Onboard and activate',
		statement:
			'Turn an accepted offer into clear expectations, ready systems, and a supported entry into the organisation.',
		gate: 'Activation gate',
		gateText:
			'Confirm manager, team, systems access, learning path, and first-month plan are ready before day one.',
		outcomes: ['Preboarding plan', 'Manager readiness check', '30/60/90 day plan'],
		skills: [
			'hr-onboarding',
			'hr-employee-experience',
			'hr-employee-journey-mapping',
			'hr-manager-effectiveness',
		],
	},
	{
		id: 'develop',
		eyebrow: '05 · enable performance and growth',
		title: 'Develop and retain',
		statement:
			'Make feedback, mobility, rewards, learning, and career decisions observable and manager-owned.',
		gate: 'Growth gate',
		gateText:
			'Set the measure of progress, action owner, review cadence, and conditions for changing the approach.',
		outcomes: [
			'Capability plan',
			'Manager action loop',
			'Retention and mobility signals',
		],
		skills: [
			'hr-learning-development',
			'hr-career-development',
			'hr-internal-mobility',
			'hr-compensation-benefits',
			'hr-employee-engagement',
		],
	},
	{
		id: 'govern',
		eyebrow: '06 · operate with control',
		title: 'Operate and govern',
		statement:
			'Run reliable people operations with appropriate systems, policies, escalation paths, and accountable review.',
		gate: 'Operating gate',
		gateText:
			'Name the policy owner, operational metric, risk trigger, review cycle, and escalation route.',
		outcomes: ['Service model', 'Control and escalation map', 'Review cadence'],
		skills: [
			'hr-hris',
			'hr-compliance',
			'hr-employee-relations',
			'hr-ai-governance',
			'hr-ai-privacy',
		],
	},
] as const;

export type PeopleSystemStage = (typeof PEOPLE_SYSTEM_STAGES)[number];
