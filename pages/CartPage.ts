import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export interface CartRow {
  name: string | null;
  category: string | null;
  price: string | null;
  quantity: string | null;
  total: string | null;
}

export class CartPage extends BasePage {
  readonly cartLink: Locator;
  readonly viewCartLink: Locator;
  readonly cartRows: Locator;
  readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.viewCartLink = page.getByText("View Cart");
    this.cartRows = page.locator("#cart_info_table tbody tr");
    this.proceedToCheckoutButton = page.getByText("Proceed To Checkout");
     this.cartLink = page.getByRole("link", {
      name: "Cart",
    });
  }

  async proceedToCheckout(): Promise<void> {
  await this.proceedToCheckoutButton.click();
}

  async getProductQuantity(productNumber: number): Promise<string> {
  return (
    await this.cartRows
      .nth(productNumber - 1)
      .locator(".cart_quantity button")
      .textContent()
  )?.trim() ?? "";
}

  async openCart(): Promise<void> {
    await this.viewCartLink.click();
  }

 async openCartLink(): Promise<void> {
  await this.cartLink.scrollIntoViewIfNeeded();

  await this.cartLink.waitFor({
    state: "visible",
    timeout: 10000,
  });

  await this.cartLink.click();
}

  getRowByProductName(productName: string): Locator {
    return this.cartRows.filter({ hasText: productName });
  }

  async getCartRowDetails(productName: string): Promise<CartRow> {
    const row = this.getRowByProductName(productName);

    const name =
      (await row.locator(".cart_description h4 a").textContent())?.trim() ?? null;
    const category =
      (await row.locator(".cart_description p").textContent())?.trim() ?? null;
    const price =
      (await row.locator(".cart_price p").textContent())?.trim() ?? null;
    const quantity =
      (await row.locator(".cart_quantity button").textContent())?.trim() ?? null;
    const total =
      (await row.locator(".cart_total_price").textContent())?.trim() ?? null;

    return { name, category, price, quantity, total };
  }

  async printCartRowDetails(productName: string): Promise<void> {
    const details = await this.getCartRowDetails(productName);

    console.log(`Cart Row - ${productName}`);
    console.log("Name:", details.name);
    console.log("Category:", details.category);
    console.log("Price:", details.price);
    console.log("Quantity:", details.quantity);
    console.log("Total:", details.total);
  }
}