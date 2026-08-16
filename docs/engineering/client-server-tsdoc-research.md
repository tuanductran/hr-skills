# Client/server and TSDoc research notes

## Nextra

The official Nextra monorepo uses the root package identity `nextra-monorepo`, a private workspace package, and Turbo filters over `packages/*`. Source: <https://raw.githubusercontent.com/shuding/nextra/main/package.json>

Nextra's App Router architecture separates server-side and client-side responsibilities. Its migration guidance describes loading translations and server data in server components, then passing serializable values to layout/theme components. Source: <https://the-guild.dev/blog/nextra-4>

This repository applies the same principle through explicit package exports: `./client` contains browser-safe modules, `./server` contains filesystem/process APIs, and the root export remains a server-compatible backward-compatible alias.

## Bun Node compatibility

Bun's official Node compatibility documentation states that Bun aims for near-complete Node.js compatibility and treats a Node-compatible package failing in Bun as a Bun bug. It lists `node:fs`, `node:path`, `node:os`, `node:url`, `node:stream`, `node:buffer`, and related modules as implemented, with caveats for some APIs such as `node:child_process`, `node:module`, `node:crypto`, `node:tls`, and `node:perf_hooks`. Source: <https://bun.com/docs/runtime/nodejs-compat>

The repository therefore keeps standard `node:` imports in server-only modules and does not place filesystem/process imports in client entrypoints.

## TSDoc/API documentation

TSDoc is a proposal for standardizing TypeScript documentation comments so multiple tools can parse the same comments consistently. Source: <https://tsdoc.org/>

API Extractor expects `/**` comments immediately before exported declarations or a `@packageDocumentation` entrypoint comment, and supports summary, `@remarks`, `@param`, `@returns`, `@example`, and release tags such as `@public`, `@beta`, and `@internal`. Source: <https://api-extractor.com/pages/tsdoc/doc_comment_syntax/>

The repository's `hr-skills-tsdoc` package follows this model with `ts-morph` extraction from all public entrypoints of `hr-skills`, `hr-skills-build`, and `hr-skills-ref`, rendering the shared result to `docs/engineering/api.md`.
