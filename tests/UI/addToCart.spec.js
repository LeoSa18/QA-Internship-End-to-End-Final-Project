import { test, expect } from '@playwright/test';
import { ProductPage } from '../Pages/ProductPage';
import { NavBar } from '../Pages/NavBar';


const baseUrl = 'https://api.practicesoftwaretesting.com';


async function getProductIdByTerm(term, request, baseUrl) {
    const encodedTerm = encodeURIComponent(term);
    const response = await request.get(`${baseUrl}/products/search?q=${encodedTerm}`);
    const product = await response.json();
    return product.data[0]?.id;
}


test.describe('Add to Cart Tests', () => {

    const validScenarios = [
        { term: 'Claw Hammer with Shock Reduction Grip', quantity: 1 },
        { term: 'Bolt Cutters', quantity: 2 },
        { term: 'Claw Hammer', quantity: 12 },
        { term: 'Protective Gloves', quantity: 3 },
    ]

    const invalidScenarios = [
        { term: 'Claw Hammer with Shock Reduction Grip', quantity: 0 },
        { term: 'Bolt Cutters', quantity: -1 },
        { term: 'Claw Hammer', quantity: 1.5 },
    ]

    validScenarios.forEach(({ term }) => {
        test(`User can add available product ${term} to the cart`, async ({ page, request }) => {
            const productId = await getProductIdByTerm(term, request, baseUrl);
            await page.goto(`https://practicesoftwaretesting.com/product/${productId}`, { waitUntil: 'networkidle' });

            const productDetails = new ProductPage(page);

            await expect(productDetails.addToCartButton).toBeVisible();
        });
    });

    validScenarios.forEach(({ term, quantity }) => {
        test(`User adds a valid quantity of product ${term} to the cart`, async ({ page, request }) => {
            const productId = await getProductIdByTerm(term, request, baseUrl);
            await page.goto(`https://practicesoftwaretesting.com/product/${productId}`, { timeout: 60000 });

            const productDetails = new ProductPage(page);
            const navBar = new NavBar(page);

            await productDetails.fillQuantity(quantity);
            await productDetails.clickOnAddToCart();
            await page.waitForTimeout(2000);

            const toast = page.getByRole('alert');

            await expect(navBar.cartButton).toBeVisible();
            await expect(toast).toHaveText('Product added to shopping cart.');
        });
    });

    invalidScenarios.forEach(({ term, quantity }) => {
        test(`User adds an invalid quantity of product ${term} to the cart`, async ({ page, request }) => {
            const productId = await getProductIdByTerm(term, request, baseUrl);
            await page.goto(`https://practicesoftwaretesting.com/product/${productId}`, { timeout: 60000 });

            const productDetails = new ProductPage(page);
            await productDetails.fillQuantity(quantity);
            await productDetails.clickOnAddToCart();
            await page.waitForTimeout(2000);

            const toast = page.getByRole('alert', { name: 'Product added to shopping cart.' });

            await expect(toast).not.toBeVisible();
        });
    });

});