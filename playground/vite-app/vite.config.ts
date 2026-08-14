import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// No node polyfills configured on purpose — if App.tsx ever imports
// something that pulls in node:fs/node:path (e.g. by importing
// 'hr-skills-build' instead of 'hr-skills-build/client'), this build
// should fail loudly instead of silently polyfilling it.
export default defineConfig({
	plugins: [react()],
});
