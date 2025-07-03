const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { NavBar } = require('../../Pages/NavBar');
const { LogInPage } = require('../../Pages/LogInPage');
const { RegistrationPage } = require('../../Pages/RegistrationPage');

Given('the user is on the home page', async function () {
  await this.page.goto(this.baseURL);
});

When('the user navigates to the registration page', async function () {
  const navbar = new NavBar(this.page);
  await navbar.clickSigninButton();
  const loginPage = new LogInPage(this.page);
  await loginPage.clickRegisterButton();
});

When('the user submits the registration form with the following data:', { timeout: 30000 }, async function (dataTable) {
  const registrationPage = new RegistrationPage(this.page);
  const data = dataTable.rowsHash();

  await registrationPage.fillRegistrationForm(
    data.firstName,
    data.lastName,
    data.dateOfBirth,
    data.street,
    data.postalCode,
    data.city,
    data.state,
    data.country,
    data.phone,
    data.email,
    data.password
  );

  await this.page.waitForTimeout(3000); // Espera un segundo para que los campos se llenen correctamente
  await registrationPage.submitRegistrationForm();

  // la pagina es re lenta
  await this.page.waitForTimeout(13000);
});

Then('the user should be redirected to the login page', async function () {
  await expect(this.page).toHaveURL(/.*login/);
});
