// @ts-check
import { defineConfig, devices } from '@playwright/test'
 
/**
* @see https://playwright.dev/docs/test-configuration
*/
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
 
  // 👉 REPORTER CONFIG
/*   reporter: [
    ['list'],
    ['allure-playwright']
  ],
  */
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
 
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'], 
        headless: false 
      },
    },
    // Si querés activar Firefox o WebKit, descomentá las siguientes secciones
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
 
  // webServer opcional, por si usás una app local
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});