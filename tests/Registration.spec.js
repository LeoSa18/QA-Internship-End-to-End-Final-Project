import { test, expect } from '@playwright/test';
import { allure } from 'allure-playwright';
import { HomePage } from './Pages/HomePage';
import { LogInPage } from './Pages/LogInPage';
import { RegistrationPage } from './Pages/RegistrationPage';
import {NavBar} from './Pages/NavBar';


test ('Navigate to Registration Page', async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navbar = new NavBar(page);
    await navbar.clickSigninButton();
    await expect(page).toHaveURL(/.*login/);
    const loginPage = new LogInPage(page);
    await loginPage.clickRegisterButton();
    await expect(page).toHaveURL(/.*register/);
});

const validRegistrationData = [
    { firstName: 'John', lastName: 'Doe', dateOfBirth: '10/11/2003', streetAddress: '123 Main St', postalCode: '12345', city: 'Anytown', state: 'CA', country: 'United States of America (the)', phone: '1234567890', email: 'john10.doe@example.com', password: 'Passwo4rd123!' },
    { firstName: 'Alice', lastName: 'Smith', dateOfBirth: '21/05/1978', streetAddress: '456 Oak Ave', postalCode: '54321', city: 'Metropolis', state: 'NY', country: 'United States of America (the)', phone: '9876543210', email: 'alice7.s@example.com', password: 'MyPa8ssw0rd!  ' },
    { firstName: 'Carlos', lastName: 'Rivera', dateOfBirth: '24/06/2003', streetAddress: '789 Pine Rd', postalCode: '67890', city: 'Miami', state: 'FL', country: 'United States of America (the)', phone: '1122334455', email: 'carlos59.r@example.com', password: 'Sec!ure123*' }        
]

