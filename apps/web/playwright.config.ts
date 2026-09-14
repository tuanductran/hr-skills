import { defineConfig, devices } from '@playwright/test';

const isCI = Boolean(process.env['CI']);
const baseURL = process.env['PLAYWRIGHT_BASE_URL'] ?? 'http://127.0.0.1:3010';
const chromiumExecutablePath = process.env['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH'];

export default defineConfig({
	testDir: './e2e',
	fullyParallel: true,
	forbidOnly: isCI,
	retries: isCI ? 2 : 0,
	...(isCI ? { workers: 1 } : {}),
	reporter: [['list'], ['html', { open: 'never' }]],
	use: {
		baseURL,
		trace: 'on-first-retry',
		launchOptions: chromiumExecutablePath
			? { executablePath: chromiumExecutablePath }
			: {},
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'mobile-chromium',
			use: { ...devices['Pixel 5'] },
		},
	],
	webServer: {
		command: 'bun run dev -- --port 3010',
		url: baseURL,
		reuseExistingServer: !isCI,
		stdout: 'ignore',
		stderr: 'pipe',
		timeout: 120_000,
	},
});
