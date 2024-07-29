import { test, expect } from '@playwright/test';

test.describe('Test Case 1: Login Page', () => {
  // Open the web application.
  test.beforeEach(async ({page}) => {
    await page.goto('https://www.saucedemo.com/');
    await page.waitForLoadState('domcontentloaded');
  });
  
  test('should log in with valid credentials and display Home/Products page', async ({page}) => {	
    // Verify that the login page is displayed.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-container"]')).toBeVisible();
    await expect(page).toHaveTitle(/Swag Labs/);

    // Enter valid credentials and click the login button.
    const username = 'standard_user';
    const password = 'secret_sauce';
    await page.fill('[data-test=username]', username);
    await page.fill('[data-test=password]', password);
    await page.click('[data-test=login-button]');
    
    // Verify that the Home/Products page is displayed after successful login.
    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
  });

  test('should reject log in with invalid credentials', async ({page}) => {	
    // Verify that the login page is displayed.
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="login-container"]')).toBeVisible();
    await expect(page).toHaveTitle(/Swag Labs/);

    // Enter invalid credentials and click the login button.
    // Verify that the login page is still displayed with error message after unsuccessful login.
    await page.fill('[data-test=username]', 'invalid_user');
    await page.fill('[data-test=password]', 'invalid_password');
    await page.click('[data-test=login-button]');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username and password do not match any user in this service');
    
    await page.fill('[data-test=username]', '');
    await page.fill('[data-test=password]', '');
    await page.click('[data-test=login-button]');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Username is required');

    await page.fill('[data-test=username]', 'invalid_user');
    await page.fill('[data-test=password]', '');
    await page.click('[data-test=login-button]');
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(page.locator('[data-test="error"]')).toHaveText('Epic sadface: Password is required');
  });
});