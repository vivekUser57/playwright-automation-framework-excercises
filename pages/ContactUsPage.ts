import { Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { URLS } from "../config/urls";
import { ContactUsDetails } from "../types/ContactUsDetails";

export class ContactUsPage extends BasePage {
  readonly homePageLogo: Locator;
  readonly contactUsLink: Locator;

  // Contact Us Page
  readonly getInTouchHeading: Locator;
  readonly nameTextbox: Locator;
  readonly emailTextbox: Locator;
  readonly subjectTextbox: Locator;
  readonly messageTextbox: Locator;
  readonly uploadFileInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.homePageLogo = page.locator(
      "img[alt='Website for automation practice']",
    );
    this.contactUsLink = page.getByRole("link", { name: "Contact us" });
    // Contact Us Page
    this.getInTouchHeading = page.getByRole("heading", {
      name: "Get In Touch",
    });

    this.nameTextbox = page.getByRole("textbox", {
      name: "Name",
    });

    this.emailTextbox = page.locator("input[name='email']");

    this.subjectTextbox = page.getByRole("textbox", {
      name: "Subject",
    });
    this.messageTextbox = page.getByRole("textbox", {
      name: "Your Message Here",
    });
    this.uploadFileInput = page.locator("input[name='upload_file']");
    this.submitButton = page.locator("[name='submit']");
    this.successMessage = page
      .locator("div")
      .filter({
        hasText: "Success! Your details have been submitted successfully.",
      })
      .first();
  }

  async navigate(): Promise<void> {
    await super.navigate(URLS.CONTACT_US);
  }

  async openContactUs(): Promise<void> {
    await this.contactUsLink.click();
  }

async fillContactUsForm(details: ContactUsDetails): Promise<void> {
  await this.nameTextbox.waitFor({ state: "visible" });

  await this.nameTextbox.fill(details.name);
  await this.emailTextbox.fill(details.email);
  await this.subjectTextbox.fill(details.subject);
  await this.messageTextbox.fill(details.message);
}

async uploadFile(filePath: string): Promise<void> {
  // Wait 10 seconds before uploading
  await this.page.waitForTimeout(10000);

  // Upload the file
  await this.uploadFileInput.setInputFiles(filePath);

  // Wait 10 seconds after uploading
  await this.page.waitForTimeout(10000);
}

async submitContactUs(): Promise<void> {
  await this.submitButton.click();
}
}
