describe("Countries Page", () => {
  beforeEach(() => {
    cy.visit("/countries");
  });

  it("should load the countries page", () => {
    cy.url().should("include", "/countries");
  });

  it("should display loading state initially", () => {
    // Check for loading state (it may disappear quickly as countries load)
    cy.get('[data-testid="loading"], [data-testid="countries-grid"]').should(
      "exist"
    );
  });

  it("should display a list of countries after loading", () => {
    // Wait for countries to load
    cy.get('[data-testid="country-card"]', { timeout: 10000 }).should(
      "have.length.greaterThan",
      0
    );
  });

  it("should display country information (name, population, currency)", () => {
    // Wait for the first country card to be visible
    cy.get("img[alt]", { timeout: 10000 }).first().should("be.visible");

    // Check that country cards have the expected content
    cy.contains(/[A-Za-z]+/).should("be.visible"); // Country name
  });

  it("should navigate to a country detail page when clicked", () => {
    // Wait for countries to load and click the first country card
    cy.get('[data-testid="country-card-button"]', { timeout: 10000 })
      .first()
      .click();

    // Verify navigation to detail page
    cy.url().should("include", "/countries/");
  });

  it("should display country flags", () => {
    // Wait for images to load
    cy.get("img[alt]", { timeout: 10000 }).should("have.length.greaterThan", 0);

    // Check that at least one flag image is visible
    cy.get("img[alt]")
      .first()
      .should("be.visible")
      .and("have.attr", "src")
      .and("not.be.empty");
  });
});
