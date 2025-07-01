class ProductPage {
    constructor(page) {
        this.page = page;
        this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
        this.quantityInput = page.locator('#quantity-input');
        this.stockAlert = page.locator('.text-danger.mt-3');
    }

    async clickOnAddToCart() {
    await this.addToCartButton.click();
     }

    async fillQuantity(quantity) {
        await this.quantityInput.fill(quantity.toString());
    }

    async isAddToCartVisible() {
    return await this.addToCartButton.isVisible();
     }

    async stockAlertIsVisible() {
        return await this.stockAlert.isVisible();
    }
}

module.exports = { ProductPage };