import { Download, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export interface PaymentDetails {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export class PaymentPage extends BasePage {
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmButton: Locator;
  readonly orderSuccessMessage: Locator;
  readonly downloadInvoiceButton: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nameOnCardInput = page.locator('input[name="name_on_card"]');
    this.cardNumberInput = page.locator('input[name="card_number"]');
    this.cvcInput = page.locator('input[name="cvc"]');
    this.expiryMonthInput = page.locator('input[name="expiry_month"]');
    this.expiryYearInput = page.locator('input[name="expiry_year"]');
    this.payAndConfirmButton = page.getByRole("button", { name: "Pay and Confirm Order" });
    // The real post-payment message on automationexercise is:
    //   "Congratulations! Your order has been confirmed!"
    // rendered inside a <b> tag — #success_message is not present on that page.
    this.orderSuccessMessage = page.getByText(
      /Congratulations!\s*Your order has been confirmed/i,
    );
    this.downloadInvoiceButton = page.getByRole("link", {
      name: /download invoice/i,
    });
    this.continueButton = page.getByRole("link", { name: "Continue" });
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    await this.nameOnCardInput.fill(details.nameOnCard);
    await this.cardNumberInput.fill(details.cardNumber);
    await this.cvcInput.fill(details.cvc);
    await this.expiryMonthInput.fill(details.expiryMonth);
    await this.expiryYearInput.fill(details.expiryYear);
  }

  async payAndConfirmOrder(): Promise<void> {
    await this.payAndConfirmButton.click();
  }

  /**
   * Clicks the Download Invoice link and returns the Download handle.
   * Used by TC024 to assert an invoice file was produced.
   */
  async downloadInvoice(): Promise<Download> {
    const [download] = await Promise.all([
      this.page.waitForEvent("download"),
      this.downloadInvoiceButton.click(),
    ]);
    return download;
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
}
