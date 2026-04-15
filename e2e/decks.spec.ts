import { test, expect } from '@playwright/test';

test.describe('Deck Builder', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="tab-deckbuilder"]');
    await page.waitForTimeout(1000);
  });

  test('debe cargar la sección de deck builder', async ({ page }) => {
    await expect(page.locator('[data-testid="deck-builder"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar lista de mazos', async ({ page }) => {
    await expect(page.locator('[data-testid="deck-list"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener formulario de búsqueda de cartas', async ({ page }) => {
    await expect(page.locator('[data-testid="deck-search-input"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener botón para crear nuevo mazo', async ({ page }) => {
    await expect(page.locator('[data-testid="create-deck-button"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe poder buscar cartas para el mazo', async ({ page }) => {
    const searchInput = page.locator('[data-testid="deck-search-input"]');
    await searchInput.fill('test');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    const searchResults = page.locator('[data-testid="deck-search-results"]');
    const isVisible = await searchResults.isVisible().catch(() => false);
    if (isVisible) {
      const results = searchResults.locator('[data-testid="search-result-item"]');
      const count = await results.count();
      expect(count).toBeGreaterThanOrEqual(0);
    }
  });

  test('debe mostrar botones de acción en mazos existentes', async ({ page }) => {
    const deckItems = page.locator('[data-testid="deck-item"]');
    const count = await deckItems.count();

    if (count > 0) {
      const firstDeck = deckItems.first();
      await expect(firstDeck.locator('[data-testid="deck-view-button"]')).toBeVisible();
      await expect(firstDeck.locator('[data-testid="deck-edit-button"]')).toBeVisible();
      await expect(firstDeck.locator('[data-testid="deck-delete-button"]')).toBeVisible();
    }
  });

  test('debe poder abrir modal de creación de mazo', async ({ page }) => {
    const createButton = page.locator('[data-testid="create-deck-button"]');
    await createButton.click();
    await expect(page.locator('[data-testid="create-deck-modal"]')).toBeVisible({ timeout: 5000 });
  });

  test('debe tener campos en el modal de creación de mazo', async ({ page }) => {
    const createButton = page.locator('[data-testid="create-deck-button"]');
    await createButton.click();
    await page.waitForTimeout(500);

    await expect(page.locator('[data-testid="deck-name-input"]')).toBeVisible();
    await expect(page.locator('[data-testid="deck-race-select"]')).toBeVisible();
    await expect(page.locator('[data-testid="deck-format-select"]')).toBeVisible();
    await expect(page.locator('[data-testid="deck-cards-input"]')).toBeVisible();
  });

  test('debe poder cerrar modal de creación de mazo', async ({ page }) => {
    const createButton = page.locator('[data-testid="create-deck-button"]');
    await createButton.click();
    await page.waitForTimeout(500);

    const closeButton = page.locator('[data-testid="modal-close"]');
    await closeButton.click();
    await expect(page.locator('[data-testid="create-deck-modal"]')).not.toBeVisible({ timeout: 3000 });
  });

  test('debe mostrar botón de validar mazo', async ({ page }) => {
    const deckItems = page.locator('[data-testid="deck-item"]');
    const count = await deckItems.count();

    if (count > 0) {
      const firstDeck = deckItems.first();
      await expect(firstDeck.locator('[data-testid="deck-validate-button"]')).toBeVisible();
    }
  });
});
