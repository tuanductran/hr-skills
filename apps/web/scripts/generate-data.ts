import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDocumentationData } from 'hr-skills-build/server';

const indexPath = resolve(
	fileURLToPath(new URL('../public/data/hr-skills.json', import.meta.url)),
);
const detailsDirectory = resolve(
	fileURLToPath(new URL('../public/data/skills', import.meta.url)),
);
const documentation = await buildDocumentationData();
const generatedAt = new Date().toISOString();
const index = {
	...documentation,
	generatedAt,
	skills: documentation.skills.map(
		({ content: _content, prompts: _prompts, examples: _examples, ...skill }) =>
			skill,
	),
};

await mkdir(dirname(indexPath), { recursive: true });
await rm(detailsDirectory, { recursive: true, force: true });
await mkdir(detailsDirectory, { recursive: true });
await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
await Promise.all(
	documentation.skills.map((skill) =>
		writeFile(
			resolve(detailsDirectory, `${skill.id}.json`),
			`${JSON.stringify(skill, null, 2)}\n`,
			'utf8',
		),
	),
);

console.log(
	`Generated HR Skills index and ${documentation.skillCount} detail files → ${dirname(indexPath)}`,
);
