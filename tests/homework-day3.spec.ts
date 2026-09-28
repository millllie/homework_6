import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test('Add two items to the cart', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();

  await homePage.addItemToCart('Combination Pliers');
  await homePage.addItemToCart('Bolt Cutters');
});

test('Remove one item from the cart', async ({ page }) => {
  const homePage = new HomePage(page);

  await homePage.goto();

  await homePage.addItemToCart('Combination Pliers');
  await homePage.addItemToCart('Bolt Cutters');

  await expect(homePage.cartLink).toContainText('2');

  await homePage.removeItemFromCart('Bolt Cutters');

  await expect(homePage.cartLink).toContainText('1');
});