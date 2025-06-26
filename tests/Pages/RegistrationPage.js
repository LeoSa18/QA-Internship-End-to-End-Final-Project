function toDateInputFormat(dateString) {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    if (!day || !month || !year) return '';
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

class RegistrationPage {
    constructor (page) {
        this.page = page; 
        this.firstNameInput = page.locator('#first_name');
        this.lastNameInput = page.locator('#last_name');
        this.dateOfBirthInput = page.locator('#dob');
        this.streetAddressInput = page.locator('#street');
        this.postalCodeInput = page.locator('#postal_code');
        this.cityInput = page.locator('#city');
        this.stateInput = page.locator('#state');
        this.countryInput = page.locator('#country');
        this.phoneInput = page.locator('#phone');
        this.emailInput = page.locator('#email');
        this.passwordInput = page.locator('#password');
        this.registerButton = page.locator('body > app-root > div > app-register > div > div > div > form > div > button');
    }


    async fillRegistrationForm(firstName, lastName, dateOfBirth, streetAddress, postalCode, city, state, country, phone, email, password) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        // Convierte la fecha al formato yyyy-mm-dd
        await this.dateOfBirthInput.fill(toDateInputFormat(dateOfBirth));
        await this.streetAddressInput.fill(streetAddress);
        await this.postalCodeInput.fill(postalCode);
        await this.cityInput.fill(city);
        await this.stateInput.fill(state);
        await this.countryInput.selectOption(country);
        await this.phoneInput.fill(phone);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
    }

    async submitRegistrationForm() {
        await this.registerButton.click();
    }
}

module.exports = { RegistrationPage };