import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { URLS } from "../config/urls";

export class HomePage extends BasePage {
  readonly homePageLogo: Locator;
  readonly signupLoginLink: Locator;
  readonly loggedInUserLabel: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly testCaseLink: Locator;
  readonly testCaseText: Locator;
  readonly panel_groupText: Locator;
  // Subscription
  readonly subscriptionText: Locator;
  readonly subscriptionEmail: Locator;
  readonly subscriptionButton: Locator;
  readonly subscriptionSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.homePageLogo = page.locator(
      "img[alt='Website for automation practice']",
    );
    this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
    this.loggedInUserLabel = page
      .locator("a")
      .filter({ hasText: /Logged in as/i });
    this.logoutLink = page.getByRole("link", { name: "Logout" });
    this.deleteAccountLink = page.getByRole("link", { name: "Delete Account" });
    this.testCaseLink = page.locator("li").filter({ hasText: "Test Cases" });
    this.testCaseText = page.locator('b:has-text("TEST CASES")');
    this.panel_groupText = page.locator(
      "//span[contains(text(),'Below is the list of test Cases for you to practic')]",
    );
    this.subscriptionText = page.getByText("SUBSCRIPTION");
    this.subscriptionEmail = page.locator("#susbscribe_email");
    this.subscriptionButton = page.locator("#subscribe");
    this.subscriptionSuccessMessage = page.getByText(
      "You have been successfully subscribed!",
    );
  }

  async navigate(): Promise<void> {
    await super.navigate(URLS.HOME);
  }

  async openLoginPage(): Promise<void> {
    await this.signupLoginLink.click();
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }

  async deleteAccount(): Promise<void> {
    await this.deleteAccountLink.click();
  }

  async openTestCase(): Promise<void> {
    await this.testCaseLink.click();
  }

  async scrollToSubscription(): Promise<void> {
    await this.subscriptionText.scrollIntoViewIfNeeded();
  }

  async subscribe(email: string): Promise<void> {
    await this.subscriptionEmail.fill(email);
    await this.subscriptionButton.click();
  }
}
