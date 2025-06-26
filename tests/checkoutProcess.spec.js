import { test, expect } from '@playwright/test';
const { HomePage } = require('./Pages/HomePage');
const { CheckoutPage } = require('./Pages/CheckoutPage');
const { ProductPage } = require('./Pages/ProductPage');
const { LogInPage } = require('./Pages/LoginPage');

test('Display "Proceed to checkout" button', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Paso 1: Agregar producto desde Home → Product
  await page.waitForTimeout(2000);
  await homePage.openProduct();
  await productPage.clickOnAddToCart();
  await page.waitForTimeout(7000);
  // Paso 2: Ir al checkout
  await page.goto('https://practicesoftwaretesting.com/checkout');
  await page.waitForTimeout(5000);

  // Paso 3: Validaciones
  await expect(checkoutPage.cartProceedButton).toBeVisible();
});

// Datos de usuario (nombre visible + email + password)
const users = [
  { username: 'Jane Doe', email: 'customer@practicesoftwaretesting.com', password: 'welcome01' },
  //{ username: 'Jack Howe', email: 'customer2@practicesoftwaretesting.com', password: 'welcome01' },
  //{ username: 'Bob Smith', email: 'customer3@practicesoftwaretesting.com', password: 'pass123' },
];

users.forEach(({ username, email, password }) => {
  test(`Access checkout as logged-in user: ${username}`, async ({ page }) => {
    const loginPage = new LogInPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Paso 1: Login
    await page.goto('https://practicesoftwaretesting.com/auth/login');
    await loginPage.fillEmail(email);
    await loginPage.fillPassword(password);
    await loginPage.clickLoginButton();
    await page.waitForTimeout(2000);

    // Paso 2: Agregar un producto al carrito
    await page.goto('https://practicesoftwaretesting.com/');
    await page.waitForTimeout(2000);
    await homePage.openProduct();
    await page.waitForTimeout(1000);
    await productPage.clickOnAddToCart();
    await page.waitForTimeout(4000);

    // Paso 3: Ir al Checkout
    await page.goto('https://practicesoftwaretesting.com/checkout');  
    await page.waitForTimeout(4000);

    // Paso 4: Click en "Proceed to checkout" (Cart step)
    await checkoutPage.proceedFromCart();

    // Paso 5: Validaciones
    const message = await checkoutPage.getSignInMessage();
    expect(message).toContain(`Hello ${username}, you are already logged in`);
    await expect(checkoutPage.signInProceedButton).toBeVisible();
    await expect(checkoutPage.signInProceedButton).toBeEnabled();
  });
});

test('Enable "Proceed to checkout" button when all address fields are completed', async ({ page }) => {
  const loginPage = new LogInPage(page);
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Paso 1: Login
  await page.goto('https://practicesoftwaretesting.com/auth/login');  
  await loginPage.fillEmail('customer@practicesoftwaretesting.com'); 
  await loginPage.fillPassword('welcome01');
  await loginPage.clickLoginButton();
  await page.waitForTimeout(2000);

  // Paso 2: Agregar producto al carrito
  await page.goto('https://practicesoftwaretesting.com/');
  await page.waitForTimeout(2000);
  await homePage.openProduct();
  await productPage.clickOnAddToCart();
  await page.waitForTimeout(5000);

  // Paso 3: Ir al checkout y avanzar hasta Billing Address
  await page.goto('https://practicesoftwaretesting.com/checkout');  
  await checkoutPage.proceedFromCart();
  await checkoutPage.proceedFromSignIn();
  await page.waitForTimeout(2000);

  // Paso 4: Completar todos los campos obligatorios
  await checkoutPage.fillAllAddressFields();
  await page.waitForTimeout(3000);

  // Paso 5: Verificar que el botón esté habilitado
  const isEnabled = await checkoutPage.isAddressProceedEnabled();
  expect(isEnabled).toBe(true);
});


