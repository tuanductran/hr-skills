export { loadRegistry } from './loader.ts';
export { autocompleteSkills, findSkillById, pickRandomSkill } from './queries.ts';

// Re-exported directly from `hr-skills-build/client` so every command uses
// the exact same search, recommendation, and planning behavior as the CLI
// and the web app — including their error types, which commands should
// catch instead of letting them fall through to a generic error reply.
export type { ExecutionPlan, Registry, RegistryEntry } from 'hr-skills-build/client';
export {
	generateExecutionPlan,
	getRecommendations,
	InvalidSearchQueryError,
	searchSkills,
	UnknownSkillError,
} from 'hr-skills-build/client';
