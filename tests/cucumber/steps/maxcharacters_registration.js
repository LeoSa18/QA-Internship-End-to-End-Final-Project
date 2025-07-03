const { Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');

Then('an error message for maximum characters should be displayed', async function () {
  const errorAlerts = this.page.locator('.alert.alert-danger');
  await expect(errorAlerts.first()).toBeVisible();
  await expect(errorAlerts.first()).toContainText(
    /The first name field must not be greater than 40 characters.*The last name field must not be greater than 20 characters.*The address\.street field must not be greater than 70 characters.*The address\.city field must not be greater than 40 characters.*The address\.state field must not be greater than 40 characters.*The address\.postal code field must not be greater than 10 characters.*The phone field must not be greater than 24 characters./is
  );
});
