const limit = 4
const currentPage = 2

describe("Pagination Profile", () => {
    beforeEach(() => {
        cy.mockProfilePage({
            contribtionsCount: limit
        })
    })

    describe("Base tests", () => {
        it("should display pagination", () => {
            cy.login("/account/profile?page=1&limit=2")
            cy.dataCy("pagination").should("be.visible")
        })

        it("should show page 1 when query is page=1 or nothing", () => {
            cy.login("/account/profile?page=1&limit=2")
            cy.checkCurrentActivePage(1)

            cy.login("/account/profile?limit=2")
            cy.checkCurrentActivePage(1)
        })

        it("should show page 2 when query is page=2", () => {
            cy.login("/account/profile?page=2&limit=2")
            cy.checkCurrentActivePage(2)
        })

        describe("Errors", () => {
            it("should show first page when current page is 0 or less", () => {
                cy.login("/account/profile?page=0")
                cy.contains("Contribution").should("be.visible")
                cy.login("/account/profile?page=-1")
                cy.contains("Contribution").should("be.visible")
            })

            it("should show first page when limit is 0 or less", () => {
                cy.login("/account/profile?page=1&limit=0")
                cy.contains("Contribution").should("be.visible")

                cy.login("/account/profile?page=1&limit=-1")
                cy.contains("Contribution").should("be.visible")
            })
        })

        describe("Buttons", () => {
            it("should show next page when click next button", () => {
                cy.login(`/account/profile?page=${currentPage}`)
                cy.dataCy("pagination-button-next").click()

                cy.wait("@mockContributions")
                cy.wait("@mockProfile")
                cy.wait("@mockProfileStatistics")

                cy.checkCurrentActivePage(currentPage + 1)
            })

            it("should show previous page when click previous button", () => {
                cy.login(`/account/profile?page=${currentPage}`)
                cy.dataCy("pagination-button-previous").click()

                cy.wait("@mockContributions")
                cy.wait("@mockProfile")
                cy.wait("@mockProfileStatistics")

                cy.checkCurrentActivePage(currentPage - 1)
            })
        })
    })

    describe("Limit", () => {
        beforeEach(() => {
            cy.login(`/account/profile?page=1&limit=${limit}`)
        })

        it("should show limited count of items when set limit", () => {
            cy.dataCy("itemlistcontribute-wrapper").should("have.length", limit)
        })

        it("should have limit set when change page", () => {
            cy.dataCy("pagination-button-previous").click()
            cy.dataCy("itemlistcontribute-wrapper").should("have.length", limit)

            cy.dataCy("pagination-button-next").click()
            cy.dataCy("itemlistcontribute-wrapper").should("have.length", limit)
        })
    })
})

export { }

