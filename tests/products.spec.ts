import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '../fixtures/login-page';
import { ProductsPage } from '../fixtures/products-page';

type Fixtures = {
    loginPage: LoginPage;
    productsPage: ProductsPage;
  };

const test = baseTest.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    productsPage: async ({ page }, use) => {
        await use(new ProductsPage(page));
    },
  });

// TODO: Verify that there are 2 products successfully added to the cart.
test.describe('Test Case 2: Adding Products', () => { 
    test.beforeEach(async ({loginPage}) => {
        await loginPage.login();
    });

    test.afterEach(async ({loginPage, page}) => {
        await loginPage.logout();
        await expect(page).toHaveURL('https://www.saucedemo.com/');
      });

    test('should add a specific product to the cart', async ({productsPage, page}) => {
        // Add one specific product (Sauce Labs Fleece Jacket) to the shopping cart.
        // Assuming we only know the name else locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]')
        const DEFAULT_PRODUCT_NAME = 'Sauce Labs Fleece Jacket';
        await productsPage.addProductToCart(DEFAULT_PRODUCT_NAME.toLowerCase().replace(/ /g, '-'));

        // Add any one random product to the shopping cart, selection should be dynamic.
        await productsPage.addRandomProductToCart();

        // await expect(page.locator('[data-test="shopping-cart-badge"')).toBeVisible();
        
        // Navigate to the shopping cart
        await page.locator('[data-test="shopping-cart-link"]').click();
        
        // Verify that there are 2 products successfully added to the cart.
        const count = await page.locator('[data-test="inventory-item"]').count();
        expect(count).toBe(2);

        // In the Shopping cart page, proceed to the checkout page.
        await page.locator('[data-test="checkout"]').click();
    });
 });



