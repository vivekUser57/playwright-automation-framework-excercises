import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/Homepage";
import { LoginPage } from "../pages/Loginpage";
import { SignupPage } from "../pages/Signuppage";
import { ConfirmationPage } from "../pages/Confirmationpage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { PaymentPage } from "../pages/PaymentPage";
import registerData from "../test-data/registerData.json";
import { RegisterUser } from "../types/RegisterUser";
import { URLS } from "../config/urls";

test.describe("Checkout", () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let signupPage: SignupPage;
  let confirmationPage: ConfirmationPage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let paymentPage: PaymentPage;
  let user: RegisterUser;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
    confirmationPage = new ConfirmationPage(page);
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    checkoutPage = new CheckoutPage(page);
    paymentPage = new PaymentPage(page);

    user = {
      ...registerData,
      email: `vivek${Date.now()}${Math.floor(Math.random() * 1000)}@test.com`,
    } as RegisterUser;

    await homePage.navigate();
    await expect(page).toHaveURL(URLS.HOME);
    await expect(homePage.homePageLogo).toBeVisible();
  });

  test("TC014 - Place Order: Register while Checkout", async ({ page }) => {
    // Step 4: Add products to cart
    await productPage.openProducts();
    await expect(page).toHaveURL(URLS.PRODUCTS);
    await expect(productPage.allProductsHeading).toBeVisible();
    await productPage.addProductToCart(1);
    await productPage.clickContinueShopping();

    // Step 5-6: Click 'Cart' and verify cart page
    await cartPage.openCartLink();
    await expect(page).toHaveURL(URLS.VIEW_CART);

    // Step 7: Click 'Proceed To Checkout'
    await cartPage.proceedToCheckout();

    // Step 8: Click 'Register / Login' button (checkout redirects unauthenticated users to login)
    await homePage.openLoginPage();
    await expect(page).toHaveURL(URLS.LOGIN);
    await expect(loginPage.newUserSignupHeading).toBeVisible();

    // Step 9: Fill all details in Signup and create account
    await loginPage.startSignup(user.name, user.email);
    await signupPage.verifyPrefilledInformation(user);
    await signupPage.fillAccountInformation(user);

    // Step 10: Verify 'ACCOUNT CREATED!' and click 'Continue'
    await expect(confirmationPage.accountCreatedMessage).toBeVisible();
    await expect(confirmationPage.accountCreatedMessage).toHaveText(
      /account created!/i,
    );
    await confirmationPage.continue();

    // Step 11: Verify 'Logged in as username' at top
    await expect(homePage.loggedInUserLabel).toBeVisible();
    await expect(homePage.loggedInUserLabel).toContainText(user.name);

    // Step 12-13: Click 'Cart' then 'Proceed To Checkout' again
    await cartPage.openCartLink();
await expect(page).toHaveURL(URLS.VIEW_CART);
    await cartPage.proceedToCheckout();

    // Step 14: Verify Address Details and Review Your Order
    await checkoutPage.verifyAddressAndOrderVisible();

    // Step 15: Enter comment and click 'Place Order'
    await checkoutPage.enterComment("Please deliver between 9 AM - 6 PM.");
    await checkoutPage.placeOrder();

    // Step 16-17: Enter payment details and confirm
    await paymentPage.fillPaymentDetails({
      nameOnCard: user.name,
      cardNumber: "4111111111111111",
      cvc: "123",
      expiryMonth: "12",
      expiryYear: "2030",
    });
    await paymentPage.payAndConfirmOrder();

    // Step 18: Verify success message
    await expect(paymentPage.successMessage).toBeVisible();
    await expect(paymentPage.successMessage).toContainText(
      "Your order has been placed successfully!",
    );

    // Step 19-20: Delete account and verify
    await homePage.deleteAccount();
    await expect(confirmationPage.accountDeletedMessage).toBeVisible();
    await expect(confirmationPage.accountDeletedMessage).toHaveText(
      /account deleted!/i,
    );
    await confirmationPage.continue();
  });
});