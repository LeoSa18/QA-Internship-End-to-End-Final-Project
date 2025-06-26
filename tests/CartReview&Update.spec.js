import { test, expect } from '@playwright/test';
import { HomePage } from './Pages/HomePage';
import { ProductPage } from './Pages/ProductPage';
import { CartPage } from './Pages/CartPage';
import { NavBar } from './Pages/NavBar';

test('Cart not visible before adding items', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    
    const navbar = new NavBar(page);
    // Verifica que el botón del carrito no sea visible antes de agregar productos
    expect(await navbar.isCartButtonVisible()).toBe(false);
});

test('Add item to cart and verify cart visibility', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const homePage = new HomePage(page);
    await homePage.openFirstProduct(); 
    const productPage = new ProductPage(page);
    await productPage.clickOnAddToCart() ;
    await page.waitForTimeout(10000); 
    const navbar = new NavBar(page);

    expect(await navbar.isCartButtonVisible()).toBe(true);
});

test('Display cart items and verify details', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const homePage = new HomePage(page);
    await homePage.openFirstProduct(); 
    const productPage = new ProductPage(page);
    await productPage.clickOnAddToCart() ;
    await page.waitForTimeout(10000); 
    const navbar = new NavBar(page);
    await navbar.clickCartButton();
    await page.waitForTimeout(5000); 
    
    const cartPage = new CartPage(page);
    
    expect(await cartPage.isProgressBarVisible()).toBe(true);
    expect(await cartPage.isProductNameVisible()).toBe(true);
    expect(await cartPage.isProductQuantityVisible()).toBe(true);
    expect(await cartPage.isProductPriceVisible()).toBe(true);
    expect(await cartPage.isProductTotalVisible()).toBe(true);
    expect(await cartPage.isCheckoutButtonVisible()).toBe(true);
});

test('Verify cart item details are editable', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const homePage = new HomePage(page);
    await homePage.openFirstProduct(); 
    const productPage = new ProductPage(page);
    await productPage.clickOnAddToCart() ;
    await page.waitForTimeout(10000); 
    const navbar = new NavBar(page);
    await navbar.clickCartButton();
    await page.waitForTimeout(5000); 
    
    const cartPage = new CartPage(page);
    
    expect(await cartPage.nameEditable()).toBe(false);
    expect(await cartPage.quantityEditable()).toBe(true);
    expect(await cartPage.priceEditable()).toBe(false); 
    expect(await cartPage.totalEditable()).toBe(false); 
});

test('Total price updates after changing quantity', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const homePage = new HomePage(page);
    await homePage.openFirstProduct(); 
    const productPage = new ProductPage(page);
    await productPage.clickOnAddToCart() ;
    await page.waitForTimeout(10000); 
    const navbar = new NavBar(page);
    await navbar.clickCartButton();
    await page.waitForTimeout(5000); 
    
    const cartPage = new CartPage(page);

    const totalLocator = cartPage.ProductTotal;
    const initialTotal = await totalLocator.textContent();

    await cartPage.updateQuantity(2);

    // Esperar a que el total cambie realmente
    await expect(totalLocator).not.toHaveText(initialTotal);
});

test('Remove item from cart', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const homePage = new HomePage(page);
    await homePage.openFirstProduct(); 
    const productPage = new ProductPage(page);
    await productPage.clickOnAddToCart() ;
    await page.waitForTimeout(10000); 
    const navbar = new NavBar(page);
    await navbar.clickCartButton();
    await page.waitForTimeout(5000); 
    
    const cartPage = new CartPage(page);

    // Espera a que el producto esté visible
    await expect(cartPage.ProductName).toBeVisible();

    // Elimina el producto
    await cartPage.removeProduct();

    // Espera que ya no esté visible
    await expect(cartPage.ProductName).not.toBeVisible();
});

test('Total price is correct after update', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const homePage = new HomePage(page);
    await homePage.openFirstProduct(); 
    const productPage = new ProductPage(page);
    await productPage.clickOnAddToCart() ;
    await page.waitForTimeout(10000); 
    const navbar = new NavBar(page);
    await navbar.clickCartButton();
    await page.waitForTimeout(5000); 
    
    const cartPage = new CartPage(page);

    const unitPrice = await cartPage.getProductPrice();
    await cartPage.updateQuantity(3);

    const expectedTotal = (unitPrice * 3).toFixed(2);
    // Esperar a que el total se actualice correctamente
    await expect(cartPage.ProductTotal).toHaveText(`$${expectedTotal}`);
});

test('Cart persists after page refresh', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const homePage = new HomePage(page);
    await homePage.openFirstProduct(); 
    const productPage = new ProductPage(page);
    await productPage.clickOnAddToCart() ;
    await page.waitForTimeout(10000); 
    const navbar = new NavBar(page);
    await navbar.clickCartButton();
    await page.waitForTimeout(5000); 
    
    const cartPage = new CartPage(page);

  // Refrescar la página
     await page.reload();
     await page.waitForTimeout(5000); // Esperar a que la página se recargue

    expect(await cartPage.isProgressBarVisible()).toBe(true);
    expect(await cartPage.isProductNameVisible()).toBe(true);
    expect(await cartPage.isProductQuantityVisible()).toBe(true);
    expect(await cartPage.isProductPriceVisible()).toBe(true);
    expect(await cartPage.isProductTotalVisible()).toBe(true);
    expect(await cartPage.isCheckoutButtonVisible()).toBe(true);


});

