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
│   └── urls.ts               # Centralized URL constants
├── data-factory/
│   └── contactUsFactory.ts   # Dynamic data for the Contact Us form
├── models/
│   └── GuestDetails.ts       # Type model for guest checkout
├── pages/                    # Page Object classes (one per page)
│   ├── BasePage.ts
│   ├── AuthPage.ts
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
│   ├── registerData.json     # Static test user
│   ├── userData.ts           # Dynamic user data via Faker.js
│   └── sample.pdf            # Upload-test fixture
├── types/
│   ├── RegisterUser.ts
│   └── ContactUsDetails.ts
├── tests/
│   ├── Register.spec.ts
│   ├── Login.spec.ts
│   ├── Home.spec.ts
│   ├── Product.spec.ts
│   └── Checkout.spec.ts
├── playwright.config.ts      # Parameterized reporter config (see below)
├── package.json
└── tsconfig.json
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
npx playwright test                 # full suite, default (html) reporter
npx playwright test tests/Login.spec.ts
npm run test:ui                     # interactive UI mode
```

## 📊 Reporting — pick the format you need

Reporting is **parameterized** via the `REPORT_TYPE` environment variable — no config edits needed. Whoever's running the suite chooses HTML, Allure, JSON, or all three at once:

| Command | Produces | Best for |
|---|---|---|
| `npm run test:html` | `playwright-report/` (interactive HTML) | Local debugging, trace viewer |
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

The same pattern works for the Playwright HTML report — archive `playwright-report/**` and use the **HTML Publisher** plugin if you want it viewable inline in Jenkins too.

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


---
<p align="center">⭐ If this framework helped you, consider starring the repo!</p>
