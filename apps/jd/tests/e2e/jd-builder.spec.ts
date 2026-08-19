import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('JD Builder local-first workspace', () => {
	test('has no serious accessibility violations on the initial editor', async ({
		page,
	}) => {
		await page.goto('/');
		const results = await new AxeBuilder({ page }).analyze();
		expect(
			results.violations.filter(
				(violation) =>
					violation.impact === 'serious' || violation.impact === 'critical',
			),
		).toEqual([]);
	});

	test('autosaves locally and resumes after reload', async ({ page }) => {
		await page.goto('/');
		await page.getByLabel('Job title').fill('Local-first People Partner');
		await expect(page.getByText(/Saved/i)).toBeVisible({ timeout: 5_000 });
		await page.reload();
		await expect(page.getByLabel('Job title')).toHaveValue(
			'Local-first People Partner',
		);
	});

	test('lists, archives and restores a local draft', async ({ page }) => {
		await page.goto('/');
		await page.getByLabel('Job title').fill('Archiveable People Partner');
		await expect(page.getByText(/Saved/i)).toBeVisible({ timeout: 5_000 });
		await page.getByRole('link', { name: 'My drafts' }).click();
		await expect(
			page.getByRole('heading', { name: 'Archiveable People Partner' }),
		).toBeVisible();
		await page.getByRole('button', { name: 'Archive' }).click();
		await page.getByLabel('Include archived').check();
		await expect(page.getByText('Archived')).toBeVisible();
		await page.getByRole('button', { name: 'Restore' }).click();
		await expect(page.getByRole('button', { name: 'Open draft' })).toBeVisible();
	});

	test('exports document formats without an account', async ({ page }) => {
		await page.goto('/');
		await page.getByLabel('Job title').fill('Exportable People Partner');
		await expect(page.getByText(/Saved/i)).toBeVisible({ timeout: 5_000 });

		const jsonDownload = page.waitForEvent('download');
		await page.getByRole('button', { name: 'JSON' }).click();
		expect((await jsonDownload).suggestedFilename()).toMatch(
			/exportable-people-partner\.json$/,
		);

		const markdownDownload = page.waitForEvent('download');
		await page.getByRole('button', { name: 'Markdown' }).click();
		expect((await markdownDownload).suggestedFilename()).toMatch(
			/exportable-people-partner\.md$/,
		);

		const docxDownload = page.waitForEvent('download');
		await page.getByRole('button', { name: 'DOCX' }).click();
		expect((await docxDownload).suggestedFilename()).toMatch(
			/exportable-people-partner\.docx$/,
		);
	});
});
