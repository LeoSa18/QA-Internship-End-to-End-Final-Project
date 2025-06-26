import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('User Registration API Tests', () => {
  const baseURL = 'https://api.practicesoftwaretesting.com/';

  test('Status Code 201 on Successful Registration', async ({ request }) => {
    const response = await request.post(`${baseURL}users/register`, {
      form: {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe778la@example.com',
        password: 'SuperSecure@123',
        'address[street]': 'Street 1',
        'address[city]': 'City',
        'address[state]': 'State',
        'address[country]': 'Country',
        'address[postal_code]': '1234AA',
        phone: '0987654321',
      dob: '1970-01-01',
      }
  });

    const responseBody = await response.json();
    console.log('Response Status:', response.status());
    console.log('Response Body:', responseBody);

    expect(response.status()).toBe(201);
  });

  test('Status Code 422 on missing required fields', async ({ request }) => {
    const response = await request.post(`${baseURL}users/register`, {
      form: {
        first_name: '',
        last_name: 'Doe',
        email: 'john12388@example.com',
        password: 'SuperSecure@123',
        'address[street]': 'Street 1',
        'address[city]': 'City',
        'address[state]': 'State',
        'address[country]': 'Country',
        'address[postal_code]': '1234AA',
        phone: '0987654321',
        dob: '1970-01-01',
      },
    });

    const responseBody = await response.json();
    console.log('Response Status:', response.status());
    console.log('Response Body:', responseBody);

    expect(response.status()).toBe(422);
    expect(responseBody).toMatchObject({
        first_name: ['The first name field is required.']
    });
  });

  test('Status Code 422 on already registered email', async ({ request }) => {
    const response = await request.post(`${baseURL}users/register`, {
      form: {
        first_name: 'Jane',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        password: 'SuperSecure@123',
        'address[street]': 'Street 1',
        'address[city]': 'City',
        'address[state]': 'State',
        'address[country]': 'Country',
        'address[postal_code]': '1234AA',
        phone: '0987654321',
        dob: '1970-01-01',
      },
    });

    const responseBody = await response.json();
    console.log('Response Status:', response.status());
    console.log('Response Body:', responseBody);
    expect(response.status()).toBe(422);
    expect(responseBody).toMatchObject({
        email: ['A customer with this email address already exists.']
    });
  });
});

