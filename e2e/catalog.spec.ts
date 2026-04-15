import { test, expect } from '@playwright/test';

test.describe('Catálogo de Cartas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debe cargar el catálogo de cartas', async ({ page }) => {
    await expect(page.locator('[data-testid="tab-catalog"]')).toBeVisible();
    await expect(page.locator('[data-testid="card-grid"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar cartas en el grid', async ({ page }) => {
    const cards = page.locator('[data-testid="card-item"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('debe tener paginación', async ({ page }) => {
    await expect(page.locator('[data-testid="pagination"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe mostrar sidebar de filtros', async ({ page }) => {
    await expect(page.locator('[data-testid="filters-sidebar"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener filtro de búsqueda', async ({ page }) => {
    await expect(page.locator('[data-testid="search-input"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener filtros de raza, tipo, edición y rareza', async ({ page }) => {
    await expect(page.locator('[data-testid="filter-race"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="filter-type"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="filter-edition"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="filter-rarity"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener filtros de costo y daño', async ({ page }) => {
    await expect(page.locator('[data-testid="filter-cost-min"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="filter-cost-max"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="filter-damage-min"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="filter-damage-max"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe permitir buscar cartas', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('dragon');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(2000);

    const cards = page.locator('[data-testid="card-item"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('debe mostrar modal al hacer click en una carta', async ({ page }) => {
    const firstCard = page.locator('[data-testid="card-item"]').first();
    await firstCard.click();
    await expect(page.locator('[data-testid="card-modal"]')).toBeVisible({ timeout: 5000 });
  });

  test('debe cerrar modal al hacer click en cerrar', async ({ page }) => {
    const firstCard = page.locator('[data-testid="card-item"]').first();
    await firstCard.click();
    await page.waitForTimeout(500);

    const closeButton = page.locator('[data-testid="modal-close"]');
    await closeButton.click();
    await expect(page.locator('[data-testid="card-modal"]')).not.toBeVisible({ timeout: 3000 });
  });

  test('debe funcionar la paginación', async ({ page }) => {
    await expect(page.locator('[data-testid="pagination"]')).toBeVisible({ timeout: 10000 });

    const nextButton = page.locator('[data-testid="pagination-next"]');
    if (await nextButton.isEnabled()) {
      await nextButton.click();
      await page.waitForTimeout(2000);
      const cards = page.locator('[data-testid="card-item"]');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    }
  });
});
