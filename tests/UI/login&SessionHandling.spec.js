// @ts-check
import { test, expect } from '@playwright/test';
import { HomePage } from '../Pages/HomePage';
import { LogInPage } from '../Pages/LogInPage';
import { NavBar } from '../Pages/NavBar';

test.describe('Login and Session Handling Tests', () => {

  const validCredentials = [
    { email: 'customer@practicesoftwaretesting.com', password: 'welcome01' },
    { email: 'customer2@practicesoftwaretesting.com', password: 'welcome01' },
    { email: 'admin@practicesoftwaretesting.com', password: 'welcome01' },
  ]
  const invalidCredentials = [
    { email: 'hola@practicesoftwaretesting.com', password: 'welcome01' },
    { email: 'unregistered@practicesoftwaretesting.com', password: 'welcome01' },
    { email: 'customer@practicesoftwaretesting.com', password: '1234567' },
  ]

  test('Sign in button is displayed correctly in the navigation bar', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navBar = new NavBar(page);

    // Expect a title "to contain" a substring.
    await expect(navBar.signinbutton).toBeVisible();
  });

  test('Login form is displayed correctly ', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navBar = new NavBar(page);
    const loginPage = new LogInPage(page);

    await navBar.clickSigninButton();
    await expect(loginPage.loginForm).toBeVisible();

  });

  validCredentials.forEach(({ email, password }) => {
    test(`User logins with valid credentials:${email}`, async ({ page }) => {
      await page.goto('https://practicesoftwaretesting.com/auth/login', {
        timeout: 60000,
        waitUntil: 'domcontentloaded'
      });
      const homePage = new HomePage(page);
      const loginPage = new LogInPage(page);

      await loginPage.fillEmail(email);
      await loginPage.fillPassword(password);
      await loginPage.clickLoginButton();

      await expect(homePage.filters).toBeVisible();
    });
  });


  invalidCredentials.forEach(({ email, password }) => {
    test(`User logins with invalid credentials:${email}`, async ({ page }) => {
      await page.goto('https://practicesoftwaretesting.com/auth/login', {
        timeout: 60000,
        waitUntil: 'domcontentloaded'
      });
      const loginPage = new LogInPage(page);

      await loginPage.fillEmail(email);
      await loginPage.fillPassword(password);
      await loginPage.clickLoginButton();

      await expect(loginPage.alert).toHaveText('Invalid email or password')});
  });

  test('User is logged out when no credentials are provided', async ({ context, page }) => {
    // 1. Log in
    await page.goto('https://practicesoftwaretesting.com/auth/login');

    const loginPage = new LogInPage(page);
    await loginPage.fillEmail('customer@practicesoftwaretesting.com');
    await loginPage.fillPassword('welcome01');
    await loginPage.clickLoginButton();

    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForTimeout(2000);
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
  });
});
