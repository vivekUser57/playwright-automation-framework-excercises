import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { RegisterUser } from "../types/RegisterUser";

export class SignupPage extends BasePage {
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

  constructor(page: Page) {
    super(page);

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
  }

  async verifyPrefilledInformation(user: RegisterUser): Promise<void> {
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
}