describe('Home page', () => {
  it('should open home', () => {
    cy.visit(Cypress.env("base_url"))
  })
})