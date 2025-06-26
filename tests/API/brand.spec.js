import { test, expect } from '@playwright/test';

const baseUrl = 'https://api.practicesoftwaretesting.com';
const email = 'admin@practicesoftwaretesting.com';
const password = 'welcome01';

// Helper function to create a brand, with optional name and slug
async function createBrand(request, name, slug) {
    name = name || `new-brand-${Date.now()}`;
    slug = slug || `new-brand-${Date.now()}`;
    return await request.post(`${baseUrl}/brands`, {
        data: { name, slug }
    });
}

test.describe('API Tests - Brands', () => {
    test('Status 201 - Admin adds a new brand successfully', async ({ request }) => {
        const responseCreateBrand = await createBrand(request);
        const body = await responseCreateBrand.json();
        console.log('Response:', body);

        expect(body).toMatchObject({
            name: body.name,
            slug: body.slug,
            id: expect.any(String),
        });

        expect(responseCreateBrand.status()).toBe(201);
    })

    test('Status 409 - Fail to add a brand that already exists', async ({ request }) => {
        // Create a brand with generated name/slug
        const firstResp = await createBrand(request);
        expect(firstResp.status()).toBe(201);

        const firstBrand = await firstResp.json();
        const { name, slug } = firstBrand;

        // Try to create the same brand again (should fail)
        const secondResp = await createBrand(request, name, slug);
        const bodyResponse = await secondResp.json();
      
        expect(bodyResponse.slug).toContain('A brand already exists with this slug.');
        expect(secondResp.status()).toBe(422);
    })

    test('Status 200 - Admin retrieves a brand with valid ID', async ({ request }) => {
        // Create a brand to retrieve
        const createResp = await createBrand(request);
        expect(createResp.status()).toBe(201);
        const createdBrand = await createResp.json();
        const brandId = createdBrand.id;

        const response = await request.get(`${baseUrl}/brands/${brandId}`);

        const body = await response.json();

        expect(body).toMatchObject({
            id: brandId,
            name: expect.any(String),
            slug: expect.any(String),
        });

        expect(response.status()).toBe(200);
    })

    test('Status 404 - Fail to retrieve a brand with ID that does not exist', async ({ request }) => {
        const brandId = '01JYKSN3J7KJMKQ3D4MY1A10';

        const brandResp = await request.get(`${baseUrl}/brands/${brandId}`);

        const bodyResponse = await brandResp.json();

        expect(bodyResponse).toHaveProperty('message');
        expect(bodyResponse.message).toContain('Requested item not found');
        expect(brandResp.status()).toBe(404);
    })

    test('Status 204 - Admin deletes a brand successfully', async ({ request }) => {
        // Create a brand to delete
        const createResp = await createBrand(request);
        expect(createResp.status()).toBe(201);
        const createdBrand = await createResp.json();
        const brandId = createdBrand.id;
        console.log('Created Brand ID:', brandId);

        // Login admin
        const loginResponse = await request.post(`${baseUrl}/users/login`, {
            data: {
                email: email,
                password: password
            }
        });

        expect(loginResponse.status()).toBe(200);

        const loginData = await loginResponse.json();
        const access_token = loginData.access_token;

        // Delete the brand
        console.log('Deleting bradnId:', brandId);
        const brandResp = await request.delete(`${baseUrl}/brands/${brandId}`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            });
        expect(brandResp.status()).toBe(204);
    })
})