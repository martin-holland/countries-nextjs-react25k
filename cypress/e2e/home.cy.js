describe("Home Page", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the home page successfully", () => {
    cy.contains("App will be here").should("be.visible");
  });

  it("should have the correct title", () => {
    cy.title().should("exist");
  });

  it("should render without errors", () => {
    cy.get("body").should("be.visible");
  });
});
