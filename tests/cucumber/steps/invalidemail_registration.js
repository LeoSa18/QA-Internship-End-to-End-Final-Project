const { Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Then('an error message for invalid email should be displayed', async function () {
  const errorAlerts = this.page.locator('.alert.alert-danger');
  await expect(errorAlerts.first()).toBeVisible();
});
