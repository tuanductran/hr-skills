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

export interface ValidationError {
	skill: string;
	message: string;
}
