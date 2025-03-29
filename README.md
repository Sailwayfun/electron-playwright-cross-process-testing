# Electron Cross-Process Testing

This project demonstrates how to test communication between two Electron applications (AppA and AppB). It consists of two separate Electron apps that can interact with each other.

## Branches

The project has several branches targeting different testing scenarios:

- `main` - Basic configuration of AppA and AppB with manual testing
- `feat/multiple-executables` - Testing interaction between two Electron applications
- `feat/multiple-windows` - Testing multiple windows within a single Electron application

## Project Structure

- `AppA/` - The primary application that can launch AppB or open additional windows
- `AppB/` - The secondary application that can be launched from AppA

## Requirements

- Node.js (v14 or higher recommended)
- npm (v6 or higher recommended)
- Electron (v35.1.2)
- electron-builder (v26.0.12)
- Playwright (^1.51.1) for automated testing

## Installation

1. Clone the repository:

   ```bash
   git clone [repository URL]
   cd electron-cross-process-testing
   ```

2. Install dependencies for both applications:

   ```bash
   # Install dependencies for AppA
   cd AppA
   npm install

   # Install dependencies for AppB
   cd ../AppB
   npm install
   ```

## Building and Packaging Executables

### Packaging AppA

```bash
cd AppA

# Add the packaging script to package.json if not present
# Add this to the "scripts" section:
# "pack": "electron-builder --dir"

# Then run:
npm run pack
```

### Packaging AppB

```bash
cd AppB

# Package the application
npm run pack
```

The packaged applications will be available in the `dist/` directory of each application. For macOS, you'll find the executable at:

- `AppA/dist/mac-arm64/appa.app/Contents/MacOS/appa`
- `AppB/dist/mac-arm64/appb.app/Contents/MacOS/appb`

For other platforms, the paths will be similar but with the appropriate platform name (win-unpacked, linux-unpacked, etc.).

## Running the Applications

### Running AppA

```bash
cd AppA
npm start
```

### Running AppB

```bash
cd AppB
npm start
```

## Testing

### Basic Manual Testing (main branch)

This project is designed to test cross-process communication between Electron applications. To test the interaction:

1. Package both applications using the instructions above
2. Run AppA using `npm start`
3. Click the "Click me to launch AppB" button in AppA
4. AppB should launch and display a form

### Automated Testing (feat/multiple-executables branch)

The `feat/multiple-executables` branch contains automated tests using Playwright:

```bash
# Switch to the multiple-executables branch
git checkout feat/multiple-executables

# Install dependencies if needed
cd AppA
npm install

# Run tests
npm test
```

The tests will:

1. Launch AppA
2. Click the button to launch AppB
3. Verify AppB launches correctly
4. Fill and submit forms in AppB
5. Verify form submission works correctly

### Multiple Windows Testing (feat/multiple-windows branch)

The `feat/multiple-windows` branch allows testing multiple windows within a single Electron application:

```bash
# Switch to the multiple-windows branch
git checkout feat/multiple-windows

# Install dependencies if needed
cd AppA
npm install

# Run tests for multiple windows
npm run test-another-window

# Run tests for multiple executables
npm run test-multiple-executables
```

These tests verify:

1. AppA can open a second window
2. Form elements in the second window can be filled and submitted
3. Form submission correctly updates DOM elements

### Troubleshooting Tests

If AppB fails to launch from AppA:

1. Check the console output in AppA for error messages
2. Verify that the path to the AppB executable in `AppA/index.js` is correct
3. Ensure AppB was properly packaged and the executable exists

For automated tests:

1. Check the test reports in the `AppA/test-results/` directory
2. Verify that the debugging port (9223) is available and not in use
3. If tests are failing with timeout errors, try increasing the timeout in the test configuration

### Customizing Tests

You can modify the existing tests or add new ones:

1. Multiple Executables Tests: Edit `AppA/tests/app-a-multiple-executables.spec.js`
2. Multiple Windows Tests: Edit `AppA/tests/app-a-multiple-window.spec.js`
```
