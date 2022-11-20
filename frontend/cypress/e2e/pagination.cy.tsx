// Theoretically a component test but changes url so component tests not working
describe('Pagination', () => {
    beforeEach(() => {
        cy.task('clearNock')
        cy.task('nock', {
            hostname: 'https://jsonplaceholder.typicode.com',
            method: 'get',
            path: '/todos/1',
            statusCode: 200,
            body: {
                "userId": 1,
                "id": 1,
                "title": "Test",
                "completed": false
            },
        })

        cy.visit(`${Cypress.env("BASE_URL")}/weights/1`)
    })

    it('should display', () => {

    })
})

export { }

