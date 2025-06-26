// @ts-check
import { defineConfig, devices } from '@playwright/test'
<<<<<<< Lucia-TestCases

/**
 * @see https://playwright.dev/docs/test-configuration
 */
=======
 
/**
* @see https://playwright.dev/docs/test-configuration
*/
>>>>>>> main
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
<<<<<<< Lucia-TestCases

  // 👉 REPORTER CONFIG
  reporter: [
    ['list'],
    ['allure-playwright']
  ],

=======
 
  // 👉 REPORTER CONFIG
/*   reporter: [
    ['list'],
    ['allure-playwright']
  ],
  */
>>>>>>> main
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
<<<<<<< Lucia-TestCases

=======
 
>>>>>>> main
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'], 
        headless: false 
      },
    },
    // Si querés activar Firefox o WebKit, descomentá las siguientes secciones
<<<<<<< Lucia-TestCases
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
=======
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
>>>>>>> main
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
<<<<<<< Lucia-TestCases

=======
 
>>>>>>> main
  // webServer opcional, por si usás una app local
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
<<<<<<< Lucia-TestCases
});
=======
});
>>>>>>> main
