const { When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { RegistrationPage } = require('../../Pages/RegistrationPage');



Then('the user should remain on the registration page', async function () {
  await expect(this.page).toHaveURL(/.*register/);
});

Then('an error message should be displayed for required fields', async function () {
  const errorAlerts = this.page.locator('.alert.alert-danger');
  await expect(errorAlerts.first()).toBeVisible();

  // Verifica que al menos una alerta coincida con errores esperados
  await expect(errorAlerts).toContainText([
    /First name is required/i,
    /Last name is required/i,
    /Date of Birth is required/i,
    /Street is required/i,
    /Postcode is required/i,
    /City is required/i,
    /State is required/i,
    /Country is required/i,
    /Phone is required/i,
    /Email is required/i,
    /Password is required.*Password must be minimal 6 characters long.*Password can not include invalid characters./is
  ]);
});
