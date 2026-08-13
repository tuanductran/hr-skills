import type { DocumentationData, DocumentationSkill } from 'hr-skills-build';
import documentationData from '../../data/skills.json';

const data = documentationData as DocumentationData;
const skillsById = new Map(data.skills.map((skill) => [skill.id, skill]));

export function getDocumentationData(): DocumentationData {
	return data;
}

export function getDocumentationSkill(skillId: string): DocumentationSkill | undefined {
	return skillsById.get(skillId);
}

export function requireDocumentationSkill(skillId: string): DocumentationSkill {
	const skill = getDocumentationSkill(skillId);
	if (!skill) throw new Error(`Unknown documentation skill: ${skillId}`);
	return skill;
}
