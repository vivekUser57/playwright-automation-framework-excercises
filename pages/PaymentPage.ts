import { Locator, Page } from "@playwright/test";
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
  readonly payButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.nameOnCardInput = page.locator('input[name="name_on_card"]');
    this.cardNumberInput = page.locator('input[name="card_number"]');
    this.cvcInput = page.locator('input[name="cvc"]');
    this.expiryMonthInput = page.locator('input[name="expiry_month"]');
    this.expiryYearInput = page.locator('input[name="expiry_year"]');
    this.payButton = page.getByText("Pay and Confirm Order");
    this.successMessage = page.locator(".alert-success");
  }

  async fillPaymentDetails(details: PaymentDetails): Promise<void> {
    await this.nameOnCardInput.fill(details.nameOnCard);
    await this.cardNumberInput.fill(details.cardNumber);
    await this.cvcInput.fill(details.cvc);
    await this.expiryMonthInput.fill(details.expiryMonth);
    await this.expiryYearInput.fill(details.expiryYear);
  }

  async payAndConfirmOrder(): Promise<void> {
    await this.payButton.click();
  }
}