validRegistrationData.forEach((data, idx) => {
    test(`Registration with valid information set #${idx + 1}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navbar = new NavBar(page);
    await navbar.clickSigninButton();
    await expect(page).toHaveURL(/.*login/);
    const loginPage = new LogInPage(page);
    await loginPage.clickRegisterButton();
    await expect(page).toHaveURL(/.*register/);
    const registrationPage = new RegistrationPage(page);

        // La conversión de fecha dd/mm/yyyy a yyyy-mm-dd se realiza automáticamente en RegistrationPage
        await registrationPage.fillRegistrationForm(
            data.firstName,
            data.lastName,
            data.dateOfBirth, // formato dd/mm/yyyy, se convierte internamente
            data.streetAddress,
            data.postalCode,
            data.city,
            data.state,
            data.country,
            data.phone,
            data.email,
            data.password
        );
        await registrationPage.submitRegistrationForm();
        await page.waitForTimeout(11000); // Para ver el llenado en pantalla (debug, 11 segundos)
        await expect(page).toHaveURL(/.*login/);
    });
});

const emptyFieldsData = [
    { firstName: '', lastName: '', dateOfBirth: '', streetAddress: '', postalCode: '', city: '', state: '', country: '', phone: '', email: '', password: '' }]

emptyFieldsData.forEach((data, idx) => {
test(`Registration attempt with all empty fields #${idx + 1}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navbar = new NavBar(page);
    await navbar.clickSigninButton();
    await expect(page).toHaveURL(/.*login/);
    const loginPage = new LogInPage(page);
    await loginPage.clickRegisterButton();
    await expect(page).toHaveURL(/.*register/);
    const registrationPage = new RegistrationPage(page);


    // Intentar llenar el formulario con campos vacíos
    await registrationPage.fillRegistrationForm(
        data.firstName,
        data.lastName,
        data.dateOfBirth,
        data.streetAddress,
        data.postalCode,
        data.city,
        data.state,
        data.country,
        data.phone,
        data.email,
        data.password
    );
    await registrationPage.submitRegistrationForm();
    await page.waitForTimeout(1000); // Para ver el llenado en pantalla (debug, 1 segundo)
    
    // Verificar que al menos un mensaje de error esté visible
    const errorAlerts = page.locator('.alert.alert-danger');
    await expect(errorAlerts.first()).toBeVisible();
    // Chequear que contenga el texto de algún error esperado 
    await expect(errorAlerts).toContainText([
        /First name is required/i,
        /Last name is required/i,
        /Date of Birth is required/i,
        /Street is required/i,
        /Postcode is required/i, 
        /City is required/i,
        /State is required/i,
        /Country is required/i,
        /Phone is required/i,
        /Email is required/i,
        /Password is required.*Password must be minimal 6 characters long.*Password can not include invalid characters./is
    ]);
    // Verificar que la URL no cambie, indicando que el registro falló
    await expect(page).toHaveURL(/.*register/);
} );

const ExistingEmailData = [
    { firstName: 'John', lastName: 'Doe', dateOfBirth: '10/11/2003', streetAddress: '123 Main St', postalCode: '12345', city: 'Anytown', state: 'CA', country: 'United States of America (the)', phone: '1234567890', email: 'customer@practicesoftwaretesting.com', password: 'Passwo4rd123!' },
    { firstName: 'Alice', lastName: 'Smith', dateOfBirth: '21/05/1978', streetAddress: '456 Oak Ave', postalCode: '54321', city: 'Metropolis', state: 'NY', country: 'United States of America (the)', phone: '9876543210', email: 'customer3@practicesoftwaretesting.com', password: 'MyPa8ssw0rd!  ' }]

ExistingEmailData.forEach((data, idx) => {
    test (`Registration attempt with existing email #${idx + 1}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navbar = new NavBar(page);
    await navbar.clickSigninButton();
    await expect(page).toHaveURL(/.*login/);
    const loginPage = new LogInPage(page);
    await loginPage.clickRegisterButton();
    await expect(page).toHaveURL(/.*register/);
    const registrationPage = new RegistrationPage(page);

        // Intentar llenar el formulario con un email ya existente
        await registrationPage.fillRegistrationForm(
            data.firstName,
            data.lastName,
            data.dateOfBirth, 
            data.streetAddress,
            data.postalCode,
            data.city,
            data.state,
            data.country,
            data.phone,
            data.email,
            data.password
        );
        await registrationPage.submitRegistrationForm();
        await page.waitForTimeout(1000); // Para ver el llenado en pantalla (debug, 1 segundo)
        
        // Verificar que al menos un mensaje de error esté visible
        const errorAlerts = page.locator('.alert.alert-danger');
        await expect(errorAlerts.first()).toBeVisible();
        // Chequear que contenga el texto de algún error esperado 
        await expect(errorAlerts).toContainText(/A customer with this email address already exists./i);
        
        // Verificar que la URL no cambie, indicando que el registro falló
        await expect(page).toHaveURL(/.*register/);
    });
});

const shortPasswordData = [
    { firstName: 'John', lastName: 'Doe', dateOfBirth: '10/11/2003', streetAddress: '123 Main St', postalCode: '12345', city: 'Anytown', state: 'CA', country: 'United States of America (the)', phone: '1234567890', email: 'juli@hola.com', password: '123Ho.' },
    { firstName: 'Alice', lastName: 'Smith', dateOfBirth: '21/05/1978', streetAddress: '456 Oak Ave', postalCode: '54321', city: 'Metropolis', state: 'NY', country: 'United States of America (the)', phone: '9876543210', email: 'gustavo@plu.com', password: '123pL.4' }]

shortPasswordData.forEach((data, idx) => {
    test(`Registration attempt with short password #${idx + 1}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navbar = new NavBar(page);
    await navbar.clickSigninButton();
    await expect(page).toHaveURL(/.*login/);
    const loginPage = new LogInPage(page);
    await loginPage.clickRegisterButton();
    await expect(page).toHaveURL(/.*register/);
    const registrationPage = new RegistrationPage(page);

        // Intentar llenar el formulario con una contraseña corta
        await registrationPage.fillRegistrationForm(
            data.firstName,
            data.lastName,
            data.dateOfBirth, 
            data.streetAddress,
            data.postalCode,
            data.city,
            data.state,
            data.country,
            data.phone,
            data.email,
            data.password
        );
        await registrationPage.submitRegistrationForm();
        await page.waitForTimeout(1000); // Para ver el llenado en pantalla (debug, 1 segundo)
        
        // Verificar que al menos un mensaje de error esté visible
        const errorAlerts = page.locator('.alert.alert-danger');
        await expect(errorAlerts.first()).toBeVisible();
        // Chequear que contenga el texto de algún error esperado 
        await expect(errorAlerts).toContainText(/Password must be minimal 8 characters long./i);
        
        // Verificar que la URL no cambie, indicando que el registro falló
        await expect(page).toHaveURL(/.*register/);
    });
}); //esta bien que falle BUG, diferencia entre el mensaje que manda la UI con los requisitos funcionales de la pagina 

