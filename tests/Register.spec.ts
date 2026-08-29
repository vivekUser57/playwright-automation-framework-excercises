import { test, expect } from "../fixtures/pomFixture";
import { URLS } from "../config/urls";

/**
 * User Registration flows — TC001 (register) and TC005 (duplicate email).
 * Every test starts on the Home page (see beforeEach) with a freshly
 * factory-built RegisterUser (unique email each run).
 */
test.describe("User Registration", () => {
  test.beforeEach(async ({ page, homePage }) => {
    await homePage.navigate();
    await expect(page).toHaveURL(URLS.HOME);
    await expect(homePage.homePageLogo).toBeVisible();
  });

  test("@regression TC001 - Register User", async ({
    page,
    homePage,
    loginPage,
    signupPage,
    confirmationPage,
    registerUser,
  }) => {
    await test.step("Open Signup / Login page", async () => {
      await homePage.openLoginPage();
      await expect(page).toHaveURL(URLS.LOGIN);
      await expect(loginPage.newUserSignupHeading).toBeVisible();
    });

    await test.step("Fill signup mini-form and account info", async () => {
      await loginPage.startSignup(registerUser.name, registerUser.email);
      await signupPage.fillAccountInformation(registerUser);
    });

    await test.step("Verify 'Account Created!' banner", async () => {
      await expect(confirmationPage.accountCreatedMessage).toBeVisible();
      await expect(confirmationPage.accountCreatedMessage).toHaveText(
        /account created!/i,
      );
      await confirmationPage.continue();
    });

    await test.step("Verify logged-in as expected user", async () => {
      await expect(homePage.loggedInUserLabel).toBeVisible();
      await expect(homePage.loggedInUserLabel).toContainText(registerUser.name);
    });

    await test.step("Cleanup: delete the account", async () => {
      await homePage.deleteAccount();
      await expect(confirmationPage.accountDeletedMessage).toBeVisible();
      await expect(confirmationPage.accountDeletedMessage).toHaveText(
        /account deleted!/i,
      );
      await confirmationPage.continue();
    });
  });

  test("@regression TC005 - Register User with existing email", async ({
    page,
    homePage,
    loginPage,
    signupPage,
    confirmationPage,
    registerUser,
  }) => {
    await test.step("Register a fresh user", async () => {
      await homePage.openLoginPage();
      await expect(page).toHaveURL(URLS.LOGIN);
      await loginPage.startSignup(registerUser.name, registerUser.email);
      await signupPage.fillAccountInformation(registerUser);
      await expect(confirmationPage.accountCreatedMessage).toBeVisible();
      await confirmationPage.continue();
    });

    await test.step("Logout the user", async () => {
      await homePage.logout();
      await expect(page).toHaveURL(URLS.LOGIN);
    });

    await test.step("Retry signup with the same email — expect duplicate error", async () => {
      await loginPage.startSignup(registerUser.name, registerUser.email);
      await expect(loginPage.emailAlreadyExistsMessage).toBeVisible();
      await expect(loginPage.emailAlreadyExistsMessage).toHaveText(
        /email address already exist/i,
      );
    });

    await test.step("Cleanup: log back in and delete account", async () => {
      await loginPage.login(registerUser.email, registerUser.password);
      await expect(homePage.loggedInUserLabel).toContainText(registerUser.name);
      await homePage.deleteAccount();
      await expect(confirmationPage.accountDeletedMessage).toBeVisible();
      await confirmationPage.continue();
    });
  });
});
