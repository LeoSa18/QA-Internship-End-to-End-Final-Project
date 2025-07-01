const { Given, Then, And } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const ProductPage = require('../../Pages/ProductPage');

async function getProductIdByTerm(term, request, baseUrl) {
    const encodedTerm = encodeURIComponent(term);
    const response = await request.get(`${baseUrl}/products/search?q=${encodedTerm}`);
    const product = await response.json();
    return product.data[0]?.id;
}

Given('the user is on the {string} details page', async function (product) {
  const productId = await getProductIdByTerm(product, this.request, this.baseURL);
  await this.page.goto(`${this.baseURL}/product/${productId}`, { waitUntil: 'networkidle' });
  this.productPage = new ProductPage(this.page);
});

/* And('the {string} has stock available', async function () {
  const isAvailable = await this.productPage.stockAlertIsVisible(); // o verificar stock vía API
  expect(isAvailable).toBeTruthy();
}); */

Then('the user should see the "Add to Cart" button enabled under the details and quantity input', async function () {
  await expect(this.productPage.addToCartButton).toBeVisible();
  await expect(this.productPage.addToCartButton).toBeEnabled();
});