const maxcharactersData = [
    { firstName: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', lastName: 'AAAAAAAAAAAAAAAAAAAAAA', dateOfBirth: '10/11/2003', streetAddress: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', postalCode: 'AAAAAAAAAAAA', city: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA ', state: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', country: 'United States of America (the)', phone: '12345678901112131415161718', email: 'patopatoso@gmail.com', password: 'Passwo4rd123!' }]

maxcharactersData.forEach((data, idx) => {
    test (`Registration attempt with maximum characters #${idx + 1}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navbar = new NavBar(page);
    await navbar.clickSigninButton();
    await expect(page).toHaveURL(/.*login/);
    const loginPage = new LogInPage(page);
    await loginPage.clickRegisterButton();
    await expect(page).toHaveURL(/.*register/);
    const registrationPage = new RegistrationPage(page);

        // Intentar llenar el formulario con campos que exceden el máximo de caracteres
        await registrationPage.fillRegistrationForm(
            data.firstName,
            data.lastName,
            data.dateOfBirth, 
            data.streetAddress,
            data.postalCode,
            data.city,
            data.state,
            data.country,
            data.phone,
            data.email,
            data.password
        );
        await registrationPage.submitRegistrationForm();
        await page.waitForTimeout(1000); // Para ver el llenado en pantalla (debug, 1 segundo)
        
        // Verificar que al menos un mensaje de error esté visible
        const errorAlerts = page.locator('.alert.alert-danger');
        await expect(errorAlerts.first()).toBeVisible();
        // Chequear que contenga todos los mensajes juntos en el mismo bloque, separados por cualquier cantidad de caracteres (incluyendo saltos de línea)
        await expect(errorAlerts.first()).toContainText(
            /The first name field must not be greater than 40 characters.*The last name field must not be greater than 20 characters.*The address\.street field must not be greater than 70 characters.*The address\.city field must not be greater than 40 characters.*The address\.state field must not be greater than 40 characters.*The address\.postal code field must not be greater than 10 characters.*The phone field must not be greater than 24 characters./is
        );
        await page.waitForTimeout(3000); // Para ver el llenado en pantalla (debug, 3 segundos)
        // Verificar que la URL no cambie, indicando que el registro falló
        await expect(page).toHaveURL(/.*register/);
    });
});

const nonnumericphoneData = [
    { firstName: 'John', lastName: 'Doe', dateOfBirth: '10/11/2003', streetAddress: '123 Main St', postalCode: '12345', city: 'Anytown', state: 'CA', country: 'United States of America (the)', phone: '1234567890abc', email: 'plant@foco.com', password: 'Passwo4rd123!' },
    { firstName: 'Alice', lastName: 'Smith', dateOfBirth: '21/05/1978', streetAddress: '456 Oak Ave', postalCode: '54321', city: 'Metropolis', state: 'NY', country: 'United States of America (the)', phone: '+543512345678', email: 'wow@super.com', password: 'MyPa8ssw0rd!  ' }]

nonnumericphoneData.forEach((data, idx) => {
    test(`Registration attempt with non-numeric phone #${idx + 1}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navbar = new NavBar(page);
    await navbar.clickSigninButton();
    await expect(page).toHaveURL(/.*login/);
    const loginPage = new LogInPage(page);
    await loginPage.clickRegisterButton();
    await expect(page).toHaveURL(/.*register/);
    const registrationPage = new RegistrationPage(page);

        // Intentar llenar el formulario con un teléfono no numérico
        await registrationPage.fillRegistrationForm(
            data.firstName,
            data.lastName,
            data.dateOfBirth, 
            data.streetAddress,
            data.postalCode,
            data.city,
            data.state,
            data.country,
            data.phone,
            data.email,
            data.password
        );
        await registrationPage.submitRegistrationForm();
        await page.waitForTimeout(1000); // Para ver el llenado en pantalla (debug, 1 segundo)
        
        // Verificar que al menos un mensaje de error esté visible
        const errorAlerts = page.locator('.alert.alert-danger');
        await expect(errorAlerts.first()).toBeVisible();
        // Chequear que contenga el texto de algún error esperado 
        await expect(errorAlerts).toContainText(/Only numbers are allowed./i);
        
        // Verificar que la URL no cambie, indicando que el registro falló
        await expect(page).toHaveURL(/.*register/);
    });
});

