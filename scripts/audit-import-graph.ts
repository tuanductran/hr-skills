#!/usr/bin/env bun
/**
 * Deterministic, read-only source import and workspace dependency inventory.
 *
 * This is a migration aid, not a dead-code detector. It records static edges
 * and flags non-literal dynamic imports for manual review. It never edits files.
 */
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXCLUDED = new Set([
  ".git",
  ".turbo",
  "coverage",
  "dist",
  "node_modules",
  ".next",
  "out",
]);
const SOURCE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
]);
const compilerOptions: ts.CompilerOptions = {
  allowJs: true,
  checkJs: false,
  module: ts.ModuleKind.Preserve,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  resolveJsonModule: true,
  allowImportingTsExtensions: true,
  baseUrl: ROOT,
  paths: {},
};

type ImportEdge = {
  from: string;
  line: number;
  kind: "import" | "export" | "require" | "dynamic-import" | "import-type";
  specifier: string;
  resolution: "internal" | "external" | "unresolved-relative";
  resolved: string | null;
};

type WorkspaceEdge = {
  from: string;
  dependency: string;
  to: string;
  section: string;
};

const compare = (left: string, right: string) =>
  left < right ? -1 : left > right ? 1 : 0;
const relative = (file: string) =>
  path.relative(ROOT, file).split(path.sep).join("/");
const isRelativeSpecifier = (value: string) =>
  value.startsWith("./") || value.startsWith("../") || value.startsWith("/");

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const files: string[] = [];
  entries.sort((a, b) => compare(a.name, b.name));
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!EXCLUDED.has(entry.name)) {
        files.push(...(await walk(path.join(directory, entry.name))));
      }
      continue;
    }
    if (entry.isFile() && SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(path.join(directory, entry.name));
    }
  }
  return files;
}

