import { Page, Locator } from "@playwright/test";

export interface AccountInfo {
  password: string;
  day: string;
  month: string;
  year: string;
  firstName: string;
  lastName: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
  mobileNumber: string;
}

export class AuthPage {
  readonly page: Page;

  // Signup (name/email) form
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;

  // Account information form
  readonly titleMrRadio: Locator;
  readonly titleMrsRadio: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly addressInput: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;

  // Confirmation screens
  readonly accountCreatedText: Locator;
  readonly accountDeletedText: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');

    this.titleMrRadio = page.locator("#id_gender1");
    this.titleMrsRadio = page.locator("#id_gender2");
    this.passwordInput = page.locator("#password");
    this.daysSelect = page.locator("#days");
    this.monthsSelect = page.locator("#months");
    this.yearsSelect = page.locator("#years");
    this.firstNameInput = page.locator("#first_name");
    this.lastNameInput = page.locator("#last_name");
    this.addressInput = page.locator("#address1");
    this.countrySelect = page.locator("#country");
    this.stateInput = page.locator("#state");
    this.cityInput = page.locator("#city");
    this.zipcodeInput = page.locator("#zipcode");
    this.mobileNumberInput = page.locator("#mobile_number");
    this.createAccountButton = page.locator('button[data-qa="create-account"]');

    this.accountCreatedText = page.getByText("Account Created!");
    this.accountDeletedText = page.getByText("Account Deleted!");
    this.continueButton = page.getByRole("link", { name: "Continue" });
  }

  /**
   * Fills the initial "New User Signup!" mini-form (name + email) and submits it.
   */
  async signup(name: string, email: string): Promise<void> {
    await this.signupNameInput.fill(name);
    await this.signupEmailInput.fill(email);
    await this.signupButton.click();
  }

  /**
   * Fills the full "Enter Account Information" form on the signup page.
   * Days/months/years are selected by their option `value`, so ensure
   * faker-generated numbers are passed as plain numeric strings (e.g. "5", not "05").
   */
  async fillAccountInformation(info: AccountInfo): Promise<void> {
    await this.titleMrRadio.check({ force: true });

    await this.passwordInput.fill(info.password);

    await this.daysSelect.selectOption(info.day);
    await this.monthsSelect.selectOption(info.month);
    await this.yearsSelect.selectOption(info.year);

    await this.firstNameInput.fill(info.firstName);
    await this.lastNameInput.fill(info.lastName);
    await this.addressInput.fill(info.address);
    await this.countrySelect.selectOption(info.country);
    await this.stateInput.fill(info.state);
    await this.cityInput.fill(info.city);
    await this.zipcodeInput.fill(info.zipcode);
    await this.mobileNumberInput.fill(info.mobileNumber);
  }

  async submitAccountCreation(): Promise<void> {
    await this.createAccountButton.click();
  }

  async clickContinue(): Promise<void> {
    await this.continueButton.click();
  }
}