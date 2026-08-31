import { expect, test } from '@playwright/test';

test.describe('product surfaces', () => {
	test('the skill graph filters nodes and links into skill pages', async ({ page }) => {
		await page.goto('/graph');
		await expect(
			page.getByRole('heading', { name: 'See how HR skills connect.' }),
		).toBeVisible();

		const card = page.locator('.graph-card').first();
		await expect(card).toBeVisible();
		const link = card.locator('h2 a');
		const href = await link.getAttribute('href');
		expect(href).toMatch(/^\/skills\//);

		await page.getByLabel('Find a skill').fill('zzzzzznotarealskillzzzzzz');
		await expect(
			page.getByRole('heading', { name: 'No connected skills found' }),
		).toBeVisible();
		await page.getByRole('button', { name: 'Reset graph' }).click();
		await expect(page.locator('.graph-card').first()).toBeVisible();
	});

	test('a runtime trace entry expands to show its recorded state', async ({ page }) => {
		await page.goto('/runtime');
		await expect(
			page.getByRole('heading', { name: 'Replay a deterministic workflow trace.' }),
		).toBeVisible();
		await expect(page.getByText('simulated')).toBeVisible();

		const entry = page.locator('.trace-entry__button').first();
		await entry.click();
		await expect(page.locator('.trace-entry__panel-inner pre').first()).toBeVisible();
	});

	test('the evaluation dashboard reports pass rate and per-case detail', async ({
		page,
	}) => {
		await page.goto('/evaluation');
		await expect(
			page.getByRole('heading', {
				name: 'Evaluate planner behavior against golden cases.',
			}),
		).toBeVisible();
		await expect(page.getByText('cases passing')).toBeVisible();

		const card = page.locator('.evaluation-card__button').first();
		await card.click();
		await expect(page.locator('.evaluation-card__panel-inner').first()).toBeVisible();
	});

	test('the changelog lists pending changesets or a clear empty state', async ({
		page,
	}) => {
		await page.goto('/changelog');
		await expect(
			page.getByRole('heading', { name: 'Follow what changed in the platform.' }),
		).toBeVisible();

		const hasReleases = await page.locator('.release-card').count();
		if (hasReleases > 0) {
			await expect(page.locator('.release-card').first()).toBeVisible();
		} else {
			await expect(
				page.getByRole('heading', { name: 'No pending changesets' }),
			).toBeVisible();
		}
	});
});
