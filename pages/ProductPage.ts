import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export interface ProductDetails {
  name: string | null;
  category: string | null;
  price: string | null;
  availability: string | null;
  condition: string | null;
  brand: string | null;
}

export interface ProductCardInfo {
  name: string | null;
  price: string | null;
}

export interface ReviewPayload {
  name: string;
  email: string;
  review: string;
}

export class ProductPage extends BasePage {
  readonly allProductsHeading: Locator;
  readonly viewProductLinks: Locator;
  readonly productName: Locator;
  readonly productCategory: Locator;
  readonly productPrice: Locator;
  readonly productAvailability: Locator;
  readonly productCondition: Locator;
  readonly productBrand: Locator;
  readonly productsLink: Locator;

  // Search
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  readonly searchedProductNames: Locator;

  // Cart / listing
  readonly addToCartLinks: Locator;
  readonly continueShoppingButton: Locator;
  readonly productCards: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartLink: Locator;

  // Category sidebar (left panel on products page)
  readonly categoriesHeading: Locator;
  readonly categoryPageHeading: Locator;

  // Brand sidebar
  readonly brandsHeading: Locator;
  readonly brandLinks: Locator;

  // Product-detail review form
  readonly writeYourReviewHeading: Locator;
  readonly reviewNameInput: Locator;
  readonly reviewEmailInput: Locator;
  readonly reviewTextarea: Locator;
  readonly reviewSubmitButton: Locator;
  readonly reviewSuccessMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Products listing page
    this.allProductsHeading = page.getByRole("heading", { name: "All Products" });
    this.viewProductLinks = page.locator("a").filter({ hasText: "View Product" });
    this.productsLink = page.getByRole("link", { name: " Products" });

    // Product detail page
    this.productName = page.locator(".product-information h2");
    this.productCategory = page.locator(".product-information p", { hasText: "Category" });
    this.productPrice = page.locator(".product-information span span");
    this.productAvailability = page.locator(".product-information p", { hasText: "Availability" });
    this.productCondition = page.locator(".product-information p", { hasText: "Condition" });
    this.productBrand = page.locator(".product-information p", { hasText: "Brand" });

    // Search
    this.searchInput = page.locator("#search_product");
    this.searchButton = page.locator("#submit_search");
    this.searchedProductsHeading = page.getByRole("heading", { name: "Searched Products" });
    this.searchedProductNames = page.locator(".productinfo p");

    // Cart / listing
    this.addToCartLinks = page.locator("a").filter({ hasText: "Add to cart" });
    this.continueShoppingButton = page.getByRole("button", { name: "Continue Shopping" });
    this.productCards = page.locator(".features_items .product-image-wrapper");
    this.quantityInput = page.locator("#quantity");
    this.addToCartButton = page.locator(".product-information .cart");
    this.viewCartLink = page.getByRole("link", { name: "View Cart" });

    // Category sidebar
    this.categoriesHeading = page.getByRole("heading", { name: "Category" });
    // Any of the /category_products/N landing pages has a centered H2 title.
    this.categoryPageHeading = page.locator("h2.title.text-center");

    // Brand sidebar
    this.brandsHeading = page.getByRole("heading", { name: "Brands" });
    this.brandLinks = page.locator(".brands_products a[href^='/brand_products/']");

