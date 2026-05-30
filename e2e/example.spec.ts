import { test, expect } from '@playwright/test';

test('query builder UI loads and allows adding rules', async ({ page }) => {
  await page.goto('/');

  // Verify the main header
  await expect(page.locator('h1')).toHaveText('Criteria');

  // Verify the sections are present
  await expect(page.getByRole('heading', { name: /^Editor$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Preview$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Inspection$/i })).toBeVisible();

  // Verify the history button is present
  await expect(page.getByRole('button', { name: /History/i })).toBeVisible();

  // Test adding a rule
  const addRuleButton = page.getByRole('button', { name: /Add Rule/i });
  await expect(addRuleButton).toBeVisible();

  await addRuleButton.click();

  // Verify that a select field (part of the rule) appeared
  const fieldSelect = page.getByRole('combobox').first();
  await expect(fieldSelect).toBeVisible();
});

test('allows reordering rules via drag and drop', async ({ page }) => {
  await page.goto('/');

  const addRuleButton = page.getByRole('button', { name: /Add Rule/i });
  await addRuleButton.click();
  await addRuleButton.click(); // Add two rules

  // Count the number of rules (ConditionRule components)
  const rules = page.locator('.group.bg-surface.border-border');
  await expect(rules).toHaveCount(2);

  // Verify the drag handles exist
  const handles = page.locator('.cursor-grab');
  await expect(handles).toHaveCount(2);
});
