import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { URLS } from "../config/urls";
import { test, expect } from "@playwright/test";

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
  // Search Product
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchedProductsHeading: Locator;
  readonly searchedProductNames: Locator;
  // Cart
  readonly addToCartLinks: Locator;
  readonly continueShoppingButton: Locator;
  // readonly viewCartLink: Locator;
  readonly productCards: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly viewCartLink: Locator;

  constructor(page: Page) {
    super(page);

    // Products listing page
    this.allProductsHeading = page.getByRole("heading", {
      name: "All Products",
    });
    this.viewProductLinks = page
      .locator("a")
      .filter({ hasText: "View Product" });
    this.productsLink = page.getByRole("link", { name: " Products" });

    // Product detail page
    this.productName = page.locator(".product-information h2");
    this.productCategory = page.locator(".product-information p", {
      hasText: "Category",
    });
    this.productPrice = page.locator(".product-information span span");
    this.productAvailability = page.locator(".product-information p", {
      hasText: "Availability",
    });
    this.productCondition = page.locator(".product-information p", {
      hasText: "Condition",
    });
    this.productBrand = page.locator(".product-information p", {
      hasText: "Brand",
    });
    // Search Product
    this.searchInput = page.locator("#search_product");
    this.searchButton = page.locator("#submit_search");

    this.searchedProductsHeading = page.getByRole("heading", {
      name: "Searched Products",
    });

    this.searchedProductNames = page.locator(".productinfo p");

    // Cart
    this.addToCartLinks = page.locator("a").filter({ hasText: "Add to cart" });
    this.continueShoppingButton = page.getByRole("button", {
      name: "Continue Shopping",
    });
    // this.viewCartLink = page.getByText("View Cart");
    // Inside constructor, add:
    this.productCards = page.locator(".product-image-wrapper");
    this.quantityInput = page.locator("#quantity");

    this.addToCartButton = page.locator(".product-information .cart");

    this.viewCartLink = page.getByRole("link", {
      name: "View Cart",
    });
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

  /**
   * Returns the 'View Product' locator for a given position (1-based index).
   * e.g. getViewProductLink(1) -> first product, getViewProductLink(2) -> second product
   */
  getViewProductLink(productNumber: number): Locator {
    if (productNumber < 1) {
      throw new Error(`productNumber must be >= 1, received: ${productNumber}`);
    }
    return this.viewProductLinks.nth(productNumber - 1);
  }

  /**
   * Clicks 'View Product' for the given position (1-based index).
   * e.g. openProduct(1) -> opens the first product, openProduct(2) -> opens the second product
   */
  async openProduct(productNumber: number): Promise<void> {
    await this.getViewProductLink(productNumber).click();
  }

  async getProductDetails(): Promise<ProductDetails> {
    const name = (await this.productName.textContent())?.trim() ?? null;
    const categoryRaw =
      (await this.productCategory.textContent())?.trim() ?? null;
    const price = (await this.productPrice.textContent())?.trim() ?? null;
    const availabilityRaw =
      (await this.productAvailability.textContent())?.trim() ?? null;
    const conditionRaw =
      (await this.productCondition.textContent())?.trim() ?? null;
    const brandRaw = (await this.productBrand.textContent())?.trim() ?? null;

    const category = categoryRaw?.replace(/^Category:\s*/i, "") ?? null;
    const availability =
      availabilityRaw?.replace(/^Availability:\s*/i, "") ?? null;
    const condition = conditionRaw?.replace(/^Condition:\s*/i, "") ?? null;
    const brand = brandRaw?.replace(/^Brand:\s*/i, "") ?? null;

    return { name, category, price, availability, condition, brand };
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

    return products.map((product) => product.trim());
  }

  async verifyAverageSearchResult(searchText: string): Promise<void> {
    const products = await this.getSearchedProducts();

    if (products.length === 0) {
      throw new Error("No products found after search.");
    }

    const totalProducts = products.length;

    // Average logic
    const expectedMatchCount = Math.floor(totalProducts / 2);

    const matchingProducts = products.filter((product) =>
      product.toLowerCase().includes(searchText.toLowerCase()),
    );

    console.log(`Total Products Found: ${totalProducts}`);
    console.log(`Expected Matching Products: ${expectedMatchCount}`);
    console.log(`Actual Matching Products: ${matchingProducts.length}`);

    if (matchingProducts.length < expectedMatchCount) {
      throw new Error(
        `Expected at least ${expectedMatchCount} products containing "${searchText}", but found only ${matchingProducts.length}`,
      );
    }
  }

  /**
   * Returns the 'Add to cart' locator for a given product position (1-based index)
   * on the products listing page.
   */
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

  async addProductToCart(productNumber: number): Promise<void> {
    const product = this.productCards.nth(productNumber - 1);
    await product.waitFor({ state: "visible", timeout: 10000 });
    await product.scrollIntoViewIfNeeded();
    await product.hover();
    const addButton = product.locator(".overlay-content a.add-to-cart");
    await addButton.waitFor({ state: "visible", timeout: 10000 });
    await addButton.waitFor({ state: "attached", timeout: 10000 });
    await addButton.click();
    await this.continueShoppingButton.waitFor({
      state: "visible",
      timeout: 10000,
    });
  }

  /**
   * Reads the product name and price directly from the listing page card,
   * for a given 1-based product position — before it's added to cart.
   */
  async getProductCardInfo(productNumber: number): Promise<ProductCardInfo> {
    if (productNumber < 1) {
      throw new Error(`productNumber must be >= 1, received: ${productNumber}`);
    }
    const card = this.productCards.nth(productNumber - 1);

    const name =
      (await card.locator(".productinfo p").textContent())?.trim() ?? null;
    const price =
      (await card.locator(".productinfo h2").textContent())?.trim() ?? null;

    return { name, price };
  }
}
