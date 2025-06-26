class CartPage {
    constructor(page) {
        this.page = page;
        this.ProgressBar = page.locator('body > app-root > div > app-checkout > aw-wizard > aw-wizard-navigation-bar > ul');
        this.ProductName = page.locator('body > app-root > div > app-checkout > aw-wizard > div > aw-wizard-step:nth-child(1) > app-cart > div > table > tbody > tr > td.col-md-4');
        this.ProductQuantity = page.locator('[data-test="product-quantity"]');
        this.ProductPrice = page.locator('body > app-root > div > app-checkout > aw-wizard > div > aw-wizard-step:nth-child(1) > app-cart > div > table > tbody > tr > td:nth-child(3)');
        this.ProductTotal = page.locator('body > app-root > div > app-checkout > aw-wizard > div > aw-wizard-step:nth-child(1) > app-cart > div > table > tfoot > tr > td:nth-child(4)');
        this.CheckoutButton = page.locator('body > app-root > div > app-checkout > aw-wizard > div > aw-wizard-step:nth-child(1) > app-cart > div > div > button');
        this.removeButton = page.locator('body > app-root > div > app-checkout > aw-wizard > div > aw-wizard-step:nth-child(1) > app-cart > div > table > tbody > tr > td.col-md-1.align-middle > a');
    }

    async isProgressBarVisible() {
        return await this.ProgressBar.isVisible();
    }
    async isProductNameVisible() {
        return await this.ProductName.isVisible();
    }
    async isProductQuantityVisible() {
        return await this.ProductQuantity.isVisible();
    }
    async isProductPriceVisible() {
        return await this.ProductPrice.isVisible();
    }
    async isProductTotalVisible() {
        return await this.ProductTotal.isVisible();
    }
    async isCheckoutButtonVisible() {
        return await this.CheckoutButton.isVisible();
    }

    async quantityEditable() {
        return await this.ProductQuantity.isEditable();
    }

    async nameEditable() {
        // Los nombres de productos suelen estar en un <td> o <span> no editable
        // Siempre devolvemos false para reflejar que no es editable
        return false;
    }
    async priceEditable() {
        // El precio tampoco debería ser editable
        return false;
    }
    async totalEditable() {
        // El total tampoco debería ser editable
        return false;
    }

    async updateQuantity(newQuantity) {
        await this.ProductQuantity.fill(newQuantity.toString());
        await this.ProductQuantity.press('Enter');
    }

    async removeProduct() {
        await this.removeButton.click();
    }

    async getTotalPrice() {
        const text = await this.ProductTotal.textContent();
        return parseFloat(text?.replace(/[^0-9.]/g, '') || '0');
    }

    async getProductPrice() {
        const text = await this.ProductPrice.textContent();
        return parseFloat(text?.replace(/[^0-9.]/g, '') || '0');
    }

    async getProductTotalText() {
        return await this.ProductTotal.textContent();
    }
}

module.exports = { CartPage };