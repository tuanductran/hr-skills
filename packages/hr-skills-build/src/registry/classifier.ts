/**
 * Skill classifier for the HR Skills router.
 *
 * Given a skill name (e.g. "hr-recruiting"), returns:
 *  - `category`: which routing table section it belongs to in root SKILL.md
 *  - `tags`: optional extra tags used for cross-references
 *
 * This is the single source of truth for categorization. When a new skill
 * is added to skills/, `sync` calls `classifySkill()` to decide where it
 * goes in the router without manual edits.
 *
 * CATEGORY DEFINITIONS (in router order):
 *  talent-acquisition       — recruiting, sourcing, TA ops, assessment, offers
 *  onboarding-offboarding   — employee lifecycle ops, people ops, HR admin
 *  performance-talent       — perf management, succession, career, coaching
 *  compensation-rewards     — comp, benefits, job architecture, recognition
 *  learning-development     — L&D, training, leadership dev, skills
 *  org-design-change        — OD, change management, M&A, consulting
 *  workforce-analytics      — workforce planning, analytics, forecasting, budget
 *  hr-technology-ai         — HRIS, automation, GenAI, AI ethics, chatbots
 *  compliance-risk          — legal, labor relations, ER, risk, policy
 *  culture-experience       — culture, EX, engagement, wellbeing, DEI
 *  global-project           — global HR, Vietnam, project management
 *  technical-hiring         — engineering/design/product specialist skills
 */

export type SkillCategory =
	| 'talent-acquisition'
	| 'onboarding-offboarding'
	| 'performance-talent'
	| 'compensation-rewards'
	| 'learning-development'
	| 'org-design-change'
	| 'workforce-analytics'
	| 'hr-technology-ai'
	| 'compliance-risk'
	| 'culture-experience'
	| 'global-project'
	| 'technical-hiring'
	| 'uncategorized';

export interface SkillClassification {
	category: SkillCategory;
	tags: string[];
}

// ---------------------------------------------------------------------------
// Explicit overrides — highest priority, always wins.
// Add any skill that the prefix/keyword rules get wrong.
// ---------------------------------------------------------------------------

