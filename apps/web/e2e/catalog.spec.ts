import { expect, test } from '@playwright/test';

test.describe('skills catalog', () => {
	test('search, filter, and sort state lives in the URL', async ({ page }) => {
		await page.goto('/skills?q=hris&domain=hr-technology-ai&tier=full');
		await expect(page.getByRole('searchbox', { name: 'Search skills' })).toHaveValue(
			'hris',
		);
		await expect(page.getByRole('combobox', { name: 'Practice area' })).toHaveValue(
			'hr-technology-ai',
		);
		await expect(page.getByRole('combobox', { name: 'Maturity' })).toHaveValue(
			'full',
		);
		await expect(page.getByText(/\d+ of \d+ skills/)).toBeVisible();
		await expect(page.getByRole('heading', { name: 'HRIS', level: 2 })).toBeVisible();

		await page.getByRole('combobox', { name: 'Sort by' }).selectOption('tier');
		await expect(page).toHaveURL(/sort=tier/);
	});

	test('active filter pills remove one filter at a time', async ({ page }) => {
		await page.goto('/skills?domain=onboarding-offboarding');
		const pill = page.getByRole('button', { name: /Area: Onboarding/ });
		await expect(pill).toBeVisible();
		await pill.click();
		await expect(page).not.toHaveURL(/domain=/);
		await expect(page.getByRole('combobox', { name: 'Practice area' })).toHaveValue(
			'',
		);
	});

	test('"Clear all" resets every filter back to the full catalog', async ({ page }) => {
		await page.goto('/skills?q=payroll&tier=partial');
		await page.getByRole('button', { name: 'Clear all' }).click();
		await expect(page).toHaveURL(/\/skills$/);
		await expect(page.getByRole('searchbox', { name: 'Search skills' })).toHaveValue(
			'',
		);
		await expect(page.getByText(/^\d+ of \d+ skills$/)).toBeVisible();
	});

	test('an unmatched query shows the empty state with a recovery action', async ({
		page,
	}) => {
		await page.goto('/skills?q=zzzzzznotarealskillzzzzzz');
		await expect(
			page.getByRole('heading', { name: 'No matching skills' }),
		).toBeVisible();
		await page.getByRole('button', { name: 'Reset catalog' }).click();
		await expect(page).toHaveURL(/\/skills$/);
		await expect(
			page.getByRole('heading', { name: 'No matching skills' }),
		).not.toBeVisible();
	});
});
