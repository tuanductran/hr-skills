import { expect, test } from '@playwright/test';

const routes = [
	{ path: '/', mobileToggle: 'Filters and worklist' },
	{ path: '/map', mobileToggle: 'Decision stage' },
	{ path: '/skills/hr-onboarding', mobileToggle: null },
] as const;

const mobileProject = /android|iphone|ipad/i;

test.describe('HR Skills Workspace responsive integrity', () => {
	for (const route of routes) {
		test(`${route.path} renders without horizontal overflow`, async ({
			page,
		}, testInfo) => {
			const browserErrors: string[] = [];
			page.on('pageerror', (error) => browserErrors.push(error.message));
			page.on('console', (message) => {
				if (message.type() === 'error') browserErrors.push(message.text());
			});

			await page.goto(route.path, { waitUntil: 'networkidle' });
			await expect(page.locator('#workspace-main')).toBeVisible();
			await expect(page.locator('#workspace-main h1').first()).toBeVisible();

			if (mobileProject.test(testInfo.project.name) && route.mobileToggle) {
				const toggle = page.getByRole('button', { name: route.mobileToggle });
				await expect(toggle).toBeVisible();
				await expect(toggle).toHaveAttribute('aria-expanded', 'false');
				await toggle.click();
				await expect(toggle).toHaveAttribute('aria-expanded', 'true');
			}

			if (route.path === '/skills/hr-onboarding') {
				const prepare = page.getByRole('button', { name: 'Prepare for Claude' });
				await expect(prepare).toBeVisible();
				await prepare.click();
				await expect(page.getByRole('dialog')).toBeVisible();
				await page.keyboard.press('Escape');
				await expect(page.getByRole('dialog')).toBeHidden();
				await expect(prepare).toBeFocused();
			}

			const layout = await page.evaluate(() => {
				const initialScrollX = window.scrollX;
				window.scrollTo({ left: 99999, top: window.scrollY });
				const horizontalScrollX = window.scrollX;
				window.scrollTo({ left: initialScrollX, top: window.scrollY });

				const offenders = [...document.querySelectorAll<HTMLElement>('body *')]
					.map((element) => {
						const box = element.getBoundingClientRect();
						return {
							tag: element.tagName.toLowerCase(),
							id: element.id,
							className: element.className,
							text: (element.textContent ?? '').trim().slice(0, 80),
							left: Math.round(box.left),
							right: Math.round(box.right),
						};
					})
					.filter(
						(element) =>
							element.right > window.innerWidth + 1 || element.left < -1,
					)
					.slice(0, 12);

				return {
					horizontalScrollX,
					viewport: `${window.innerWidth}x${window.innerHeight}`,
					offenders,
				};
			});

			expect(
				layout.horizontalScrollX,
				`horizontal scroll at ${layout.viewport}: ${JSON.stringify(layout.offenders)}`,
			).toBeLessThanOrEqual(1);
			expect(browserErrors, browserErrors.join('\n')).toEqual([]);

			await page.screenshot({
				path: testInfo.outputPath(
					`${route.path === '/' ? 'catalog' : route.path.replaceAll('/', '-').slice(1)}.png`,
				),
				fullPage: false,
			});
		});
	}
});
