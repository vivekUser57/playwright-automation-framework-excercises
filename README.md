<div align="center">

# 🎭 Playwright Automation Framework

**Page Object Model UI automation suite for [automationexercise.com](https://automationexercise.com/)**
Built with Playwright + TypeScript · CI-driven with Jenkins · Reports in HTML, Allure, or JSON — your choice.

[![Playwright](https://img.shields.io/badge/Playwright-1.61-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Jenkins](https://img.shields.io/badge/CI-Jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white)](https://www.jenkins.io/)
[![Allure](https://img.shields.io/badge/Reports-Allure-FF6E42?style=for-the-badge)](https://allurereport.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)

</div>

---

## 📌 Overview

An end-to-end UI test suite covering registration, login, product browsing, cart, checkout, and the contact form on a live e-commerce demo site. Built around the **Page Object Model (POM)**, typed test data, and reusable data factories — so specs stay short and only describe *behavior*, not implementation.

Every spec runs as its own **Jenkins job** (`Home-Spec-Tests`, `Login-Spec-Tests`, `Product-Spec-Tests`, `Register-Spec-Tests`) inside a `Playwright_automation_exercise` folder, with independent build history and pass/fail trends.

## 🗂️ Project Structure

```
playwright-automation-framework-excercises/
├── config/
│   └── urls.ts                    # Centralized URL constants (single source of truth)
├── data-factory/
│   ├── contactUsFactory.ts        # Dynamic Contact Us payloads via Faker.js
│   └── registerUserFactory.ts     # Dynamic RegisterUser (unique email per run)
├── fixtures/
│   └── pomFixture.ts              # Playwright test.extend<> — auto-injects every POM + fresh user
├── models/
│   └── GuestDetails.ts            # Type model for guest checkout
├── pages/                         # Page Object classes (one per page)
│   ├── BasePage.ts                # Shared page ref + FOOTER / SUBSCRIPTION (present on every page)
│   ├── AuthPage.ts                # Register-while-Checkout auth flow (used by TC014)
│   ├── Homepage.ts                # Home + top navbar (Signup/Login, Logout, Delete Account, etc.)
│   ├── Loginpage.ts               # Login form + signup mini-form + error messages
│   ├── Signuppage.ts              # Full "Enter Account Information" form (TC001, TC002, TC004, TC005)
│   ├── ProductPage.ts             # Products listing + product detail + search + Add-to-cart
│   ├── CartPage.ts                # View cart, rows, proceed-to-checkout, checkout modal
│   ├── CheckoutPage.ts            # Address / order review / comment / place order
│   ├── PaymentPage.ts             # Card details + Pay & Confirm + success banner
│   ├── Confirmationpage.ts        # Shared "Account Created!" / "Account Deleted!" screens
│   └── ContactUsPage.ts           # Contact form + file upload + success banner + Home button
├── test-data/
│   ├── registerData.json          # Static baseline user (email is overridden per run)
│   ├── userData.ts                # Ad-hoc Faker.js user object
│   └── sample.pdf                 # Upload fixture used by TC006
├── types/
│   ├── RegisterUser.ts
│   └── ContactUsDetails.ts
├── tests/
│   ├── Register.spec.ts           # TC001, TC005
│   ├── Login.spec.ts              # TC002, TC003, TC004
│   ├── Home.spec.ts               # TC006, TC007, TC010, TC011
│   ├── Product.spec.ts            # TC008, TC009, TC012, TC013
│   └── Checkout.spec.ts           # TC014
├── playwright.config.ts           # Parameterized reporter config (see below)
├── package.json
└── tsconfig.json
```

## ✅ Test Coverage

Full list of the 26 test cases published on [automationexercise.com/test_cases](https://www.automationexercise.com/test_cases). Each row links to the official scenario. **Status** shows what is automated in this framework today.

| # | Test Case | Status | Spec |
|---|---|---|---|
| TC001 | [Register User](https://www.automationexercise.com/test_cases#collapse1) | ✅ Automated | [Register.spec.ts](playwright-automation-framework-excercises/tests/Register.spec.ts) |
| TC002 | [Login User with correct email and password](https://www.automationexercise.com/test_cases#collapse2) | ✅ Automated | [Login.spec.ts](playwright-automation-framework-excercises/tests/Login.spec.ts) |
| TC003 | [Login User with incorrect email and password](https://www.automationexercise.com/test_cases#collapse3) | ✅ Automated | [Login.spec.ts](playwright-automation-framework-excercises/tests/Login.spec.ts) |
| TC004 | [Logout User](https://www.automationexercise.com/test_cases#collapse4) | ✅ Automated | [Login.spec.ts](playwright-automation-framework-excercises/tests/Login.spec.ts) |
| TC005 | [Register User with existing email](https://www.automationexercise.com/test_cases#collapse5) | ✅ Automated | [Register.spec.ts](playwright-automation-framework-excercises/tests/Register.spec.ts) |
| TC006 | [Contact Us Form](https://www.automationexercise.com/test_cases#collapse6) | ✅ Automated (passes on CI/Jenkins; local file-upload flake known) | [Home.spec.ts](playwright-automation-framework-excercises/tests/Home.spec.ts) |
| TC007 | [Verify Test Cases Page](https://www.automationexercise.com/test_cases#collapse7) | ✅ Automated | [Home.spec.ts](playwright-automation-framework-excercises/tests/Home.spec.ts) |
| TC008 | [Verify All Products and product detail page](https://www.automationexercise.com/test_cases#collapse8) | ✅ Automated | [Product.spec.ts](playwright-automation-framework-excercises/tests/Product.spec.ts) |
| TC009 | [Search Product](https://www.automationexercise.com/test_cases#collapse9) | ✅ Automated | [Product.spec.ts](playwright-automation-framework-excercises/tests/Product.spec.ts) |
| TC010 | [Verify Subscription in home page](https://www.automationexercise.com/test_cases#collapse10) | ✅ Automated | [Home.spec.ts](playwright-automation-framework-excercises/tests/Home.spec.ts) |
| TC011 | [Verify Subscription in Cart page](https://www.automationexercise.com/test_cases#collapse11) | ✅ Automated | [Home.spec.ts](playwright-automation-framework-excercises/tests/Home.spec.ts) |
| TC012 | [Add Products in Cart](https://www.automationexercise.com/test_cases#collapse12) | ✅ Automated | [Product.spec.ts](playwright-automation-framework-excercises/tests/Product.spec.ts) |
| TC013 | [Verify Product quantity in Cart](https://www.automationexercise.com/test_cases#collapse13) | ✅ Automated | [Product.spec.ts](playwright-automation-framework-excercises/tests/Product.spec.ts) |
| TC014 | [Place Order: Register while Checkout](https://www.automationexercise.com/test_cases#collapse14) | ✅ Automated | [Checkout.spec.ts](playwright-automation-framework-excercises/tests/Checkout.spec.ts) |
| TC015 | [Place Order: Register before Checkout](https://www.automationexercise.com/test_cases#collapse15) | ✅ Automated | [Checkout.spec.ts](playwright-automation-framework-excercises/tests/Checkout.spec.ts) |
| TC016 | [Place Order: Login before Checkout](https://www.automationexercise.com/test_cases#collapse16) | ✅ Automated | [Checkout.spec.ts](playwright-automation-framework-excercises/tests/Checkout.spec.ts) |
| TC017 | [Remove Products From Cart](https://www.automationexercise.com/test_cases#collapse17) | ✅ Automated | [Product.spec.ts](playwright-automation-framework-excercises/tests/Product.spec.ts) |
| TC018 | [View Category Products](https://www.automationexercise.com/test_cases#collapse18) | ✅ Automated | [Product.spec.ts](playwright-automation-framework-excercises/tests/Product.spec.ts) |
| TC019 | [View & Cart Brand Products](https://www.automationexercise.com/test_cases#collapse19) | ✅ Automated | [Product.spec.ts](playwright-automation-framework-excercises/tests/Product.spec.ts) |
| TC020 | [Search Products and Verify Cart After Login](https://www.automationexercise.com/test_cases#collapse20) | ✅ Automated | [Product.spec.ts](playwright-automation-framework-excercises/tests/Product.spec.ts) |
| TC021 | [Add review on product](https://www.automationexercise.com/test_cases#collapse21) | ✅ Automated | [Product.spec.ts](playwright-automation-framework-excercises/tests/Product.spec.ts) |
| TC022 | [Add to cart from Recommended items](https://www.automationexercise.com/test_cases#collapse22) | ✅ Automated | [Product.spec.ts](playwright-automation-framework-excercises/tests/Product.spec.ts) |
| TC023 | [Verify address details in checkout page](https://www.automationexercise.com/test_cases#collapse23) | ✅ Automated | [Checkout.spec.ts](playwright-automation-framework-excercises/tests/Checkout.spec.ts) |
| TC024 | [Download Invoice after purchase order](https://www.automationexercise.com/test_cases#collapse24) | ✅ Automated | [Checkout.spec.ts](playwright-automation-framework-excercises/tests/Checkout.spec.ts) |
| TC025 | [Verify Scroll Up using 'Arrow' button and Scroll Down functionality](https://www.automationexercise.com/test_cases#collapse25) | ✅ Automated | [Home.spec.ts](playwright-automation-framework-excercises/tests/Home.spec.ts) |
| TC026 | [Verify Scroll Up without 'Arrow' button and Scroll Down functionality](https://www.automationexercise.com/test_cases#collapse26) | ✅ Automated | [Home.spec.ts](playwright-automation-framework-excercises/tests/Home.spec.ts) |

> **Automated: 26 / 26** &nbsp;·&nbsp; Source of truth: [automationexercise.com/test_cases](https://www.automationexercise.com/test_cases)

## 🛠️ Tech Stack

| Layer | Tool |
|---|---|
| Automation | [Playwright](https://playwright.dev/) `^1.61` |
| Language | TypeScript (strict mode) |
| Test data | [@faker-js/faker](https://fakerjs.dev/) |
| Design pattern | Page Object Model |
| CI | Jenkins (per-spec pipeline jobs) |
| Reporting | Playwright HTML · Allure · JSON · JUnit — parameterized |

## 🚀 Getting Started

```bash
git clone https://github.com/vivekUser57/playwright-automation-framework-excercises.git
cd playwright-automation-framework-excercises
npm install
npx playwright install
```

## 🧪 Running Tests

```bash
npm test                            # full suite → HTML report (auto-opens on failure)
npx playwright test tests/Login.spec.ts
npm run test:ui                     # interactive UI mode
```

## 📑 HTML Report (default)

The default `npm test` command produces a single **self-contained HTML report** at `report/index.html` that shows every test — passed, failed, skipped, and flaky — with traces, screenshots, videos and the full step timeline for each one.

- **Overwritten on every run** — a `pretest` script wipes `report/` and `test-results/` before Playwright starts, so you never see leftovers from previous runs.
- **Generated whether tests pass or fail** — the HTML report is emitted at the end of the run either way. Failures show the failing step, the assertion diff, plus the captured trace / screenshot / video.
- **Auto-opens on failure** — `playwright.config.ts` sets `open: 'on-failure'`, so a browser tab pops up automatically the moment any test fails. Passing runs stay quiet.
- **Open it manually anytime:**

  ```bash
  npm run report:html      # runs `playwright show-report report`
  ```

  or double-click `report/index.html`.

**Typical workflow:**

```bash
npm test                     # runs tests + writes fresh HTML report (opens if any test failed)
npm run report:html          # re-open the last report without re-running tests
```

## 📊 Reporting — pick the format you need

Reporting is **parameterized** via the `REPORT_TYPE` environment variable — no config edits needed. Whoever's running the suite chooses HTML, Allure, JSON, or all three at once:

| Command | Produces | Best for |
|---|---|---|
| `npm run test:html` | `report/` (interactive HTML) | Local debugging, trace viewer |
| `npm run test:allure` | `allure-results/` (raw results) | Jenkins trend dashboards, history graphs |
| `npm run test:json` | `test-results/results.json` | Feeding other tools / dashboards |
| `npm run test:all-reports` | All of the above, in one run | CI runs where multiple consumers need output |

A `junit.xml` is always written to `test-results/` regardless of `REPORT_TYPE`, since Jenkins reads it natively for build trend graphs without any extra plugin.

**Viewing reports locally:**
```bash
npm run report:html      # opens the Playwright HTML report in your browser
npm run report:allure     # generates + opens the Allure report from allure-results/
```

**Viewing/downloading from Jenkins:**
1. Install the **Allure Jenkins Plugin** (Manage Jenkins → Plugins).
2. Register the **Allure Commandline** tool once under Manage Jenkins → Tools.
3. On each job (e.g. `Home-Spec-Tests`), add a post-build action **"Allure Report"** pointing at `allure-results`.
4. After the next build, a permanent **Allure Report** link appears in that job's sidebar with history/trend charts.
5. To download a static copy, add an **"Archive the artifacts"** step for `allure-report/**` (after `npm run report:allure:generate`), or grab the folder from **Workspace Files** on the job page.

The same pattern works for the Playwright HTML report — archive `report/**` and use the **HTML Publisher** plugin if you want it viewable inline in Jenkins too.

## ⚙️ Configuration Notes

- Base URL: `https://automationexercise.com` (`playwright.config.ts → use.baseURL`)
- Browser: Chromium — headless automatically on CI (`process.env.CI`), headed locally
- Tracing: on first retry · Screenshots: on failure · Video: retained on failure
- Retries: 2 on CI, 0 locally

## 🧩 Design Highlights

- **Page Object Model** — one class per page; specs read as plain business flows.
- **Typed test data** (`types/`) — registration and contact-form payloads are compile-time checked.
- **Data factories** (`data-factory/`) — dynamic payloads instead of hardcoded values, cutting down flaky/duplicate-data failures.
- **Centralized URLs** (`config/urls.ts`) — no magic strings scattered across specs.
- **Parameterized reporting** — one config, three report formats, chosen at run time.
- **Playwright fixtures** (`fixtures/pomFixture.ts`) — POM injection via `test.extend<>`; specs never call `new HomePage(page)` themselves.
- **BasePage segregation** — the site footer/subscription lives on every page, so it lives once in `BasePage` and every POM inherits it.

## 🧬 Fixtures & Factories

### Fixture — `fixtures/pomFixture.ts`

Instead of importing `{ test, expect }` from `@playwright/test` directly, specs import them from the **central fixture**. This wires every Page Object into the test signature, so a test just destructures what it needs:

```ts
import { test, expect } from "../fixtures/pomFixture";
import { URLS } from "../config/urls";

test("TC010 - Verify Subscription on Home page", async ({ homePage }) => {
  await homePage.scrollToSubscription();
  await homePage.subscribeAndVerify(`subscriber+${Date.now()}@test.com`);
});
```

Available fixtures:

| Fixture | Type | Notes |
|---|---|---|
| `homePage` | `HomePage` | |
| `loginPage` | `LoginPage` | |
| `signupPage` | `SignupPage` | |
| `confirmationPage` | `ConfirmationPage` | |
| `contactUsPage` | `ContactUsPage` | |
| `cartPage` | `CartPage` | |
| `productPage` | `ProductPage` | |
| `authPage` | `AuthPage` | Used by TC014 register-while-checkout flow |
| `checkoutPage` | `CheckoutPage` | |
| `paymentPage` | `PaymentPage` | |
| `registerUser` | `RegisterUser` | Fresh user per test — unique email each call via `RegisterUserFactory.create()` |

Fixtures are **lazy** — a POM is only constructed if the test asks for it. This means empty overhead for tests that only need one or two pages.

### Factory — `data-factory/registerUserFactory.ts`

A thin wrapper that seeds a `RegisterUser` from `test-data/registerData.json`, overrides the email with a unique value, and accepts a `Partial<RegisterUser>` override so a test can pin any field:

```ts
const user = RegisterUserFactory.create({ title: "Mrs", country: "United States" });
```

Because the email is regenerated on every call (`qa.{timestamp}.{random}@test.com`), parallel/repeat runs never hit **"Email Address already exist!"**.

## 🧱 Segregation Rules

To keep POMs small and testable:

- **Footer / Subscription** → `BasePage` (present on every page — inherited by every POM).
- **Top navbar links** (Signup/Login, Logout, Delete Account, Cart, Contact Us, Test Cases) → `HomePage` (also inherited/reused via `homePage` fixture).
- **Page-specific UI** → its dedicated POM only.
- **Assertions on shared UI** live in the POM helper (e.g. `subscribeAndVerify` asserts the success banner internally) so tests stay short and consistent.

## 🧾 What Changed in the Latest Refactor

- ✅ Added `fixtures/pomFixture.ts` — POM injection + fresh user data via `test.extend<>`.
- ✅ Added `data-factory/registerUserFactory.ts` — generic factory for `RegisterUser` (unique email + overrides).
- ✅ Moved footer/subscription from `HomePage` to `BasePage` — every POM now inherits `subscribeAndVerify` / `scrollToSubscription`.
- ✅ Deleted dead file `pages/registerPage.ts` (duplicate of Signup/Login; had a `this.page` used before `super()` bug).
- ✅ Removed duplicate `TC014` from `Product.spec.ts` (kept in `Checkout.spec.ts` only).
- ✅ Removed duplicate `URLS.CART` key; added `URLS.PAYMENT_DONE`.
- ✅ Fixed `CheckoutPage.verifyAddressAndOrderVisible()` — `.waitFor()` replaced with `expect().toBeVisible()` so failures show as assertion errors, not timeouts.
- ✅ Removed two `waitForTimeout(10_000)` sleeps from `ContactUsPage.uploadFile()`.
- ✅ TC006 — commented-out "Click Home" step re-implemented with a proper URL assertion via `contactUsPage.clickHome()`.
- ✅ TC008 — asserts on **parsed content** (name / price contains `Rs.` / brand etc.) instead of visibility of possibly-empty containers.
- ✅ TC009 — asserts `results.length > 0` before running the fuzzy "average match" heuristic.
- ✅ TC011 — asserts `URL === VIEW_CART` before subscribing (no more cross-POM leaks).
- ✅ TC012 — unified selector strategy: both products asserted via `cartPage.getCartRowDetails(name)`; adds `expect(cartRows).toHaveCount(2)`.
- ✅ TC013 — also asserts product name match between detail page and cart row.
- ✅ `Home.spec.ts` describe title fixed (`"User Registration"` → `"Home / Contact Us / Subscription"`).
- ✅ Contact Us dialog handler moved out of `beforeEach` into the one test (TC006) that needs it.

---
<p align="center">⭐ If this framework helped you, consider starring the repo!</p>
