import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  timeout: 60 * 1000,

  expect: {
    timeout: 10 * 1000,
  },

  reporter: [
    ["html", { open: "never" }],
  ],

  use: {
    headless: false,

    viewport: {
      width: 1920,
      height: 1080,
    },

    ignoreHTTPSErrors: true,

    actionTimeout: 15 * 1000,

    navigationTimeout: 30 * 1000,

    screenshot: "only-on-failure",

    video: "off",

    trace: "off",
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],

  // webServer: {
  //   command: "npm run start",
  //   url: "http://localhost:3000",
  //   reuseExistingServer: !process.env.CI,
  // },
});