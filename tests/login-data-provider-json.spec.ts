import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// Читаем тестовые данные из JSON
const filePath = path.resolve('test-data/login.json');
const loginData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

test('login with data from JSON', async ({ page }) => {
  await page.goto(loginData.url);

  await page.locator('[data-test="email"]').fill(loginData.email);
  await page.locator('[data-test="password"]').fill(loginData.password);
  await page.locator('[data-test="login-submit"]').click();

  await expect(page).toHaveURL(/\/account/);
  await expect(page.locator('[data-test="page-title"]')).toHaveText('My account');
});