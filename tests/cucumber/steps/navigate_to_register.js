
const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { NavBar } = require('../../Pages/NavBar');
const { LogInPage } = require('../../Pages/LogInPage');

When('the user clicks on the "Register" link in the navigation bar', async function () {
    const navBar = new NavBar(this.page);
    await navBar.clickSigninButton();
});

When ('the user clicks on the "Register" button', async function () {
    const logInPage = new LogInPage(this.page);
    await logInPage.clickRegisterButton();
});

Then('the user should be redirected to the registration page', async function () {
    await expect(this.page).toHaveURL(/.*register/);
});