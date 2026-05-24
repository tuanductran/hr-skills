import { defineConfig } from 'bumpp';

export default defineConfig({
	recursive: true,
	commit: 'chore(release): bump version to %s',
	tag: 'v%s',
	push: true,
});
