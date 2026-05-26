import type { ChangelogConfig } from 'changelogen';

const config = {
	types: {
		feat: {
			title: '🚀 Features',
			semver: 'minor',
		},

		fix: {
			title: '🐛 Bug Fixes',
			semver: 'patch',
		},

		docs: {
			title: '📖 Documentation',
		},

		refactor: {
			title: '♻️ Refactors',
		},

		style: {
			title: '🎨 Styling',
		},

		test: {
			title: '🧪 Tests',
		},

		build: {
			title: '📦 Build System',
		},

		ci: {
			title: '🤖 CI',
		},

		chore: {
			title: '🧹 Chores',
		},
	},

	templates: {
		commitMessage: 'chore(release): bump version to v{{newVersion}}',
	},
} satisfies Partial<ChangelogConfig>;

export default config;
