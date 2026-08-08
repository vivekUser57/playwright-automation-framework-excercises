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

  test("TC014 - Place Order: Register while Checkout", async ({ page }) => {
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
          cardNumber: "4111111111111111",
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