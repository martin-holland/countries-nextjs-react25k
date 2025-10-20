# Cypress Quick Start Guide

## 🚀 Running Cypress Tests

### Option 1: Interactive Mode (Recommended for Development)

```bash
npm run cypress
```

Opens the Cypress Test Runner UI where you can select and run tests interactively.

### Option 2: Headless Mode (Faster, No UI)

```bash
npm run cypress:headless
```

Runs all tests in the terminal without opening a browser UI.

### Option 3: With Auto-Start Dev Server (Most Convenient)

```bash
# Interactive mode with auto-start
npm run e2e

# Headless mode with auto-start
npm run e2e:headless
```

These commands automatically start your Next.js dev server before running tests.

## 📁 Test Files

All test files are located in `cypress/e2e/`:

- `home.cy.js` - Home page tests
- `countries.cy.js` - Countries listing and detail pages
- `navigation.cy.js` - Navigation and routing tests
- `favourites.cy.js` - Favourites functionality
- `authentication.cy.js` - Login, logout, and protected routes

## ✍️ Writing Your First Test

Create a new file in `cypress/e2e/` with the `.cy.js` extension:

```javascript
// cypress/e2e/my-feature.cy.js
describe("My Feature", () => {
  it("should work correctly", () => {
    cy.visit("/my-page");
    cy.get('[data-testid="my-button"]').click();
    cy.contains("Success!").should("be.visible");
  });
});
```

## 🔧 Custom Commands Available

```javascript
// Login (defined in cypress/support/commands.js)
cy.login("user@example.com", "password");

// Logout
cy.logout();

// Wait for API calls
cy.waitForApi("@apiAlias");
```

## 📚 More Information

See `CYPRESS_SETUP.md` for comprehensive documentation.

## 🐛 Troubleshooting

**Tests failing?**

- Make sure your dev server is running on port 3000
- Check that you're using the correct selectors
- Add `data-testid` attributes to your components for stable testing

**Need help?**

- Check the [Cypress Documentation](https://docs.cypress.io)
- Review the example tests in `cypress/e2e/`
