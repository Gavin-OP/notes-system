import { expect, test } from "@playwright/test";

test("JobTI starts clean and advances after a single choice", async ({ page }) => {
  await page.goto("job-seeker-personality");
  await expect(page.getByRole("heading", { name: /求职者人格/ })).toBeVisible();
  await expect(page.locator(".personality-hero-art")).toHaveCount(0);
  await page.getByRole("button", { name: /开始测试/ }).click();
  await expect(page.getByText("1 / 10")).toBeVisible();
  await page.getByRole("radio").first().click();
  await expect(page.getByText("2 / 10")).toBeVisible();
  await expect(page.getByRole("button", { name: /下一题/ })).toHaveCount(0);
});

test("the type gallery is directly addressable", async ({ page }) => {
  await page.goto("job-seeker-personality/types");
  await expect(page.getByRole("heading", { name: "八种求职者人格" })).toBeVisible();
  await expect(page.locator(".personality-type-card")).toHaveCount(8);
});
