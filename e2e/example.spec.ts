import { test, expect } from '@playwright/test';

test('has title and count works', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page.locator('h2').filter({ hasText: 'Zustand Store' })).toBeVisible();

  // Test the count
  const countValue = page.locator('span.font-mono');
  await expect(countValue).toHaveText('0');

  await page.click('button:has-text("+")');
  await expect(countValue).toHaveText('1');

  await page.click('button:has-text("-")');
  await expect(countValue).toHaveText('0');
});
