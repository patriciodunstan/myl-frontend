import type { Page, APIRequestContext, APIResponse } from '@playwright/test';

export class APIHelper {
  constructor(private page: Page) {}

  async interceptRequest(urlPattern: string | RegExp): Promise<APIResponse> {
    return new Promise((resolve) => {
      this.page.route(urlPattern, async (route) => {
        const response = await route.fetch();
        resolve(response);
        route.continue();
      });
    });
  }

  async waitForAPIResponse(urlPattern: string | RegExp): Promise<APIResponse> {
    return this.page.waitForResponse(urlPattern);
  }

  async mockAPIResponse(urlPattern: string | RegExp, data: any): Promise<void> {
    await this.page.route(urlPattern, (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(data),
      });
    });
  }

  getAPIUrl(endpoint: string): string {
    return `/api${endpoint}`;
  }
}

export async function waitForCardsLoad(page: Page): Promise<void> {
  await page.waitForSelector('[data-testid="card-grid"]', { timeout: 10000 });
}

export async function waitForSpinner(page: Page): Promise<void> {
  await page.waitForSelector('[data-testid="spinner"]', { state: 'hidden', timeout: 5000 }).catch(() => {});
}

export async function clickTab(page: Page, tabName: string): Promise<void> {
  await page.click(`[data-testid="tab-${tabName}"]`);
  await page.waitForTimeout(500);
}
