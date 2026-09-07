import { expect, test } from '@playwright/test';

test.describe('home page', () => {
	test('states the product and links into the two entry points', async ({ page }) => {
		await page.goto('/');
		await expect(page).toHaveTitle('HR Skills');
		await expect(
			page.getByRole('heading', {
				name: 'Move from HR question to confident next step.',
			}),
		).toBeVisible();
		await expect(
			page.getByText(/Use a canonical library of \d+ HR Skills/),
		).toBeVisible();

		await expect(page.getByRole('link', { name: /Find a skill/ })).toHaveAttribute(
			'href',
			'/skills',
		);
		await expect(page.getByRole('link', { name: /Build a plan/ })).toHaveAttribute(
			'href',
			'/planner',
		);

		const practicalGuide = page.locator('.hero__path a', {
			hasText: 'I need a practical guide',
		});
		await expect(practicalGuide).toHaveAttribute('href', '/skills');
		const complexTask = page.locator('.hero__path a', {
			hasText: 'I have a complex HR task',
		});
		await expect(complexTask).toHaveAttribute('href', '/planner');
	});

	test('browsing by practice area navigates the catalog with the domain applied', async ({
		page,
	}) => {
		await page.goto('/');
		const domainCard = page
			.locator('.domain-grid a', { hasText: 'HR technology & AI' })
			.first();
		await expect(domainCard).toBeVisible();
		await domainCard.click();
		await expect(page).toHaveURL(/\/skills\?domain=hr-technology-ai/);
		await expect(page.getByRole('combobox', { name: 'Practice area' })).toHaveValue(
			'hr-technology-ai',
		);
	});

	test('featured skill cards open the skill guide', async ({ page }) => {
		await page.goto('/');
		const firstCard = page.locator('.skill-grid .skill-card').first();
		const heading = await firstCard.locator('h3').textContent();
		const href = await firstCard.getAttribute('href');
		await firstCard.click();
		await page.waitForURL(new RegExp(href ?? ''));
		// Scoped to .skill-hero: the skill's own Markdown body may contain its
		// own <h1>, so a page-wide heading query would be ambiguous.
		await expect(page.locator('.skill-hero h1')).toHaveText(heading ?? '');
	});
});
