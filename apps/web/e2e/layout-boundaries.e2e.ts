import { expect, test } from '@playwright/test';

const routes = ['/', '/map', '/skills/hr-onboarding'] as const;

const boundaryViewports: Record<
	string,
	ReadonlyArray<{ width: number; height: number }>
> = {
	'desktop-windows-chromium': [
		{ width: 1280, height: 720 },
		{ width: 1440, height: 900 },
	],
	'desktop-linux-firefox': [{ width: 1024, height: 768 }],
	'desktop-macos-webkit': [{ width: 1280, height: 800 }],
	'android-pixel-7-chromium': [
		{ width: 320, height: 568 },
		{ width: 360, height: 800 },
		{ width: 412, height: 915 },
	],
	'ios-iphone-14-webkit': [
		{ width: 320, height: 568 },
		{ width: 375, height: 812 },
		{ width: 390, height: 844 },
	],
	'ipados-ipad-pro-11-webkit': [
		{ width: 768, height: 1024 },
		{ width: 820, height: 1180 },
		{ width: 1024, height: 768 },
	],
};

test.describe('layout boundary integrity', () => {
	test.describe.configure({ mode: 'serial' });

	test('keeps every primary route within viewport boundaries', async ({
		page,
	}, testInfo) => {
		const viewports = boundaryViewports[testInfo.project.name] ?? [];
		expect(
			viewports,
			`Missing viewport matrix for ${testInfo.project.name}`,
		).not.toHaveLength(0);

		for (const viewport of viewports) {
			await page.setViewportSize(viewport);
			for (const route of routes) {
				const browserErrors: string[] = [];
				page.once('pageerror', (error) => browserErrors.push(error.message));
				page.once('console', (message) => {
					if (message.type() === 'error') browserErrors.push(message.text());
				});

				await page.goto(route, { waitUntil: 'networkidle' });
				await expect(page.locator('#workspace-main')).toBeVisible();
				await expect(page.locator('#workspace-main h1').first()).toBeVisible({
					timeout: 15_000,
				});

				const audit = await page.evaluate(() => {
					const initialScrollX = window.scrollX;
					window.scrollTo({ left: 99999, top: window.scrollY });
					const horizontalScrollX = window.scrollX;
					window.scrollTo({ left: initialScrollX, top: window.scrollY });

					const offenders = [
						...document.querySelectorAll<HTMLElement>('body *'),
					]
						.map((element) => {
							const box = element.getBoundingClientRect();
							return {
								tag: element.tagName.toLowerCase(),
								id: element.id,
								className: String(element.className).slice(0, 180),
								left: Math.round(box.left),
								right: Math.round(box.right),
							};
						})
						.filter(
							(element) =>
								element.left < -1 ||
								element.right > window.innerWidth + 1,
						)
						.slice(0, 8);

					return {
						horizontalScrollX,
						viewport: `${window.innerWidth}x${window.innerHeight}`,
						mainWidth: Math.round(
							document
								.querySelector('#workspace-main')
								?.getBoundingClientRect().width ?? 0,
						),
						offenders,
					};
				});

				expect(
					audit.horizontalScrollX,
					`${route} at ${audit.viewport}: ${JSON.stringify(audit.offenders)}`,
				).toBeLessThanOrEqual(1);
				expect(
					audit.mainWidth,
					`${route} at ${audit.viewport} has no usable main width`,
				).toBeGreaterThan(0);
				expect(browserErrors, browserErrors.join('\n')).toEqual([]);
			}
		}
	});
});
