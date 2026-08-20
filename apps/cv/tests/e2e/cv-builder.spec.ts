import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('CV Studio local-first workspace', () => {
	test('renders an accessible editor', async ({ page }) => {
		await page.goto('/?new=1');
		await expect(page.getByLabel('Full name')).toBeVisible();
		const results = await new AxeBuilder({ page }).analyze();
		expect(
			results.violations.filter(
				(violation) =>
					violation.impact === 'critical' || violation.impact === 'serious',
			),
		).toEqual([]);
	});

	test('autosaves a CV and resumes it after reload', async ({ page }) => {
		await page.goto('/?new=1');
		await page.getByLabel('Full name').fill('Local-first CV Author');
		await expect(page.getByText(/^Saved /)).toBeVisible({ timeout: 5000 });
		await page.goto('/');
		await page.reload();
		await expect(page.getByLabel('Full name')).toHaveValue('Local-first CV Author');
	});

	test('exports a Markdown CV', async ({ page }) => {
		await page.goto('/?new=1');
		const download = page.waitForEvent('download');
		await page.getByRole('button', { name: 'Markdown' }).click();
		expect((await download).suggestedFilename()).toMatch(/Alex Morgan.*\.md$/);
	});

	test('creates a genuinely new CV', async ({ page }) => {
		await page.goto('/?new=1');
		await page.getByLabel('Full name').fill('Existing CV Author');
		await expect(page.getByText(/^Saved /)).toBeVisible({ timeout: 5000 });
		await page.goto('/?new=1');
		await expect(page.getByLabel('Full name')).not.toHaveValue('Existing CV Author');
	});

	test('manages drafts and backup workspace', async ({ page }) => {
		await page.goto('/?new=1');
		await page.getByLabel('Full name').fill('Workspace CV Author');
		await expect(page.getByText(/^Saved /)).toBeVisible({ timeout: 5000 });
		await page.getByRole('link', { name: 'CV Studio home' }).click();
		await page.goto('/drafts');
		await expect(
			page.getByRole('heading', { name: 'Workspace CV Author' }),
		).toBeVisible();
		await page.getByRole('button', { name: 'Duplicate' }).click();
		await expect(
			page.getByRole('heading', { name: 'Workspace CV Author (copy)' }),
		).toBeVisible();
	});
});
