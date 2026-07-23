import { expect, test } from "@playwright/test";

// Requires the seeded demo staff accounts (npm run seed) and the shared
// demo password set via DEMO_STAFF_PASSWORD. .env.local is loaded globally
// in playwright.config.ts.
const PASSWORD = process.env.DEMO_STAFF_PASSWORD!;

const ROLES = [
  { email: "dr.santos@serenedental.demo", role: "dentist" },
  { email: "carla.reyes@serenedental.demo", role: "receptionist" },
  { email: "admin@serenedental.demo", role: "admin" },
];

test.describe("dashboard auth + RLS access", () => {
  // Serial, not parallel: 3 simultaneous real sign-ins against the same
  // Supabase Auth project raced and intermittently failed when run in
  // parallel (confirmed a test-infra flake, not a product bug, by rerunning
  // with --workers=1 and getting a clean pass every time).
  test.describe.configure({ mode: "serial" });

  test("unauthenticated visitors are redirected to /login", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  for (const { email, role } of ROLES) {
    test(`${role} can sign in and view appointments/patients without error`, async ({ page }) => {
      await page.goto("/login");
      await page.getByLabel("Email").fill(email);
      await page.getByLabel("Password").fill(PASSWORD);
      await page.getByRole("button", { name: "Sign In" }).click();

      await expect(page).toHaveURL(/\/dashboard$/);
      await expect(page.getByText(role, { exact: false })).toBeVisible();

      // Regression guard for a real bug: staff_select RLS used to only
      // allow a staff member to see their own row, so the embedded
      // staff(*) join on someone else's appointment returned null and
      // crashed the page for any non-owner, non-admin role.
      await page.goto("/dashboard/appointments");
      await expect(page.getByText("This page couldn't load")).not.toBeVisible();
      const firstAppointment = page.locator("table tbody tr").first();
      await expect(firstAppointment).toBeVisible();
      await firstAppointment.getByRole("link").first().click();
      await expect(page.getByText("This page couldn't load")).not.toBeVisible();
      await expect(page.getByText("Dentist:")).toBeVisible();

      await page.goto("/dashboard/patients");
      await expect(page.getByText("This page couldn't load")).not.toBeVisible();
      await expect(page.locator("table tbody tr").first()).toBeVisible();
    });
  }
});
