/**
 * Generates `docs/engineering/api.md` from the JSDoc comments and type signatures of the
 * public API surface exported by `src/index.ts`.
 *
 * This mirrors the approach used by Nextra's `nextra/tsdoc` module
 * (https://github.com/shuding/nextra/blob/main/packages/nextra/src/server/tsdoc/base.ts):
 * `ts-morph` is used to read each exported declaration's `Type` and JSDoc tags
 * directly from the TypeScript compiler, rather than re-deriving them by hand.
 * Nextra renders that structured output as MDX at Next.js build time via a
 * `<TSDoc definition={...} />` component; this repo has no MDX/Next.js
 * pipeline, so the same structured extraction is rendered to plain Markdown
 * instead and written straight to `docs/engineering/api.md`.
 *
 * The JSDoc tag vocabulary this script understands (`@param`, `@returns`,
 * `@throws`, `@remarks`, `@example`) follows the TSDoc standard
 * (https://github.com/microsoft/tsdoc) — the same tag set `ts-morph`/the
 * TypeScript compiler already parse out of doc comments, so no separate
 * TSDoc parser dependency is needed here.
 *
 * Run with: `bun run api-docs` (see package.json).
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ExportedDeclarations, Symbol as TsSymbol, Type } from 'ts-morph';
import { Project, SyntaxKind, ts } from 'ts-morph';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PACKAGE_ROOT = path.resolve(__dirname, '../..');
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '../..');
const OUT_FILE = path.join(REPO_ROOT, 'docs/engineering/api.md');
const PACKAGE_NAME = 'hr-skills-build';

/**
 * Section grouping and ordering, keyed by the source file (relative to
 * `src/`) each exported symbol is declared in. Mirrors the curated structure
 * of the hand-written `docs/engineering/api.md` this script replaces, so the generated
 * doc stays organized by domain rather than by raw declaration order.
 */
const SECTIONS: { title: string; files: string[] }[] = [
	{ title: 'Registry', files: ['registry/registry.ts'] },
	{ title: 'Documentation', files: ['docs/loader.ts', 'docs/types.ts'] },
	{ title: 'Discovery', files: ['registry/discovery.ts', 'registry/classifier.ts'] },
	{ title: 'Search', files: ['search/search.ts'] },
	{ title: 'Recommendations', files: ['search/recommendations.ts'] },
	{ title: 'Relevance Signals', files: ['search/relevance-signals.ts'] },
	{ title: 'Planner', files: ['planner/planner.ts'] },
	{
		title: 'Runtime',
		files: [
			'runtime/runtime.ts',
			'runtime/runtime-context.ts',
			'runtime/runtime-errors.ts',
			'runtime/runtime-events.ts',
			'runtime/runtime-retry.ts',
			'runtime/runtime-state.ts',
			'runtime/runtime-trace.ts',
		],
	},
	{
		title: 'Validation',
		files: [
			'validation/validate.ts',
			'validation/validate-planner.ts',
			'validation/validate-registry.ts',
		],
	},
	{ title: 'Security Validation', files: ['validation/security.ts'] },
	{ title: 'Semantic Validation', files: ['validation/semantic-validation.ts'] },
	{ title: 'Quality Scoring', files: ['validation/quality-scoring.ts'] },
	{ title: 'Duplicate Detection', files: ['validation/detect-duplicates.ts'] },
	{ title: 'Evaluation', files: ['evaluation/evaluate.ts'] },
	{ title: 'Evaluation Datasets', files: ['evaluation/evaluation-datasets.ts'] },
	{ title: 'Shared Utilities', files: ['shared/helpers.ts', 'shared/parser.ts'] },
	{ title: 'Constants', files: ['shared/constants.ts'] },
];

interface DocEntry {
	name: string;
	filePath: string;
	line: number;
	description: string;
	isFunction: boolean;
	signature: string;
	params: { name: string; description: string; optional: boolean }[];
	returns: string;
	throws: string;
}

const project = new Project({
	tsConfigFilePath: path.join(PACKAGE_ROOT, 'tsconfig.json'),
});

const compilerObject = project.getTypeChecker().compilerObject;

function getTags(symbol: TsSymbol): Record<string, string> {
	const tags: Record<string, string> = Object.create(null);
	for (const tag of symbol.getJsDocTags()) {
		const name = tag.getName();
		const value = ts.displayPartsToString(tag.getText());
		tags[name] = name in tags ? `${tags[name]}\n${value}` : value;
	}
	return tags;
}

function replaceJsDocLinks(md: string): string {
	return md.replaceAll(/\{@link (?<link>[^}]*)\}/g, '$1');
}

/**
 * `JSDocTag#getText()` returns the tag's raw source text, including the
 * ` * ` continuation-line prefix that block comments use for wrapped lines.
 * Strip that so multi-line `@param`/`@returns` text reads as normal prose.
 */