test('Display payment dropdown with 5 options', async ({ page }) => {
  const loginPage = new LogInPage(page);
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Paso 1: Login
  await page.goto('https://practicesoftwaretesting.com/auth/login'); 
  await loginPage.fillEmail('customer@practicesoftwaretesting.com'); 
  await loginPage.fillPassword('welcome01');
  await loginPage.clickLoginButton();
  await page.waitForTimeout(2000);

  // Paso 2: Agregar producto al carrito
  await page.goto('https://practicesoftwaretesting.com/');
  await page.waitForTimeout(2000);
  await homePage.openProduct();
  await productPage.clickOnAddToCart();
  await page.waitForTimeout(5000);

  // Paso 3: Ir al checkout y avanzar hasta Billing Address
  await page.goto('https://practicesoftwaretesting.com/checkout');  
  await checkoutPage.proceedFromCart();
  await checkoutPage.proceedFromSignIn();
  await page.waitForTimeout(2000);

  // Paso 4: Completar todos los campos obligatorios
  await checkoutPage.fillAllAddressFields();
  await page.waitForTimeout(3000);
  await checkoutPage.proceedFromAddress();
  
  // Paso 5: Verificar que el dropdown de payment tenga 5 opciones
  const paymentOptions = await checkoutPage.paymentDropdown.locator('option').count();
  await page.waitForTimeout(3000);
  expect(paymentOptions).toBe(6); // Incluye la opción "Select a payment method"
});

test('Successful payment with selected method', async ({ page }) => {
  const loginPage = new LogInPage(page);
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Paso 1: Login
  await page.goto('https://practicesoftwaretesting.com/auth/login'); 
  await loginPage.fillEmail('customer@practicesoftwaretesting.com'); 
  await loginPage.fillPassword('welcome01');
  await loginPage.clickLoginButton();
  await page.waitForTimeout(2000);

  // Paso 2: Agregar producto al carrito
  await page.goto('https://practicesoftwaretesting.com/');
  await page.waitForTimeout(2000);
  await homePage.openProduct();
  await productPage.clickOnAddToCart();
  await page.waitForTimeout(5000);

  // Paso 3: Ir al checkout y avanzar hasta Billing Address
  await page.goto('https://practicesoftwaretesting.com/checkout');  
  await checkoutPage.proceedFromCart();
  await checkoutPage.proceedFromSignIn();
  await page.waitForTimeout(2000);

  // Paso 4: Completar todos los campos obligatorios
  await checkoutPage.fillAllAddressFields();
  await page.waitForTimeout(2000);
  await checkoutPage.proceedFromAddress();
  
  // Paso 5: Seleccionar una opción de pago
  await checkoutPage.selectPaymentMethod('Cash on Delivery');
  await page.waitForTimeout(1000);
  await checkoutPage.confirmPayment();
  await page.waitForTimeout(2000);
  await expect(checkoutPage.paymentSuccessMessage).toContainText('Payment was successful');
});

test('Display order confirmation after successful payment', async ({ page }) => {
  const loginPage = new LogInPage(page);
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Paso 1: Login
  await page.goto('https://practicesoftwaretesting.com/auth/login'); 
  await loginPage.fillEmail('customer@practicesoftwaretesting.com'); 
  await loginPage.fillPassword('welcome01');
  await loginPage.clickLoginButton();
  await page.waitForTimeout(2000);
  // Paso 2: Agregar producto al carrito
  await page.goto('https://practicesoftwaretesting.com/');
  await page.waitForTimeout(2000);
  await homePage.openProduct();
  await productPage.clickOnAddToCart();
  await page.waitForTimeout(4000);

  // Paso 3: Ir al checkout y avanzar hasta Billing Address
  await page.goto('https://practicesoftwaretesting.com/checkout');  
  await checkoutPage.proceedFromCart();
  await checkoutPage.proceedFromSignIn();
  await page.waitForTimeout(2000);

  // Paso 4: Completar todos los campos obligatorios
  await checkoutPage.fillAllAddressFields();
  await page.waitForTimeout(2000);
  await checkoutPage.proceedFromAddress();
  
  // Paso 5: Seleccionar una opción de pago
  await checkoutPage.selectPaymentMethod('Cash on Delivery');
  await page.waitForTimeout(1000);
  await checkoutPage.confirmPayment();
  await page.waitForTimeout(2000);
  await checkoutPage.confirmPayment();
  await page.waitForTimeout(1000);

  // Paso 6: Verificar mensaje de éxito 
  await expect(checkoutPage.isOrderSuccessVisible()).toBeTruthy();

});

