import { expect, test } from '@playwright/test';

test.describe('Skill Explorer progressive results', () => {
	test('starts at six skills, loads six more, and keeps previous results while a query is pending', async ({
		page,
	}) => {
		await page.goto('/', { waitUntil: 'networkidle' });
		await expect(
			page.getByRole('heading', {
				name: 'Find evidence for the people work in front of you.',
			}),
		).toBeVisible({ timeout: 15_000 });
		const rows = page.locator('#workspace-main article');
		await expect(rows).toHaveCount(6);
		await expect(
			page.getByText('Showing 6 of 146 skills', { exact: true }),
		).toBeVisible();

		await page.getByRole('button', { name: 'Load 6 more skills' }).click();
		await expect(rows).toHaveCount(12);
		await expect(
			page.getByText('Showing 12 of 146 skills', { exact: true }),
		).toBeVisible();

		const searchInput = page.getByRole('searchbox', { name: 'Search skills' });
		await searchInput.fill('onboarding');
		const pendingSearch = page.getByText('Searching registry…', { exact: true });
		await expect(pendingSearch).toBeVisible();
		await expect(rows).toHaveCount(12);
		await expect(pendingSearch).toBeHidden();
		await expect(rows).toHaveCount(6);
		await expect(
			page.getByText(/Showing 6 of \d+ skills/, { exact: true }),
		).toBeVisible();

		await page.goto('/?domain=learning-development&view=all', {
			waitUntil: 'networkidle',
		});
		await expect(
			page.getByRole('heading', {
				name: 'Find evidence for the people work in front of you.',
			}),
		).toBeVisible({ timeout: 15_000 });
		await expect(page.locator('#workspace-main article')).toHaveCount(6);
		await page.getByRole('button', { name: 'Load 1 more skill' }).click();
		await expect(page.locator('#workspace-main article')).toHaveCount(7);
		await expect(
			page.getByRole('button', { name: /Load \d+ more skill/ }),
		).toHaveCount(0);
	});
});