const EXPLICIT: Readonly<Record<string, SkillClassification>> = {
	// Talent acquisition
	'hr-recruiting': { category: 'talent-acquisition', tags: ['core'] },
	'hr-talent-acquisition': { category: 'talent-acquisition', tags: ['strategy'] },
	'hr-job-description': { category: 'talent-acquisition', tags: [] },
	'hr-job-analysis': { category: 'talent-acquisition', tags: [] },
	'hr-interviewing': { category: 'talent-acquisition', tags: [] },
	'hr-candidate-sourcing': { category: 'talent-acquisition', tags: [] },
	'hr-candidate-experience': { category: 'talent-acquisition', tags: [] },
	'hr-candidate-assessment': { category: 'talent-acquisition', tags: [] },
	'hr-social-recruiting': { category: 'talent-acquisition', tags: [] },
	'hr-employer-branding': { category: 'talent-acquisition', tags: [] },
	'hr-executive-search': { category: 'talent-acquisition', tags: [] },
	'hr-executive-assessment': { category: 'talent-acquisition', tags: [] },
	'hr-contingent-workforce': { category: 'talent-acquisition', tags: [] },
	'hr-demand-planning': { category: 'talent-acquisition', tags: [] },
	'hr-talent-supply-chain': { category: 'talent-acquisition', tags: [] },
	'hr-talent-intelligence': { category: 'talent-acquisition', tags: [] },
	'hr-market-mapping': { category: 'talent-acquisition', tags: [] },
	'hr-talent-mapping': { category: 'talent-acquisition', tags: [] },
	'hr-passive-candidate-engagement': { category: 'talent-acquisition', tags: [] },
	'hr-search-strategy': { category: 'talent-acquisition', tags: [] },
	'hr-retained-search': { category: 'talent-acquisition', tags: [] },
	'hr-reference-checking': { category: 'talent-acquisition', tags: [] },
	'hr-offer-management': { category: 'talent-acquisition', tags: [] },
	'hr-recruitment-operations': { category: 'talent-acquisition', tags: [] },
	'hr-recruitment-marketing': { category: 'talent-acquisition', tags: [] },
	'hr-talent-crm': { category: 'talent-acquisition', tags: [] },

	// Onboarding / offboarding / people ops
	'hr-onboarding': { category: 'onboarding-offboarding', tags: [] },
	'hr-offboarding': { category: 'onboarding-offboarding', tags: [] },
	'hr-people-operations': { category: 'onboarding-offboarding', tags: [] },
	'hr-coordination': { category: 'onboarding-offboarding', tags: [] },
	'hr-employee-self-service': { category: 'onboarding-offboarding', tags: [] },
	'hr-service-delivery': { category: 'onboarding-offboarding', tags: [] },
	'hr-shared-services': { category: 'onboarding-offboarding', tags: [] },
	'hr-operating-model': { category: 'onboarding-offboarding', tags: [] },
	'hr-management': { category: 'onboarding-offboarding', tags: [] },
	'hr-employee-lifecycle': { category: 'onboarding-offboarding', tags: [] },
	'hr-vendor-management': { category: 'onboarding-offboarding', tags: [] },

	// Performance / talent / career
	'hr-performance-management': { category: 'performance-talent', tags: [] },
	'hr-performance-review': { category: 'performance-talent', tags: [] },
	'hr-talent-management': { category: 'performance-talent', tags: [] },
	'hr-succession-planning': { category: 'performance-talent', tags: [] },
	'hr-career-development': { category: 'performance-talent', tags: [] },
	'hr-competency-management': { category: 'performance-talent', tags: [] },
	'hr-manager-effectiveness': { category: 'performance-talent', tags: [] },
	'hr-coaching-mentoring': { category: 'performance-talent', tags: [] },
	'hr-people-leadership': { category: 'performance-talent', tags: [] },
	'hr-business-partner': { category: 'performance-talent', tags: [] },

	// Compensation / rewards
	'hr-compensation-benefits': { category: 'compensation-rewards', tags: [] },
	'hr-total-rewards': { category: 'compensation-rewards', tags: [] },
	'hr-job-architecture': { category: 'compensation-rewards', tags: [] },
	'hr-recognition': { category: 'compensation-rewards', tags: [] },
	'hr-salary-benchmarking': { category: 'compensation-rewards', tags: [] },
	'hr-retirement-benefits': { category: 'compensation-rewards', tags: [] },

	// Learning / development
	'hr-training-development': { category: 'learning-development', tags: [] },
	'hr-learning-development': { category: 'learning-development', tags: [] },
	'hr-learning-strategy': { category: 'learning-development', tags: [] },
	'hr-leadership-development': { category: 'learning-development', tags: [] },
	'hr-workforce-capability': { category: 'learning-development', tags: [] },
	'hr-skills-management': { category: 'learning-development', tags: [] },
	'hr-skills-taxonomy': { category: 'learning-development', tags: [] },

	// Org design / change
	'hr-organizational-development': { category: 'org-design-change', tags: [] },
	'hr-organization-effectiveness': { category: 'org-design-change', tags: [] },
	'hr-organizational-design': { category: 'org-design-change', tags: [] },
	'hr-change-management': { category: 'org-design-change', tags: [] },
	'hr-change-communication': { category: 'org-design-change', tags: [] },
	'hr-design-thinking': { category: 'org-design-change', tags: [] },
	'hr-consulting': { category: 'org-design-change', tags: [] },
	'hr-strategic-planning': { category: 'org-design-change', tags: [] },
	'hr-workforce-transformation': { category: 'org-design-change', tags: [] },
	'hr-crisis-management': { category: 'org-design-change', tags: [] },
	'hr-mergers-acquisitions': { category: 'org-design-change', tags: [] },
	'hr-post-merger-integration': { category: 'org-design-change', tags: [] },
	'hr-ma-integration-by-country': { category: 'org-design-change', tags: [] },

	// Workforce planning / analytics
	'hr-workforce-planning': { category: 'workforce-analytics', tags: [] },
	'hr-analytics': { category: 'workforce-analytics', tags: [] },
	'hr-kpi': { category: 'workforce-analytics', tags: [] },
	'hr-workforce-intelligence': { category: 'workforce-analytics', tags: [] },
	'hr-workforce-scheduling': { category: 'workforce-analytics', tags: [] },
	'hr-time-attendance': { category: 'workforce-analytics', tags: [] },
	'hr-skills-intelligence': { category: 'workforce-analytics', tags: [] },
	'hr-workforce-scenario-planning': { category: 'workforce-analytics', tags: [] },
	'hr-strategic-workforce-planning': { category: 'workforce-analytics', tags: [] },
	'hr-workforce-economics': { category: 'workforce-analytics', tags: [] },
	'hr-people-budgeting': { category: 'workforce-analytics', tags: [] },
	'hr-organization-network-analysis': { category: 'workforce-analytics', tags: [] },
	'hr-workforce-forecasting': { category: 'workforce-analytics', tags: [] },
	'hr-predictive-analytics': { category: 'workforce-analytics', tags: [] },

	// HR technology / AI
	'hr-technology': { category: 'hr-technology-ai', tags: [] },
	'hr-hris': { category: 'hr-technology-ai', tags: [] },
	'hr-digital-hr': { category: 'hr-technology-ai', tags: [] },
	'hr-automation': { category: 'hr-technology-ai', tags: [] },
	'hr-knowledge-management': { category: 'hr-technology-ai', tags: [] },
	'hr-genai': { category: 'hr-technology-ai', tags: ['ai'] },
	'hr-prompt-engineering': { category: 'hr-technology-ai', tags: ['ai'] },
	'hr-ai-governance': { category: 'hr-technology-ai', tags: ['ai'] },
	'hr-ai-ethics': { category: 'hr-technology-ai', tags: ['ai'] },
	'hr-ai-privacy': { category: 'hr-technology-ai', tags: ['ai'] },
	'hr-ai-change-management': { category: 'hr-technology-ai', tags: ['ai'] },
	'hr-agentic-ai': { category: 'hr-technology-ai', tags: ['ai'] },
	'hr-ai-evaluation': { category: 'hr-technology-ai', tags: ['ai'] },
	'hr-ai-adoption': { category: 'hr-technology-ai', tags: ['ai'] },
	'hr-system-integration': { category: 'hr-technology-ai', tags: [] },
	'hr-chatbot-design': { category: 'hr-technology-ai', tags: [] },

	// Compliance / risk
	'hr-compliance': { category: 'compliance-risk', tags: [] },
	'hr-labor-relations': { category: 'compliance-risk', tags: [] },
	'hr-employee-relations': { category: 'compliance-risk', tags: [] },
	'hr-conflict-resolution': { category: 'compliance-risk', tags: [] },
	'hr-risk-management': { category: 'compliance-risk', tags: [] },
	'hr-audit': { category: 'compliance-risk', tags: [] },
	'hr-policy-management': { category: 'compliance-risk', tags: [] },
	'hr-immigration': { category: 'compliance-risk', tags: [] },
	'hr-payroll': { category: 'compliance-risk', tags: [] },
	'hr-accessibility-accommodation': { category: 'compliance-risk', tags: [] },

	// Culture / EX / engagement / wellbeing
	'hr-culture': { category: 'culture-experience', tags: [] },
	'hr-employee-engagement': { category: 'culture-experience', tags: [] },
	'hr-employee-experience': { category: 'culture-experience', tags: [] },
	'hr-employee-listening': { category: 'culture-experience', tags: [] },
	'hr-diversity-inclusion': { category: 'culture-experience', tags: [] },
	'hr-wellbeing': { category: 'culture-experience', tags: [] },
	'hr-future-of-work': { category: 'culture-experience', tags: [] },
	'hr-internal-mobility': { category: 'culture-experience', tags: [] },
	'hr-employee-journey-mapping': { category: 'culture-experience', tags: [] },
	'hr-employee-communications': { category: 'culture-experience', tags: [] },

	// Global / project
	'hr-project-management': { category: 'global-project', tags: [] },
	'hr-global-hr': { category: 'global-project', tags: [] },
	'hr-global-expansion': { category: 'global-project', tags: [] },
	'hr-vietnam-context': { category: 'global-project', tags: ['vietnam', 'core'] },

	// Technical hiring specialists
	'hr-frontend': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-backend': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-fullstack': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-mobile': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-devops': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-cloud': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-qa': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-security': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-data': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-ai': { category: 'technical-hiring', tags: ['engineering', 'ai'] },
	'hr-uiux': { category: 'technical-hiring', tags: ['design'] },
	'hr-product-management': { category: 'technical-hiring', tags: [] },
	'hr-system-design': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-software-architecture': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-blockchain': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-embedded': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-iot': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-ar-vr': { category: 'technical-hiring', tags: ['engineering'] },
	'hr-game-development': { category: 'technical-hiring', tags: ['engineering'] },
};

