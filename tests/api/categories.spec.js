import { test, expect } from '@playwright/test';

const baseUrl = 'https://api.practicesoftwaretesting.com';

test.describe('Categories API Tests', () => {
  const adminCredentials = {
    email: 'admin@practicesoftwaretesting.com',
    password: 'welcome01'
  };

  async function loginAsAdmin(request) {
    const response = await request.post(`${baseUrl}/users/login`, {
      data: adminCredentials,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.access_token).toBeTruthy();
    return body.access_token;
  }

  test('Create a new category successfully', async ({ request }) => {
    const token = await loginAsAdmin(request);

    const name = 'Electronics';
    const slug = 'electronics';

    const response = await request.post(`${baseUrl}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name, slug }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeTruthy();
    console.log(`Created category '${name}' with ID: ${body.id}`);
  });

  test('Successfully update an existing category', async ({ request }) => {
    const token = await loginAsAdmin(request);

    const originalData = {
      name: 'Temp Category to Update',
      slug: 'temp-update'
    };

    const updatedData = {
      name: 'Sports Equipment',
      slug: 'sports-equipment'
    };

    // Crear categoría
    const createResponse = await request.post(`${baseUrl}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
      data: originalData
    });

    expect(createResponse.status()).toBe(201);
    const { id } = await createResponse.json();

    // Actualizarla
    const updateResponse = await request.put(`${baseUrl}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      data: updatedData
    });

    expect(updateResponse.status()).toBe(200);
    const updateBody = await updateResponse.json();
    expect(updateBody.success).toBe(true);
    console.log(`Updated category ${id} to '${updatedData.name}'`);
  });

  test('Successfully delete an existing category', async ({ request }) => {
    const token = await loginAsAdmin(request);

    const name = 'Temp Category to Delete';
    const slug = 'delete-me';

    // Crear categoría
    const createResponse = await request.post(`${baseUrl}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name, slug }
    });

    expect(createResponse.status()).toBe(201);
    const { id } = await createResponse.json();

    // Eliminar
    const deleteResponse = await request.delete(`${baseUrl}/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(deleteResponse.status()).toBe(204);
    console.log(`Deleted category: ${id}`);
  });

    test('Fail to delete category without admin authentication', async ({ request }) => {
    // Obtener token para crear categoría (sí logueado)
    const token = await loginAsAdmin(request);

    // Crear una categoría temporal (logueado)
    const createResponse = await request.post(`${baseUrl}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { 
            name: 'Unauthorized Delete Test', 
            slug: 'unauth-delete' 
        }
    });

    expect(createResponse.status()).toBe(201);
    const { id } = await createResponse.json();

    // Intentar borrarla SIN token (no autenticado)
    const deleteResponse = await request.delete(`${baseUrl}/categories/${id}`);

    // Validaciones
    expect(deleteResponse.status()).toBe(401);
    const errorBody = await deleteResponse.json();
    expect(errorBody.message).toBe('Unauthorized');
    console.log(`Delete without auth correctly failed with 401 for category: ${id}`);
    });

});
