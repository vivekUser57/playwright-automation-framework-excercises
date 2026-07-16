import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { URLS } from "../config/urls";
import { RegisterUser } from "../types/RegisterUser";

export class RegisterPage extends BasePage {
  // Home Page
  readonly homePageLogo: Locator;
  readonly signupLoginLink: Locator;
  // Signup Page
  readonly newUserSignupHeading: Locator;
  readonly LoginToYourAccountHeading: Locator;
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  // Account Information
  readonly accountInformationHeading: Locator;
  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly dayDropdown: Locator;
  readonly monthDropdown: Locator;
  readonly yearDropdown: Locator;
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;
  // Address Information
  readonly addressInformationHeading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countryDropdown: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;
  // Account Created Page
  readonly accountCreatedMessage: Locator;
  readonly continueButton: Locator;
  // Logged In User Section
  readonly loggedInUserLabel: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  // Delete Account Page
  readonly accountDeletedMessage: Locator;

  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage = this.page.getByText(
  "Your email or password is incorrect!"
);

readonly emailAlreadyExistsMessage = this.page.getByText(
  "Email Address already exist!"
);

  constructor(page: Page) {
    super(page);
    // Home Page
    this.homePageLogo = page.locator(
      "img[alt='Website for automation practice']",
    );
    this.signupLoginLink = page.getByRole("link", { name: "Signup / Login" });
    this.newUserSignupHeading = page.getByText("New User Signup!", {
      exact: true,
    });
    this.LoginToYourAccountHeading = page.getByText("Login to your account", {
      exact: true,
    });
    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');
    // Account Information
    this.accountInformationHeading = page.getByRole("heading", {
      name: /Enter Account Information/i,
    });
    this.titleMrRadio = page.locator("#id_gender1");
    this.titleMrsRadio = page.locator("#id_gender2");
    this.nameInput = page.locator("#name");
    this.emailInput = page.locator("#email");
    this.passwordInput = page.locator("#password");
    this.dayDropdown = page.locator("#days");
    this.monthDropdown = page.locator("#months");
    this.yearDropdown = page.locator("#years");
    this.newsletterCheckbox = page.locator("#newsletter");
    this.offersCheckbox = page.locator("#optin");
    // Address Information
    this.addressInformationHeading = page.getByText("Address Information", {
      exact: true,
    });

    this.firstNameInput = page.locator("#first_name");
    this.lastNameInput = page.locator("#last_name");
    this.companyInput = page.locator("#company");
    this.address1Input = page.locator("#address1");
    this.address2Input = page.locator("#address2");
    this.countryDropdown = page.locator("#country");
    this.stateInput = page.locator("#state");
    this.cityInput = page.locator("#city");
    this.zipcodeInput = page.locator("#zipcode");
    this.mobileNumberInput = page.locator("#mobile_number");
    this.createAccountButton = page.getByRole("button", {
      name: "Create Account",
    });
    this.loginEmailInput = page.locator("form").locator("input").nth(1);
    this.loginPasswordInput = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
    // Account Created Page
    this.accountCreatedMessage = page
      .locator("b")
      .filter({ hasText: /account created!/i });

    this.continueButton = page.getByRole("link", {
      name: "Continue",
    });

    // Logged In User Section
    this.loggedInUserLabel = page
      .locator("a")
      .filter({ hasText: /Logged in as/i });

    this.logoutLink = page.getByRole("link", {
      name: "Logout",
    });

    this.deleteAccountLink = page.getByRole("link", {
      name: "Delete Account",
    });
    // Delete Account Page

    this.accountDeletedMessage = page
      .locator("b")
      .filter({ hasText: /account deleted!/i });
  }

  async navigate(): Promise<void> {
    await super.navigate(URLS.HOME);
  }

  async openSignupPage(): Promise<void> {
    await this.signupLoginLink.click();
  }

async signupUser(user: RegisterUser): Promise<void> {
  await this.signupNameInput.fill(user.name);
  await this.signupEmailInput.fill(user.email);
  await this.signupButton.click();
}

async verifyAccountInformation(user: RegisterUser): Promise<void> {
  await expect(this.accountInformationHeading).toBeVisible();
  await expect(this.nameInput).toHaveValue(user.name);
  await expect(this.emailInput).toHaveValue(user.email);
  await expect(this.emailInput).toBeDisabled();
}

  async fillAccountInformation(user: RegisterUser): Promise<void> {
    if (user.title.toLowerCase() === "mr") {
      await this.titleMrRadio.check();
    } else {
      await this.titleMrsRadio.check();
    }

    await this.passwordInput.fill(user.password);
    await this.dayDropdown.selectOption(user.day);
    await this.monthDropdown.selectOption(user.month);
    await this.yearDropdown.selectOption(user.year);

    if (user.newsletter) {
      await this.newsletterCheckbox.check();
    }

    if (user.offers) {
      await this.offersCheckbox.check();
    }

    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);

    if (user.company) {
      await this.companyInput.fill(user.company);
    }

    await this.address1Input.fill(user.address);

    if (user.address2) {
      await this.address2Input.fill(user.address2);
    }

    await this.countryDropdown.selectOption({ label: user.country });

    await this.stateInput.fill(user.state);
    await this.cityInput.fill(user.city);
    await this.zipcodeInput.fill(user.zipcode);
    await this.mobileNumberInput.fill(user.mobile);

    await this.createAccountButton.click();
  }

  async loginUser(email: string, password: string) {
  await this.loginEmailInput.fill(email);
  await this.loginPasswordInput.fill(password);
  await this.loginButton.click();
}

async logoutUser() {
  await this.logoutLink.click();
}
}
