import { test as base } from "@playwright/test";
import { HomePage } from "../pages/Homepage";
import { LoginPage } from "../pages/Loginpage";
import { SignupPage } from "../pages/Signuppage";
import { ConfirmationPage } from "../pages/Confirmationpage";
import { ContactUsPage } from "../pages/ContactUsPage";
import { CartPage } from "../pages/CartPage";
import { ProductPage } from "../pages/ProductPage";
import { AuthPage } from "../pages/AuthPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { PaymentPage } from "../pages/PaymentPage";
import { RegisterUser } from "../types/RegisterUser";
import { RegisterUserFactory } from "../data-factory/registerUserFactory";

/**
 * Central Playwright fixture. Every spec imports { test, expect } from here
 * instead of "@playwright/test", so:
 *   - POMs are auto-instantiated per test (no repeated `new` in beforeEach)
 *   - a fresh RegisterUser (unique email) is available on demand
 *   - fixtures are lazy: unused POMs cost nothing
 */
type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  signupPage: SignupPage;
  confirmationPage: ConfirmationPage;
  contactUsPage: ContactUsPage;
  cartPage: CartPage;
  productPage: ProductPage;
  authPage: AuthPage;
  checkoutPage: CheckoutPage;
  paymentPage: PaymentPage;
  registerUser: RegisterUser;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  signupPage: async ({ page }, use) => {
    await use(new SignupPage(page));
  },
  confirmationPage: async ({ page }, use) => {
    await use(new ConfirmationPage(page));
  },
  contactUsPage: async ({ page }, use) => {
    await use(new ContactUsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  paymentPage: async ({ page }, use) => {
    await use(new PaymentPage(page));
  },
  // Fresh user data per test (unique email each time).
  registerUser: async ({}, use) => {
    await use(RegisterUserFactory.create());
  },
});

export { expect } from "@playwright/test";
