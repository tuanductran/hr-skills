import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:3013';

export default defineConfig({
	testDir: './e2e',
	testMatch: '**/*.e2e.ts',
	outputDir: '/home/ubuntu/hr-skills-responsive-audit/playwright-output',
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	reporter: [
		['list'],
		[
			'html',
			{
				outputFolder: '/home/ubuntu/hr-skills-responsive-audit/playwright-report',
				open: 'never',
			},
		],
	],
	use: {
		baseURL,
		headless: true,
		trace: 'retain-on-failure',
		video: 'retain-on-failure',
	},
	projects: [
		{
			name: 'desktop-windows-chromium',
			use: {
				browserName: 'chromium',
				viewport: { width: 1440, height: 960 },
				deviceScaleFactor: 1,
				userAgent:
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0 Safari/537.36',
			},
		},
		{
			name: 'desktop-linux-firefox',
			use: {
				browserName: 'firefox',
				viewport: { width: 1366, height: 768 },
				deviceScaleFactor: 1,
				userAgent:
					'Mozilla/5.0 (X11; Linux x86_64; rv:153.0) Gecko/20100101 Firefox/153.0',
			},
		},
		{
			name: 'desktop-macos-webkit',
			use: {
				browserName: 'webkit',
				viewport: { width: 1440, height: 900 },
				deviceScaleFactor: 1,
				userAgent:
					'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15',
			},
		},
		{
			name: 'android-pixel-7-chromium',
			use: { browserName: 'chromium', ...devices['Pixel 7'] },
		},
		{
			name: 'ios-iphone-14-webkit',
			use: { browserName: 'webkit', ...devices['iPhone 14'] },
		},
		{
			name: 'ipados-ipad-pro-11-webkit',
			use: { browserName: 'webkit', ...devices['iPad Pro 11'] },
		},
	],
});
