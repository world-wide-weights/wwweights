import paginatedItems from "../../fixtures/items/list.json"
import relatedTags from "../../fixtures/tags/related.json"

describe("Search /weights", () => {
    describe("Search", () => {
        beforeEach(() => {
            cy.mockDiscoverPage()

            cy.visitLocalPage("/weights")
        })

        it("should search items when click search items", () => {
            cy.dataCy("search").type(paginatedItems.data[0].name)
            cy.dataCy("text-input-icon-query").click()

            cy.contains(paginatedItems.data[0].name).should("be.visible")
        })

        it("should search items when hit enter", () => {
            cy.dataCy("search").type(`${paginatedItems.data[0].name}{enter}`)
            cy.contains(paginatedItems.data[0].name).should("be.visible")
        })

        it("should search items when query in url", () => {
            cy.visitLocalPage(`/weights?query=${paginatedItems.data[0].name}`)

            cy.dataCy("search").should("have.value", paginatedItems.data[0].name)
        })
    })

    describe("Related Tags", () => {
        beforeEach(() => {
            cy.mockDiscoverPage()

            cy.visitLocalPage("/weights")
        })

        describe("Displayed tags", () => {
            beforeEach(() => {
                // Search item
                cy.dataCy("search").type(relatedTags.data[1].name)
                cy.dataCy("text-input-icon-query").click()

                cy.wait("@mockGetRelatedTags")
            })

            it("should display tags when search", () => {
                cy.dataCy("search-header-tag-wrapper").should("be.visible")
            })

            it("should search tag when click on tag", () => {
                // Click first tag
                cy.dataCy("search-header-tag-wrapper", " a").first().click()

                cy.dataCy("search").should("have.value", relatedTags.data[1].name)
            })

            it("should not display tag in list when search for tag", () => {
                // Click first tag
                cy.dataCy("search-header-chip-0").click()

                cy.dataCy("search-header-chip-0").should("not.exist")
            })
        })

        it("should not display tags when no search", () => {
            cy.dataCy("search-header-tag-wrapper").should("not.exist")
        })
    })
})

export { }

