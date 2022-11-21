import weights from '../fixtures/weights.json'

// Theoretically a component test but changes url so component tests not working
describe('Pagination', () => {
    beforeEach(() => {
        cy.task('clearNock')
        cy.task('nock', {
            hostname: 'https://jsonplaceholder.typicode.com',
            method: 'get',
            path: `/todos`,
            statusCode: 200,
            body: weights,
        })
    })

    it('should display', () => {

        cy.visit(`${Cypress.env("BASE_URL")}/weights?page=2`)
    })
})

export { }