test('Complete order and reset cart', async ({ page }) => {
  const loginPage = new LogInPage(page);
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Paso 1: Login
  await page.goto('https://practicesoftwaretesting.com/auth/login'); 
  await loginPage.fillEmail('customer@practicesoftwaretesting.com'); 
  await loginPage.fillPassword('welcome01');
  await loginPage.clickLoginButton();
  await page.waitForTimeout(2000);

  // Paso 2: Agregar producto al carrito
  await page.goto('https://practicesoftwaretesting.com/');
  await page.waitForTimeout(2000);
  await homePage.openProduct();
  await productPage.clickOnAddToCart();
  await page.waitForTimeout(5000);

  // Paso 3: Ir al checkout y avanzar hasta Billing Address
  await page.goto('https://practicesoftwaretesting.com/checkout');  
  await checkoutPage.proceedFromCart();
  await checkoutPage.proceedFromSignIn();
  await page.waitForTimeout(2000);

  // Paso 4: Completar todos los campos obligatorios
  await checkoutPage.fillAllAddressFields();
  await page.waitForTimeout(1000);
  await checkoutPage.proceedFromAddress();
  
  // Paso 5: Seleccionar una opción de pago
  await checkoutPage.selectPaymentMethod('Cash on Delivery');
  await page.waitForTimeout(1000);
  await checkoutPage.confirmPayment();
  await page.waitForTimeout(1000);
  await checkoutPage.confirmPayment();
  await page.waitForTimeout(5000);

  // Paso 6: Verificar mensaje de éxito 
  await expect(checkoutPage.isOrderSuccessVisible()).toBeTruthy();

  // Paso 7: Verificar que el carrito esté vacío
  const cartVisible = await checkoutPage.isCartIconVisible();
  await expect(cartVisible).toBe(false); 
});

/*
test('Validation message if no payment method is selected', async ({ page }) => {
  const loginPage = new LogInPage(page);
  const homePage = new HomePage(page);
  const productPage = new ProductPage(page);
  const checkoutPage = new CheckoutPage(page);

  // Paso 1: Login
  await page.goto('https://practicesoftwaretesting.com/auth/login'); 
  await loginPage.fillEmail('customer@practicesoftwaretesting.com'); 
  await loginPage.fillPassword('welcome01');
  await loginPage.clickLoginButton();
  await page.waitForTimeout(2000);

  // Paso 2: Agregar producto al carrito
  await page.goto('https://practicesoftwaretesting.com/');
  await page.waitForTimeout(2000);
  await homePage.openProduct();
  await productPage.clickOnAddToCart();
  await page.waitForTimeout(5000);

  // Paso 3: Ir al checkout y avanzar hasta Billing Address
  await page.goto('https://practicesoftwaretesting.com/checkout');  
  await checkoutPage.proceedFromCart();
  await checkoutPage.proceedFromSignIn();
  await page.waitForTimeout(2000);

  // Paso 4: Completar todos los campos obligatorios
  await checkoutPage.fillAllAddressFields();
  await page.waitForTimeout(2000);
  await checkoutPage.proceedFromAddress();
  
  // Paso 5: Seleccionar una opción de pago
  await checkoutPage.selectPaymentMethod('Cash on Delivery');
  await page.waitForTimeout(1000);
  await checkoutPage.confirmPayment();
  await page.waitForTimeout(2000);
  await expect(checkoutPage.paymentSuccessMessage).toContainText('Payment was successful');
});
*/
