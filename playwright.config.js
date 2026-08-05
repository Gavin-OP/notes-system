import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: { command: "npm run dev -- --host 127.0.0.1", url: "http://127.0.0.1:5173/notes-system/", reuseExistingServer: true },
  use: { baseURL: "http://127.0.0.1:5173/notes-system/" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "mobile-webkit", use: { ...devices["iPhone 13"] } },
  ],
});
