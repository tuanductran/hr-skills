import { expect, test } from '@playwright/test';

test.describe('HR Skills landing page', () => {
	test('presents the product story and primary navigation', async ({ page }) => {
		await page.goto('/');

		await expect(page).toHaveTitle(/HR Skills/i);
		await expect(page.getByRole('heading', { level: 1 })).toContainText(
			'Make the next people decision clearer.',
		);
		await expect(page.locator('nav[aria-label="Main navigation"]')).toHaveCount(1);
		await expect(
			page.getByRole('link', { name: 'Explore the repository' }),
		).toHaveAttribute('href', /github\.com\/tuanductran\/hr-skills/);
		await expect(page.getByRole('heading', { name: 'JD Builder' })).toBeVisible();
	});

	test('does not create horizontal overflow on the current viewport', async ({
		page,
	}) => {
		await page.goto('/');
		const overflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth,
		);
		expect(overflow).toBe(false);
	});

	test('keeps interactive controls keyboard reachable', async ({ page }) => {
		await page.goto('/');
		await page.keyboard.press('Tab');
		await expect(page.locator(':focus')).toBeVisible();
		await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
			'href',
			'#main-content',
		);
	});

	test('opens and closes the mobile navigation accessibly', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto('/');
		const menu = page.getByRole('button', { name: 'Menu' });
		await menu.click();
		await expect(
			page.getByRole('dialog', { name: 'Mobile navigation' }),
		).toBeVisible();
		await expect(page.getByRole('link', { name: 'How it works' })).toBeVisible();
		await page.keyboard.press('Escape');
		await expect(page.getByRole('dialog', { name: 'Mobile navigation' })).toHaveCount(
			0,
		);
	});

	test('publishes crawlable robots and sitemap endpoints', async ({ request }) => {
		const robots = await request.get('/robots.txt');
		const sitemap = await request.get('/sitemap.xml');
		expect(robots.ok()).toBe(true);
		expect(sitemap.ok()).toBe(true);
		expect(await robots.text()).toContain('Sitemap:');
		expect(await sitemap.text()).toContain('<loc>');
	});
});
