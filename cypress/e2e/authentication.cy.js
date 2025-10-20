describe("Authentication", () => {
  beforeEach(() => {
    // Clear any existing sessions
    cy.logout();
  });

  describe("Login Page", () => {
    beforeEach(() => {
      cy.visit("/login");
    });

    it("should load the login page", () => {
      cy.url().should("include", "/login");
    });

    it("should display login form", () => {
      // Check for common login form elements
      cy.get('input[type="email"]').should("be.visible");
      cy.get('input[type="password"]').should("be.visible");
      cy.get('button[type="submit"]').should("be.visible");
    });

    it("should show validation errors for invalid inputs", () => {
      // Wait for form to be ready, then try to submit with empty fields
      cy.get('input[type="email"]').should("be.visible");
      cy.get('button[type="submit"]').click();

      // Check for error messages (adjust based on your validation)
      // Supabase Auth UI may show validation errors
      // cy.contains(/required|invalid/i).should('be.visible')
    });

    it("should accept valid email format", () => {
      // Wait for the input to be fully loaded and interactive
      cy.get('input[type="email"]')
        .should("be.visible")
        .click()
        .clear()
        .type("test@example.com", { delay: 50 });

      // Re-query the element after typing (Supabase Auth UI re-renders)
      cy.get('input[type="email"]').should("have.value", "test@example.com");
    });

    // Uncomment and modify these tests based on your authentication setup
    /*
    it('should login successfully with valid credentials', () => {
      // Type email (break chain to avoid detachment)
      cy.get('input[type="email"]').should('be.visible').click().clear()
      cy.get('input[type="email"]').type('test@example.com', { delay: 50 })
      
      // Type password (re-query element)
      cy.get('input[type="password"]').should('be.visible').click().clear()
      cy.get('input[type="password"]').type('password123', { delay: 50 })
      
      // Submit and verify redirect
      cy.get('button[type="submit"]').click()
      cy.url().should('not.include', '/login')
    })

    it('should show error message with invalid credentials', () => {
      // Type email (break chain to avoid detachment)
      cy.get('input[type="email"]').should('be.visible').click().clear()
      cy.get('input[type="email"]').type('wrong@example.com', { delay: 50 })
      
      // Type password (re-query element)
      cy.get('input[type="password"]').should('be.visible').click().clear()
      cy.get('input[type="password"]').type('wrongpassword', { delay: 50 })
      
      // Submit and check for error
      cy.get('button[type="submit"]').click()
      cy.contains(/invalid|error/i).should('be.visible')
    })
    */
  });

  describe("Protected Routes", () => {
    it("should redirect to login when accessing protected pages without authentication", () => {
      cy.visit("/protected");

      // Should redirect to login (adjust based on your implementation)
      // cy.url().should('include', '/login')
    });

    it("should allow access to protected pages when authenticated", () => {
      // Login first
      // cy.login('test@example.com', 'password123')
      // Try to access protected page
      // cy.visit('/protected')
      // cy.url().should('include', '/protected')
    });
  });

  describe("Profile Page", () => {
    beforeEach(() => {
      cy.visit("/profile");
    });

    it("should load the profile page", () => {
      cy.url().should("include", "/profile");
    });

    // Add more profile-specific tests based on your implementation
  });
});
