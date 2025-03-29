const playwright = require('@playwright/test');
const electron = playwright._electron;
const chromium = playwright.chromium;
const test = playwright.test;
const expect = playwright.expect;

async function waitForCDP(port, timeout) {
  const http = require('node:http');
  const start = new Date().getTime();

  async function check() {
    try {
      const res = await new Promise((resolve, reject) => {
        http.get(`http://localhost:${port}/json/version`, (res) => resolve(res)).on('error', reject);
      });
      if (res.statusCode === 200) {
        return;
      }
      await retry();
    } catch {
      await retry();
    }
  };

  async function retry() {
    if (new Date().getTime() - start > timeout) {
      throw new Error('CDP not available');
    }
    await new Promise(resolve => setTimeout(resolve, 300));
    await check();
  };

  await check();
}

test.describe('AppA and AppB Integration Tests', () => {
  let app;
  let page;
  let browser;
  let appBPage;

  // Setup for each test
  test.beforeEach(async () => {
    app = await electron.launch({ args: ['main.js'] });
    page = await app.firstWindow();
    await page.click('#launch-b');
    await waitForCDP(9223);
    browser = await chromium.connectOverCDP('http://localhost:9223');
    appBPage = browser.contexts()[0].pages()[0];
  });

  // Teardown after each test
  test.afterEach(async () => {
    if (appBPage && !appBPage.isClosed()) {
      await appBPage.close();
    }
    if (app) {
      await app.close();
    }
  });

  test('AppA can launch AppB successfully', async () => {
    // Simply verify AppB is running
    expect(appBPage).toBeDefined();
    expect(await appBPage.isClosed()).toBe(false);
  });

  test('Form fields in AppB can be filled correctly', async () => {
    await appBPage.locator('#fname').fill('John');
    await appBPage.locator('#lname').fill('Doe');

    expect(await appBPage.locator('#fname').inputValue()).toBe('John');
    expect(await appBPage.locator('#lname').inputValue()).toBe('Doe');
  });

  test('Form submission in AppB displays submitted values', async () => {
    await appBPage.locator('#fname').fill('John');
    await appBPage.locator('#lname').fill('Doe');
    await appBPage.locator('button[type="submit"]').click();

    await appBPage.waitForSelector('#first-name');

    // Verify submitted values are displayed in the result area
    expect(await appBPage.locator('#first-name').textContent()).toBe('John');
    expect(await appBPage.locator('#last-name').textContent()).toBe('Doe');
  });

  test('AppB can be closed successfully', async () => {
    await appBPage.close();
    expect(await appBPage.isClosed()).toBe(true);
  });
});
