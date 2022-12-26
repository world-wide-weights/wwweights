const currentPage = 2
const limit = 5

describe('Pagination /weights', () => {
    describe("Base tests", () => {
        beforeEach(() => {
            cy.mockWeightsPage()
        })

        it('should display pagination', () => {
            cy.visitLocalPage("/weights")
            cy.wait('@mockGetRelatedTags')
            cy.dataCy('pagination').should('be.visible')
        })

        it('should show page 1 when query is page=1 or nothing', () => {
            cy.visitLocalPage("/weights")
            cy.wait('@mockGetRelatedTags')
            cy.checkCurrentActivePage(1)

            cy.visitLocalPage("/weights?page=1")
            cy.wait('@mockGetRelatedTags')
            cy.checkCurrentActivePage(1)
        })

        it('should show page 2 when query is page=2', () => {
            cy.visitLocalPage("/weights?page=2")
            cy.wait('@mockGetRelatedTags')
            cy.checkCurrentActivePage(2)
        })

        describe('Errors', () => {
            it('should show 404 when current page is 0 or less', () => {
                cy.visitLocalPage("/weights?page=0", { failOnStatusCode: false })
                cy.check404()

                cy.visitLocalPage("/weights?page=-1", { failOnStatusCode: false })
                cy.check404()
            })

            it('should show 404 when limit is 0 or less', () => {
                cy.visitLocalPage("/weights?page=1&limit=0", { failOnStatusCode: false })
                cy.check404()

                cy.visitLocalPage("/weights?page=1&limit=-1", { failOnStatusCode: false })
                cy.check404()
            })
        })

        describe('Buttons', () => {
            beforeEach(() => {
                cy.visitLocalPage(`/weights?page=${currentPage}`)
                cy.wait('@mockGetRelatedTags')
            })

            it('should show next page when click next button', () => {
                cy.dataCy('pagination-button-next').click()
                cy.checkCurrentActivePage(currentPage + 1)
            })

            it('should show previous page when click previous button', () => {
                cy.dataCy('pagination-button-previous').click()
                cy.checkCurrentActivePage(currentPage - 1)
            })
        })
    })

    describe('Limit', () => {
        beforeEach(() => {
            cy.mockWeightsPage(5)

            cy.visitLocalPage(`/weights?limit=${limit}`)
            cy.wait('@mockGetRelatedTags')
        })

        it('should show limited count of items when set limit', () => {
            cy.dataCy('weights-list-item').should('have.length', limit)
        })

        it('should have limit set when change page', () => {
            cy.dataCy('pagination-button-previous').click()
            cy.dataCy('weights-list-item').should('have.length', limit)

            cy.dataCy('pagination-button-next').click()
            cy.dataCy('weights-list-item').should('have.length', limit)
        })
    })
})

export { }

