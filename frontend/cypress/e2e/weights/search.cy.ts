import { routes } from "../../../src/services/routes/routes"
import paginatedItems from "../../fixtures/items/list.json"
import relatedTags from "../../fixtures/tags/related.json"

describe("Search /weights", () => {
    describe("Search", () => {
        beforeEach(() => {
            cy.mockDiscoverPage()

            cy.visitLocalPage(routes.weights.list())
            cy.wait("@mockGetRelatedTags")
        })

        // This test seems to be flaky: https://github.com/cypress-io/cypress/issues/3817
        // it('should search items when click search items', () => {
        //     cy.dataCy('search').type(paginatedItems.data[0].name)
        //     cy.dataCy('text-input-icon-query').click()

        //     cy.url().should('include', paginatedItems.data[0].name)
        // })

        // This test seems to be flaky: https://github.com/cypress-io/cypress/issues/3817
        // it('should search items when hit enter', () => {
        //     cy.dataCy('search').type(`${paginatedItems.data[0].name}{enter}`)
        //     cy.url().should('include', paginatedItems.data[0].name)
        // })

        it("should search items when query in url", () => {
            cy.visitLocalPage(routes.weights.list({ query: paginatedItems.data[0].name }))
            cy.wait("@mockGetRelatedTags")

            cy.dataCy("search").should("have.value", paginatedItems.data[0].name)
        })
    })

    describe("Related Tags", () => {
        beforeEach(() => {
            cy.mockDiscoverPage()

            cy.visitLocalPage(routes.weights.list())
            cy.wait("@mockGetRelatedTags")
        })

        describe("Displayed tags", () => {
            beforeEach(() => {
                // Search item
                cy.dataCy("search").type(paginatedItems.data[0].name)
                cy.dataCy("text-input-icon-query").click()
            })

            it("should display tags when search", () => {
                cy.dataCy("search-header-tag-wrapper").should("be.visible")
            })

            it("should search tag when click on tag", () => {
                // Click first tag
                cy.dataCy("search-header-tag-wrapper", " a").first().click()

                cy.dataCy("search").should("have.value", relatedTags[0].name)
            })

            it("should not display tag in list when search for tag", () => {
                // Click first tag
                cy.dataCy(`search-header-chip-${relatedTags[1].slug}`).click()

                cy.dataCy(`search-header-chip-${relatedTags[1].slug}`).should("not.exist")
            })
        })

        it("should not display tags when no search", () => {
            cy.dataCy("search-header-tag-wrapper").should("not.exist")
        })
    })
})

export { }

