describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have a navigation component", () => {
    cy.get('nav, [data-testid="navigation"]').should("exist");
  });

  it("should navigate to countries page", () => {
    // Try to find and click a link to countries page
    cy.contains(/countries/i).click({ force: true });
    cy.url().should("include", "/countries");
  });

  it("should navigate to favourites page", () => {
    // Try to find and click a link to favourites page
    cy.contains(/favourites/i).click({ force: true });
    cy.url().should("include", "/favourites");
  });

  it("should navigate to profile page", () => {
    // Try to find and click a link to profile page
    cy.contains(/profile/i).click({ force: true });
    cy.url().should("include", "/profile");
  });

  it("should navigate to login page", () => {
    // Try to find and click a link to login page
    cy.contains(/login/i).click({ force: true });
    cy.url().should("include", "/login");
  });

  it("should allow navigation back to home", () => {
    cy.visit("/countries");
    cy.contains(/home/i).click({ force: true });
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});
