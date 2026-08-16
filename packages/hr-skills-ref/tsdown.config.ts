import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: {
		index: 'src/index.ts',
		'client/index': 'src/client/index.ts',
		'server/index': 'src/server/index.ts',
	},
	format: ['esm'],
	dts: true,
	clean: true,
});