// ---------------------------------------------------------------------------
// Keyword fallback rules — applied when EXPLICIT has no entry.
// Order matters: first match wins.
// ---------------------------------------------------------------------------

type KeywordRule = {
	keywords: string[];
	classification: SkillClassification;
};

const KEYWORD_RULES: ReadonlyArray<KeywordRule> = [
	// Technical hiring — check before generic TA rules
	{
		keywords: [
			'frontend',
			'backend',
			'fullstack',
			'mobile',
			'devops',
			'cloud',
			'qa',
			'security',
			'blockchain',
			'embedded',
			'iot',
			'ar-vr',
			'game-development',
			'software-architecture',
			'system-design',
			'uiux',
			'product-management',
		],
		classification: { category: 'technical-hiring', tags: ['engineering'] },
	},
	// AI / GenAI
	{
		keywords: ['ai-', 'genai', 'agentic', 'llm', 'prompt'],
		classification: { category: 'hr-technology-ai', tags: ['ai'] },
	},
	// Recruiting / TA
	{
		keywords: [
			'recruit',
			'talent-acq',
			'candidate',
			'sourcing',
			'interviewing',
			'search',
			'offer',
			'job-description',
			'job-analysis',
			'employer-brand',
		],
		classification: { category: 'talent-acquisition', tags: [] },
	},
	// Workforce analytics
	{
		keywords: [
			'workforce',
			'analytics',
			'forecasting',
			'planning',
			'budgeting',
			'economics',
			'kpi',
			'metrics',
			'predictive',
			'intelligence',
		],
		classification: { category: 'workforce-analytics', tags: [] },
	},
	// Org design / change
	{
		keywords: [
			'organizational',
			'org-design',
			'change-management',
			'change-communication',
			'mergers',
			'integration',
			'transformation',
			'consulting',
			'strategic-planning',
		],
		classification: { category: 'org-design-change', tags: [] },
	},
	// Compliance
	{
		keywords: [
			'compliance',
			'labor',
			'payroll',
			'audit',
			'risk',
			'policy',
			'immigration',
			'accessibility',
			'relations',
		],
		classification: { category: 'compliance-risk', tags: [] },
	},
	// L&D
	{
		keywords: ['learning', 'training', 'development', 'capability', 'skills-'],
		classification: { category: 'learning-development', tags: [] },
	},
	// People ops / onboarding
	{
		keywords: [
			'onboard',
			'offboard',
			'people-ops',
			'service-delivery',
			'shared-services',
			'hr-coordination',
			'employee-lifecycle',
			'vendor',
		],
		classification: { category: 'onboarding-offboarding', tags: [] },
	},
	// Culture / EX
	{
		keywords: [
			'culture',
			'engagement',
			'experience',
			'wellbeing',
			'diversity',
			'inclusion',
			'future-of-work',
			'communications',
			'journey',
			'listening',
		],
		classification: { category: 'culture-experience', tags: [] },
	},
	// Compensation
	{
		keywords: [
			'compensation',
			'total-rewards',
			'salary',
			'benefits',
			'recognition',
			'retirement',
			'job-architecture',
		],
		classification: { category: 'compensation-rewards', tags: [] },
	},
	// Performance / talent management
	{
		keywords: [
			'performance',
			'succession',
			'career',
			'competency',
			'manager',
			'coaching',
			'mentoring',
			'leadership',
			'talent-management',
		],
		classification: { category: 'performance-talent', tags: [] },
	},
	// HR tech
	{
		keywords: [
			'hris',
			'technology',
			'automation',
			'digital',
			'chatbot',
			'system',
			'integration',
			'knowledge-management',
		],
		classification: { category: 'hr-technology-ai', tags: [] },
	},
	// Global / Vietnam
	{
		keywords: ['global', 'vietnam', 'project-management', 'expansion'],
		classification: { category: 'global-project', tags: [] },
	},
];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Classify a skill by name into a category and tag set.
 *
 * Resolution order:
 *  1. EXPLICIT override map (exact match)
 *  2. KEYWORD_RULES (substring scan, first match wins)
 *  3. 'uncategorized' fallback
 */