function stripJsDocLineMarkers(raw: string): string {
	return raw
		.split('\n')
		.map((line) => line.replace(/^\s*\*\s?/, ''))
		.join('\n')
		.trim();
}

function renderMarkdownProse(raw: string): string {
	return replaceJsDocLinks(stripJsDocLineMarkers(raw))
		.replaceAll(/\n[ \t]+(?=[*-]\s)/g, '\n')
		.replaceAll(' * ', ' \\* ');
}

function getFormattedType(t: Type): string {
	return t.getText(undefined, ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
}

/** Renders a function declaration's call signature as a one-line `ts` snippet, function-keyword style. */
function renderFunctionSignature(
	name: string,
	declaration: ExportedDeclarations,
): string {
	const declarationType = declaration.getType();
	const [signature] = declarationType.getCallSignatures();
	if (!signature) return '';
	const isAsync =
		declaration.isKind(SyntaxKind.FunctionDeclaration) &&
		declaration.isAsync !== undefined
			? declaration.asKindOrThrow(SyntaxKind.FunctionDeclaration).isAsync()
			: declaration.getText().includes('async ');
	const params = signature
		.getParameters()
		.map((param) => {
			const paramDecl = param.getDeclarations()[0];
			const optional =
				paramDecl?.asKind(SyntaxKind.Parameter)?.isOptional() ?? false;
			const paramType = paramDecl
				? project.getTypeChecker().getTypeOfSymbolAtLocation(param, paramDecl)
				: undefined;
			const typeText = paramType ? getFormattedType(paramType) : 'unknown';
			return `${param.getName()}${optional ? '?' : ''}: ${typeText}`;
		})
		.join(', ');
	const returnType = signature.getDeclaration().getSignature().getReturnType();
	return `${isAsync ? 'async ' : ''}function ${name}(${params}): ${getFormattedType(returnType)}`;
}

function buildEntry(
	name: string,
	declaration: ExportedDeclarations,
): DocEntry | undefined {
	const symbol = declaration.getSymbolOrThrow();
	const comment = symbol.compilerSymbol.getDocumentationComment(compilerObject);
	const description = renderMarkdownProse(ts.displayPartsToString(comment));
	const tags = getTags(symbol);

	const filePath = path
		.relative(
			path.join(PACKAGE_ROOT, 'src'),
			declaration.getSourceFile().getFilePath(),
		)
		.replaceAll('\\', '/');

	const declarationType = declaration.getType();
	const isFunction = declarationType.getCallSignatures().length > 0;

	const params: DocEntry['params'] = [];
	let signature = '';

	if (isFunction) {
		signature = renderFunctionSignature(name, declaration);
		const [callSig] = declarationType.getCallSignatures();

		// Read @param tags as structured JSDoc nodes (not the flattened
		// symbol-level tag string) so multi-line param descriptions survive
		// intact instead of being cut at the first newline.
		const paramDescByName = new Map<string, string>();
		const jsDocOwner = declaration.isKind(SyntaxKind.FunctionDeclaration)
			? declaration.asKindOrThrow(SyntaxKind.FunctionDeclaration)
			: undefined;
		for (const jsDoc of jsDocOwner?.getJsDocs() ?? []) {
			for (const tag of jsDoc.getTags()) {
				if (tag.getTagName() !== 'param') continue;
				const tagText = stripJsDocLineMarkers(tag.getText()).replace(
					/^@param\s*/,
					'',
				);
				const match = tagText.match(
					/^(?<paramName>\S+)\s*-?\s*(?<desc>[\s\S]*)$/,
				);
				if (match?.groups) {
					const paramName = match.groups['paramName'];
					const desc = match.groups['desc'];
					if (paramName) {
						paramDescByName.set(
							paramName.trim(),
							renderMarkdownProse(desc ?? ''),
						);
					}
				}
			}
		}

		for (const param of callSig?.getParameters() ?? []) {
			const paramDecl = param.getDeclarations()[0];
			const optional =
				paramDecl?.asKind(SyntaxKind.Parameter)?.isOptional() ?? false;
			params.push({
				name: param.getName(),
				optional,
				description: paramDescByName.get(param.getName()) ?? '',
			});
		}
	} else if (declaration.isKind(SyntaxKind.TypeAliasDeclaration)) {
		// Use the alias's own type node text rather than `Type#getText()`,
		// which (with UseAliasDefinedOutsideCurrentScope) just prints the
		// alias's own name back — self-referential and useless in docs.
		const typeNodeText = declaration
			.asKindOrThrow(SyntaxKind.TypeAliasDeclaration)
			.getTypeNodeOrThrow()
			.getText();
		signature = `type ${name} = ${typeNodeText}`;
	} else if (declaration.isKind(SyntaxKind.InterfaceDeclaration)) {
		signature = `interface ${name} ${declaration
			.asKindOrThrow(SyntaxKind.InterfaceDeclaration)
			.getText()
			.replace(/^(export\s+)?interface\s+\S+\s*/, '')}`;
	} else {
		const formatted = getFormattedType(declarationType);
		// `node:path`/`node:fs` etc. aren't resolved with full type info in this
		// Project (no `@types/node` on the program), so some const initializers
		// come back as `any`. Fall back to the initializer's own source text,
		// which is still informative for a docs constant.
		if (formatted === 'any' && declaration.isKind(SyntaxKind.VariableDeclaration)) {
			const initializer = declaration
				.asKindOrThrow(SyntaxKind.VariableDeclaration)
				.getInitializer();
			signature = `const ${name} = ${initializer?.getText() ?? formatted}`;
		} else {
			signature = `const ${name}: ${formatted}`;
		}
	}

	if (!description && !signature) return undefined;

	return {
		name,
		filePath,
		line: declaration.getStartLineNumber(),
		description,
		isFunction,
		signature,
		params,
		returns: renderMarkdownProse(tags['returns'] ?? ''),
		throws: renderMarkdownProse(
			(tags['throws'] ?? '').replace(/^\{(?<err>[^}]+)\}\s*/, '`$<err>` — '),
		),
	};
}

