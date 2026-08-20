import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const validDraft = {
	id: 'backup-draft',
	title: 'Imported People Partner',
	status: 'draft',
	version: 1,
	createdAt: '2026-08-20T00:00:00.000Z',
	updatedAt: '2026-08-20T00:00:00.000Z',
	archivedAt: null,
	data: {
		title: 'Imported People Partner',
		department: 'People & Culture',
		location: 'Ho Chi Minh City',
		employmentType: 'Full-time',
		workArrangement: 'Hybrid',
		seniority: 'Senior',
		summary:
			'Own people operations programs that make the employee experience clearer, fairer and easier to scale across a growing organization.',
		responsibilities: [
			'Design and improve people programs across the employee lifecycle.',
		],
		requiredSkills: ['People operations strategy'],
		preferredSkills: [],
		successMetrics: ['Program adoption and employee satisfaction'],
	},
};

function seriousViolations(
	violations: Awaited<ReturnType<AxeBuilder['analyze']>>['violations'],
) {
	return violations.filter(
		(violation) => violation.impact === 'serious' || violation.impact === 'critical',
	);
}

test.describe('JD Builder local-first workspace', () => {
	test('has no serious accessibility violations on the initial editor', async ({
		page,
	}) => {
		await page.goto('/?new=1');
		const results = await new AxeBuilder({ page }).analyze();
		expect(seriousViolations(results.violations)).toEqual([]);
	});

	test('has no serious accessibility violations on drafts workspace', async ({
		page,
	}) => {
		await page.goto('/drafts');
		const results = await new AxeBuilder({ page }).analyze();
		expect(seriousViolations(results.violations)).toEqual([]);
	});

	test('autosaves locally and resumes after reload', async ({ page }) => {
		await page.goto('/?new=1');
		await page.getByLabel('Job title').fill('Local-first People Partner');
		await expect(page.getByText(/Saved/i)).toBeVisible({ timeout: 5_000 });
		await page.reload();
		await expect(page.getByLabel('Job title')).toHaveValue(
			'Local-first People Partner',
		);
	});

	test('creates a genuinely new draft from the workspace', async ({ page }) => {
		await page.goto('/?new=1');
		await page.getByLabel('Job title').fill('Existing People Partner');
		await expect(page.getByText(/Saved/i)).toBeVisible({ timeout: 5_000 });
		await page.getByRole('link', { name: 'My drafts' }).click();
		await page.getByRole('link', { name: 'New draft' }).click();
		await expect(page.getByLabel('Job title')).not.toHaveValue(
			'Existing People Partner',
		);
	});

	test('lists, archives and restores a local draft', async ({ page }) => {
		await page.goto('/?new=1');
		await page.getByLabel('Job title').fill('Archiveable People Partner');
		await expect(page.getByText(/Saved/i)).toBeVisible({ timeout: 5_000 });
		await page.getByRole('link', { name: 'My drafts' }).click();
		await expect(
			page.getByRole('heading', { name: 'Archiveable People Partner' }),
		).toBeVisible();
		await page.getByRole('button', { name: 'Archive' }).click();
		await page.getByLabel('Include archived').check();
		await expect(page.getByText('Archived', { exact: true })).toBeVisible();
		await page.getByRole('button', { name: 'Restore' }).click();
		await expect(page.getByRole('link', { name: 'Open draft' })).toBeVisible();
	});

	test('duplicates and permanently deletes a local draft', async ({ page }) => {
		await page.goto('/?new=1');
		await page.getByLabel('Job title').fill('Duplicable People Partner');
		await expect(page.getByText(/Saved/i)).toBeVisible({ timeout: 5_000 });
		await page.getByRole('link', { name: 'My drafts' }).click();
		await page.getByRole('button', { name: 'Duplicate' }).click();
		await expect(
			page.getByRole('heading', { name: 'Duplicable People Partner (copy)' }),
		).toBeVisible();
		const originalCard = page
			.locator('div')
			.filter({
				has: page.getByRole('heading', {
					name: 'Duplicable People Partner',
					exact: true,
				}),
			})
			.filter({ has: page.getByRole('button', { name: 'Delete' }) })
			.last();
		await originalCard.getByRole('button', { name: 'Delete' }).click();
		await page.getByRole('button', { name: 'Delete permanently' }).click();
		await expect(
			page.getByRole('heading', {
				name: 'Duplicable People Partner',
				exact: true,
			}),
		).toHaveCount(0);
		await expect(
			page.getByRole('heading', { name: 'Duplicable People Partner (copy)' }),
		).toBeVisible();
	});

	test('exports document formats without an account', async ({ page }) => {
		await page.goto('/?new=1');
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

	test('imports valid backup drafts and rejects invalid files', async ({ page }) => {
		await page.goto('/drafts');
		const fileInput = page.locator('input[type="file"]');
		await fileInput.setInputFiles({
			name: 'valid-backup.json',
			mimeType: 'application/json',
			buffer: Buffer.from(JSON.stringify([validDraft])),
		});
		await expect(page.getByText('Workspace updated')).toBeVisible();
		await expect(
			page.getByRole('heading', { name: 'Imported People Partner' }),
		).toBeVisible();

		await fileInput.setInputFiles({
			name: 'invalid-backup.json',
			mimeType: 'application/json',
			buffer: Buffer.from('{not-json'),
		});
		await expect(page.getByText(/backup file is invalid/i)).toBeVisible();
	});
});
