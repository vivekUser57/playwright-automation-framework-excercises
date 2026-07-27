import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { URLS } from "../config/urls";

export interface ProductDetails {
  name: string | null;
  category: string | null;
  price: string | null;
  availability: string | null;
  condition: string | null;
  brand: string | null;
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

  constructor(page: Page) {
    super(page);

    // Products listing page
    this.allProductsHeading = page.getByRole("heading", { name: "All Products" });
    this.viewProductLinks = page.locator("a").filter({ hasText: "View Product" });
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
    const categoryRaw = (await this.productCategory.textContent())?.trim() ?? null;
    const price = (await this.productPrice.textContent())?.trim() ?? null;
    const availabilityRaw =
      (await this.productAvailability.textContent())?.trim() ?? null;
    const conditionRaw = (await this.productCondition.textContent())?.trim() ?? null;
    const brandRaw = (await this.productBrand.textContent())?.trim() ?? null;

    const category = categoryRaw?.replace(/^Category:\s*/i, "") ?? null;
    const availability = availabilityRaw?.replace(/^Availability:\s*/i, "") ?? null;
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
}