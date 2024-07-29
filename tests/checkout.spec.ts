import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from "../fixtures/login-page";
import { ProductsPage } from "../fixtures/products-page";

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
test.describe('Test Case 3: Checkout Page', () => { 
    test.beforeEach(async ({loginPage}) => {
        await loginPage.login();
    });

    test.afterEach(async ({loginPage, page}) => {
        await loginPage.logout();
        await expect(page).toHaveURL('https://www.saucedemo.com/');
      });

    test('should checkout with correct number of inventory items and shipping information', async ({productsPage, page}) => {
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
        const cartItemsCount = await page.locator('[data-test="inventory-item"]').count();
        expect(cartItemsCount).toBe(2);

        // In the Shopping cart page, proceed to the checkout page.
        await page.locator('[data-test="checkout"]').click();

        // On the Shipping information form page, fill out the shipping information form by entering your First Name, Last Name and Zip Code
        const data = {
            firstName: 'John',
            lastName: 'Doe',
            postalCode: '12345'
        };
        await page.fill('[data-test=firstName]', data.firstName);
        await page.fill('[data-test=lastName]', data.lastName);
        await page.fill('[data-test="postalCode"]', data.postalCode);
        await page.locator('[data-test="continue"]').click();

        //  Verify that the changes are reflected on the shipping information form page.
        const checkoutItemsCount = await page.locator('[data-test="inventory-item"]').count();
        expect(checkoutItemsCount).toBe(cartItemsCount);

        // Complete the purchase process and verify that the order is successful.
        await page.locator('[data-test="finish"]').click();
        await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
        await expect(page.locator('[data-test="complete-header"]')).toContainText('Thank you for your order!');
        await expect(page.locator('[data-test="complete-text"]')).toContainText('Your order has been dispatched, and will arrive just as fast as the pony can get there!');
    });

    test('should reject checkout with invalid shipping information', async ({productsPage, page}) => {
        const CHECKOUT_INFORMATION_URL = 'https://www.saucedemo.com/checkout-step-one.html';
        const DEFAULT_PRODUCT_NAME = 'Sauce Labs Fleece Jacket';
        await productsPage.addProductToCart(DEFAULT_PRODUCT_NAME.toLowerCase().replace(/ /g, '-'));
        await productsPage.addRandomProductToCart();
        await page.locator('[data-test="shopping-cart-link"]').click();
        const cartItemsCount = await page.locator('[data-test="inventory-item"]').count();
        expect(cartItemsCount).toBe(2);
        await page.locator('[data-test="checkout"]').click();
       
        const data = {
            firstName: 'John',
            lastName: 'Doe',
            postalCode: '12345'
        };
        
        const invalidContinueAttempt = async (message: string) => {
            await page.locator('[data-test="continue"]').click();
            await expect(page).toHaveURL(CHECKOUT_INFORMATION_URL);
            await expect(page.locator('[data-test="error"]')).toHaveText(message);
        }
        
        // Verify that the checkout information page is still displayed with error message after invalid data.
        await page.fill('[data-test=firstName]', '');
        await invalidContinueAttempt('Error: First Name is required');
        await page.fill('[data-test=firstName]', data.firstName);
        await page.locator('[data-test="continue"]').click();

        await page.fill('[data-test=lastName]', '');
        await invalidContinueAttempt('Error: Last Name is required');
        await page.fill('[data-test=lastName]', data.lastName);
        await page.locator('[data-test="continue"]').click();

        await page.fill('[data-test=postalCode]', '');
        await invalidContinueAttempt('Error: Postal Code is required');
        await page.fill('[data-test=postalCode]', data.postalCode);
        await page.locator('[data-test="continue"]').click();
    });
 });
