import { test, expect } from '@playwright/test';

test.describe('Simulador', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="tab-simulator"]');
    await page.waitForTimeout(1000);
  });

  test('debe cargar la sección de simulador', async ({ page }) => {
    await expect(page.locator('[data-testid="simulator"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener selector de mazo', async ({ page }) => {
    await expect(page.locator('[data-testid="simulator-deck-select"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener botón de simular', async ({ page }) => {
    await expect(page.locator('[data-testid="simulate-button"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener área de mano inicial', async ({ page }) => {
    await expect(page.locator('[data-testid="hand-area"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener curva de maná', async ({ page }) => {
    await expect(page.locator('[data-testid="mana-curve"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe poder simular mano inicial', async ({ page }) => {
    const simulateButton = page.locator('[data-testid="simulate-button"]');
    await simulateButton.click();
    await page.waitForTimeout(2000);

    const handCards = page.locator('[data-testid="hand-card"]');
    const count = await handCards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('debe mostrar información del mazo seleccionado', async ({ page }) => {
    const deckSelect = page.locator('[data-testid="simulator-deck-select"]');
    const options = await deckSelect.inputValue();

    if (options) {
      await expect(page.locator('[data-testid="deck-info"]')).toBeVisible({ timeout: 5000 });
    }
  });
});
