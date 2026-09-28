import { test, expect } from '@playwright/test';

test('Search for pliers', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');

  const searchInput = page.getByRole('textbox', { name: 'Search' });

  await searchInput.dblclick();
  await searchInput.fill('Pliers');

  await expect(searchInput).toHaveValue('Pliers');

  const searchButton = page.getByRole('button', { name: 'Search' });
  await searchButton.click();

  const productTitles = page.locator('.card-title');

  await expect(productTitles).toHaveCount(4);
});


test('Filter catalog to hammers', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');

  const hammerCheckbox = page.getByRole('checkbox', { name: 'Hammer' });

  await hammerCheckbox.check();

  await expect(hammerCheckbox).toBeChecked();

  const productTitles = page.locator('.card-title');

  await expect(productTitles).toHaveCount(7);

  await hammerCheckbox.uncheck();

  await expect(hammerCheckbox).not.toBeChecked();
});


test('Sort products by name', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');

  const sortDropdown = page.getByRole('combobox', { name: 'Sort' });

  await sortDropdown.selectOption({ label: 'Name (A - Z)' });

  const productTitles = page.locator('.card-title');

  await expect(productTitles).toHaveCount(9);

  const firstTitle = productTitles.first();

  await expect(firstTitle).toContainText('Adjustable Wrench');
  await expect(firstTitle).toHaveClass(/card-title/);
});


test('Inspect product and add two items to cart', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');

  const combinationPliers = page.getByRole('link', {
    name: 'Combination Pliers'
  });

  await combinationPliers.click();

  await expect(
    page.getByRole('heading', {
      name: 'Combination Pliers',
      level: 1
    })
  ).toBeVisible();

  const quantity = page.getByRole('spinbutton');

  await expect(quantity).toHaveValue('1');

  const increaseButton = page.getByRole('button', {
    name: /Increase quantity/i
  });

  await increaseButton.click();

  await expect(quantity).toHaveValue('2');

  await page.getByRole('button', {
    name: /Add to cart/i
  }).click();

  await expect(page.getByRole('alert')).toContainText(
    'Product added to shopping cart'
  );

  const cartLink = page.getByRole('link', { name: /cart/i });

  await expect(cartLink).toBeVisible();
  await expect(cartLink).toContainText('2');
});