async function run(): Promise<void> {
  const files = await walk(ROOT);
  const edges: ImportEdge[] = [];
  let nonLiteralDynamicImports = 0;

  for (const file of files) {
    const text = await readFile(file, "utf8");
    const source = ts.createSourceFile(
      file,
      text,
      ts.ScriptTarget.Latest,
      true,
      file.endsWith(".tsx") || file.endsWith(".jsx")
        ? ts.ScriptKind.TSX
        : file.endsWith(".js") || file.endsWith(".mjs") || file.endsWith(".cjs")
          ? ts.ScriptKind.JS
          : ts.ScriptKind.TS,
    );

    const addEdge = (
      specifier: string,
      kind: ImportEdge["kind"],
      node: ts.Node,
    ) => {
      const result = ts.resolveModuleName(
        specifier,
        file,
        compilerOptions,
        ts.sys,
      ).resolvedModule;
      const relativeImport = isRelativeSpecifier(specifier);
      const resolvedFile = result?.resolvedFileName;
      const resolvedInsideRepo =
        resolvedFile !== undefined &&
        !resolvedFile.split(path.sep).includes("node_modules") &&
        (resolvedFile === ROOT || resolvedFile.startsWith(ROOT + path.sep));
      const resolution: ImportEdge["resolution"] = resolvedInsideRepo
        ? "internal"
        : relativeImport
          ? "unresolved-relative"
          : "external";
      const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
      edges.push({
        from: relative(file),
        line: line + 1,
        kind,
        specifier,
        resolution,
        resolved: resolvedInsideRepo && resolvedFile ? relative(resolvedFile) : null,
      });
    };

    const visit = (node: ts.Node): void => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        addEdge(node.moduleSpecifier.text, "import", node);
      } else if (
        ts.isExportDeclaration(node) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        addEdge(node.moduleSpecifier.text, "export", node);
      } else if (
        ts.isImportEqualsDeclaration(node) &&
        ts.isExternalModuleReference(node.moduleReference) &&
        node.moduleReference.expression &&
        ts.isStringLiteral(node.moduleReference.expression)
      ) {
        addEdge(node.moduleReference.expression.text, "import", node);
      } else if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument) &&
        ts.isStringLiteral(node.argument.literal)) {
        addEdge(node.argument.literal.text, "import-type", node);
      } else if (ts.isCallExpression(node)) {
        const argument = node.arguments[0];
        if (
          node.expression.kind === ts.SyntaxKind.ImportKeyword ||
          (ts.isIdentifier(node.expression) && node.expression.text === "require")
        ) {
          const kind =
            node.expression.kind === ts.SyntaxKind.ImportKeyword
              ? "dynamic-import"
              : "require";
          if (argument && ts.isStringLiteralLike(argument)) {
            addEdge(argument.text, kind, node);
          } else if (kind === "dynamic-import") {
            nonLiteralDynamicImports += 1;
          }
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }

  const manifestPaths = ["package.json"];
  for (const workspaceRoot of ["apps", "packages", "playground"]) {
    const rootPath = path.join(ROOT, workspaceRoot);
    for (const entry of await readdir(rootPath, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const manifest = path.join(workspaceRoot, entry.name, "package.json");
      try {
        await access(path.join(ROOT, manifest));
        manifestPaths.push(manifest);
      } catch {
        // A workspace directory without a package manifest is not a package.
      }
    }
  }
  const manifests = await Promise.all(
    [...new Set(manifestPaths)].map(async (manifestPath) => ({
      file: manifestPath,
      value: JSON.parse(await readFile(path.join(ROOT, manifestPath), "utf8")) as {
        name?: string;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
        peerDependencies?: Record<string, string>;
        optionalDependencies?: Record<string, string>;
      },
    })),
  );
  const workspaceNames = new Map(
    manifests
      .filter(({ value }) => value.name)
      .map(({ file, value }) => [value.name!, relative(path.join(ROOT, file))]),
  );
  // Resolve bare workspace package imports to their owning workspace even
  // when the package export points at generated dist/ files.
  for (const edge of edges) {
    if (edge.resolution !== "external") continue;
    const packageName = edge.specifier.startsWith("@")
      ? edge.specifier.split("/").slice(0, 2).join("/")
      : edge.specifier.split("/")[0]!;
    const workspacePath = workspaceNames.get(packageName);
    if (!workspacePath) continue;
    const subpath = edge.specifier.slice(packageName.length).replace(/^\//, "");
    edge.resolution = "internal";
    const workspaceDirectory = path.posix.dirname(workspacePath);
    edge.resolved = subpath
      ? path.posix.join(workspaceDirectory, subpath)
      : workspaceDirectory;
  }

  const workspaceEdges: WorkspaceEdge[] = [];
  for (const { file, value } of manifests) {
    for (const section of [
      "dependencies",
      "devDependencies",
      "peerDependencies",
      "optionalDependencies",
    ] as const) {
      for (const [dependency, version] of Object.entries(value[section] ?? {})) {
        const target = workspaceNames.get(dependency);
        if (target && (version.startsWith("workspace:") || dependency === value.name)) {
          workspaceEdges.push({
            from: relative(path.join(ROOT, file)),
            dependency,
            to: target,
            section,
          });
        }
      }
    }
  }

  edges.sort((a, b) =>
    compare(a.from, b.from) ||
    a.line - b.line ||
    compare(a.specifier, b.specifier) ||
    compare(a.kind, b.kind),
  );
  workspaceEdges.sort((a, b) =>
    compare(a.from, b.from) ||
    compare(a.dependency, b.dependency) ||
    compare(a.section, b.section),
  );

  const summary = {
    schemaVersion: 1,
    scope: "repository-worktree source files; generated and dependency directories excluded",
    filesScanned: files.length,
    staticImportEdges: edges.length,
    internalImportEdges: edges.filter((edge) => edge.resolution === "internal").length,
    externalImportEdges: edges.filter((edge) => edge.resolution === "external").length,
    unresolvedRelativeImports: edges.filter((edge) => edge.resolution === "unresolved-relative").length,
    nonLiteralDynamicImports,
    workspaceDependencyEdges: workspaceEdges.length,
  };

  const report = {
    summary,
    workspaceDependencies: workspaceEdges,
    imports: edges,
    limitations: [
      "The scan is static: computed imports, runtime plugin loading, reflection, and imports assembled from variables are not resolvable.",
      "Non-literal dynamic import() calls are counted for manual review but are not assigned an edge.",
      "External package imports are recorded but are not expanded into dependency internals.",
      "An import edge is evidence of a reference, not proof that a feature is required or safe to remove.",
      "Run the inventory from the exact checkout being reviewed; generated outputs and node_modules are intentionally excluded.",
    ],
  };

  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
}

void run().catch((error: unknown) => {
  process.stderr.write(`Import inventory failed: ${String(error)}\n`);
  process.exitCode = 1;
});
