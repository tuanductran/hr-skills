import { expect, test } from '@playwright/test';

test.describe('JD Builder', () => {
	test('loads role presets and starts a draft', async ({ page }) => {
		const presets = await page.request.get('/api/role-presets');
		expect(presets.ok()).toBe(true);
		const payload = await presets.json();
		expect(payload.data.length).toBeGreaterThan(0);

		await page.goto('/');
		await expect(page.getByRole('heading', { level: 1 })).toContainText(
			'Build a job description people can trust.',
		);
		await page.getByRole('button', { name: 'Start building' }).click();
		await expect(page).toHaveURL(/\/builder/);
		await expect(
			page.getByRole('heading', {
				name: 'Shape the work, not an idealized person.',
			}),
		).toBeVisible();
	});

	test('moves through sections and previews the draft', async ({ page }) => {
		await page.goto('/builder?preset=recruiter');
		await page.getByRole('button', { name: 'Save & continue' }).click();
		await expect(
			page.getByText('Role overview', { exact: true }).last(),
		).toBeVisible();

		for (let index = 0; index < 4; index += 1) {
			await page.getByRole('button', { name: 'Save & continue' }).click();
		}
		await expect(
			page.getByText('Success measures', { exact: true }).last(),
		).toBeVisible();
		await page.getByRole('button', { name: 'Add success measure' }).click();
		await expect(page.getByPlaceholder(/Build a qualified pipeline/)).toBeVisible();

		await page.getByRole('button', { name: 'Preview document' }).click();
		await expect(
			page.getByRole('heading', { name: 'Candidate-facing preview' }),
		).toBeVisible();
	});

	test('has no horizontal overflow on the mobile viewport', async ({ page }) => {
		await page.goto('/');
		const overflow = await page.evaluate(
			() =>
				document.documentElement.scrollWidth >
				document.documentElement.clientWidth,
		);
		expect(overflow).toBe(false);
	});
});
