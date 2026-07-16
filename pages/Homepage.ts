import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { URLS } from "../config/urls";

export class HomePage extends BasePage {
  readonly homePageLogo: Locator;
  readonly signupLoginLink: Locator;
  readonly loggedInUserLabel: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;

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
}