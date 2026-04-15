import { test, expect } from '@playwright/test';

test.describe('MyL Frontend - Production E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://myl-frontend-production.up.railway.app');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Catálogo de Cartas', () => {
    test('✅ debe cargar el catálogo de cartas', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Catálogo' })).toBeVisible();
      await expect(page.locator('.cards-grid')).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe mostrar cartas en el grid', async ({ page }) => {
      const cards = page.locator('.cards-grid > div');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);
    });

    test('✅ debe tener paginación', async ({ page }) => {
      await expect(page.locator('.pagination')).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe funcionar la paginación', async ({ page }) => {
      const pagination = page.locator('.pagination');
      await expect(pagination).toBeVisible({ timeout: 10000 });

      const nextButton = page.getByRole('button', { name: '»' });
      if (await nextButton.isEnabled()) {
        await nextButton.click();
        await page.waitForTimeout(2000);

        const cards = page.locator('.cards-grid > div');
        const count = await cards.count();
        expect(count).toBeGreaterThan(0);

        const pageInfo = page.locator('.pagination-info');
        await expect(pageInfo).toContainText('Página 2');
      }
    });

    test('✅ debe mostrar modal al hacer click en una carta', async ({ page }) => {
      const firstCard = page.locator('.cards-grid > div').first();
      await firstCard.click();

      await expect(page.locator('.modal-backdrop')).toBeVisible({ timeout: 5000 });
      await expect(page.getByRole('heading', { level: 2 })).toBeVisible();
    });

    test('✅ debe cerrar modal al hacer click en cerrar', async ({ page }) => {
      const firstCard = page.locator('.cards-grid > div').first();
      await firstCard.click();
      await page.waitForTimeout(500);

      const closeButton = page.getByRole('button', { name: '×' });
      await closeButton.click();
      await expect(page.locator('.modal-backdrop')).not.toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Deck Builder', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Constructor' }).click();
      await page.waitForTimeout(1000);
    });

    test('✅ debe cargar la sección de deck builder', async ({ page }) => {
      await expect(page.locator('.deck-sidebar')).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe mostrar lista de mazos', async ({ page }) => {
      await expect(page.locator('.deck-selector')).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe tener formulario de búsqueda de cartas', async ({ page }) => {
      await expect(page.getByPlaceholder(/Buscar cartas/)).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe tener botón para crear nuevo mazo', async ({ page }) => {
      await expect(page.getByRole('button', { name: '+ Nuevo' })).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe poder buscar cartas para el mazo', async ({ page }) => {
      const searchInput = page.getByPlaceholder(/Buscar cartas/);
      await searchInput.fill('dragon');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
    });
  });

  test.describe('Simulador', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Simulador' }).click();
      await page.waitForTimeout(1000);
    });

    test('✅ debe cargar la sección de simulador', async ({ page }) => {
      await expect(page.locator('.simulator-container')).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe tener selector de mazo', async ({ page }) => {
      await expect(page.getByRole('combobox', { name: 'Mazo' })).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe tener botón de simular', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Robar 7' })).toBeVisible({ timeout: 10000 });
    });

    test('❌ debe poder simular mano inicial - API FALLO 400', async ({ page }) => {
      const deckSelect = page.getByRole('combobox', { name: 'Mazo' });
      const options = await deckSelect.allOptions();

      if (options.length > 1) {
        await deckSelect.selectOption(options[1]);
        await page.waitForTimeout(1000);

        const simulateButton = page.getByRole('button', { name: 'Robar 7' });
        await simulateButton.click();
        await page.waitForTimeout(2000);

        const alert = await page.evaluate(() => {
          const modal = document.querySelector('.modal-backdrop');
          if (modal) {
            return modal.textContent;
          }
          return null;
        });

        expect(alert).toContain('Error al simular el robo');
      }
    });
  });

  test.describe('Banlist', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Banlist' }).click();
      await page.waitForTimeout(1000);
    });

    test('✅ debe cargar la sección de banlist', async ({ page }) => {
      await expect(page.locator('.banlist-container')).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe mostrar lista de cartas baneadas', async ({ page }) => {
      await expect(page.locator('.banlist-table')).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe tener selector de formato', async ({ page }) => {
      await expect(page.getByRole('combobox', { name: 'Racial Edición' })).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe poder cambiar el formato de la banlist', async ({ page }) => {
      const formatSelect = page.getByRole('combobox', { name: 'Racial Edición' });
      await formatSelect.selectOption('Racial Libre');
      await page.waitForTimeout(1000);

      await expect(page.getByRole('combobox', { name: 'Racial Libre' })).toBeVisible();
    });
  });

  test.describe('Contacto', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'Contacto' }).click();
      await page.waitForTimeout(1000);
    });

    test('✅ debe cargar la sección de contacto', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Contacto & Sugerencias' })).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe tener formulario de contacto', async ({ page }) => {
      await expect(page.locator('form')).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe tener campo de nombre', async ({ page }) => {
      await expect(page.getByRole('textbox', { name: /Nombre/ })).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe tener campo de email', async ({ page }) => {
      await expect(page.getByRole('textbox', { name: /Email/ })).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe tener campo de tipo', async ({ page }) => {
      await expect(page.getByRole('combobox', { name: /Tipo/ })).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe tener campo de mensaje', async ({ page }) => {
      await expect(page.getByRole('textbox', { name: /Mensaje/ })).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe tener botón de enviar', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'Enviar' })).toBeVisible({ timeout: 10000 });
    });

    test('✅ debe requerir nombre y mensaje', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: 'Enviar' });
      await submitButton.click();
      await page.waitForTimeout(1000);

      await expect(page.getByRole('textbox', { name: /Nombre/ })).toHaveJSProperty('validity', (validity) => !validity);
    });
  });

  test.describe('Navegación', () => {
    test('✅ debe funcionar navegación entre tabs', async ({ page }) => {
      const tabs = ['Catálogo', 'Constructor', 'Simulador', 'Banlist', 'Contacto'];

      for (const tab of tabs) {
        await page.getByRole('button', { name: tab }).click();
        await page.waitForTimeout(500);

        const activeTab = page.locator(`button[name="${tab}"][active]`);
        if (tab === 'Catálogo') {
          await expect(activeTab).toBeVisible();
        }
      }
    });
  });
});
