describe('Home page', () => {
  it('should open home', () => {
    cy.visit(Cypress.env("CLIENT_BASE_URL"))
  })
})

export { }

