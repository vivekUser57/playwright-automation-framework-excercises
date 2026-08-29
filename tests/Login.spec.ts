import { test, expect } from "../fixtures/pomFixture";
import { URLS } from "../config/urls";

/**
 * User Login flows — TC002 (valid), TC003 (invalid), TC004 (logout).
 * TC002 / TC004 create a fresh user first so the tests are self-contained
 * and don't depend on a shared static account.
 */
test.describe("User Login", () => {
  test.beforeEach(async ({ page, homePage }) => {
    await homePage.navigate();
    await expect(page).toHaveURL(URLS.HOME);
    await expect(homePage.homePageLogo).toBeVisible();
  });

  test("TC002 - Login User with correct email and password", async ({
    page,
    homePage,
    loginPage,
    signupPage,
    confirmationPage,
    registerUser,
  }) => {
    await test.step("Register a fresh user first", async () => {
      await homePage.openLoginPage();
      await expect(page).toHaveURL(URLS.LOGIN);
      await loginPage.startSignup(registerUser.name, registerUser.email);
      await signupPage.verifyPrefilledInformation(registerUser);
      await signupPage.fillAccountInformation(registerUser);
      await expect(confirmationPage.accountCreatedMessage).toBeVisible();
      await confirmationPage.continue();
      await expect(homePage.loggedInUserLabel).toContainText(registerUser.name);
    });

    await test.step("Logout to reach a clean login screen", async () => {
      await homePage.logout();
      await expect(page).toHaveURL(URLS.LOGIN);
    });

    await test.step("Login with valid credentials", async () => {
      await loginPage.login(registerUser.email, registerUser.password);
      await expect(homePage.loggedInUserLabel).toContainText(registerUser.name);
    });

    await test.step("Cleanup: delete the account", async () => {
      await homePage.deleteAccount();
      await expect(confirmationPage.accountDeletedMessage).toBeVisible();
      await confirmationPage.continue();
    });
  });

  test("TC003 - Login User with incorrect email and password", async ({
    page,
    homePage,
    loginPage,
  }) => {
    await homePage.openLoginPage();
    await expect(page).toHaveURL(URLS.LOGIN);
    await expect(loginPage.loginToYourAccountHeading).toBeVisible();

    await loginPage.login("invalid@test.com", "WrongPassword123");

    await expect(loginPage.loginErrorMessage).toBeVisible();
    await expect(loginPage.loginErrorMessage).toHaveText(
      "Your email or password is incorrect!",
    );
    // Verify we did NOT navigate away from /login on failed auth.
    await expect(page).toHaveURL(URLS.LOGIN);
  });

  test("TC004 - Logout User", async ({
    page,
    homePage,
    loginPage,
    signupPage,
    confirmationPage,
    registerUser,
  }) => {
    await test.step("Register a fresh user first", async () => {
      await homePage.openLoginPage();
      await expect(page).toHaveURL(URLS.LOGIN);
      await loginPage.startSignup(registerUser.name, registerUser.email);
      await signupPage.verifyPrefilledInformation(registerUser);
      await signupPage.fillAccountInformation(registerUser);
      await expect(confirmationPage.accountCreatedMessage).toBeVisible();
      await confirmationPage.continue();
      await expect(homePage.loggedInUserLabel).toContainText(registerUser.name);
    });

    await test.step("Logout and verify we land on the login screen", async () => {
      await homePage.logout();
      await expect(page).toHaveURL(URLS.LOGIN);
      await expect(loginPage.loginToYourAccountHeading).toBeVisible();
    });
  });
});
