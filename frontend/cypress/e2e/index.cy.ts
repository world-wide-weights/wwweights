import weights from '../fixtures/weights.json'

describe('Home page', () => {
  it('should open home', () => {
    cy.task('clearNock')
    cy.task('nock', {
      hostname: 'https://jsonplaceholder.typicode.com',
      method: 'get',
      path: `/todos`,
      statusCode: 200,
      body: weights,
    })

    cy.visit(Cypress.env("BASE_URL"))
  })
})

export { }

