import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Checkout step page: address review, order summary, comment box, Place Order.
 */
export class CheckoutPage extends BasePage {
  readonly addressDetailsHeading: Locator;
  readonly reviewOrderHeading: Locator;
  readonly commentTextArea: Locator;
  readonly placeOrderButton: Locator;

  // Address blocks rendered by the site on the checkout page.
  readonly deliveryAddressBlock: Locator;
  readonly billingAddressBlock: Locator;

  constructor(page: Page) {
    super(page);
    this.addressDetailsHeading = page.getByRole("heading", {
      name: "Address Details",
    });
    this.reviewOrderHeading = page.getByRole("heading", {
      name: "Review Your Order",
    });
    this.commentTextArea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.getByRole("link", { name: "Place Order" });

    this.deliveryAddressBlock = page.locator("#address_delivery");
    this.billingAddressBlock = page.locator("#address_invoice");
  }

  /** Assert (not just wait for) both key sections of the checkout screen. */
  async verifyAddressAndOrderVisible(): Promise<void> {
    await expect(this.addressDetailsHeading).toBeVisible();
    await expect(this.reviewOrderHeading).toBeVisible();
  }

  async enterComment(comment: string): Promise<void> {
    await this.commentTextArea.fill(comment);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }

  /** Returns the trimmed text of the delivery address block (TC023). */
  async getDeliveryAddressText(): Promise<string> {
    return (await this.deliveryAddressBlock.innerText()).trim();
  }

  /** Returns the trimmed text of the billing address block (TC023). */
  async getBillingAddressText(): Promise<string> {
    return (await this.billingAddressBlock.innerText()).trim();
  }
}
