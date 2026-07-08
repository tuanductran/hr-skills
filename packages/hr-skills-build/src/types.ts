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

export interface MarketplaceJson {
	name: string;
	description: string;
	plugins: Array<{
		name: string;
		source: string;
		description: string;
		skills: string[];
	}>;
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