const invalidEmailData = [
    { firstName: 'John', lastName: 'Doe', dateOfBirth: '10/11/2003', streetAddress: '123 Main St', postalCode: '12345', city: 'Anytown', state: 'CA', country: 'United States of America (the)', phone: '1234567890', email: 'john.doe', password: 'Passwo4rd123!' },
    { firstName: 'Alice', lastName: 'Smith', dateOfBirth: '21/05/1978', streetAddress: '456 Oak Ave', postalCode: '54321', city: 'Metropolis', state: 'NY', country: 'United States of America (the)', phone: '9876543210', email: '@alice.com', password: 'MyPa8ssw0rd!  '}]

invalidEmailData.forEach((data, idx) => {
    test(`Registration attempt with invalid email #${idx + 1}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navbar = new NavBar(page);
    await navbar.clickSigninButton();
    await expect(page).toHaveURL(/.*login/);
    const loginPage = new LogInPage(page);
    await loginPage.clickRegisterButton();
    await expect(page).toHaveURL(/.*register/);
    const registrationPage = new RegistrationPage(page);

        // Intentar llenar el formulario con un email inválido
        await registrationPage.fillRegistrationForm(
            data.firstName,
            data.lastName,
            data.dateOfBirth, 
            data.streetAddress,
            data.postalCode,
            data.city,
            data.state,
            data.country,
            data.phone,
            data.email,
            data.password
        );
        await registrationPage.submitRegistrationForm();
        await page.waitForTimeout(1000); // Para ver el llenado en pantalla (debug, 1 segundo)
        
        // Verificar que al menos un mensaje de error esté visible
        const errorAlerts = page.locator('.alert.alert-danger');
        await expect(errorAlerts.first()).toBeVisible();
        
        // Verificar que la URL no cambie, indicando que el registro falló
        await expect(page).toHaveURL(/.*register/);
    });
});

const underageData = [
    { firstName: 'John', lastName: 'Doe', dateOfBirth: '10/11/2010', streetAddress: '123 Main St', postalCode: '12345', city: 'Anytown', state: 'CA', country: 'United States of America (the)', phone: '1234567890', email: 'ni8o@gmail.com', password: 'Passwo4rd123!' },
    { firstName: 'Alice', lastName: 'Smith', dateOfBirth: '21/05/2015', streetAddress: '456 Oak Ave', postalCode: '54321', city: 'Metropolis', state: 'NY', country: 'United States of America (the)', phone: '9876543210', email: 'nin7a@gmail.com', password: 'MyPa8ssw0rd!  '}]

underageData.forEach((data, idx) => {
    test(`Registration attempt with underage user #${idx + 1}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navbar = new NavBar(page);
    await navbar.clickSigninButton();
    await expect(page).toHaveURL(/.*login/);
    const loginPage = new LogInPage(page);
    await loginPage.clickRegisterButton();
    await expect(page).toHaveURL(/.*register/);
    const registrationPage = new RegistrationPage(page);

        // Intentar llenar el formulario con un usuario menor de edad
        await registrationPage.fillRegistrationForm(
            data.firstName,
            data.lastName,
            data.dateOfBirth, 
            data.streetAddress,
            data.postalCode,
            data.city,
            data.state,
            data.country,
            data.phone,
            data.email,
            data.password
        );
        await registrationPage.submitRegistrationForm();
        await page.waitForTimeout(1000); // Para ver el llenado en pantalla (debug, 1 segundo)
        
        // Verificar que al menos un mensaje de error esté visible
        const errorAlerts = page.locator('.alert.alert-danger');
        await expect(errorAlerts.first()).toBeVisible();
        await page.waitForTimeout(4000); // Para ver el llenado en pantalla (debug, 1 segundo)
        await expect(errorAlerts).toContainText(/Customer must be 18 years old./i);
        
        // Verificar que la URL no cambie, indicando que el registro falló
        await expect(page).toHaveURL(/.*register/);
    });
});

