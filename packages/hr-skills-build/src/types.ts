export interface SkillCatalogEntry {
	name: string;
	description: string;
	author: string;
	version: string;
	supportedTasks: string[];
}

export interface SkillDirectoryOptions {
	readonly prefix?: string;
	readonly sort?: boolean;
}

export interface SkillMeta {
	name: string;
	description: string;
	coverage: string;
	scopeSentence: string;
	triggerPhrases: string[];
	supportedTasks: string[];
}

export interface SkillFrontmatter {
	name?: string;
	description?: string;
	metadata?: {
		author?: string;
		version?: string;
	};
}

export interface ValidationError {
	skill: string;
	message: string;
}
