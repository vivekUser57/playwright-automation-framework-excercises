<h1 align="center">🎭 Playwright Automation Framework — Exercises</h1>

<p align="center">
  A Page Object Model based UI automation framework built with <b>Playwright + TypeScript</b>,
  testing the demo e-commerce site <a href="https://automationexercise.com/">automationexercise.com</a>.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Playwright-1.61-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Language-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Runtime-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Faker.js-Test%20Data-FF6F61?style=for-the-badge" />
</p>

---

## 📌 About

This repository is a hands-on **Playwright automation framework** covering end-to-end UI test scenarios for a live e-commerce demo site — registration, login, product browsing, cart, checkout, and the contact form. It follows the **Page Object Model (POM)** pattern for clean separation between test logic and page interactions, with typed test data and reusable factories.

## 🗂️ Project Structure

```
playwright-automation-framework-excercises/
├── config/
│   └── urls.ts               # Centralized URL constants (home, login, cart, checkout...)
├── data-factory/
│   └── contactUsFactory.ts   # Generates dynamic data for the Contact Us form
├── models/
│   └── GuestDetails.ts       # Type model for guest checkout details
├── pages/                    # Page Object classes (one per page)
│   ├── BasePage.ts
│   ├── Homepage.ts
│   ├── Loginpage.ts
│   ├── Signuppage.ts
│   ├── registerPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── PaymentPage.ts
│   ├── Confirmationpage.ts
│   └── ContactUsPage.ts
├── test-data/
│   ├── registerData.json     # Static test user data
│   ├── userData.ts           # Dynamic user data generated via Faker.js
│   └── sample.pdf            # Sample file used for upload tests
├── types/
│   ├── RegisterUser.ts       # Type definitions for registration data
│   └── ContactUsDetails.ts   # Type definitions for contact form data
├── tests/                    # Test specs
│   ├── Register.spec.ts
│   ├── Login.spec.ts
│   ├── Home.spec.ts
│   ├── Product.spec.ts
│   └── Checkout.spec.ts
├── playwright.config.ts
├── package.json
└── README.md
```

## ✅ Test Coverage

| Test Case | Scenario |
|---|---|
| TC001 | Register User |
| TC002 | Login User with correct email and password |
| TC003 | Login User with incorrect email and password |
| TC004 | Logout User |
| TC005 | Register User with existing email |
| TC006 | Contact Us Form |
| TC007 | Verify Test Cases Page |
| TC008 | Verify All Products and product detail page |
| TC009 | Search Product |
| TC010 | Verify Subscription in home page |
| TC011 | Verify Subscription in Cart page |
| TC012 | Add Products in Cart |
| TC013 | Verify Product quantity in Cart |
| TC014 | Place Order: Register while Checkout |

## 🛠️ Tech Stack

- **[Playwright](https://playwright.dev/)** `^1.61.1` — browser automation & test runner
- **TypeScript** — static typing across pages, models, and tests
- **[@faker-js/faker](https://fakerjs.dev/)** `^10.5.0` — realistic, randomized test data
- **Page Object Model (POM)** — one class per page, tests stay readable and DRY
- **HTML Reporter** — built-in Playwright HTML report after every run

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (LTS recommended)
- npm

### Installation
```bash
git clone https://github.com/vivekUser57/playwright-automation-framework-excercises.git
cd playwright-automation-framework-excercises
npm install
npx playwright install
```

### Running Tests
```bash
# Run the full suite (headed, Chromium)
npx playwright test

# Run a specific spec file
npx playwright test tests/Login.spec.ts

# Run in UI mode (interactive)
npx playwright test --ui

# Open the HTML report after a run
npx playwright show-report
```

## ⚙️ Configuration

- Base test directory: `./tests`
- Browser: Chromium (`headless: false` by default — set `headless: true` in `playwright.config.ts` for CI)
- Tracing: enabled on first retry (`trace: 'on-first-retry'`)
- Target site: [automationexercise.com](https://automationexercise.com/)

## 🧩 Design Highlights

- **Page Object Model** — every page has its own class with locators and actions, keeping test specs focused purely on assertions and flow.
- **Typed test data** (`types/`) — registration and contact-form payloads are strongly typed, catching data-shape mistakes at compile time.
- **Data factories** (`data-factory/`) — dynamic payload generation instead of hardcoded values, reducing flaky/duplicate-data failures.
- **Centralized URLs** (`config/urls.ts`) — no magic strings scattered across specs.

## 🔮 Roadmap

- [ ] Add CI pipeline (GitHub Actions) to run tests on every push
- [ ] Parameterize base URL via environment variables
- [ ] Add cross-browser projects (Firefox, WebKit, Mobile)
- [ ] Add Allure/JSON reporting for richer test reports
- [ ] Increase assertions coverage on payment & guest checkout flows

## 👤 Author

**Vivek** — [github.com/vivekUser57](https://github.com/vivekUser57)

---
<p align="center">⭐ If you found this useful, consider starring the repo!</p>
