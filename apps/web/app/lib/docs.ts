import {
	buildDocumentationData,
	buildRegistry,
	type DocumentationData,
	type DocumentationSkill,
	getRecommendations,
	type RecommendationResult,
	type Registry,
} from 'hr-skills-build';

let documentationDataPromise: Promise<DocumentationData> | undefined;
let registryPromise: Promise<Registry> | undefined;

/** Server-only access to canonical documentation generated from registry + Markdown. */
export function getDocumentationData(): Promise<DocumentationData> {
	documentationDataPromise ??= buildDocumentationData();
	return documentationDataPromise;
}

/** Server-only access to the canonical registry built by hr-skills-build. */
export function getRegistry(): Promise<Registry> {
	registryPromise ??= buildRegistry();
	return registryPromise;
}

export async function getDocumentationSkill(
	skillId: string,
): Promise<DocumentationSkill | undefined> {
	const data = await getDocumentationData();
	return data.skills.find((skill) => skill.id === skillId);
}

/** Delegate related-skill ranking and lookup to the package recommendation API. */
export async function getSkillRecommendations(
	skillId: string,
): Promise<RecommendationResult['recommendations']> {
	const registry = await getRegistry();
	return getRecommendations(skillId, registry, 5).recommendations;
}
