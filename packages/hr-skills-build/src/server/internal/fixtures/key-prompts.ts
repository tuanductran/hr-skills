/**
 * Build a SKILL.md content string with a `## Key prompts` section containing
 * `subtopics` H3 sub-headings, each with `promptsEach` numbered quoted prompts.
 *
 * Used in unit tests to generate fixture content of a specific size without
 * manually crafting strings. Internal-only — imported directly by
 * `test/validation/validate.test.ts` from this file path, never re-exported
 * from the package's public entrypoints.
 *
 * @param subtopics - Number of H3 sub-heading blocks to generate.
 * @param promptsEach - Number of quoted prompts to generate under each sub-heading.
 * @returns A full SKILL.md string with valid frontmatter and the generated prompts section.
 */
export function makeKeyPromptsContent(subtopics: number, promptsEach: number): string {
	const blocks = Array.from({ length: subtopics }, (_, si) => {
		const prompts = Array.from(
			{ length: promptsEach },
			(_, pi) => `${pi + 1}. "Prompt ${si + 1}-${pi + 1} for [role]."`,
		).join('\n');
		return `### Subtopic ${si + 1}\n\n${prompts}`;
	});

	return [
		'---',
		'name: hr-test',
		'description: This is a sufficiently long description for validation purposes.',
		'metadata:',
		'  author: Tuan Duc Tran',
		'  version: "1.0.0"',
		'---',
		'',
		'## Key prompts',
		'',
		...blocks,
		'',
		'## Tips',
		'',
		'- Tip',
	].join('\n');
}
