import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: {
		'bin/hr-skills': 'src/bin/hr-skills.ts',
		'cli-bootstrap': 'src/cli/cli-bootstrap.ts',
		discover: 'src/cli/discover.ts',
		find: 'src/cli/discover.ts',
		list: 'src/cli/list.ts',
		init: 'src/cli/init.ts',
		recommend: 'src/cli/recommend.ts',
		plan: 'src/cli/generate-plan.ts',
		execute: 'src/cli/execute-plan.ts',
		evaluate: 'src/cli/run-evaluation.ts',
		'skill-review': 'src/cli/skill-review.ts',
		registry: 'src/cli/generate-registry.ts',
		signals: 'src/cli/generate-relevance-signals.ts',
	},
	format: ['esm'],
	dts: true,
	clean: true,
});
