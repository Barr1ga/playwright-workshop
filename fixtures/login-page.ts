import { Page } from "@playwright/test";

type LoginCredentials = {username?: string, password?: string}

export class LoginPage {
    constructor(public readonly page: Page) {}

    async goto() {
        await this.page.goto('https://www.saucedemo.com/');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async fillCredentials(data?: LoginCredentials) {
        await this.page.fill('[data-test=username]', data?.username ?? 'standard_user');	
        await this.page.fill('[data-test=password]', data?.password ?? 'secret_sauce');
    }

    async submitCredentials() {
        await this.page.click('[data-test=login-button]');
    }

    async login(data?: LoginCredentials) {
        await this.goto();
        await this.fillCredentials(data);
        await this.submitCredentials();
    }

    async logout() {
        await this.page.getByRole('button', { name: 'Open Menu' }).click();
        await this.page.locator('[data-test="logout-sidebar-link"]').click();
    }
}