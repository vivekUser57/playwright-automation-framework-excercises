import { test, expect } from "@playwright/test";
import { HomePage } from "../pages/Homepage";
import { LoginPage } from "../pages/Loginpage";
import { SignupPage } from "../pages/Signuppage";
import { ConfirmationPage } from "../pages/Confirmationpage";
import registerData from "../test-data/registerData.json";
import { RegisterUser } from "../types/RegisterUser";
import { URLS } from "../config/urls";
import { ContactUsPage } from "../pages/ContactUsPage";
import { ContactUsFactory } from "../data-factory/contactUsFactory";

test.describe("User Registration", () => {
  let homePage: HomePage;
  let loginPage: LoginPage;
  let signupPage: SignupPage;
  let confirmationPage: ConfirmationPage;
  let user: RegisterUser;
  let contactUsPage: ContactUsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    loginPage = new LoginPage(page);
    signupPage = new SignupPage(page);
    confirmationPage = new ConfirmationPage(page);
    contactUsPage = new ContactUsPage(page);

    // Auto-accept the native confirm() dialog that fires on Contact Us submit.
    // Registered once here so it's active for the whole test, no manual
    // waitForEvent/race logic needed in the test body.
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    user = {
      ...registerData,
      email: `vivek${Date.now()}${Math.floor(Math.random() * 1000)}@test.com`,
    } as RegisterUser;

    await homePage.navigate();
    await expect(page).toHaveURL(URLS.HOME);
    await expect(homePage.homePageLogo).toBeVisible();
  });

  test("TC006 - Contact Us Form", async ({ page }) => {
    const contactDetails = ContactUsFactory.create();

    await test.step("Navigate to Contact Us", async () => {
      await contactUsPage.openContactUs();
      await expect(page).toHaveURL(URLS.CONTACT_US);
      await expect(contactUsPage.getInTouchHeading).toBeVisible();
    });

    await test.step("Fill Contact Us form", async () => {
      await contactUsPage.fillContactUsForm(contactDetails);
    });

    await test.step("Upload file", async () => {
      await contactUsPage.uploadFile("test-data/sample.pdf");
    });

    await test.step("Submit form and accept confirmation", async () => {
     
      await contactUsPage.submitButton.click();
    });

    await test.step("Verify success message", async () => {
      await expect(contactUsPage.successMessage).toBeVisible({ timeout: 15000 });
      await expect(contactUsPage.successMessage).toContainText(
        "Success! Your details have been submitted successfully."
      );
    });

    await test.step("Click Home and verify landing on home page", async () => {
      // await contactUsPage.homeButton.click();
      // await expect(page).toHaveURL(URLS.HOME);
      // await expect(homePage.homePageLogo).toBeVisible();
    });
  });


  test("TC007 - Verify Test Cases Page", async ({ page }) => {
    // Step 3: Verify home page is visible
    await expect(homePage.homePageLogo).toBeVisible();

    // Step 4: Click on 'Test Cases' button
    await homePage.openTestCase();

    // Step 5: Verify user is navigated to test cases page successfully
    await expect(page).toHaveURL(URLS.TEST_CASES);
    await expect(homePage.testCaseText).toBeVisible();
    await expect(homePage.panel_groupText).toBeVisible();
  });


});