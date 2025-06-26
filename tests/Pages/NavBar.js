class NavBar {
    constructor(page) {
        this.page = page;
        this.signinbutton = page.locator('#navbarSupportedContent > ul > li:nth-child(4) > a');
        this.cartButton = page.locator('#navbarSupportedContent > ul > li:nth-child(5) > a > fa-icon > svg');
    }

    async clickSigninButton() {
        await this.signinbutton.click();
    }

    async isCartButtonVisible() {
        return await this.cartButton.isVisible();
    }
    async clickCartButton() {
        await this.cartButton.click();
    }
}

module.exports = {NavBar};