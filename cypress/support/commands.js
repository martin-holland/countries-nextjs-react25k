// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command for logging in (example using Supabase)
Cypress.Commands.add("login", (email, password) => {
  cy.session([email, password], () => {
    cy.visit("/login");

    // Wait for form to load and type email
    cy.get('input[type="email"]').should("be.visible").click().clear();
    cy.get('input[type="email"]').type(email, { delay: 50 });

    // Type password (re-query to avoid detachment issues)
    cy.get('input[type="password"]').should("be.visible").click().clear();
    cy.get('input[type="password"]').type(password, { delay: 50 });

    // Submit the form
    cy.get('button[type="submit"]').click();

    // Wait for successful login (redirect away from login page)
    cy.url().should("not.include", "/login", { timeout: 10000 });
  });
});

// Custom command to clear Supabase session
Cypress.Commands.add("logout", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
  cy.window().then((win) => {
    win.sessionStorage.clear();
  });
});

// Custom command to wait for API calls
Cypress.Commands.add("waitForApi", (alias) => {
  cy.wait(alias);
  cy.get('[data-testid="loading"]').should("not.exist");
});

// Example of a parent command
// Cypress.Commands.add('login', (email, password) => { ... })
//
// Example of a child command
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
// Example of a dual command
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
// Example of overwriting an existing command
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
