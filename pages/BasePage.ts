import { expect, Locator, Page } from '@playwright/test';

export abstract class BasePage {

    protected readonly page: Page;

    constructor(page: Page) {

        this.page = page;

    }

    async navigate(url: string): Promise<void> {

        await this.page.goto(url, {
            waitUntil: 'domcontentloaded'
        });

    }

    async click(locator: Locator): Promise<void> {

        await expect(locator).toBeVisible();

        await locator.click();

    }

    async fill(locator: Locator, value: string): Promise<void> {

        await expect(locator).toBeVisible();

        await locator.fill(value);

    }

}