import * as fs from 'fs';
import * as path from 'path';

import { test, expect } from '../fixtures';
import { LoginPage } from '../pages/LoginPage';

// ----------------------------------------------------------------------
// TASK 1 — logged in fixture
// ----------------------------------------------------------------------
test.describe('logged in fixture', () => {
  test('account page is open after login', async ({ loggedInPage }) => {
    await expect(loggedInPage).toHaveURL(/\/account/);
  });
});

// ----------------------------------------------------------------------
// TASK 2 — all Playwright hooks
// ----------------------------------------------------------------------
test.describe('catalog hooks', () => {
  let suiteStartTime: number;

  // No page here on purpose — beforeAll must not create/share a page.
  test.beforeAll(() => {
    suiteStartTime = Date.now();
    console.log(`[catalog hooks] suite started at ${new Date(suiteStartTime).toISOString()}`);
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot();
      await testInfo.attach('failure-screenshot', {
        body: screenshot,
        contentType: 'image/png',
      });
    }
  });

  test.afterAll(() => {
    const durationMs = Date.now() - suiteStartTime;
    console.log(`[catalog hooks] suite finished, duration ${durationMs}ms`);
  });

  test('catalog page loaded', async ({ page }) => {
    await expect(page).toHaveURL('https://practicesoftwaretesting.com/');
    await expect(page.locator('app-overview')).toBeVisible();
  });
});

// ----------------------------------------------------------------------
// TASK 3 — CSV driven login tests
// ----------------------------------------------------------------------
type LoginCase = {
  name: string;
  email: string;
  password: string;
  expectedResult: 'success' | 'failure' | string;
};

function readLoginCases(): LoginCase[] {
  const csvPath = path.join(__dirname, '..', 'test-data', 'login-cases.csv');
  const content = fs.readFileSync(csvPath, 'utf-8').trim();

  const [headerLine, ...rows] = content.split('\n');
  const headers = headerLine.split(',').map((h) => h.trim());

  return rows
    .filter((row) => row.trim().length > 0)
    .map((row) => {
      const values = row.split(',').map((v) => v.trim());
      const record = {} as LoginCase;
      headers.forEach((header, index) => {
        (record as any)[header] = values[index];
      });
      return record;
    });
}

const loginCases = readLoginCases();

test.describe('CSV driven login tests', () => {
  for (const loginCase of loginCases) {
    test(`login "${loginCase.name}" should result in ${loginCase.expectedResult}`, async ({
      page,
    }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(loginCase.email, loginCase.password);

      if (loginCase.expectedResult === 'success') {
        await expect(page).toHaveURL(/\/account/);
      } else {
        await expect(loginPage.invalidCredentialsMessage).toBeVisible();
      }
    });
  }
});