export function classifySkill(skillName: string): SkillClassification {
	// 1. Explicit override
	if (skillName in EXPLICIT) {
		return EXPLICIT[skillName] as SkillClassification;
	}

	// 2. Keyword rules — strip common prefix to get the slug
	const slug = skillName.replace(/^hr-/, '');

	for (const rule of KEYWORD_RULES) {
		if (rule.keywords.some((kw) => slug.includes(kw))) {
			return rule.classification;
		}
	}

	// 3. Fallback
	return { category: 'uncategorized', tags: [] };
}

// ---------------------------------------------------------------------------
// Category metadata — human-readable section headers and descriptions used
// when generating the routing table in root SKILL.md
// ---------------------------------------------------------------------------

export interface CategoryMeta {
	heading: string;
	description?: string;
	/** If true, adds a preamble note below the table */
	preamble?: string;
}

export const CATEGORY_META: Readonly<
	Record<Exclude<SkillCategory, 'uncategorized'>, CategoryMeta>
> = {
	'talent-acquisition': {
		heading: 'Talent acquisition & recruiting',
	},
	'onboarding-offboarding': {
		heading: 'Onboarding, offboarding & people operations',
	},
	'performance-talent': {
		heading: 'Performance, talent & career management',
	},
	'compensation-rewards': {
		heading: 'Compensation, benefits & rewards',
	},
	'learning-development': {
		heading: 'Learning & development',
	},
	'org-design-change': {
		heading: 'Organizational development, design & change',
	},
	'workforce-analytics': {
		heading: 'Workforce planning & analytics',
	},
	'hr-technology-ai': {
		heading: 'HR technology, data & AI',
	},
	'compliance-risk': {
		heading: 'Compliance, labor relations & risk',
	},
	'culture-experience': {
		heading: 'Culture, engagement, experience & wellbeing',
	},
	'global-project': {
		heading: 'Project management & global/local context',
	},
	'technical-hiring': {
		heading: 'Software-engineering & technical hiring specialists',
		preamble:
			'Use these together with [hr-recruiting](skills/hr-recruiting), [hr-job-description](skills/hr-job-description), or [hr-interviewing](skills/hr-interviewing)\nwhen the role being hired is technical.',
	},
};
