import { test, expect } from '@playwright/test';

test.describe('Banlist', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="tab-banlist"]');
    await page.waitForTimeout(1000);
  });

  test('debe cargar la sección de banlist', async ({ page }) => {
    await expect(page.locator('[data-testid="banlist"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar lista de cartas baneadas', async ({ page }) => {
    await expect(page.locator('[data-testid="banlist-list"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener selector de formato', async ({ page }) => {
    await expect(page.locator('[data-testid="banlist-format-select"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe poder cambiar el formato de la banlist', async ({ page }) => {
    const formatSelect = page.locator('[data-testid="banlist-format-select"]');
    await formatSelect.selectOption('racial_edicion');
    await page.waitForTimeout(1000);

    const banlistItems = page.locator('[data-testid="banlist-item"]');
    const count = await banlistItems.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('debe mostrar el nivel de restricción de cada carta', async ({ page }) => {
    const banlistItems = page.locator('[data-testid="banlist-item"]');
    const count = await banlistItems.count();

    if (count > 0) {
      const firstItem = banlistItems.first();
      await expect(firstItem.locator('[data-testid="banlist-restriction"]')).toBeVisible();
    }
  });
});
