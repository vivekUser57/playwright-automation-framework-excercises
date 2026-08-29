import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { URLS } from "../config/urls";

/**
 * Home page + top navbar (navbar links are reachable from every page,
 * so they live here for convenience — the navbar is not a separate POM).
 * Also owns the "Recommended items" section and the scroll-up arrow.
 */
export class HomePage extends BasePage {
  readonly homePageLogo: Locator;
  readonly signupLoginLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly testCaseLink: Locator;
  readonly testCaseText: Locator;

  /** Nav element that reads "Logged in as <name>". Single source of truth. */
  readonly loggedInUserLabel: Locator;

  // ── Recommended items section (near the bottom of home) ─────────────
  readonly recommendedItemsHeading: Locator;
  readonly recommendedProductCards: Locator;
  readonly recommendedAddToCartLinks: Locator;

  /** Scroll-to-top arrow that appears once the user scrolls down. */
  readonly scrollUpArrow: Locator;

  constructor(page: Page) {
    super(page);

    this.homePageLogo = page.locator(
      "img[alt='Website for automation practice']",
    );
    this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
    this.logoutLink = page.getByRole("link", { name: "Logout" });
    this.deleteAccountLink = page.getByRole("link", { name: "Delete Account" });
    // Navbar link is scoped by href because there are two "Test Cases" links on
    // the home page (the navbar entry and the mid-page CTA) — role-based match
    // would trip strict mode.
    this.testCaseLink = page.locator(".shop-menu a[href='/test_cases']");
    // Match only the H2 page title — the test_cases page also contains an <h5>
    // subtitle and many <h4 class="panel-title">Test Case N: ...</h4> rows.
    this.testCaseText = page.getByRole("heading", { level: 2, name: "Test Cases" });

    this.loggedInUserLabel = page
      .locator("a")
      .filter({ hasText: /Logged in as/i });

    this.recommendedItemsHeading = page.getByRole("heading", {
      name: /recommended items/i,
    });
    this.recommendedProductCards = page.locator(
      ".recommended_items .product-image-wrapper",
    );
    this.recommendedAddToCartLinks = page.locator(
      ".recommended_items .productinfo a.add-to-cart",
    );

    this.scrollUpArrow = page.locator("#scrollUp");
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

  /** Force-scroll the window to the very bottom (used by TC025 / TC026). */
  async scrollToBottom(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /** Force-scroll the window back to the top (used by TC026). */
  async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  /** Click the scroll-up arrow that appears after scrolling (TC025). */
  async clickScrollUpArrow(): Promise<void> {
    await this.scrollUpArrow.click();
  }

  /** Returns the visible product name of the Nth recommended item (1-based). */
  async getRecommendedItemName(n = 1): Promise<string> {
    const card = this.recommendedProductCards.nth(n - 1);
    return (await card.locator(".productinfo p").textContent())?.trim() ?? "";
  }

  /** Add the Nth recommended item to the cart via its overlay button (1-based). */
  async addRecommendedItemToCart(n = 1): Promise<void> {
    await this.recommendedItemsHeading.scrollIntoViewIfNeeded();
    const card = this.recommendedProductCards.nth(n - 1);
    await card.scrollIntoViewIfNeeded();
    await this.recommendedAddToCartLinks.nth(n - 1).click();
  }
}
