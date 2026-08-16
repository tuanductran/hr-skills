/**
 * Generate the repository API reference from TSDoc-compatible comments.
 *
 * The generator intentionally works from emitted TypeScript entrypoints rather
 * than package-specific source paths. This keeps `api.md` synchronized across
 * the public CLI package, the build library, and the reference library.
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { ExportedDeclarations, Symbol as TsSymbol, Type } from 'ts-morph';
import { Project, SyntaxKind, ts } from 'ts-morph';

const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(PACKAGE_ROOT, '../..');
const OUT_FILE = path.join(REPO_ROOT, 'docs/engineering/api.md');

type Surface = 'client' | 'server' | 'cli';

interface PackageTarget {
	name: string;
	description: string;
	surface: Surface;
	entry: string;
	packageRoot: string;
}

interface DocEntry {
	name: string;
	filePath: string;
	line: number;
	description: string;
	signature: string;
	params: { name: string; description: string; optional: boolean }[];
	returns: string;
	throws: string;
}

const TARGETS: PackageTarget[] = [
	{
		name: 'hr-skills',
		description: 'Publishable HR Skills CLI and `hr-skills` executable.',
		surface: 'cli',
		entry: 'src/bin/hr-skills.ts',
		packageRoot: path.join(REPO_ROOT, 'packages/hr-skills'),
	},
	{
		name: 'hr-skills-build',
		description:
			'Server-side build, registry, planner, runtime, and validation APIs.',
		surface: 'server',
		entry: 'src/index.ts',
		packageRoot: path.join(REPO_ROOT, 'packages/hr-skills-build'),
	},
	{
		name: 'hr-skills-build',
		description: 'Browser-safe planner, runtime, search, and shared APIs.',
		surface: 'client',
		entry: 'src/index.client.ts',
		packageRoot: path.join(REPO_ROOT, 'packages/hr-skills-build'),
	},
	{
		name: 'hr-skills-ref',
		description: 'Server-side filesystem and skill-loading APIs.',
		surface: 'server',
		entry: 'src/index.ts',
		packageRoot: path.join(REPO_ROOT, 'packages/hr-skills-ref'),
	},
	{
		name: 'hr-skills-ref',
		description: 'Browser-safe parsing, schema, model, and pure transformation APIs.',
		surface: 'client',
		entry: 'src/client/index.ts',
		packageRoot: path.join(REPO_ROOT, 'packages/hr-skills-ref'),
	},
];

function getTags(symbol: TsSymbol): Record<string, string> {
	const tags: Record<string, string> = Object.create(null);
	for (const tag of symbol.getJsDocTags()) {
		const name = tag.getName();
		const value = ts.displayPartsToString(tag.getText());
		tags[name] = name in tags ? `${tags[name]}\n${value}` : value;
	}
	return tags;
}

function renderProse(raw: string): string {
	return raw
		.split('\n')
		.map((line) => line.replace(/^\s*\*\s?/, ''))
		.join('\n')
		.replaceAll(/\{@link\s+([^}]+)\}/g, '$1')
		.replace(/^ +-/gm, '-')
		.replaceAll('*', '\\*')
		.trim();
}

function formatType(type: Type): string {
	return type.getText(undefined, ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope);
}

function formatSignature(
	name: string,
	declaration: ExportedDeclarations,
	project: Project,
): string {
	const type = declaration.getType();
	const [signature] = type.getCallSignatures();
	if (signature) {
		const params = signature
			.getParameters()
			.map((param) => {
				const declarationNode = param.getDeclarations()[0];
				const optional =
					declarationNode?.asKind(SyntaxKind.Parameter)?.isOptional() ?? false;
				const parameterType = declarationNode
					? project
							.getTypeChecker()
							.getTypeOfSymbolAtLocation(param, declarationNode)
					: undefined;
				return `${param.getName()}${optional ? '?' : ''}: ${parameterType ? formatType(parameterType) : 'unknown'}`;
			})
			.join(', ');
		const returnType = signature.getDeclaration().getSignature().getReturnType();
		return `function ${name}(${params}): ${formatType(returnType)}`;
	}
	if (declaration.isKind(SyntaxKind.TypeAliasDeclaration)) {
		return `type ${name} = ${declaration.asKindOrThrow(SyntaxKind.TypeAliasDeclaration).getTypeNodeOrThrow().getText()}`;
	}
	if (declaration.isKind(SyntaxKind.InterfaceDeclaration)) {
		return declaration.getText().replace(/^export\s+/, '');
	}
	return `const ${name}: ${formatType(type)}`;
}

function buildEntry(
	declaration: ExportedDeclarations,
	project: Project,
	packageRoot: string,
): DocEntry | undefined {
	const symbol = declaration.getSymbol();
	if (!symbol) return undefined;
	const description = renderProse(
		ts.displayPartsToString(
			symbol.compilerSymbol.getDocumentationComment(
				project.getTypeChecker().compilerObject,
			),
		),
	);
	const tags = getTags(symbol);
	if ('internal' in tags) return undefined;
	const name = symbol.getName();
	const filePath = path
		.relative(
			path.join(packageRoot, 'src'),
			declaration.getSourceFile().getFilePath(),
		)
		.replaceAll('\\', '/');
	const params: DocEntry['params'] = [];
	const signature = formatSignature(name, declaration, project);
	const callSignature = declaration.getType().getCallSignatures()[0];
	for (const parameter of callSignature?.getParameters() ?? []) {
		const declarationNode = parameter.getDeclarations()[0];
		params.push({
			name: parameter.getName(),
			optional:
				declarationNode?.asKind(SyntaxKind.Parameter)?.isOptional() ?? false,
			description: '',
		});
	}
	return {
		name,
		filePath,
		line: declaration.getStartLineNumber(),
		description,
		signature,
		params,
		returns: renderProse(tags['returns'] ?? ''),
		throws: renderProse(tags['throws'] ?? ''),
	};
}

function renderEntry(entry: DocEntry, target: PackageTarget): string {
	const lines = [
		`### \`${entry.name}\``,
		'',
		'```ts',
		`import { ${entry.name} } from '${target.name}${target.surface === 'server' ? '/server' : target.surface === 'client' ? '/client' : ''}'`,
		'```',
		'',
	];
	if (entry.description) lines.push(entry.description, '');
	if (entry.signature) lines.push('```ts', entry.signature, '```', '');
	if (entry.params.length) {
		lines.push('#### Parameters', '');
		for (const parameter of entry.params)
			lines.push(
				`- \`${parameter.name}\`${parameter.optional ? ' (optional)' : ''}`,
			);
		lines.push('');
	}
	if (entry.returns) lines.push('#### Returns', '', entry.returns, '');
	if (entry.throws) lines.push('#### Throws', '', entry.throws, '');
	lines.push('---', '');
	return lines.join('\n');
}

async function collectTarget(target: PackageTarget): Promise<DocEntry[]> {
	const project = new Project({
		tsConfigFilePath: path.join(target.packageRoot, 'tsconfig.json'),
	});
	const indexFile = project.getSourceFile(path.join(target.packageRoot, target.entry));
	if (!indexFile) return [];
	const entries: DocEntry[] = [];
	for (const declarations of indexFile.getExportedDeclarations().values()) {
		const declaration = declarations[0];
		if (!declaration) continue;
		const entry = buildEntry(declaration, project, target.packageRoot);
		if (entry) entries.push(entry);
	}
	return entries.sort(
		(a, b) => a.filePath.localeCompare(b.filePath) || a.line - b.line,
	);
}

async function generate(): Promise<string> {
	const output: string[] = [
		'# API Reference',
		'',
		'> This file is generated from TSDoc-compatible comments. Do not edit it by hand; update exported declarations and run `bun run api-docs`.',
		'',
	];
	for (const target of TARGETS) {
		const entries = await collectTarget(target);
		output.push(`## ${target.name} — ${target.surface}`, '', target.description, '');
		if (!entries.length) {
			output.push(
				'This surface exposes a command dispatcher rather than importable declarations.',
				'',
				'---',
				'',
			);
			continue;
		}
		for (const entry of entries) output.push(renderEntry(entry, target));
	}
	return `${output
		.join('\n')
		.replaceAll('\t', '    ')
		.replace(/\n{3,}/g, '\n\n')
		.trimEnd()}\n`;
}

const content = await generate();
if (process.argv.includes('--check')) {
	const existing = await readFile(OUT_FILE, 'utf8').catch(() => '');
	if (existing !== content) {
		console.error('docs/engineering/api.md is stale — run `bun run api-docs`.');
		process.exitCode = 1;
	} else {
		console.log('docs/engineering/api.md is up to date.');
	}
} else {
	await writeFile(OUT_FILE, content, 'utf8');
	console.log('Wrote docs/engineering/api.md');
}
