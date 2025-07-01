import { test, expect } from '@playwright/test';
const { HomePage } = require('./Pages/HomePage');
// Feature: Product listing
// Scenario: Display product with name, price and image
// Given the shopper is on the home page
// When the list of products is loaded
// Then each product should display its name, price and an image

test('Display product with name, price and image', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  const homePage = new HomePage(page);
 
  const products = homePage.getAllProducts();
  const count = await products.count();

  for (let i = 0; i < count; i++) {
    const product = products.nth(i);
    const name = product.locator('.card-title');
    const price = product.locator('.card-footer');
    const image = product.locator('.card-img-top');

    await expect(name).toBeVisible();
    await expect(price).toBeVisible();
    await expect(image).toBeVisible();
  }
});

// Feature: Product search
// Scenario: Search with exact product name
// Scenario Output:
// | product_name       |
// | Thor Hammer        |
// | Combination Pliers |
// | Bolt Cutters       |

test.describe.configure({ mode: 'serial' });
['Thor Hammer', 'Combination Pliers', 'Bolt Cutters'].forEach((searchQuery) => {
  test(`Search with exact product name: ${searchQuery}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    const homePage = new HomePage(page);
    

    await homePage.searchProduct(searchQuery);
    await page.waitForTimeout(2000);
    const products = homePage.getAllProducts();
    const count = await products.count();
    await expect(count).toBeGreaterThan(0);

    let found = false;
    for (let i = 0; i < count; i++) {
      const name = products.nth(i).locator('.card-title');
      const text = await name.textContent();
      if (text.trim() === searchQuery) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});

// Feature: Product search
// Scenario: Search with partial name
// Scenario Output:
// | product_name |
// | Hammer       |
// | Pliers       |
// | Cutters      |

['Hammer', 'Pliers', 'Cutters'].forEach((searchQuery) => {
  test(`Search with partial name: ${searchQuery}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    const homePage = new HomePage(page);
    
    await homePage.searchProduct(searchQuery);
    await page.waitForTimeout(2000);
    const products = homePage.getAllProducts();
    const count = await products.count();
    await expect(count).toBeGreaterThan(0);

    let found = false;
    for (let i = 0; i < count; i++) {
      const name = products.nth(i).locator('.card-title');
      const text = await name.textContent();
      if (text.toLowerCase().includes(searchQuery.toLowerCase())) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});

// Feature: Product search
// Scenario: Search with invalid product name
// Scenario Output:
// | product_name |
// | Hamburguer   |
// | 1234         |
// | #Time_machine|

['Hamburguer', '1234', '#Time_machine'].forEach((searchQuery) => {
  test(`Search with invalid product name: ${searchQuery}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    const homePage = new HomePage(page);

    await homePage.searchProduct(searchQuery);
    await page.waitForTimeout(2000);
    const productContainer = homePage.getProductContainer();
    await expect(productContainer).toContainText('There are no products found.');
  });
});

// Feature: Product search
// Scenario: Search with empty input

test('Search with empty input', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  const homePage = new HomePage(page);

  await homePage.searchProduct('');
  await page.waitForTimeout(2000);
  const products = homePage.getAllProducts();
  const count = await products.count();
  await expect(count).toBeGreaterThan(0);
});

// Feature: Product listing pagination
// Scenario: Pagination appears when product count exceeds page size

const examples1 = [
  { product_count: 10, page_size: 9 },
  { product_count: 25, page_size: 9 },
  { product_count: 50, page_size: 9 },
];

for (const { product_count, page_size } of examples1) {
  test(`Pagination appears when product count = ${product_count} and page size = ${page_size}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    const homePage = new HomePage(page);

    await page.waitForTimeout(2000);

    const visibleProducts = homePage.getAllProducts(); 
    const visibleCount = await visibleProducts.count();

    expect(visibleCount).toBe(page_size);

    const pagination = homePage.getPaginationControls();
    await expect(pagination).toBeVisible();
  });
}

// Feature: Product listing pagination
// Scenario: Correct behavior on the last page of pagination

test('Correct behavior on the last page of pagination', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  const homePage = new HomePage(page);

  const pagination = homePage.getPaginationControls();
  const allLinks = pagination.locator('.page-link');
  const countLinks = await allLinks.count();
  const lastNumbered = allLinks.nth(countLinks - 2);
  await lastNumbered.click();
  await page.waitForTimeout(2000);
  await expect(page.locator('body > app-root > div > app-overview > div:nth-child(3) > div.col-md-9 > div.mt-3 > app-pagination > nav > ul > li.page-item.disabled')).toBeVisible();
});

// Feature: Product search
// Scenario: Case insensitive search
// Scenario Output:
// | product_name         |
// | tHoR HAmMer          |
// | CoMbiNatiOn PliErS   |
// | BoLt CuTtErS         |

['tHoR HAmMer', 'CoMbiNatiOn PliErS', 'BoLt CuTtErS'].forEach((searchQuery) => {
  test(`Case insensitive search: ${searchQuery}`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    const homePage = new HomePage(page);

    await homePage.searchProduct(searchQuery);
    await page.waitForTimeout(2000);
    const products = homePage.getAllProducts();
    const count = await products.count();
    await expect(count).toBeGreaterThan(0);

    let found = false;
    for (let i = 0; i < count; i++) {
      const name = products.nth(i).locator('.card-title');
      const text = await name.textContent();
      if (text.toLowerCase().includes(searchQuery.toLowerCase())) {
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });
});

["Thor   Hammer", "Combination Pliers  ", "    Bolt Cutters "].forEach((queryWithSpaces) => {
  test(`Search with leading/trailing whitespace: '${queryWithSpaces}'`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    const homePage = new HomePage(page);

    await homePage.searchProduct(queryWithSpaces);
    await page.waitForTimeout(2000);
    const productContainer = homePage.getProductContainer();
    await expect(productContainer).toContainText('There are no products found.');
  });
});

/*
const examples2 = [
  { product_count: 5, page_size: 9 },
  { product_count: 8, page_size: 9 },
];

for (const { product_count, page_size } of examples2) {
  test(`Pagination is hidden when product_count = ${product_count} and page_size = ${page_size}`, async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    // Localizamos productos visibles
    const visibleProducts = homePage.getAllProducts();
    const count = await visibleProducts.count();

    // Se deben mostrar todos los productos disponibles
    expect(count).toBe(product_count);

    // La paginación NO debe estar visible
    const pagination = homePage.getPaginationControls();
    await expect(pagination).toHaveCount(0); // si desaparece del DOM
    // o:
    // await expect(pagination).not.toBeVisible(); // si se oculta con CSS
  });
}
*/

test('Navigate to next page of products', async ({ page }) => {
  await page.goto('https://practicesoftwaretesting.com/');
  const homePage = new HomePage(page);

  await page.waitForTimeout(6000);

  const firstPageProducts = homePage.getAllProducts();
  const firstCount = await firstPageProducts.count();
  await expect(firstCount).toBeGreaterThan(0);

  const firstTitles = [];
  for (let i = 0; i < firstCount; i++) {
    const name = await firstPageProducts.nth(i).locator('.card-title').textContent();
    firstTitles.push(name.trim());
  }

  const pagination = homePage.getPaginationControls();
  const nextButton = pagination.locator('.page-link').last();
  await nextButton.click();
  await page.waitForTimeout(6000);

  const secondPageProducts = homePage.getAllProducts();
  const secondTitles = [];
  const secondCount = await secondPageProducts.count();

  for (let i = 0; i < secondCount; i++) {
    const name = await secondPageProducts.nth(i).locator('.card-title').textContent();
    secondTitles.push(name.trim());
  }

  const areDifferent = secondTitles.some(title => !firstTitles.includes(title));
  expect(areDifferent).toBe(true);

  console.log('First page titles:', firstTitles);
  console.log('Second page titles:', secondTitles);
});


const examples3 = [
  { page_size: 9 },
  //{ page_size: 12 },
];

for (const { page_size } of examples3) {
  test(`Shopper navigates forward and backward in pagination (page size = ${page_size})`, async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
    const homePage = new HomePage(page);

    await page.waitForTimeout(4000);

    // Obtener títulos de la primera página
    const firstPageProducts = homePage.getAllProducts();
    const firstCount = await firstPageProducts.count();
    expect(firstCount).toBe(page_size);

    const firstTitles = [];
    for (let i = 0; i < firstCount; i++) {
      const name = await firstPageProducts.nth(i).locator('.card-title').textContent();
      firstTitles.push(name.trim());
    }

    // Navegar a la siguiente página
    const pagination = homePage.getPaginationControls();
    const nextButton = pagination.locator('.page-link').last(); // botón "Next"
    await nextButton.click();
    await page.waitForTimeout(4000);

    // Luego volver a la anterior (primera)
    const previousButton = pagination.locator('.page-link').nth(0); // botón "Previous"
    await previousButton.click();
    await page.waitForTimeout(4000);

    // Obtener títulos nuevamente de la primera página
    const returnedPageProducts = homePage.getAllProducts();
    const returnedTitles = [];
    const returnedCount = await returnedPageProducts.count();

    expect(returnedCount).toBe(page_size);

    for (let i = 0; i < returnedCount; i++) {
      const name = await returnedPageProducts.nth(i).locator('.card-title').textContent();
      returnedTitles.push(name.trim());
    }

    // Comparar listas
    console.log('First page titles:', firstTitles);
    console.log('Return page titles:', returnedTitles);
    expect(returnedTitles).toEqual(firstTitles);
  });
}