    // Review form on product detail
    this.writeYourReviewHeading = page.getByRole("link", { name: /write your review/i });
    this.reviewNameInput = page.locator("#name");
    this.reviewEmailInput = page.locator("#email");
    this.reviewTextarea = page.locator("#review");
    this.reviewSubmitButton = page.locator("#button-review");
    this.reviewSuccessMessage = page.getByText(/thank you for your review/i);
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.quantityInput.fill(quantity.toString());
  }

  async addCurrentProductToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async openViewCart(): Promise<void> {
    await this.viewCartLink.click();
  }

  async openProducts(): Promise<void> {
    await this.productsLink.click();
  }

  /** 1-based accessor for the Nth "View Product" link on the listing page. */
  getViewProductLink(productNumber: number): Locator {
    if (productNumber < 1) {
      throw new Error(`productNumber must be >= 1, received: ${productNumber}`);
    }
    return this.viewProductLinks.nth(productNumber - 1);
  }

  async openProduct(productNumber: number): Promise<void> {
    await this.getViewProductLink(productNumber).click();
  }

  async getProductDetails(): Promise<ProductDetails> {
    const name = (await this.productName.textContent())?.trim() ?? null;
    const categoryRaw = (await this.productCategory.textContent())?.trim() ?? null;
    const price = (await this.productPrice.textContent())?.trim() ?? null;
    const availabilityRaw = (await this.productAvailability.textContent())?.trim() ?? null;
    const conditionRaw = (await this.productCondition.textContent())?.trim() ?? null;
    const brandRaw = (await this.productBrand.textContent())?.trim() ?? null;

    return {
      name,
      category: categoryRaw?.replace(/^Category:\s*/i, "") ?? null,
      price,
      availability: availabilityRaw?.replace(/^Availability:\s*/i, "") ?? null,
      condition: conditionRaw?.replace(/^Condition:\s*/i, "") ?? null,
      brand: brandRaw?.replace(/^Brand:\s*/i, "") ?? null,
    };
  }

  async printProductDetails(): Promise<void> {
    const details = await this.getProductDetails();
    console.log("Product Name:", details.name);
    console.log("Product Category:", details.category);
    console.log("Product Price:", details.price);
    console.log("Product Availability:", details.availability);
    console.log("Product Condition:", details.condition);
    console.log("Product Brand:", details.brand);
  }

  async searchProduct(searchText: string): Promise<void> {
    await this.searchInput.fill(searchText);
    await this.searchButton.click();
  }

  async getSearchedProducts(): Promise<string[]> {
    const products = await this.searchedProductNames.allTextContents();
    return products.map((p) => p.trim());
  }

  async verifyAverageSearchResult(searchText: string): Promise<void> {
    const products = await this.getSearchedProducts();
    if (products.length === 0) throw new Error("No products found after search.");

    const expectedMatchCount = Math.floor(products.length / 2);
    const matching = products.filter((p) =>
      p.toLowerCase().includes(searchText.toLowerCase()),
    );

    console.log(`Total Products Found: ${products.length}`);
    console.log(`Expected Matching Products: ${expectedMatchCount}`);
    console.log(`Actual Matching Products: ${matching.length}`);

    if (matching.length < expectedMatchCount) {
      throw new Error(
        `Expected at least ${expectedMatchCount} products containing "${searchText}", but found only ${matching.length}`,
      );
    }
  }

  /** 1-based accessor for the Nth listing "Add to cart" link. */
  getAddToCartLink(productNumber: number): Locator {
    if (productNumber < 1) {
      throw new Error(`productNumber must be >= 1, received: ${productNumber}`);
    }
    return this.addToCartLinks.nth(productNumber - 1);
  }

  async clickContinueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
    await this.page.locator(".modal-backdrop").waitFor({
      state: "hidden",
      timeout: 10000,
    });
  }

  /** Hover the Nth listing card and click its overlay "Add to cart". */
  async addProductToCart(productNumber: number): Promise<void> {
    const product = this.productCards.nth(productNumber - 1);
    await product.waitFor({ state: "visible", timeout: 10000 });
    await product.scrollIntoViewIfNeeded();
    await product.hover();
    const addButton = product.locator(".overlay-content a.add-to-cart");
    await addButton.waitFor({ state: "visible", timeout: 10000 });
    await addButton.click();
    await this.continueShoppingButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  /** Reads the visible name and price from the Nth listing card (1-based). */
  async getProductCardInfo(productNumber: number): Promise<ProductCardInfo> {
    if (productNumber < 1) {
      throw new Error(`productNumber must be >= 1, received: ${productNumber}`);
    }
    const card = this.productCards.nth(productNumber - 1);
    
    // Get only the direct text of the <p> tag, excluding child elements' text
    const nameHandle = await card.locator(".productinfo p").elementHandle();
    let name: string | null = null;
    if (nameHandle) {
      name = (await nameHandle.evaluate((el) => {
        // Get only direct text nodes, not nested element text
        return Array.from(el.childNodes)
          .filter((node) => node.nodeType === 3) // TEXT_NODE
          .map((node) => node.textContent?.trim())
          .filter((text) => text)
          .join(" ");
      })).trim() || null;
    }
    
    const price = (await card.locator(".productinfo h2").textContent())?.trim() ?? null;
    return { name, price };
  }

  // ── Category sidebar (TC018) ───────────────────────────────────────────

  /**
   * Expands the main category (e.g. "Women") then clicks the child
   * subcategory link (e.g. "Dress"). Uses href-based selectors because
   * the expander <a> also renders a badge icon, so role-based exact-name
   * matching won't find it.
   */
  async openSubcategory(main: string, sub: string): Promise<void> {
    // Expand the panel by clicking its toggle: <a href="#Women"> / <a href="#Men"> ...
    const expander = this.page.locator(`a[href='#${main}']`);
    await expander.scrollIntoViewIfNeeded();
    await expander.click();

    // Sub-category links live inside the just-expanded panel body.
    const panelBody = this.page.locator(`#${main} .panel-body`);
    await panelBody.getByRole("link", { name: sub }).click();
  }

  // ── Brand sidebar (TC019) ──────────────────────────────────────────────

  /**
   * Clicks a brand link by name. Matches loosely because the site prefixes
   * the visible label with a bracketed count, e.g. "(6) Polo".
   */
  async openBrand(name: string): Promise<void> {
    await this.brandLinks
      .filter({ hasText: new RegExp(`\\b${name}\\b`, "i") })
      .first()
      .click();
  }

  // ── Product-detail review form (TC021) ────────────────────────────────

  async submitReview(payload: ReviewPayload): Promise<void> {
    await this.reviewNameInput.fill(payload.name);
    await this.reviewEmailInput.fill(payload.email);
    await this.reviewTextarea.fill(payload.review);
    await this.reviewSubmitButton.click();
  }

  // ── Search + add-all-to-cart flow (TC020) ─────────────────────────────

  /**
   * Adds every card currently rendered on the search-results grid to the cart
   * and returns the captured product names — so the caller can later assert
   * each product is present in the cart.
   */
  async addAllSearchedProductsToCart(): Promise<string[]> {
    // Wait for at least one product card to be visible, ensuring search results are loaded
    await this.productCards.first().waitFor({ state: 'visible', timeout: 10000 });
    
    const total = await this.productCards.count();
    if (total === 0) throw new Error("No products to add — search returned empty.");

    const names: string[] = [];
    for (let i = 1; i <= total; i++) {
      // Ensure the card is visible before capturing its info
      await this.productCards.nth(i - 1).scrollIntoViewIfNeeded();
      await this.productCards.nth(i - 1).waitFor({ state: 'visible', timeout: 5000 });
      
      const info = await this.getProductCardInfo(i);
      if (info.name) names.push(info.name);
      await this.addProductToCart(i);
      await this.clickContinueShopping();
    }
    return names;
  }
}
