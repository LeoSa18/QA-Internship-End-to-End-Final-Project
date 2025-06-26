class LogInPage {
    constructor (page){
        this.page = page; 
        this.loginForm = page.locator('app-root > div > app-login > div > div > div');
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.getByRole('button', { name: 'Login' });
        this.alert = page.locator('div.alert.alert-danger');
        this.RegisterButton = page.locator ('body > app-root > div > app-login > div > div > div > div.input-group.mb-3 > p > a:nth-child(1)');
    }

     async clickRegisterButton() {
    await this.RegisterButton.click();
  }

     async fillEmail(email) {
        await this.emailInput.fill(email);
    }

     async fillPassword(password) {
        await this.passwordInput.fill(password);
    }

     async clickLoginButton() {
        await this.loginButton.click();
    }
}

module.exports = {LogInPage};
