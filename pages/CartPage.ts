import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  readonly cartLink: Locator;

  constructor(page: Page) {
    super(page);

    this.cartLink = page.getByRole("link", {
      name: "Cart",
    });
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
