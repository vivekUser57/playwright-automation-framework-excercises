import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/Homepage";
import { LoginPage } from "../pages/Loginpage";
import { SignupPage } from "../pages/Signuppage";
import { ConfirmationPage } from "../pages/Confirmationpage";
import registerData from "../test-data/registerData.json";
import { RegisterUser } from "../types/RegisterUser";
import { URLS } from "../config/urls";

test.describe("User Login", () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let signupPage: SignupPage;
  let confirmationPage: ConfirmationPage;
  let user: RegisterUser;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
    confirmationPage = new ConfirmationPage(page);

    user = {
      ...registerData,
      email: `vivek${Date.now()}${Math.floor(Math.random() * 1000)}@test.com`,
    } as RegisterUser;

    await homePage.navigate();
    await expect(page).toHaveURL(URLS.HOME);
    await expect(homePage.homePageLogo).toBeVisible();
  });

  test("TC002 - Login User with correct email and password", async ({
    page,
  }) => {
    await test.step("Open Signup / Login Page", async () => {
      await homePage.openLoginPage();
      await expect(page).toHaveURL(URLS.LOGIN);
      await expect(loginPage.newUserSignupHeading).toBeVisible();
    });

    await test.step("Register New User", async () => {
      await loginPage.startSignup(user.name, user.email);
      await signupPage.verifyPrefilledInformation(user);
      await signupPage.fillAccountInformation(user);
      await expect(confirmationPage.accountCreatedMessage).toBeVisible();
      await confirmationPage.continue();
    });

    await test.step("Verify Logged In User", async () => {
      await expect(homePage.loggedInUserLabel).toContainText(user.name);
    });

    await test.step("Logout User", async () => {
      await homePage.logout();
      await expect(page).toHaveURL(URLS.LOGIN);
    });

    await test.step("Login with valid credentials", async () => {
      await loginPage.login(user.email, user.password);
    });

    await test.step("Verify Logged In User Again", async () => {
      await expect(homePage.loggedInUserLabel).toContainText(user.name);
    });

    await test.step("Delete Account", async () => {
      await homePage.deleteAccount();
      await expect(confirmationPage.accountDeletedMessage).toBeVisible();
      await confirmationPage.continue();
    });
  });

  test("TC003 - Login User with incorrect email and password", async ({
    page,
  }) => {
    await test.step("Open Signup / Login Page", async () => {
      await homePage.openLoginPage();
      await expect(page).toHaveURL(URLS.LOGIN);
      await expect(loginPage.loginToYourAccountHeading).toBeVisible();
    });

    await test.step("Login with invalid credentials", async () => {
      await loginPage.login("invalid@test.com", "WrongPassword123");
    });

    await test.step("Verify error message", async () => {
      await expect(loginPage.loginErrorMessage).toBeVisible();
      await expect(loginPage.loginErrorMessage).toHaveText(
        "Your email or password is incorrect!",
      );
    });
  });

  test("TC004 - Logout User", async ({ page }) => {
    await test.step("Open Signup / Login Page", async () => {
      await homePage.openLoginPage();
      await expect(page).toHaveURL(URLS.LOGIN);
      await expect(loginPage.newUserSignupHeading).toBeVisible();
    });

    await test.step("Register New User", async () => {
      await loginPage.startSignup(user.name, user.email);
      await signupPage.verifyPrefilledInformation(user);
      await signupPage.fillAccountInformation(user);
      await expect(confirmationPage.accountCreatedMessage).toBeVisible();
      await confirmationPage.continue();
    });

    await test.step("Verify Logged In User", async () => {
      await expect(homePage.loggedInUserLabel).toBeVisible();
      await expect(homePage.loggedInUserLabel).toContainText(user.name);
    });

    await test.step("Logout User", async () => {
      await homePage.logout();
    });

    await test.step("Verify Login Page", async () => {
      await expect(page).toHaveURL(URLS.LOGIN);
      await expect(loginPage.loginToYourAccountHeading).toBeVisible();
    });
  });
});