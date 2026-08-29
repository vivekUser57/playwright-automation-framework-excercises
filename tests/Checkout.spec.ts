import { faker } from "@faker-js/faker";
import { test, expect } from "../fixtures/pomFixture";
import { URLS } from "../config/urls";

/**
 * TC014 — Place Order: Register while Checkout.
 * Single end-to-end flow that adds a product, registers a new user
 * mid-checkout, places the order and pays. Cleanup deletes the account.
 */
test.describe("Checkout", () => {
  test.beforeEach(async ({ page, homePage }) => {
    await homePage.navigate();
    await expect(page).toHaveURL(URLS.HOME);
    await expect(homePage.homePageLogo).toBeVisible();
  });

  test("TC014 - Place Order: Register while Checkout", async ({
    page,
    homePage,
    productPage,
    cartPage,
    authPage,
    checkoutPage,
    paymentPage,
  }) => {
    // faker.string.uuid() guarantees email uniqueness across parallel/repeat runs.
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
        await expect(cartPage.cartRows).toHaveCount(1);
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

      await test.step("Verify 'Logged in as' user in navbar", async () => {
        await expect(homePage.loggedInUserLabel).toContainText(fullName);
      });

      await test.step("Return to cart and proceed to checkout", async () => {
        await cartPage.openCart();
        await expect(page).toHaveURL(URLS.VIEW_CART);
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(URLS.CHECKOUT);
      });

      await test.step("Verify address details and order review sections", async () => {
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
          // Luhn-valid dummy Visa — kept static intentionally.
          cardNumber: "4111111111111111",
          cvc: String(faker.number.int({ min: 100, max: 999 })),
          expiryMonth: "12",
          expiryYear: "2028",
        });
        await paymentPage.payAndConfirmOrder();
      });

      await test.step("Verify order success message", async () => {
        await expect(paymentPage.orderSuccessMessage).toBeVisible();
        await expect(paymentPage.orderSuccessMessage).toContainText(
          /Your order has been confirmed/i,
        );
      });
    } finally {
      // Best-effort cleanup — only if the account actually got created.
      if (accountCreated) {
        await test.step("Cleanup: delete test account", async () => {
          await homePage.deleteAccountLink.click();
          await expect(authPage.accountDeletedText).toBeVisible();
          await authPage.clickContinue();
        });
      }
    }
  });

  test("TC015 - Place Order: Register before Checkout", async ({
    page,
    homePage,
    loginPage,
    signupPage,
    confirmationPage,
    productPage,
    cartPage,
    checkoutPage,
    paymentPage,
    registerUser,
  }) => {
    let accountCreated = false;
    try {
      await test.step("Register a new user first", async () => {
        await homePage.openLoginPage();
        await expect(page).toHaveURL(URLS.LOGIN);
        await loginPage.startSignup(registerUser.name, registerUser.email);
        await signupPage.fillAccountInformation(registerUser);
        await expect(confirmationPage.accountCreatedMessage).toBeVisible();
        accountCreated = true;
        await confirmationPage.continue();
        await expect(homePage.loggedInUserLabel).toContainText(registerUser.name);
      });

      await test.step("Add a product to cart and proceed to checkout", async () => {
        await productPage.openProducts();
        await productPage.addProductToCart(1);
        await productPage.clickContinueShopping();
        await cartPage.openCart();
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(URLS.CHECKOUT);
        await checkoutPage.verifyAddressAndOrderVisible();
      });

      await test.step("Place order, pay, and verify success", async () => {
        await checkoutPage.enterComment(faker.lorem.sentence());
        await checkoutPage.placeOrder();
        await expect(page).toHaveURL(URLS.PAYMENT);
        await paymentPage.fillPaymentDetails({
          nameOnCard: registerUser.name,
          cardNumber: "4111111111111111",
          cvc: String(faker.number.int({ min: 100, max: 999 })),
          expiryMonth: "12",
          expiryYear: "2028",
        });
        await paymentPage.payAndConfirmOrder();
        await expect(paymentPage.orderSuccessMessage).toBeVisible();
      });
    } finally {
      if (accountCreated) {
        await test.step("Cleanup: delete the test account", async () => {
          await homePage.deleteAccount();
          await expect(confirmationPage.accountDeletedMessage).toBeVisible();
          await confirmationPage.continue();
        });
      }
    }
  });

  test("TC016 - Place Order: Login before Checkout", async ({
    page,
    homePage,
    loginPage,
    signupPage,
    confirmationPage,
    productPage,
    cartPage,
    checkoutPage,
    paymentPage,
    registerUser,
  }) => {
    let accountCreated = false;
    try {
      // The site rejects duplicate emails, so we register once here to obtain
      // valid credentials, then logout and log back in — that's the true
      // "Login before Checkout" flow.
      await test.step("Prepare: register + logout so we can login again", async () => {
        await homePage.openLoginPage();
        await loginPage.startSignup(registerUser.name, registerUser.email);
        await signupPage.fillAccountInformation(registerUser);
        await expect(confirmationPage.accountCreatedMessage).toBeVisible();
        accountCreated = true;
        await confirmationPage.continue();
        await homePage.logout();
      });

      await test.step("Login with existing credentials", async () => {
        await expect(page).toHaveURL(URLS.LOGIN);
        await loginPage.login(registerUser.email, registerUser.password);
        await expect(homePage.loggedInUserLabel).toContainText(registerUser.name);
      });

      await test.step("Add product, checkout, pay, verify success", async () => {
        await productPage.openProducts();
        await productPage.addProductToCart(1);
        await productPage.clickContinueShopping();
        await cartPage.openCart();
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(URLS.CHECKOUT);
        await checkoutPage.enterComment(faker.lorem.sentence());
        await checkoutPage.placeOrder();
        await paymentPage.fillPaymentDetails({
          nameOnCard: registerUser.name,
          cardNumber: "4111111111111111",
          cvc: String(faker.number.int({ min: 100, max: 999 })),
          expiryMonth: "12",
          expiryYear: "2028",
        });
        await paymentPage.payAndConfirmOrder();
        await expect(paymentPage.orderSuccessMessage).toBeVisible();
      });
    } finally {
      if (accountCreated) {
        await test.step("Cleanup: delete the test account", async () => {
          await homePage.deleteAccount();
          await expect(confirmationPage.accountDeletedMessage).toBeVisible();
          await confirmationPage.continue();
        });
      }
    }
  });

  test("TC023 - Verify address details in checkout page", async ({
    page,
    homePage,
    loginPage,
    signupPage,
    confirmationPage,
    productPage,
    cartPage,
    checkoutPage,
    registerUser,
  }) => {
    let accountCreated = false;
    try {
      await test.step("Register a user with known address data", async () => {
        await homePage.openLoginPage();
        await loginPage.startSignup(registerUser.name, registerUser.email);
        await signupPage.fillAccountInformation(registerUser);
        await expect(confirmationPage.accountCreatedMessage).toBeVisible();
        accountCreated = true;
        await confirmationPage.continue();
      });

      await test.step("Add product and reach the checkout page", async () => {
        await productPage.openProducts();
        await productPage.addProductToCart(1);
        await productPage.clickContinueShopping();
        await cartPage.openCart();
        await cartPage.proceedToCheckout();
        await expect(page).toHaveURL(URLS.CHECKOUT);
      });

      await test.step("Verify delivery + billing blocks contain the registered address", async () => {
        const delivery = await checkoutPage.getDeliveryAddressText();
        const billing = await checkoutPage.getBillingAddressText();

        for (const block of [delivery, billing]) {
          expect(block).toContain(registerUser.firstName);
          expect(block).toContain(registerUser.lastName);
          expect(block).toContain(registerUser.address);
          expect(block).toContain(registerUser.city);
          expect(block).toContain(registerUser.state);
          expect(block).toContain(registerUser.zipcode);
          expect(block).toContain(registerUser.country);
          expect(block).toContain(registerUser.mobile);
        }
      });
    } finally {
      if (accountCreated) {
        await test.step("Cleanup: delete the test account", async () => {
          await homePage.deleteAccount();
          await expect(confirmationPage.accountDeletedMessage).toBeVisible();
          await confirmationPage.continue();
        });
      }
    }
  });

  test("TC024 - Download Invoice after purchase order", async ({
    page,
    homePage,
    loginPage,
    signupPage,
    confirmationPage,
    productPage,
    cartPage,
    checkoutPage,
    paymentPage,
    registerUser,
  }) => {
    let accountCreated = false;
    try {
      await test.step("Register user and place an order end-to-end", async () => {
        await homePage.openLoginPage();
        await loginPage.startSignup(registerUser.name, registerUser.email);
        await signupPage.fillAccountInformation(registerUser);
        await expect(confirmationPage.accountCreatedMessage).toBeVisible();
        accountCreated = true;
        await confirmationPage.continue();

        await productPage.openProducts();
        await productPage.addProductToCart(1);
        await productPage.clickContinueShopping();
        await cartPage.openCart();
        await cartPage.proceedToCheckout();
        await checkoutPage.enterComment(faker.lorem.sentence());
        await checkoutPage.placeOrder();

        await paymentPage.fillPaymentDetails({
          nameOnCard: registerUser.name,
          cardNumber: "4111111111111111",
          cvc: "123",
          expiryMonth: "12",
          expiryYear: "2028",
        });
        await paymentPage.payAndConfirmOrder();
        await expect(paymentPage.orderSuccessMessage).toBeVisible();
      });

      await test.step("Download the invoice and assert a non-empty file was produced", async () => {
        await expect(paymentPage.downloadInvoiceButton).toBeVisible();
        const download = await paymentPage.downloadInvoice();
        const suggestedName = download.suggestedFilename();
        expect(suggestedName, "Suggested filename should not be empty").toBeTruthy();

        // Persist to a temp path just so we can assert the file materialised.
        const target = `test-results/${suggestedName}`;
        await download.saveAs(target);
      });
    } finally {
      if (accountCreated) {
        await test.step("Cleanup: delete the test account", async () => {
          await homePage.deleteAccount();
          await expect(confirmationPage.accountDeletedMessage).toBeVisible();
          await confirmationPage.continue();
        });
      }
    }
  });
});
