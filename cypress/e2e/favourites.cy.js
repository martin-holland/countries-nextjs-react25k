describe("Favourites Page", () => {
  beforeEach(() => {
    cy.visit("/favourites");
  });

  it("should load the favourites page", () => {
    cy.url().should("include", "/favourites");
  });

  it("should display favourites page content", () => {
    // The page should render without errors
    cy.get("body").should("be.visible");
  });

  context("When logged in", () => {
    beforeEach(() => {
      // Mock authentication if needed
      // cy.login('test@example.com', 'password')
    });

    it("should display user favourites if authenticated", () => {
      // This test will depend on your authentication setup
      // Add specific assertions based on your implementation
    });

    it("should allow adding countries to favourites", () => {
      // Navigate to countries and try to favorite one
      cy.visit("/countries");

      // Wait for countries to load
      cy.get('[data-testid="country-card"]', { timeout: 10000 }).should(
        "exist"
      );

      // Look for a favorite button (adjust selector based on your implementation)
      // cy.get('[data-testid="favorite-button"]').first().click({ force: true });
      // Note: You'll need to add the favorite button functionality to test this
    });
  });

  context("When not logged in", () => {
    it("should prompt user to login or show empty state", () => {
      // Add assertions based on your implementation
      // cy.contains(/login/i).should('be.visible')
      // or
      // cy.contains(/no favourites/i).should('be.visible')
    });
  });
});
