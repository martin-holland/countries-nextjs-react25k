# Cypress E2E Testing Setup

This document explains how to use Cypress for end-to-end testing in this Next.js application.

## Overview

Cypress has been configured for both E2E and component testing with the following structure:

```
cypress/
├── e2e/                    # E2E test specs
│   ├── home.cy.js
│   ├── countries.cy.js
│   ├── navigation.cy.js
│   ├── favourites.cy.js
│   └── authentication.cy.js
├── fixtures/               # Test data
│   └── example.json
├── support/                # Support files
│   ├── commands.js         # Custom commands
│   ├── e2e.js             # E2E support file
│   └── component.js        # Component support file
└── tsconfig.json          # TypeScript config for Cypress
```

## Installation

All dependencies have been installed. The key packages are:

- `cypress` - The testing framework
- `@testing-library/cypress` - Testing Library commands for Cypress
- `start-server-and-test` - Utility to start dev server before tests

## Running Tests

### Open Cypress Test Runner (Interactive Mode)

```bash
npm run cypress
```

This opens the Cypress UI where you can:

- Select and run individual test files
- See tests execute in real-time
- Use time-travel debugging
- View command logs and application state

### Run Tests in Headless Mode

```bash
npm run cypress:headless
```

Runs all tests in headless mode (no UI) and exits. Useful for CI/CD.

### Run Tests with Dev Server

```bash
# Start dev server and open Cypress
npm run e2e

# Start dev server and run tests headlessly
npm run e2e:headless
```

These commands automatically:

1. Start the Next.js dev server on port 3000
2. Wait for the server to be ready
3. Run Cypress tests
4. Close everything when done

## Writing Tests

### Basic Test Structure

```javascript
describe("Feature Name", () => {
  beforeEach(() => {
    cy.visit("/path");
  });

  it("should do something", () => {
    cy.get('[data-testid="element"]').should("be.visible");
    cy.contains("Text").click();
    cy.url().should("include", "/expected-path");
  });
});
```

### Using Custom Commands

Custom commands are defined in `cypress/support/commands.js`:

```javascript
// Login command
cy.login("user@example.com", "password");

// Logout command
cy.logout();

// Wait for API call
cy.waitForApi("@apiAlias");
```

### Best Practices

1. **Use data-testid attributes** for reliable selectors:

   ```jsx
   <button data-testid="submit-button">Submit</button>
   ```

   ```javascript
   cy.get('[data-testid="submit-button"]').click();
   ```

2. **Use cy.session()** for authentication to cache sessions:

   ```javascript
   cy.session([email, password], () => {
     // Login logic
   });
   ```

3. **Wait for API calls** using intercepts:

   ```javascript
   cy.intercept("GET", "/api/countries").as("getCountries");
   cy.wait("@getCountries");
   ```

4. **Use timeouts** for elements that take time to load:

   ```javascript
   cy.get('[data-testid="loader"]', { timeout: 10000 }).should("not.exist");
   ```

5. **Clean up between tests**:
   ```javascript
   beforeEach(() => {
     cy.logout();
     cy.clearLocalStorage();
   });
   ```

## Test Coverage

Current test suites cover:

1. **Home Page** (`home.cy.js`)

   - Page loads correctly
   - Basic rendering

2. **Countries** (`countries.cy.js`)

   - List view loads and displays countries
   - Country cards show correct information
   - Navigation to detail pages works
   - Images load correctly

3. **Navigation** (`navigation.cy.js`)

   - All navigation links work
   - Routing between pages
   - Back navigation

4. **Favourites** (`favourites.cy.js`)

   - Favourites page loads
   - Adding/removing favourites
   - Authentication-based behavior

5. **Authentication** (`authentication.cy.js`)
   - Login form validation
   - Login/logout flow
   - Protected routes
   - Profile page access

## Configuration

The Cypress configuration is in `cypress.config.js`:

```javascript
{
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: false,  // Set to true to record videos
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
  }
}
```

### Useful Configuration Options

- `video: true` - Record videos of test runs
- `screenshotOnRunFailure: true` - Take screenshots when tests fail
- `viewportWidth/Height` - Set browser viewport size
- `baseUrl` - Base URL for `cy.visit()` commands

## Debugging Tests

### In Test Runner

1. Click on any command in the command log
2. See the state of the application at that moment
3. Use Chrome DevTools to inspect elements

### Using cy.debug()

```javascript
cy.get('[data-testid="element"]')
  .debug() // Pauses execution
  .click();
```

### Using cy.pause()

```javascript
cy.get('[data-testid="element"]')
  .pause() // Pauses and waits for you to resume
  .click();
```

### Console Logging

```javascript
cy.get('[data-testid="element"]').then(($el) => {
  console.log("Element:", $el);
});
```

## CI/CD Integration

For continuous integration, use the headless command:

```yaml
# Example GitHub Actions
- name: Run E2E Tests
  run: npm run e2e:headless
```

## Troubleshooting

### Tests are flaky

- Add appropriate waits and assertions
- Use `cy.intercept()` to wait for API calls
- Increase timeouts for slow-loading elements

### Elements not found

- Check selectors are correct
- Add data-testid attributes for better stability
- Ensure elements are visible before interacting

### Authentication issues

- Clear cookies and local storage between tests
- Use `cy.session()` for consistent authentication state
- Mock authentication for faster tests

## Additional Resources

- [Cypress Documentation](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Testing Library with Cypress](https://testing-library.com/docs/cypress-testing-library/intro/)

## Next Steps

1. Add more test coverage for:

   - Country detail pages
   - Form submissions
   - Error handling
   - Edge cases

2. Set up Cypress Dashboard for:

   - Test recordings
   - Analytics
   - Parallelization

3. Add visual regression testing with:

   - `cypress-image-snapshot`
   - Percy or Applitools integration

4. Configure for CI/CD pipeline
