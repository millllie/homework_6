import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly productTitles: Locator;
  readonly productPrices: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartLink = page.getByRole('link', { name: /cart/i });

    this.sortDropdown = page.getByRole('combobox', { name: /sort/i });

    this.productTitles = page.locator('.card-title');

    this.productPrices = page.locator('.price');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://practicesoftwaretesting.com/');
  }

  async addItemToCart(productName: string): Promise<void> {
    if (this.page.url().includes('/product/')) {
      await this.page.goBack();
    }

    const productTitle = this.productTitles.filter({
      hasText: new RegExp(`^\\s*${productName}\\s*$`),
    });

    await productTitle.waitFor({ state: 'visible' });
    const productCard = productTitle.locator('..').locator('..');
    await productCard.click({ force: true });

    await this.page
      .getByRole('button', { name: /Add to cart/i })
      .click();
  }

  async removeItemFromCart(productName: string): Promise<void> {
    await this.cartLink.click();

    const productRow = this.page
      .locator('tr')
      .filter({
        has: this.page.getByText(productName, { exact: true }),
      });

    await productRow.locator('td').last().locator('svg').click();
  }
}