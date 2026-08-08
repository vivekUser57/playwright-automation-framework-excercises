import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { HomePage } from "../pages/Homepage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { AuthPage } from "../pages/AuthPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { PaymentPage } from "../pages/PaymentPage";
import { URLS } from "../config/urls";

test.describe("Checkout", () => {
  let homePage: HomePage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let authPage: AuthPage;
  let checkoutPage: CheckoutPage;
  let paymentPage: PaymentPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    authPage = new AuthPage(page);
    checkoutPage = new CheckoutPage(page);
    paymentPage = new PaymentPage(page);

    await homePage.navigate();
    await expect(page).toHaveURL(URLS.HOME);
    await expect(homePage.homePageLogo).toBeVisible();
  });

  test("TC008 - Verify All Products and product detail page", async ({
    page,
  }) => {
    await productPage.openProducts();

    await expect(page).toHaveURL(URLS.PRODUCTS);
    await expect(productPage.allProductsHeading).toBeVisible();

    await expect(productPage.viewProductLinks.first()).toBeVisible();

    await productPage.openProduct(2);

    await expect(page).toHaveURL(/.*\/product_details/);

    await productPage.printProductDetails();

    await expect(productPage.productName).toBeVisible();
    await expect(productPage.productCategory).toBeVisible();
    await expect(productPage.productPrice).toBeVisible();
    await expect(productPage.productAvailability).toBeVisible();
    await expect(productPage.productCondition).toBeVisible();
    await expect(productPage.productBrand).toBeVisible();
  });

  test("TC009 - Search Product", async ({ page }) => {
    const searchText = "Top";

    await productPage.openProducts();

    await expect(page).toHaveURL(URLS.PRODUCTS);

    await expect(productPage.allProductsHeading).toBeVisible();

    await productPage.searchProduct(searchText);

    await expect(productPage.searchedProductsHeading).toHaveText(
      "Searched Products",
    );

    await productPage.verifyAverageSearchResult(searchText);
  });

  test("TC012 - Add Products in Cart", async ({ page }) => {
    await productPage.openProducts();
    await expect(page).toHaveURL(URLS.PRODUCTS);
    await expect(productPage.allProductsHeading).toBeVisible();

    // Capture product name/price from the listing page BEFORE adding to cart,
    // so the test doesn't depend on hardcoded product names.
    const productInfo1 = await productPage.getProductCardInfo(1);
    const productInfo2 = await productPage.getProductCardInfo(2);

    if (!productInfo1.name || !productInfo1.price) {
      throw new Error("Could not read product 1's name/price from the listing page.");
    }
    if (!productInfo2.name || !productInfo2.price) {
      throw new Error("Could not read product 2's name/price from the listing page.");
    }

    // Destructure into locals so TypeScript narrows these as `string`, not `string | null`.
    const { name: product1Name, price: product1Price } = productInfo1;
    const { name: product2Name, price: product2Price } = productInfo2;

    console.log("Product 1 (from listing):", product1Name, product1Price);
    console.log("Product 2 (from listing):", product2Name, product2Price);

    // Add first product to cart, continue shopping
    await productPage.addProductToCart(1);
    await productPage.clickContinueShopping();

    // Add second product to cart
    await productPage.addProductToCart(2);
    await cartPage.openCart();
    await expect(page).toHaveURL(URLS.VIEW_CART);
    await expect(page.getByRole("heading", { name: product1Name })).toBeVisible();
    await expect(page.getByRole("link", { name: product2Name })).toBeVisible();
    await cartPage.printCartRowDetails(product1Name);
    await cartPage.printCartRowDetails(product2Name);

    const cartProduct1 = await cartPage.getCartRowDetails(product1Name);
    const cartProduct2 = await cartPage.getCartRowDetails(product2Name);

    expect(cartProduct1.price).toBe(product1Price);
    expect(cartProduct2.price).toBe(product2Price);
    expect(cartProduct1.quantity).toBe("1");
    expect(cartProduct2.quantity).toBe("1");
    expect(cartProduct1.total).toBe(product1Price);
    expect(cartProduct2.total).toBe(product2Price);
  });

  test("TC013 - Verify Product quantity in Cart", async ({ page }) => {
    await homePage.navigate();
    await expect(page).toHaveURL(URLS.HOME);
    await expect(homePage.homePageLogo).toBeVisible();
    await productPage.openProduct(1);
    await expect(page).toHaveURL(/.*product_details/);
    await productPage.setQuantity(4);
    await productPage.addCurrentProductToCart();
    await cartPage.openCart();
    await expect(page).toHaveURL(URLS.VIEW_CART);
    const quantity = await cartPage.getProductQuantity(1);

    expect(quantity).toBe("4");
  });

  test("TC014 - Place Order: Register while Checkout", async ({ page }) => {
    // faker.string.uuid() in the email guarantees no collisions across
    // repeated/parallel runs, since the site rejects duplicate emails.
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const fullName = `${firstName} ${lastName}`;
    const email = `qa.${faker.string.uuid()}@example.com`;

    let accountCreated = false;

    try {
      await test.step("Add product to cart", async () => {
        await productPage.openProducts();
        await expect(page).toHaveURL(URLS.PRODUCTS);
        await productPage.addProductToCart(1);
        await productPage.clickContinueShopping();
      });

      await test.step("Go to cart and verify cart page", async () => {
        await cartPage.openCart();
        await expect(page).toHaveURL(URLS.VIEW_CART);
      });

      await test.step("Proceed to checkout and click Register/Login", async () => {
        await cartPage.proceedToCheckout();
        await cartPage.clickRegisterLogin();
        await expect(page).toHaveURL(/.*\/login/);
      });

      await test.step("Fill signup form and create account", async () => {
        await authPage.signup(fullName, email);

        await authPage.fillAccountInformation({
          password: faker.internet.password({ length: 12 }),
          day: String(faker.number.int({ min: 1, max: 28 })),
          month: String(faker.number.int({ min: 1, max: 12 })),
          year: String(faker.number.int({ min: 1970, max: 2005 })),
          firstName,
          lastName,
          address: faker.location.streetAddress(),
          country: "United States",
          state: faker.location.state(),
          city: faker.location.city(),
          zipcode: faker.location.zipCode(),
          mobileNumber: faker.phone.number(),
        });

        await authPage.submitAccountCreation();
      });

      await test.step("Verify 'ACCOUNT CREATED!' and click Continue", async () => {
        await expect(authPage.accountCreatedText).toBeVisible();
        accountCreated = true;
        await authPage.clickContinue();
      });

      await test.step("Verify 'Logged in as' username at top", async () => {
        await expect(homePage.loggedInAsText).toContainText(fullName);
      });

      await test.step("Go back to cart and proceed to checkout", async () => {
        await cartPage.openCart();
        await expect(page).toHaveURL(URLS.VIEW_CART);
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(URLS.CHECKOUT);
      });

      await test.step("Verify address details and order review", async () => {
        await checkoutPage.verifyAddressAndOrderVisible();
      });

      await test.step("Enter comment and place order", async () => {
        await checkoutPage.enterComment(faker.lorem.sentence());
        await checkoutPage.placeOrder();
        await expect(page).toHaveURL(URLS.PAYMENT);
      });

      await test.step("Enter payment details and confirm order", async () => {
        await paymentPage.fillPaymentDetails({
          nameOnCard: fullName,
          cardNumber: "4111111111111111", // Luhn-valid dummy Visa, kept static intentionally
          cvc: String(faker.number.int({ min: 100, max: 999 })),
          expiryMonth: "12",
          expiryYear: "2028",
        });
        await paymentPage.payAndConfirmOrder();
      });

      await test.step("Verify order success message", async () => {
        await expect(paymentPage.orderSuccessMessage).toContainText(
          "Your order has been placed successfully!",
        );
      });
    } finally {
      if (accountCreated) {
        await test.step("Cleanup: delete test account", async () => {
          await homePage.deleteAccountLink.click();
          await expect(authPage.accountDeletedText).toBeVisible();
          await authPage.clickContinue();
        });
      }
    }
  });
});