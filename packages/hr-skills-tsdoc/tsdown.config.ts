import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: {
		'generate-api-docs': 'src/generate-api-docs.ts',
	},
	format: ['esm'],
	dts: true,
	clean: true,
});
