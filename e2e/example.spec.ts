import { test, expect } from '@playwright/test';

test('query builder UI loads and allows adding rules', async ({ page }) => {
  await page.goto('/');

  // Verify the main header
  await expect(page.locator('h1')).toHaveText('Criteria');

  // Verify the query editor is present
  await expect(page.getByRole('heading', { name: /Query Editor/i })).toBeVisible();

  // Verify the live preview panel is present (specific match)
  await expect(page.getByRole('heading', { name: /Live Preview/i })).toBeVisible();

  // Verify the results panel is present
  await expect(page.getByRole('heading', { name: /Results/i })).toBeVisible();

  // Test adding a rule
  const addRuleButton = page.getByRole('button', { name: /Add Rule/i });
  await expect(addRuleButton).toBeVisible();

  await addRuleButton.click();

  // Verify that a select field (part of the rule) appeared
  const fieldSelect = page.getByRole('combobox').first();
  await expect(fieldSelect).toBeVisible();
});
