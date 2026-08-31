import { expect, test } from '@playwright/test';

const routes = [
	'/',
	'/skills',
	'/skills/hr-onboarding',
	'/planner',
	'/graph',
	'/runtime',
	'/evaluation',
	'/changelog',
];

test.describe('navigation', () => {
	test('skip link focuses the main landmark', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
		await page.keyboard.press('Enter');
		await expect(page.locator('#main-content')).toBeFocused();
	});

	test('the "How it works" menu groups the secondary surfaces', async ({
		page,
		isMobile,
	}) => {
		test.skip(isMobile, 'desktop-only nav; mobile uses the hamburger menu');
		await page.goto('/');
		await page.getByRole('button', { name: 'How it works' }).click();
		const menu = page.getByRole('menu');
		await expect(menu.getByRole('menuitem', { name: /Skill graph/ })).toHaveAttribute(
			'href',
			'/graph',
		);
		await expect(
			menu.getByRole('menuitem', { name: /Runtime trace/ }),
		).toHaveAttribute('href', '/runtime');
		await expect(menu.getByRole('menuitem', { name: /Evaluation/ })).toHaveAttribute(
			'href',
			'/evaluation',
		);
		await expect(menu.getByRole('menuitem', { name: /Changelog/ })).toHaveAttribute(
			'href',
			'/changelog',
		);
	});

	test('the mobile menu reaches every route from one trigger', async ({
		page,
		isMobile,
	}) => {
		test.skip(!isMobile, 'mobile-only nav trigger');
		await page.goto('/');
		await page.getByRole('button', { name: 'Open navigation menu' }).click();
		const menu = page.getByRole('menu');
		await expect(
			menu.getByRole('menuitem', { name: 'Catalog', exact: true }),
		).toBeVisible();
		await expect(
			menu.getByRole('menuitem', { name: 'Planner', exact: true }),
		).toBeVisible();
		await expect(menu.getByRole('menuitem', { name: /Skill graph/ })).toBeVisible();
	});

	test('an unknown route renders the 404 page with recovery links', async ({
		page,
	}) => {
		await page.goto('/this-route-does-not-exist');
		await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
		await expect(
			page.getByRole('heading', { name: 'This page could not be found.' }),
		).toBeVisible();
		await expect(page.getByRole('link', { name: 'Browse skills' })).toHaveAttribute(
			'href',
			'/skills',
		);
		await expect(page.getByRole('link', { name: 'Go home' })).toHaveAttribute(
			'href',
			'/',
		);
	});

	for (const route of routes) {
		test(`${route} renders without horizontal overflow`, async ({ page }) => {
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(String(error)));

			await page.goto(route);
			await expect(page.locator('#main-content')).toBeVisible();

			const scrollX = await page.evaluate(() => {
				const initial = window.scrollX;
				window.scrollTo({ left: 99999, top: window.scrollY });
				const max = window.scrollX;
				window.scrollTo({ left: initial, top: window.scrollY });
				return max;
			});
			expect(scrollX).toBeLessThanOrEqual(1);
			expect(errors).toEqual([]);
		});
	}
});
