import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:3101';

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: false,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 2 : 0,
	workers: 1,
	reporter: process.env.CI ? [['line'], ['html', { open: 'never' }]] : 'list',
	use: {
		baseURL,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',
		extraHTTPHeaders: {
			'x-real-ip': '127.0.0.1',
		},
	},
	webServer:
		process.env.PLAYWRIGHT_WEBSERVER === '1'
			? {
					command:
						'export PORT=3101 HOST=127.0.0.1 && node .output/server/index.mjs',
					url: baseURL,
					reuseExistingServer: !process.env.CI,
					timeout: 120_000,
				}
			: undefined,
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			name: 'android',
			use: { ...devices['Pixel 5'] },
		},
		{
			name: 'iphone',
			use: { ...devices['iPhone 13'] },
		},
		{
			name: 'ipad',
			use: { ...devices['iPad Mini'] },
		},
		{
			name: 'ios-webkit',
			use: { ...devices['iPhone 13'], browserName: 'webkit' },
		},
		{
			name: 'android-tablet',
			use: { ...devices['Galaxy Tab S4'] },
		},
	],
});
