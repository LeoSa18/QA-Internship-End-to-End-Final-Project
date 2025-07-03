const { Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Then('an error message for non-numeric phone should be displayed', async function () {
  const errorAlerts = this.page.locator('.alert.alert-danger');
  await expect(errorAlerts.first()).toBeVisible();
  await expect(errorAlerts).toContainText(/Only numbers are allowed./i);
});
