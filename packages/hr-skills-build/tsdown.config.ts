import { defineConfig } from 'tsdown';

// Keep client and server as separate package entries, following Nextra's
// layout. The package root is mapped to the server entry in package.json.
export default defineConfig({
	entry: {
		'client/index': 'src/client/index.ts',
		'server/index': 'src/server/index.ts',
	},
	format: ['esm'],
	dts: true,
	clean: true,
});
