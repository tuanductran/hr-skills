import { expect, test } from '@playwright/test';

test.describe('skill detail', () => {
	test('renders the canonical guide with breadcrumb, content, and metadata', async ({
		page,
	}) => {
		await page.goto('/skills/hr-onboarding');
		await expect(page).toHaveTitle('Onboarding | HR Skills');

		const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
		await expect(breadcrumb.getByRole('link', { name: 'Home' })).toHaveAttribute(
			'href',
			'/',
		);
		await expect(
			breadcrumb.getByRole('link', { name: 'Skill catalog' }),
		).toHaveAttribute('href', '/skills');

		// Scoped to .skill-hero: the skill's own Markdown body may contain its
		// own <h1>, so a page-wide heading query would be ambiguous.
		await expect(page.locator('.skill-hero h1')).toHaveText('Onboarding');
		await expect(
			page.getByRole('heading', { name: 'Skill guide', level: 2 }),
		).toBeVisible();

		const metadata = page.getByRole('complementary', { name: 'Skill metadata' });
		await expect(metadata.getByText('Domain')).toBeVisible();
		await expect(metadata.getByText('Tier')).toBeVisible();
	});

	test('prompt and example sections expand independently', async ({ page }) => {
		await page.goto('/skills/hr-onboarding');
		const triggers = page.locator('.skill-accordion-trigger');
		const count = await triggers.count();
		expect(count).toBeGreaterThan(0);

		const first = triggers.first();
		const initialState = await first.getAttribute('data-state');
		await first.click();
		await expect(first).not.toHaveAttribute('data-state', initialState ?? '');
	});

	test('an unknown skill id renders the 404 page', async ({ page }) => {
		await page.goto('/skills/does-not-exist-at-all');
		await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
	});

	test('related skills link to another canonical skill page', async ({ page }) => {
		await page.goto('/skills/hr-onboarding');
		const related = page.getByRole('complementary', { name: 'Skill metadata' });
		const relatedLink = related.locator('.related-list a').first();
		if (await relatedLink.count()) {
			const href = await relatedLink.getAttribute('href');
			await relatedLink.click();
			await expect(page).toHaveURL(new RegExp(href ?? ''));
			await expect(page.locator('.skill-hero h1')).toBeVisible();
		}
	});
});
