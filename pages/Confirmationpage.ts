import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ConfirmationPage extends BasePage {
  readonly accountCreatedMessage: Locator;
  readonly accountDeletedMessage: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.accountCreatedMessage = page
      .locator("b")
      .filter({ hasText: /account created!/i });
    this.accountDeletedMessage = page
      .locator("b")
      .filter({ hasText: /account deleted!/i });
    this.continueButton = page.getByRole("link", { name: "Continue" });
  }

  async continue(): Promise<void> {
    await this.continueButton.click();
  }
}