function renderEntry(entry: DocEntry): string {
	const lines: string[] = [];
	lines.push(`### \`${entry.name}\``, '');
	lines.push('```ts', `import { ${entry.name} } from '${PACKAGE_NAME}'`, '```', '');
	if (entry.description) {
		lines.push(entry.description, '');
	}
	if (entry.signature) {
		lines.push('```ts', entry.signature, '```', '');
	}
	if (entry.params.length) {
		lines.push('#### Parameters', '');
		for (const p of entry.params) {
			const optionalNote = p.optional ? ' (optional)' : '';
			lines.push(
				`- \`${p.name}\`${optionalNote}${p.description ? ` — ${p.description}` : ''}`,
			);
		}
		lines.push('');
	}
	if (entry.returns) {
		lines.push('#### Returns', '', entry.returns, '');
	}
	if (entry.throws) {
		lines.push('#### Throws', '', entry.throws, '');
	}
	lines.push('---', '');
	return lines.join('\n');
}

async function main() {
	const indexFile = project.getSourceFileOrThrow(
		path.join(PACKAGE_ROOT, 'src/index.ts'),
	);
	const exportedDeclarations = indexFile.getExportedDeclarations();

	const entriesByFile = new Map<string, DocEntry[]>();

	for (const [name, declarations] of exportedDeclarations) {
		const declaration = declarations[0];
		if (!declaration) continue;
		// Skip re-exported type-only helper types not meant for narrative docs
		// (kept minimal/mechanical — matches nextra's `@internal` tag skip).
		const symbolTags = getTags(declaration.getSymbolOrThrow());
		if ('internal' in symbolTags) continue;

		const entry = buildEntry(name, declaration);
		if (!entry) continue;

		const list = entriesByFile.get(entry.filePath) ?? [];
		list.push(entry);
		entriesByFile.set(entry.filePath, list);
	}

	for (const list of entriesByFile.values()) {
		list.sort((a, b) => a.line - b.line);
	}

	const out: string[] = [];
	out.push('# API Reference', '');
	out.push(`Public functions and types exported from \`${PACKAGE_NAME}\`.`, '');
	out.push(
		'```ts',
		`import { buildRegistry, searchSkills, executeWorkflow } from '${PACKAGE_NAME}'`,
		'```',
		'',
	);
	out.push(
		'CLI entry points (`packages/cli`) and build entry points (`src/build/`) are process-entry scripts — they are not importable and are not covered here.',
		'',
	);
	out.push(
		'> This file is generated by `bun run api-docs` (`src/build/generate-api-docs.ts`) from the JSDoc comments and type signatures in source. Do not edit by hand — edit the source JSDoc instead and regenerate.',
		'',
	);
	out.push('---', '');

	for (const section of SECTIONS) {
		const sectionEntries = section.files.flatMap((f) => entriesByFile.get(f) ?? []);
		if (!sectionEntries.length) continue;
		out.push(`## ${section.title}`, '');
		for (const entry of sectionEntries) {
			out.push(renderEntry(entry));
		}
	}

	const content = `${out
		.join('\n')
		.replaceAll('\t', '    ')
		.replace(/\n{3,}/g, '\n\n')
		.trimEnd()}\n`;
	const relOutFile = path.relative(REPO_ROOT, OUT_FILE);

	if (process.argv.includes('--check')) {
		const existing = await readFile(OUT_FILE, 'utf8').catch(() => '');
		if (existing !== content) {
			console.error(
				`${relOutFile} is stale — run \`bun run api-docs\` and commit the result.`,
			);
			process.exitCode = 1;
			return;
		}
		console.log(`${relOutFile} is up to date.`);
		return;
	}

	await writeFile(OUT_FILE, content, 'utf8');
	console.log(`Wrote ${relOutFile}`);
}

await main();
