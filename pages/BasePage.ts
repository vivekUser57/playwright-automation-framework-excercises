import { expect, Locator, Page } from "@playwright/test";

/**
 * Base class for every Page Object.
 *
 * Owns:
 *   - the shared `page` reference
 *   - the shared site footer (subscription form is present on every page)
 *   - a generic `navigate(url)` helper
 *
 * All page objects extend this, so every POM automatically has
 * subscription support without duplicating locators.
 */
export abstract class BasePage {
  protected readonly page: Page;

  // ── Footer / Subscription (present on every page) ─────────────────
  readonly subscriptionHeading: Locator;
  readonly subscriptionEmailInput: Locator;
  readonly subscriptionSubmitButton: Locator;
  readonly subscriptionSuccessMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    this.subscriptionHeading = this.page.locator("h2", {
      hasText: "SUBSCRIPTION",
    });
    // NOTE: the site's DOM misspells the id as "susbscribe_email" — keep it.
    this.subscriptionEmailInput = this.page.locator("#susbscribe_email");
    this.subscriptionSubmitButton = this.page.locator("#subscribe");
    this.subscriptionSuccessMessage = this.page.getByText(
      "You have been successfully subscribed!",
    );
  }

  /** Navigate to any absolute URL and wait for DOM to be ready. */
  async navigate(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  /** Scroll the footer subscription block into view and assert it is visible. */
  async scrollToSubscription(): Promise<void> {
    // Force scroll to the very bottom first — the footer is lazily positioned
    // and scrollIntoViewIfNeeded alone can time out before the browser paints it.
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.subscriptionHeading.scrollIntoViewIfNeeded();
    await expect(this.subscriptionHeading).toBeVisible();
  }

  /**
   * Submits the subscription form and asserts the success banner shows.
   * The assertion lives in the POM so every test gets it for free.
   */
  async subscribeAndVerify(email: string): Promise<void> {
    await this.subscriptionEmailInput.fill(email);
    await this.subscriptionSubmitButton.click();
    await expect(this.subscriptionSuccessMessage).toBeVisible();
  }
}