const over75Data = [
    { firstName: 'John', lastName: 'Doe', dateOfBirth: '10/11/1930', streetAddress: '123 Main St', postalCode: '12345', city: 'Anytown', state: 'CA', country: 'United States of America (the)', phone: '1234567890', email: 'viejito1@gmail.com', password: 'Passwo4rd123!' },
    { firstName: 'Alice', lastName: 'Smith', dateOfBirth: '21/05/1925', streetAddress: '456 Oak Ave', postalCode: '54321', city: 'Metropolis', state: 'NY', country: 'United States of America (the)', phone: '9876543210', email: 'viejita1@gmail.com', password: 'MyPa8ssw0rd!  '}]

over75Data.forEach((data, idx) => {
    test(`Registration attempt with over 75 years old #${idx + 1}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navbar = new NavBar(page);
    await navbar.clickSigninButton();
    await expect(page).toHaveURL(/.*login/);
    const loginPage = new LogInPage(page);
    await loginPage.clickRegisterButton();
    await expect(page).toHaveURL(/.*register/);
    const registrationPage = new RegistrationPage(page);

        // Intentar llenar el formulario con un usuario mayor de 75 años
        await registrationPage.fillRegistrationForm(
            data.firstName,
            data.lastName,
            data.dateOfBirth, 
            data.streetAddress,
            data.postalCode,
            data.city,
            data.state,
            data.country,
            data.phone,
            data.email,
            data.password
        );
        await registrationPage.submitRegistrationForm();
        await page.waitForTimeout(1000); // Para ver el llenado en pantalla (debug, 1 segundo)
        
        // Verificar que al menos un mensaje de error esté visible
        const errorAlerts = page.locator('.alert.alert-danger');
        await expect(errorAlerts.first()).toBeVisible();
        await page.waitForTimeout(4000); // Para ver el llenado en pantalla (debug, 1 segundo)
        await expect(errorAlerts).toContainText(/Customer must be younger than 75 years old./i);
        
        // Verificar que la URL no cambie, indicando que el registro falló
        await expect(page).toHaveURL(/.*register/);
    });
});

const complexitypasswordData = [
    { firstName: 'John', lastName: 'Doe', dateOfBirth: '10/11/2003', streetAddress: '123 Main St', postalCode: '12345', city: 'Anytown', state: 'CA', country: 'United States of America (the)', phone: '1234567890', email: 'nosedale@gmail.com', password: 'password123!' },
    { firstName: 'Alice', lastName: 'Smith', dateOfBirth: '21/05/1978', streetAddress: '456 Oak Ave', postalCode: '54321', city: 'Metropolis', state: 'NY', country: 'United States of America (the)', phone: '9876543210', email: 'nosedvale@gmail.com', password: 'PASSWORD123!' }]
    
complexitypasswordData.forEach((data, idx) => {
    test(`Registration attempt with password not meeting complexity requirements #${idx + 1}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');

    const navbar = new NavBar(page);
    await navbar.clickSigninButton();
    await expect(page).toHaveURL(/.*login/);
    const loginPage = new LogInPage(page);
    await loginPage.clickRegisterButton();
    await expect(page).toHaveURL(/.*register/);
    const registrationPage = new RegistrationPage(page);

        // Intentar llenar el formulario con una contraseña que no cumple con los requisitos de complejidad
        await registrationPage.fillRegistrationForm(
            data.firstName,
            data.lastName,
            data.dateOfBirth, 
            data.streetAddress,
            data.postalCode,
            data.city,
            data.state,
            data.country,
            data.phone,
            data.email,
            data.password
        );
        await registrationPage.submitRegistrationForm();
        await page.waitForTimeout(1000); // Para ver el llenado en pantalla (debug, 1 segundo)
        
        // Verificar que al menos un mensaje de error esté visible
        const errorAlerts = page.locator('.alert.alert-danger');
        await expect(errorAlerts.first()).toBeVisible();
        
        // Verificar que la URL no cambie, indicando que el registro falló
        await expect(page).toHaveURL(/.*register/);
    });
});
});