test.describe('Admin User Management API Tests', () => {
  const baseURL = 'https://api.practicesoftwaretesting.com/';

  test('Admin retrieves all users successfully', async ({ request }) => {
    // Paso 1: Login como usuario con permisos
    const loginResponse = await request.post(`${baseURL}users/login`, {
      data: {
        email: 'admin@practicesoftwaretesting.com',
        password: 'welcome01'
      }
    });

    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();
    const accessToken = loginData.access_token;

    // Paso 2: Obtener usuarios (ajusta el endpoint si eres admin)
    const usersResponse = await request.get(`${baseURL}users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const usersData = await usersResponse.json();
    console.log('Users Response:', usersData);

    // Paso 3: Verificación
    expect(usersResponse.status()).toBe(200);
    expect(Array.isArray(usersData.data)).toBe(true);
  });

  test('non-admin user cannot retrieve all users', async ({ request }) => {
    // Paso 1: Login como usuario sin permisos de admin
    const loginResponse = await request.post(`${baseURL}users/login`, {
      data: {
        email: 'customer2@practicesoftwaretesting.com',
        password: 'welcome01'
      }
    });
    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();  
    const accessToken = loginData.access_token;

    // Paso 2: Intentar obtener usuarios
    const usersResponse = await request.get(`${baseURL}users`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    console.log('Users Response:', await usersResponse.json());

    // Paso 3: Verificación
    expect(usersResponse.status()).toBe(403);
    const errorData = await usersResponse.json();
    expect(errorData).toMatchObject({
        message: 'Forbidden'
        });
}
);
});



test.describe('Update User API Tests', () => {
  const baseURL = 'https://api.practicesoftwaretesting.com/';

  test('Status Code 200 on Successful User Update', async ({ request }) => {
    // Paso 1: Login como usuario
    const loginResponse = await request.post(`${baseURL}users/login`, {
      data: {
        email: 'customer2@practicesoftwaretesting.com',
        password: 'welcome01'
      }
    });

    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();
    const accessToken = loginData.access_token;

    // Paso 2: Obtener el ID del usuario actual
    const meResponse = await request.get(`${baseURL}users/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    expect(meResponse.status()).toBe(200);
    const meData = await meResponse.json();
    const userId = meData.id;

    // Paso 3: Actualizar datos del usuario
    const updateResponse = await request.put(`${baseURL}users/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        first_name: 'UpdatedFirstName',
        last_name: 'UpdatedLastName',
        email: 'customer2@practicesoftwaretesting.com',
        password: 'welcome01',
        address: {
          street: 'Updated Street 123',
          city: 'Vienna',
          state: 'Vienna State',
          country: 'Austria',
          postal_code: '1010'
        },
        phone: '1234567890',
        dob: '1980-02-02'
      }
    });

    const updateData = await updateResponse.json();
    console.log('Update Response:', updateData);

    // Paso 4: Verificación
    expect(updateResponse.status()).toBe(200);
    expect(updateData).toMatchObject({success: true});
  });

   test('User 1 cannot update User 2 - should return 403 Forbidden', async ({ request }) => {
    // Paso 1: Login como User 1 (customer@...)
    const loginResponse = await request.post(`${baseURL}users/login`, {
      data: {
        email: 'customer2@practicesoftwaretesting.com',
        password: 'welcome01'
      }
    });

    expect(loginResponse.status()).toBe(200);
    const loginData = await loginResponse.json();
    const accessToken = loginData.access_token;

    // Paso 2: Intentar modificar datos de otro usuario real
    const user2Id = '01JYH78BT12F221357386CMA1J'; // customer2@...

    const updateResponse = await request.put(`${baseURL}users/${user2Id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      data: {
        first_name: 'NotAllowed',
        last_name: 'UpdateAttempt',
        email: 'customer2@practicesoftwaretesting.com',
        password: 'welcome01',
        address: {
          street: 'Fake Street',
          city: 'Fake City',
          state: 'Fake State',
          country: 'Neverland',
          postal_code: '0000'
        },
        phone: '0000000000',
        dob: '1990-01-01'
      }
    });

    const updateData = await updateResponse.json();
    console.log('Update Response:', updateData);

    // Paso 3: Verificación
    expect(updateResponse.status()).toBe(403);
  
  });

});



  test.describe('Create Product API Tests', () => {
  const baseURL = 'https://api.practicesoftwaretesting.com/';
  const validImageId = '01JYHHHZDNWFCXXQX2C16C7MHA'; // ID válido desde GET /images

  test('Admin can create a product successfully with existing image', async ({ request }) => {
    // Paso 1: Login como admin
    const loginResponse = await request.post(`${baseURL}users/login`, {
      data: {
        email: 'admin@practicesoftwaretesting.com',
        password: 'welcome01'
      }
    });

    expect(loginResponse.status()).toBe(200);
    const accessToken = (await loginResponse.json()).access_token;
    const headers = { Authorization: `Bearer ${accessToken}` };

    // Paso 2: Obtener brand_id y category_id
    const [brandsRes, categoriesRes] = await Promise.all([
      request.get(`${baseURL}brands`, { headers }),
      request.get(`${baseURL}categories`, { headers })
    ]);

    const brand_id = (await brandsRes.json())?.[0]?.id;
    const category_id = (await categoriesRes.json())?.[0]?.id;

    expect(brand_id).toBeDefined();
    expect(category_id).toBeDefined();

    // Paso 3: Crear producto
    const createProductResponse = await request.post(`${baseURL}products`, {
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      data: {
        name: 'Pliers Test Product',
        description: 'Product created using a valid image ID from /images',
        price: 999.99,
        stock: 30,
        brand_id,
        category_id,
        product_image_id: validImageId,
        is_location_offer: false,
        is_rental: true
      }
    });

    const productData = await createProductResponse.json();
    console.log('Create Product Response:', productData);

    // Paso 4: Verificación de respuesta real
    expect(createProductResponse.status()).toBe(201);
    expect(productData).toMatchObject({
      name: 'Pliers Test Product',
      description: 'Product created using a valid image ID from /images',
      price: 999.99,
      is_location_offer: false,
      is_rental: true,
      in_stock: 30
    });
  });


  test('Product creation fails due to missing required field', async ({ request }) => {
    const validImageId = '01JYHHHZDNWFCXXQX2C16C7MHA'; // ID existente de GET /images

    // Login como admin
    const loginResponse = await request.post(`${baseURL}users/login`, {
      data: {
        email: 'admin@practicesoftwaretesting.com',
        password: 'welcome01'
      }
    });
    expect(loginResponse.status()).toBe(200);
    const accessToken = (await loginResponse.json()).access_token;
    const headers = { Authorization: `Bearer ${accessToken}` };

    // Obtener brand y category válidos
    const [brandsRes, categoriesRes] = await Promise.all([
      request.get(`${baseURL}brands`, { headers }),
      request.get(`${baseURL}categories`, { headers })
    ]);
    const brand_id = (await brandsRes.json())?.[0]?.id;
    const category_id = (await categoriesRes.json())?.[0]?.id;

    expect(brand_id).toBeDefined();
    expect(category_id).toBeDefined();

    // Intentar crear un producto sin el campo `name`
    const response = await request.post(`${baseURL}products`, {
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      data: {
        // Falta `name`
        description: 'Test sin nombre de producto',
        price: 999.99,
        stock: 10,
        brand_id,
        category_id,
        product_image_id: validImageId,
        is_location_offer: true,
        is_rental: false
      }
    });

    const responseBody = await response.json();
    console.log('Negative Test Response:', responseBody);

    // Esperar 400 o 422 dependiendo de la implementación del backend
    expect([400, 422]).toContain(response.status());
    expect(responseBody).toMatchObject({
      name: expect.any(Array) // debería contener errores para el campo name
    });
  });
  
});