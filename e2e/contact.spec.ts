import { test, expect } from '@playwright/test';

test.describe('Contacto', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="tab-contacto"]');
    await page.waitForTimeout(1000);
  });

  test('debe cargar la sección de contacto', async ({ page }) => {
    await expect(page.locator('[data-testid="contact"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener formulario de contacto', async ({ page }) => {
    await expect(page.locator('[data-testid="contact-form"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener campo de nombre', async ({ page }) => {
    await expect(page.locator('[data-testid="contact-name"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener campo de email', async ({ page }) => {
    await expect(page.locator('[data-testid="contact-email"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener campo de tipo', async ({ page }) => {
    await expect(page.locator('[data-testid="contact-type"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener campo de mensaje', async ({ page }) => {
    await expect(page.locator('[data-testid="contact-message"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe tener botón de enviar', async ({ page }) => {
    await expect(page.locator('[data-testid="contact-submit"]')).toBeVisible({ timeout: 10000 });
  });

  test('debe requerir nombre y mensaje', async ({ page }) => {
    const submitButton = page.locator('[data-testid="contact-submit"]');
    await submitButton.click();
    await page.waitForTimeout(1000);

    await expect(page.locator('[data-testid="contact-error"]')).toBeVisible();
  });

  test('debe poder llenar el formulario', async ({ page }) => {
    await page.fill('[data-testid="contact-name"]', 'Test User');
    await page.fill('[data-testid="contact-email"]', 'test@example.com');
    await page.selectOption('[data-testid="contact-type"]', 'Otro');
    await page.fill('[data-testid="contact-message"]', 'Este es un mensaje de prueba');

    const nameValue = await page.inputValue('[data-testid="contact-name"]');
    const emailValue = await page.inputValue('[data-testid="contact-email"]');
    const messageValue = await page.inputValue('[data-testid="contact-message"]');

    expect(nameValue).toBe('Test User');
    expect(emailValue).toBe('test@example.com');
    expect(messageValue).toBe('Este es un mensaje de prueba');
  });
});
