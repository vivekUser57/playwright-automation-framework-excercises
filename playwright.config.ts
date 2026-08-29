import { defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * -----------------------------------------------------------------------
 * Parameterized reporting.
 *
 * Pick a reporter (or several) without touching this file, e.g.:
 *
 *   REPORT_TYPE=html    npx playwright test         -> Playwright HTML report
 *   REPORT_TYPE=allure   npx playwright test         -> Allure results (allure-results/)
 *   REPORT_TYPE=json     npx playwright test         -> results.json
 *   REPORT_TYPE=all       npx playwright test         -> html + allure + json together
 *
 * Defaults to "html" if REPORT_TYPE is not set (e.g. local `npx playwright test`).
 * See npm scripts in package.json for shortcuts (npm run test:allure, etc.)
 * -----------------------------------------------------------------------
 */
type ReportType = 'html' | 'allure' | 'json' | 'all';

const REPORT_TYPE = (process.env.REPORT_TYPE as ReportType) || 'html';

const reporters: any[] = [['list']];

if (REPORT_TYPE === 'html' || REPORT_TYPE === 'all') {
  // outputFolder is wiped by `pretest` in package.json, so each run overwrites the previous report.
  // open: 'on-failure' auto-opens the HTML report in the browser only when tests fail
  //   (successful runs stay quiet). Pass/fail details are always included either way.
  reporters.push(['html', { open: 'on-failure', outputFolder: 'report' }]);
}

if (REPORT_TYPE === 'allure' || REPORT_TYPE === 'all') {
  reporters.push(['allure-playwright', { resultsDir: 'allure-results' }]);
}

if (REPORT_TYPE === 'json' || REPORT_TYPE === 'all') {
  reporters.push(['json', { outputFile: 'test-results/results.json' }]);
}

// Always emit a JUnit file too — Jenkins reads this natively for pass/fail trend graphs
// on every job regardless of which "human" report was requested.
reporters.push(['junit', { outputFile: 'test-results/junit.xml' }]);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: reporters,

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'https://automationexercise.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Capture screenshot only when a test fails */
    screenshot: 'only-on-failure',

    /* Record video only when a test fails */
    video: 'retain-on-failure',

    /* Maximum time each action (click, fill, etc.) can take */
    actionTimeout: 15_000,

    /* Maximum time to wait for navigation */
    navigationTimeout: 30_000,
  },

  /* Maximum time one test can run for */
  timeout: 60_000,

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: !!process.env.CI,
      },
    },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: "npm run start",
  //   url: "http://localhost:3000",
  //   reuseExistingServer: !process.env.CI,
  // },
});