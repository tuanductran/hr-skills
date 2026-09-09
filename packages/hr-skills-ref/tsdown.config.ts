import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: {
		'client/index': 'src/client/index.ts',
		'server/index': 'src/server/index.ts',
	},
	format: ['esm'],
	dts: true,
	clean: true,
});
