import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/Homepage";
import { LoginPage } from "../pages/Loginpage";
import { SignupPage } from "../pages/Signuppage";
import { ConfirmationPage } from "../pages/Confirmationpage";
import registerData from "../test-data/registerData.json";
import { RegisterUser } from "../types/RegisterUser";
import { URLS } from "../config/urls";

test.describe("User Registration", () => {
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

  test("TC001 - Register User", async ({ page }) => {
    await test.step("Open Signup / Login Page", async () => {
      await homePage.openLoginPage();
      await expect(page).toHaveURL(URLS.LOGIN);
      await expect(loginPage.newUserSignupHeading).toBeVisible();
    });

    await test.step("Enter Name and Email Address", async () => {
      await loginPage.startSignup(user.name, user.email);
    });

    await test.step("Fill Account Information", async () => {
      await signupPage.fillAccountInformation(user);
    });

    await test.step("Verify Account Created", async () => {
      await expect(confirmationPage.accountCreatedMessage).toBeVisible();
      await expect(confirmationPage.accountCreatedMessage).toHaveText(
        /account created!/i,
      );
    });

    await test.step("Click Continue", async () => {
      await confirmationPage.continue();
    });

    await test.step("Verify Logged In User", async () => {
      await expect(homePage.loggedInUserLabel).toBeVisible();
      await expect(homePage.loggedInUserLabel).toContainText(user.name);
    });

    await test.step("Delete Account", async () => {
      await homePage.deleteAccount();
      await expect(confirmationPage.accountDeletedMessage).toBeVisible();
      await expect(confirmationPage.accountDeletedMessage).toHaveText(
        /account deleted!/i,
      );
      await confirmationPage.continue();
    });
  });

  test("TC005 - Register User with existing email", async ({ page }) => {
    await test.step("Open Signup / Login Page", async () => {
      await homePage.openLoginPage();
      await expect(page).toHaveURL(URLS.LOGIN);
      await expect(loginPage.newUserSignupHeading).toBeVisible();
    });

    await test.step("Register New User", async () => {
      await loginPage.startSignup(user.name, user.email);
      await signupPage.fillAccountInformation(user);
      await expect(confirmationPage.accountCreatedMessage).toBeVisible();
      await confirmationPage.continue();
    });

    await test.step("Logout User", async () => {
      await homePage.logout();
      await expect(page).toHaveURL(URLS.LOGIN);
    });

    await test.step("Try Registering With Existing Email", async () => {
      await loginPage.startSignup(user.name, user.email);
    });

    await test.step("Verify Existing Email Error", async () => {
      await expect(loginPage.emailAlreadyExistsMessage).toBeVisible();
      await expect(loginPage.emailAlreadyExistsMessage).toHaveText(
        "Email Address already exist!",
      );
    });

    await test.step("Login and Delete Account", async () => {
      await loginPage.login(user.email, user.password);
      await homePage.deleteAccount();
      await expect(confirmationPage.accountDeletedMessage).toBeVisible();
      await confirmationPage.continue();
    });
  });
});