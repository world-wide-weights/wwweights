import items from "../../fixtures/items/list.json"

// TODO (Zoe-Bot): Update when correct api implemented  
const SORT_TYPE = "desc"

describe('Sort /weights', () => {
    beforeEach(() => {
        cy.mockWeightsPage()

        cy.visitLocalPage("/weights")
        cy.wait('@mockGetRelatedTags')

        // open dropdown
        cy.dataCy("sort-dropdown-button").click()

        // Click sort type
        cy.dataCy(`sort-dropdown-option-${SORT_TYPE}`).click()
    })

    it.skip('should initial sort by relevance', () => {
        // TODO (Zoe-Bot): Test when correct api implemented  
    })

    it('should change url with sort when change sort option', () => {
        // Check sort type via url
        cy.url().should('include', `sort=${SORT_TYPE}`)
    })

    it('should keep sort in url when search for something', () => {
        // Search something
        cy.dataCy('search').type(items[0].tags[0].slug)
        cy.dataCy('text-input-icon-query').click()

        cy.url().should('include', `sort=${SORT_TYPE}`)
    })
})

export { }

