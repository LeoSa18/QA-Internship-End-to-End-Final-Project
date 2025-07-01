const { setWorldConstructor, Before, After } = require('@cucumber/cucumber');
const { chromium, firefox, webkit } = require('@playwright/test');
 
const browserTypes = {
  chromium,
  chrome: chromium,
  firefox,
  webkit
};
 
class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }
}
 
setWorldConstructor(CustomWorld);
 
Before(async function () {
  // default to chromium if nothing specified
  const name = (process.env.BROWSER || 'chromium').toLowerCase();
  const launcher = browserTypes[name];
  if (!launcher) {
    throw new Error(`Unknown BROWSER "${name}". Valid options are: ${Object.keys(browserTypes).join(', ')}`);
  }
  this.browser = await launcher.launch({ headless: false });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});
 
After(async function () {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});