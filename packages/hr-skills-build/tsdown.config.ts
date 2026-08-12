import { defineConfig } from 'tsdown';

// Two entries, mirroring shuding/nextra's client/server split:
//   - index.ts        -> dist/index.mjs        (full surface, Node-only)
//   - index.client.ts -> dist/index.client.mjs  (browser-safe subset)
// Kept as separate bundles (not just separate exports of one bundle) so
// nothing Node-only (node:fs, node:path, node:child_process) ever ends up
// in the client chunk, even transitively.
export default defineConfig({
	entry: {
		index: 'src/index.ts',
		'index.client': 'src/index.client.ts',
	},
	format: ['esm'],
	dts: true,
	clean: true,
});
