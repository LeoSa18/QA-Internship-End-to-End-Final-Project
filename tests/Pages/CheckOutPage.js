class CheckoutPage {
  constructor(page) {
    this.page = page;

    // Cart step
    this.cartItems = page.locator('.ng-star-inserted');
    this.cartProceedButton = page.getByRole('button', { name: 'Proceed to checkout' });

    // Sign In step
    this.signInMessage = page.locator('body > app-root > div > app-checkout > aw-wizard > div > aw-wizard-step:nth-child(2) > app-login > div > div > div > p');
    this.signInProceedButton = page.getByRole('button', { name: 'Proceed to checkout' });

    // Billing Address step
    this.addressFields = page.locator('input.form-control');
    this.addressProceedButton = page.getByRole('button', { name: 'Proceed to checkout' });

    // Payment step
    this.paymentDropdown = page.locator('#payment-method');
    this.paymentConfirmButton = page.getByRole('button', { name: 'Confirm' });
    this.paymentErrorMessage = page.locator('.validation-error');
    this.paymentSuccessMessage = page.locator('.help-block');

    // Order confirmation
    this.successMessage = page.locator('text=Thanks for your order! Your invoice number is INV-20250000');
    this.cartIcon = page.locator('.svg-inline--fa fa-cart-shopping');
  }

  // ----- CART STEP -----
  async isCartProceedVisible() {
    return this.cartProceedButton.isVisible();
  }

  async proceedFromCart() {
    await this.cartProceedButton.click();
  }

  // ----- SIGN IN STEP -----
  async getSignInMessage() {
    return await this.signInMessage.textContent();
  }

  async proceedFromSignIn() {
    await this.signInProceedButton.click();
  }

  // ----- BILLING ADDRESS STEP -----
  async fillAllAddressFields(addressData) {
    const fieldsCount = await this.addressFields.count();
    for (let i = 0; i < fieldsCount; i++) {
      const input = this.addressFields.nth(i);
      if (!(await input.inputValue())) {
        await input.fill(addressData || "Test" + (i + 1));
      }
    }
  }

  async isAddressProceedEnabled() {
    return this.addressProceedButton.isEnabled();
  }

  async proceedFromAddress() {
    await this.addressProceedButton.click();
  }

  // ----- PAYMENT STEP -----
  async selectPaymentMethod(method) {
    await this.paymentDropdown.selectOption({ label: method });
  }

  async confirmPayment() {
    await this.paymentConfirmButton.click();
  }

  async getPaymentErrorMessage() {
    return await this.paymentErrorMessage.textContent();
  }

  // ----- CONFIRMATION STEP -----
  async isOrderSuccessVisible() {
    return this.successMessage.isVisible();
  }

  async isCartIconVisible() {
    return this.cartIcon.isVisible();
  }

}

module.exports = { CheckoutPage };