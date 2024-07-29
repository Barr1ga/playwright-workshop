import { Page } from "@playwright/test";

export class ProductsPage {
    constructor(public readonly page: Page) {}

    async goto() {
      await this.page.goto('https://www.saucedemo.com/');
      await this.page.waitForLoadState('domcontentloaded');
    }

      async addProductToCart(productName: string) {
      await this.page.locator(`[data-test$="${productName}"]`).click();
    }
    
    async addRandomProductToCart() {
      const addToCartButtons = this.page.locator('[data-test^="add-to-cart"]');
      const count = await addToCartButtons.count();
      const randomIndex = Math.floor(Math.random() * count);
      await addToCartButtons.nth(randomIndex).click();
    }
}