import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CheckoutPage extends BasePage {
  readonly addressDetailsHeading: Locator;
  readonly reviewOrderHeading: Locator;
  readonly commentTextArea: Locator;
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addressDetailsHeading = page.getByText("Address Details");
    this.reviewOrderHeading = page.getByText("Review Your Order");
    this.commentTextArea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByText("Place Order");
  }

  async verifyAddressAndOrderVisible(): Promise<void> {
    await this.addressDetailsHeading.waitFor({ state: "visible" });
    await this.reviewOrderHeading.waitFor({ state: "visible" });
  }

  async enterComment(comment: string): Promise<void> {
    await this.commentTextArea.fill(comment);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }
}