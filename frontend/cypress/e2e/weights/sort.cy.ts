import { routes } from "../../../src/services/routes/routes"
import items from "../../fixtures/items/list.json"

// TODO (Zoe-Bot): Update when correct api implemented  
const SORT_TYPE = "desc"

describe("Sort /weights", () => {
    beforeEach(() => {
        cy.mockWeightsPage()

        cy.visitLocalPage(routes.weights.list())
        cy.wait("@mockGetRelatedTags")

        // open dropdown
        cy.dataCy("sort-dropdown-button").click()

        // Click sort type
        cy.dataCy(`sort-dropdown-option-${SORT_TYPE}`).click()
    })

    it.skip("should initial sort by relevance", () => {
        // TODO (Zoe-Bot): Test when correct api implemented  
    })

    it("should change url with sort when change sort option", () => {
        // Check sort type via url
        cy.url().should("include", `sort=${SORT_TYPE}`)
    })

    it("should keep sort in url when search for something", () => {
        // WARNING this is hotfix for the bug related to the next router
        cy.wait(1000)

        // Search something
        cy.dataCy("search").type(items[0].tags[0].slug)
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

