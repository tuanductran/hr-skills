import type { RegistryEntry, SkillCategory } from '../shared/types.js';

/** A Markdown file associated with a skill, preserved in stable filename order. */
export interface DocumentationSection {
	readonly fileName: string;
	readonly markdown: string;
}

/** A registry entry enriched with the source Markdown needed for the public site. */
export interface DocumentationSkill extends RegistryEntry {
	readonly displayName: string;
	readonly content: string;
	readonly prompts: readonly DocumentationSection[];
	readonly examples: readonly DocumentationSection[];
}

/** A stable catalog grouping derived from the canonical registry domain. */
export interface DocumentationDomain {
	readonly id: SkillCategory;
	readonly label: string;
	readonly skillCount: number;
}

/** The generated, app-consumable public documentation artifact. */
export interface DocumentationData {
	readonly schemaVersion: 1;
	readonly generatedAt: string;
	readonly skillCount: number;
	readonly domains: readonly DocumentationDomain[];
	readonly skills: readonly DocumentationSkill[];
}
