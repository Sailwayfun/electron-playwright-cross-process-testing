const playwright = require('@playwright/test');
const electron = playwright._electron;
const test = playwright.test;
const expect = playwright.expect;

test.describe('AppA Tests', () => {
  let electronApp;
  let appWindow;

  // Setup before each test
  test.beforeEach(async () => {
    // Launch Electron app
    electronApp = await electron.launch({ args: ['.'] });

    // Get the first window
    appWindow = await electronApp.firstWindow();

    // Verify app has launched successfully
    await expect(appWindow).toBeTruthy();
    const title = await appWindow.title();
    await expect(title).toContain('AppA'); // Assuming the window title contains "AppA"
  });

  // Cleanup after each test
  test.afterEach(async () => {
    await electronApp.close();
  });

  // Test 1: Verify AppA launches successfully
  test('AppA should launch successfully', async () => {
    // This is implicitly tested in beforeEach, but we can add additional checks
    await expect(appWindow.locator('#launch-another-window')).toBeVisible();
    await expect(appWindow.locator('#launch-b')).toBeVisible();
  });

  // Test 2: Verify clicking button opens another window
  test('Clicking button should open another window', async () => {
    // Click the button to launch another window
    await appWindow.locator('#launch-another-window').click();

    // Wait for the new window to appear
    await electronApp.waitForEvent('window');

    // Get all windows and check if we have exactly 2 windows now
    const windows = electronApp.windows();
    expect(windows.length).toBe(2);

    // Check the new window has the expected properties
    const newWindow = windows[1];
    await expect(newWindow).toBeTruthy();
  });

  // Test 3: Verify form on another window can be filled
  test('Form on another window can be filled', async () => {
    // Open the new window
    await appWindow.locator('#launch-another-window').click();
    await electronApp.waitForEvent('window');
    const windows = electronApp.windows();
    const newWindow = windows[1];

    // Fill the form with first and last name using correct selectors
    await newWindow.locator('#fname').fill('John');
    await newWindow.locator('#lname').fill('Doe');

    // Verify the values were actually filled
    const firstNameValue = await newWindow.locator('#fname').inputValue();
    const lastNameValue = await newWindow.locator('#lname').inputValue();
    expect(firstNameValue).toBe('John');
    expect(lastNameValue).toBe('Doe');
  });

  // Test 4: Verify names on another window can be displayed
  test('Names on another window can be displayed', async () => {
    // Open the new window
    await appWindow.locator('#launch-another-window').click();
    await electronApp.waitForEvent('window');
    const windows = electronApp.windows();
    const newWindow = windows[1];

    // Fill the form
    await newWindow.locator('#fname').fill('John');
    await newWindow.locator('#lname').fill('Doe');

    // Submit the form - using the submit button
    await newWindow.locator('button[type="submit"]').click();

    // Verify the names are displayed in the appropriate paragraph elements
    await expect(newWindow.locator('#first-name')).toHaveText('John');
    await expect(newWindow.locator('#last-name')).toHaveText('Doe');

    // Test with a second set of names
    await newWindow.locator('#fname').fill('Jane');
    await newWindow.locator('#lname').fill('Smith');
    await newWindow.locator('button[type="submit"]').click();

    // Verify the updated names are displayed
    await expect(newWindow.locator('#first-name')).toHaveText('Jane');
    await expect(newWindow.locator('#last-name')).toHaveText('Smith');
  });
});
