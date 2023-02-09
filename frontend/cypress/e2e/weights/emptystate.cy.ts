import { routes } from "../../../src/services/routes/routes"

const SEARCH_QUERY = "apple"

describe("Empty State /weights", () => {
    beforeEach(() => {
        cy.mockDiscoverPage(0)

        cy.visitLocalPage(routes.weights.list({ query: SEARCH_QUERY }))
        cy.wait("@mockGetRelatedTags")
    })

    it("should display empty state when no items come from api", () => {
        cy.dataCy("search-empty-state").should("be.visible")
    })

    it("should contain search query in empty state", () => {
        cy.dataCy("search-empty-state").contains(SEARCH_QUERY)
    })
})

export { }

