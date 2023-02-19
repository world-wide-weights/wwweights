import paginatedTagsList from "../../fixtures/tags/list.json"

const tags = paginatedTagsList.data.map((tag: { name: string, count: number }) => tag.name)

describe("Tags", () => {
    describe("List", () => {
        beforeEach(() => {
            cy.mockTagsList()
            cy.visitLocalPage("/tags")
        })

        it("should display tags", () => {
            // Check if all tags are displayed and have href
            cy.dataCy("tags-list-container", " a").should("have.length", 16).each((tag) => {
                cy.wrap(tag).should("have.attr", "href")
                expect(tags).to.include(tag.text().split(" ")[0])
            })
        })

        it("should display tooltip on hover", () => {
            cy.dataCy("tags-list-container", " [datacy=tooltip-wrapper]").first().trigger("mouseover")
            cy.dataCy("tags-list-container", " [datacy=tooltip-wrapper] > [datacy=tooltip]").first().should("be.visible")
        })

        it("should display once text if tags count is one", () => {
            expect(paginatedTagsList.data[0].count).to.equal(1)
            cy.dataCy("tags-list-container", " [datacy=tooltip-wrapper]").first().trigger("mouseover")
            cy.dataCy("tags-list-container", " [datacy=tooltip-wrapper] > [datacy=tooltip]").first().should("contain", "Tag is used once.")
        })

        it("should display times text if tags count is more than one", () => {
            expect(paginatedTagsList.data[15].count).to.equal(260)
            cy.dataCy("tags-list-container", " [datacy=tooltip-wrapper]").last().trigger("mouseover")
            cy.dataCy("tags-list-container", " [datacy=tooltip-wrapper] > [datacy=tooltip]").last().should("contain", "Tag is used 260 times.")
        })
    })

    describe("Pagination", () => {
        it("should display pagination when there are more tags than limit per page is", () => {
            cy.mockTagsList()
            cy.visitLocalPage("/tags?limit=5")

            cy.dataCy("pagination").should("be.visible")
        })
    })

    describe("EmptyState", () => {
        it("should display empty state when there are no tags", () => {
            cy.mockTagsList({ itemCount: 0 })
            cy.visitLocalPage("/tags?page=1")

            cy.dataCy("tags-empty-state").should("be.visible")
        })
    })
})

export { }

