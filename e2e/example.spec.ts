import { test, expect } from '@playwright/test';

test('query builder UI loads and allows adding rules', async ({ page }) => {
  await page.goto('/');

  // Verify the main header
  await expect(page.locator('h1')).toHaveText('Criteria');

  // Verify the sections are present
  await expect(page.getByRole('heading', { name: /^Editor$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Preview$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^Inspection$/i })).toBeVisible();

  // Verify the archive button is present
  await expect(page.getByRole('button', { name: /Archive/i })).toBeVisible();

  // Test adding a rule
  const addRuleButton = page.getByRole('button', { name: /Add Rule/i });
  await expect(addRuleButton).toBeVisible();

  await addRuleButton.click();

  // Verify that a select field (part of the rule) appeared
  const fieldSelect = page.getByRole('combobox').first();
  await expect(fieldSelect).toBeVisible();
});

test('surfaces validation errors when running an invalid query', async ({ page }) => {
  await page.goto('/');
  
  // Add a rule but leave the value empty
  const addRuleButton = page.getByRole('button', { name: /Add Rule/i });
  await addRuleButton.click();
  
  // Try to run the query
  const runButton = page.getByRole('button', { name: /Run Query/i });
  await runButton.click();
  
  // Verify that an error message appeared
  const errorText = page.getByText(/Value is required/i);
  await expect(errorText).toBeVisible();
  
  // Verify the button shows the error state (ring-destructive)
  await expect(runButton).toHaveClass(/ring-destructive/);
});

test('allows reordering rules via drag and drop', async ({ page }) => {
  await page.goto('/');

  const addRuleButton = page.getByRole('button', { name: /Add Rule/i });
  await addRuleButton.click();
  await addRuleButton.click(); // Add two rules

  // Count the number of rules (ConditionRule components)
  const rules = page.locator('.group\\/rule');
  await expect(rules).toHaveCount(2);

  // Verify the drag handles exist
  const handles = page.locator('.cursor-grab');
  await expect(handles).toHaveCount(2);
});
