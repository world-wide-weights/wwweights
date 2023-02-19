import paginatedItems from "../../fixtures/items/list.json"

const SORT_TYPE = "heaviest"

describe("Sort /weights", () => {
    beforeEach(() => {
        cy.mockDiscoverPage()

        cy.visitLocalPage("/weights")
    })

    it("should initial sort by relevance", () => {
        cy.dataCy("sort-dropdown-button").should("contain", "Relevance")
    })

    it("should change url with sort when change sort option", () => {
        // open dropdown
        cy.dataCy("sort-dropdown-button").click()

        // Click sort type
        cy.dataCy(`sort-dropdown-option-${SORT_TYPE}`).click()

        // Check sort type via url
        cy.url().should("include", `sort=${SORT_TYPE}`)
    })

    it("should keep sort in url when search for something", () => {
        // open dropdown
        cy.dataCy("sort-dropdown-button").click()

        // Click sort type
        cy.dataCy(`sort-dropdown-option-${SORT_TYPE}`).click()

        // WARNING this is hotfix for the bug related to the next router
        cy.wait(1000)

        // Search something
        cy.dataCy("search").type(paginatedItems.data[0].name)
        cy.dataCy("text-input-icon-query").click()

        // WARNING HERE is a bug in the software
        // Check this issue: https://github.com/world-wide-weights/wwweights/issues/195
        // We are aware of this bug and we are waiting for the new next router which fixes this issue

        // To reproduce the bug add this to weights list in the server side 
        // await new Promise((resolve) => setTimeout(resolve, 500))

        cy.url().should("include", `sort=${SORT_TYPE}`)
    })
})

export { }

