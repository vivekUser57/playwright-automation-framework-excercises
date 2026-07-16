import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  // Headings
  readonly newUserSignupHeading: Locator;
  readonly loginToYourAccountHeading: Locator;

  // Signup mini-form (name + email only)
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;

  // Login form
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;

  // Errors
  readonly loginErrorMessage: Locator;
  readonly emailAlreadyExistsMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.newUserSignupHeading = page.getByText("New User Signup!", {
      exact: true,
    });
    this.loginToYourAccountHeading = page.getByText("Login to your account", {
      exact: true,
    });

    this.signupNameInput = page.locator('[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('[data-qa="signup-email"]');
    this.signupButton = page.locator('[data-qa="signup-button"]');

    this.loginEmailInput = page.locator("form").locator("input").nth(1);
    this.loginPasswordInput = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });

    this.loginErrorMessage = page.getByText(
      "Your email or password is incorrect!",
    );
    this.emailAlreadyExistsMessage = page.getByText(
      "Email Address already exist!",
    );
  }

  /** Starts registration: fills the small name/email box and submits to the signup page. */
  async startSignup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginButton.click();
  }
}